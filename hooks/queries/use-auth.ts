import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OurMemberDto, SignupInfoDto, MyPageInfoDto, SignupResponseDto, NicknameDuplicateCheckDto } from "@/types/auth";
import { fetcher } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { deleteTokens, getAccessToken, setTokens } from "@/lib/utils";
import { queryClient } from '@/lib/query-client'

// 카카오 로그인 (Callback 처리)
export const useKakaoLogin = () => {
  const router = useRouter();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) =>
      fetcher<OurMemberDto>(`/oauth/kakao/callback?code=${code}`, {
        method: "GET",
        auth: false, // 토큰이 없으므로 인증 없이 요청
      }),
    onSuccess: async (response) => {
      const { ourMember, accessToken, kakaoEmail, kakaoUserNumber } = response;

      if (ourMember && accessToken) {
        setTokens(accessToken);
        localStorage.removeItem("kakaoEmail");
        localStorage.removeItem("kakaoUserNumber");
        await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        toast({ title: "로그인 성공", description: "환영합니다!" });
        router.push("/");
      } else if (!ourMember && kakaoEmail && kakaoUserNumber) {
        localStorage.setItem("kakaoEmail", kakaoEmail);
        localStorage.setItem("kakaoUserNumber", kakaoUserNumber);
        toast({ title: "추가 정보 입력이 필요합니다.", description: "회원가입 페이지로 이동합니다." });
        router.push("/oauth/signup");
      }
    },
    onError: (error: any) => {
      console.error("Kakao Login Error:", error);

      // 이미 토큰이 있어서 400이 뜬 경우(중복 호출) 등은 무시하거나 홈으로
      // 사용자가 명확히 인지해야 할 에러만 토스트를 띄웁니다.
      toast({
        title: "로그인 처리 중 문제가 발생했습니다.",
        description: "다시 시도해주시거나 관리자에게 문의해주세요.",
        variant: "destructive"
      });

      router.push("/");
    },
  });
};

// 닉네임 중복 확인
export const useCheckNickname = () => {
  return useMutation({
    mutationFn: (nickname: string) =>
      fetcher<NicknameDuplicateCheckDto>(`/oauth/verify/duplicate/nickname?nickname=${nickname}`, {
        method: "GET",
        auth: false,
      }),
  });
};

// 회원가입 (기존 유지)
export const useSignup = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SignupInfoDto) =>
      fetcher<SignupResponseDto>("/oauth/signup", {
        method: "POST",
        auth: false,
        body: JSON.stringify(data),
      }),
    onSuccess: async (data) => {
      setTokens(data.accessToken);
      localStorage.removeItem("kakaoEmail");
      localStorage.removeItem("kakaoUserNumber");
      toast({ title: "회원가입 완료! 환영합니다." });
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      router.push("/");
    },
    onError: (error) => {
      console.error("Signup Error:", error);
      toast({ title: "회원가입 실패", description: "입력 정보를 확인해주세요.", variant: "destructive" });
    },
  });
};

// 내 정보 조회 (토큰 필수 -> auth: true / 생략 가능하지만 명시 권장)
export const useMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      // 1. 함수 내부에서 토큰 확인
      const token = getAccessToken();

      if (!token) {
        return null;
      }

      const response = await fetcher<MyPageInfoDto>("/mypage/info", {
        method: "GET",
        auth: true,
      });
      return response;
    },
    retry: 0,
  });
};

// 로그아웃 로직 (API 호출 없이 클라이언트 처리)
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const logout = () => {
    deleteTokens();
    localStorage.removeItem("kakaoEmail");
    localStorage.removeItem("kakaoUserNumber");

    // 유저 데이터 캐시 즉시 삭제 (UI 즉시 반영을 위해)
    queryClient.setQueryData(["myProfile"], null);
    queryClient.invalidateQueries({ queryKey: ["myProfile"] });

    toast({ title: "로그아웃 되었습니다." });
    router.push("/");
  };

  return { logout };
};