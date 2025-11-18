"use client";

import { useMyProfile } from "@/hooks/queries/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { format } from "date-fns";

export default function MyPage() {
  const { data: user, isLoading } = useMyProfile();
  const router = useRouter();

  // 비로그인 상태로 접근 시 홈으로 리다이렉트
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-12 w-1/3 bg-gray-800" />
            <Skeleton className="h-[400px] w-full bg-gray-900 rounded-xl border border-gray-800" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  // 날짜 포맷팅 헬퍼 함수
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy년 MM월 dd일 HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  // 성별 한글 변환
  const formatGender = (gender: string) => {
    if (gender === "MALE") return "남성";
    if (gender === "FEMALE") return "여성";
    return gender;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">마이페이지</h1>
          
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-800">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground font-bold">
                  {user.nickname.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 text-center sm:text-left">
                <CardTitle className="text-2xl text-white">{user.nickname}</CardTitle>
                <CardDescription className="text-gray-400">
                  WeTerview 회원
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {/* 이메일 */}
                <div className="space-y-2 col-span-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">카카오 이메일</Label>
                  <div className="bg-black/50 border border-gray-800 rounded-md px-4 py-3 text-gray-200 font-medium">
                    {user.kakaoEmail}
                  </div>
                </div>

                {/* 닉네임 */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">닉네임</Label>
                  <Input 
                    value={user.nickname} 
                    readOnly 
                    className="bg-black border-gray-800 text-gray-200 focus-visible:ring-0 cursor-default" 
                  />
                </div>

                {/* 성별 */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">성별</Label>
                  <Input 
                    value={formatGender(user.gender)} 
                    readOnly 
                    className="bg-black border-gray-800 text-gray-200 focus-visible:ring-0 cursor-default" 
                  />
                </div>

                {/* 가입일 */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">가입일</Label>
                  <Input 
                    value={formatDate(user.createdAt)} 
                    readOnly 
                    className="bg-black border-gray-800 text-gray-400 focus-visible:ring-0 cursor-default" 
                  />
                </div>

                {/* 수정일 */}
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs uppercase tracking-wider">최근 수정일</Label>
                  <Input 
                    value={formatDate(user.updatedAt)} 
                    readOnly 
                    className="bg-black border-gray-800 text-gray-400 focus-visible:ring-0 cursor-default" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}