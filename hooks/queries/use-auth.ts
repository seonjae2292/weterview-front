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
      fetcher<ApiResponse<OurMemberDto>>(`/kakao/callback?code=${code}`, {
        method: "GET",
      }),
    onSuccess: (response) => {
      const { role, accessToken, email } = response.data;
      
      // 토큰 저장 (보안상 HttpOnly 쿠키 권장하나, 예시로 localStorage 사용)
      localStorage.setItem("accessToken", accessToken);

      if (role === "GUEST") {
        toast({ title: "추가 정보 입력이 필요합니다." });
        // 이메일 정보를 쿼리 파라미터로 넘김
        router.push(`/auth/signup?email=${encodeURIComponent(email)}`);
      } else {
        toast({ title: "로그인 성공" });
        router.push("/");
      }
    },
    onError: (error: any) => {
      console.log(error)
      toast({ title: "로그인 실패", variant: "destructive" });
      router.push("/"); // 실패 시 이동 경로
    },
  });
};

// 닉네임 중복 확인
export const useCheckNickname = () => {
  return useMutation({
    mutationFn: (nickname: string) =>
      fetcher<ApiResponse<Record<string, boolean>>>(`/verify/duplicate/nickname?nickname=${nickname}`, {
        method: "GET",
      }),
  });
};

// 회원가입
export const useSignup = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SignupInfoDto) =>
      fetcher<ApiResponse<any>>("/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({ title: "회원가입 완료! 환영합니다." });
      router.push("/");
    },
    onError: () => {
      toast({ title: "회원가입 실패", description: "다시 시도해주세요.", variant: "destructive" });
    },
  });
};