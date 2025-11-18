import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { ApiResponse, OurMemberDto, SignupInfoDto } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// 카카오 로그인 (Callback 처리)
export const useKakaoLogin = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (code: string) =>
      fetcher<ApiResponse<OurMemberDto>>(`/oauth/kakao/callback?code=${code}`, {
        method: "GET",
      }),
    onSuccess: (response) => {
      // 응답 데이터 구조 확인 로그
      console.log("Login Success Response:", response);

      const { isOurMember, accessToken, kakaoEmail, kakaoUniqueId} = response.data;
      
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      if (!isOurMember) {
        localStorage.setItem("kakaoEmail", kakaoEmail);
        localStorage.setItem("kakaoUserNumber", kakaoUniqueId);

        toast({ title: "추가 정보 입력이 필요합니다.", description: "회원가입 페이지로 이동합니다." });
        
        router.push("/oauth/signup");
      } else {
        localStorage.removeItem("kakaoEmail");
        localStorage.removeItem("kakaoUserNumber");

        toast({ title: "로그인 성공", description: "환영합니다!" });
        
        router.push("/");
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

// 닉네임 중복 확인 (기존 유지)
export const useCheckNickname = () => {
  return useMutation({
    mutationFn: (nickname: string) =>
      fetcher<ApiResponse<Record<string, boolean>>>(`/oauth/verify/duplicate/nickname?nickname=${nickname}`, {
        method: "GET",
      }),
  });
};

// 회원가입 (기존 유지)
export const useSignup = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SignupInfoDto) =>
      fetcher<ApiResponse<any>>("/oauth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      localStorage.removeItem("kakaoEmail");
      localStorage.removeItem("kakaoUserNumber");
      toast({ title: "회원가입 완료! 환영합니다." });
      router.push("/");
    },
    onError: (error) => {
      console.error("Signup Error:", error);
      toast({ title: "회원가입 실패", description: "입력 정보를 확인해주세요.", variant: "destructive" });
    },
  });
};