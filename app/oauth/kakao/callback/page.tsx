"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useKakaoLogin } from "@/hooks/queries/use-auth";
import { Spinner } from "@/components/ui/spinner";

export default function KakaoCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  
  const { mutate: login } = useKakaoLogin();
  
  // [핵심] 중복 호출 방지를 위한 Ref
  const isProcessed = useRef(false);

  useEffect(() => {
    if (!code) {
      router.push("/");
      return;
    }

    // 이미 처리된 요청이면 실행하지 않음 (Strict Mode 방지)
    if (isProcessed.current) return;

    isProcessed.current = true; // 처리 시작 플래그 설정
    
    // 로그인 요청 실행
    login(code);

  }, [code, login, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-background">
      <Spinner className="h-10 w-10 text-primary" />
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-foreground">로그인 중입니다</h2>
        <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
}