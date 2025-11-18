// app/mypage/page.tsx
"use client";

import { useMyProfile, useLogout } from "@/hooks/queries/use-auth";
import { useGetHostedStudyGroups, useGetJoinedStudyGroups } from "@/hooks/queries/use-mypage";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyCard } from "@/components/study-group/study-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { format } from "date-fns";

export default function MyPage() {
  const { data: user, isLoading: isUserLoading } = useMyProfile();
  const { data: hostedGroups, isLoading: isHostedLoading } = useGetHostedStudyGroups();
  const { data: joinedGroups, isLoading: isJoinedLoading } = useGetJoinedStudyGroups();
  
  const { logout } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) router.push("/");
  }, [user, isUserLoading, router]);

  if (isUserLoading) return <div className="bg-black min-h-screen pt-20"><Skeleton className="w-full max-w-3xl mx-auto h-[400px] bg-gray-900"/></div>;
  if (!user) return null;

  const formatDate = (d: string) => { try { return format(new Date(d), "yyyy-MM-dd"); } catch { return d; }};

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 프로필 섹션 */}
          <div className="flex justify-between items-center mb-8">
             <h1 className="text-3xl font-bold">마이페이지</h1>
             <Button variant="destructive" size="sm" onClick={logout}>
               <LogOut className="w-4 h-4 mr-2"/> 로그아웃
             </Button>
          </div>

          <Card className="bg-gray-900 border-gray-800 mb-12">
            <CardHeader className="flex flex-row items-center gap-6 border-b border-gray-800 pb-8">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarFallback className="bg-primary text-2xl font-bold">{user.nickname.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl text-white">{user.nickname}</CardTitle>
                <CardDescription className="text-gray-400">{user.kakaoEmail}</CardDescription>
                <p className="text-xs text-gray-500 mt-2">가입일: {formatDate(user.createdAt)}</p>
              </div>
            </CardHeader>
          </Card>

          {/* 탭 섹션 */}
          <Tabs defaultValue="hosted" className="w-full">
            <TabsList className="bg-gray-900 border-gray-800 w-full justify-start p-1">
              <TabsTrigger value="hosted" className="data-[state=active]:bg-primary data-[state=active]:text-white">개설한 스터디</TabsTrigger>
              <TabsTrigger value="joined" className="data-[state=active]:bg-primary data-[state=active]:text-white">참여한 스터디</TabsTrigger>
            </TabsList>
            
            {/* 개설한 스터디 탭 */}
            <TabsContent value="hosted" className="mt-6">
               {isHostedLoading ? <Skeleton className="h-40 bg-gray-900"/> : (
                 <div className="grid md:grid-cols-2 gap-4">
                   {hostedGroups?.map((group: any, idx: number) => (
                     // id가 없으면 임시로 index 사용, 백엔드 수정 필요
                     <StudyCard key={idx} id={group.id || idx.toString()} data={group} />
                   ))}
                   {hostedGroups?.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">개설한 스터디가 없습니다.</p>}
                 </div>
               )}
            </TabsContent>
            
            {/* 참여한 스터디 탭 */}
            <TabsContent value="joined" className="mt-6">
               {isJoinedLoading ? <Skeleton className="h-40 bg-gray-900"/> : (
                 <div className="grid md:grid-cols-2 gap-4">
                   {joinedGroups?.map((group: any, idx: number) => (
                     <StudyCard key={idx} id={group.id || idx.toString()} data={group} />
                   ))}
                   {joinedGroups?.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">참여한 스터디가 없습니다.</p>}
                 </div>
               )}
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}