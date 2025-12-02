"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const KAKAO_AUTH_URI = process.env.NEXT_PUBLIC_KAKAO_AUTH_URI!;
const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;

export function KakaoLoginButton() {
  const handleLogin = () => {
    const KAKAO_AUTH_URL = `${KAKAO_AUTH_URI}?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    
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