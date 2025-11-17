"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function KakaoLoginButton() {
  const handleLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
    // 리다이렉트 URI는 카카오 개발자 센터 설정과 일치해야 합니다.
    // const REDIRECT_URI = `${window.location.origin}/auth/kakao/callback`;
    const REDIRECT_URI = `http://localhost:3000/oauth/kakao/callback`;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Button 
      onClick={handleLogin} 
      className="bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90 w-full font-bold"
    >
      <MessageCircle className="mr-2 h-4 w-4 fill-current" />
      카카오로 시작하기
    </Button>
  );
}