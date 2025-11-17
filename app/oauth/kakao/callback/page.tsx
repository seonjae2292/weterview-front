"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useKakaoLogin } from "@/hooks/queries/use-auth";
import { Spinner } from "@/components/ui/spinner"; // Spinner 컴포넌트 임포트 확인

function KakaoCallback() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { mutate: login } = useKakaoLogin();
  const isCalled = useRef(false);

  useEffect(() => {
    if (code && !isCalled.current) {
      isCalled.current = true;
      login(code);
    }
  }, [code, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <Spinner className="h-8 w-8 text-primary" />
      <p className="text-muted-foreground font-medium">로그인 정보를 확인 중입니다...</p>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <KakaoCallback />
    </Suspense>
  );
}