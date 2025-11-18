"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useKakaoLogin } from "@/hooks/queries/use-auth";
import { Spinner } from "@/components/ui/spinner";

// [수정] 로직을 별도 컴포넌트로 분리
function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");
  
  const { mutate: login } = useKakaoLogin();
  const isProcessed = useRef(false);

  useEffect(() => {
    if (!code) {
      router.push("/");
      return;
    }

    if (isProcessed.current) return;
    isProcessed.current = true; 
    
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

// [수정] Suspense로 감싼 메인 컴포넌트 export
export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    }>
      <KakaoCallbackContent />
    </Suspense>
  );
}