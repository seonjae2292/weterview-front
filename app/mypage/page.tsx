"use client";

import { useMyProfile, useLogout } from "@/hooks/queries/use-auth";
import {
  useGetHostedStudyGroups, 
  useGetJoinedStudyGroups,
  useGetLikedStudyGroups,
  useGetCommentedStudyGroups 
} from "@/hooks/queries/use-mypage";
import { useUpdateNickname } from "@/hooks/queries/use-user";
import { StudyGroupItemDto } from "@/types/study-group";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyCard } from "@/components/study-group/study-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Edit, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { EditNicknameDialog } from "@/components/mypage/edit-nickname-dialog";

export default function MyPage() {
    const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
  }); 
  
  const [commentedPage, setCommentedPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const [activeTab, setActiveTab] = useState("hosted");
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const { data: user, isLoading: isUserLoading } = useMyProfile();
  const { data: hostedGroups, isLoading: isHostedLoading } = useGetHostedStudyGroups({ enabled: activeTab === "hosted" });
  const { data: joinedGroups, isLoading: isJoinedLoading } = useGetJoinedStudyGroups({ enabled: activeTab === "joined" });
  const { data: likedGroups, isLoading: isLikedLoading } = useGetLikedStudyGroups(filters, { enabled: activeTab === "liked" });
  const { data: commentedGroups, isLoading: isCommentedLoading } = useGetCommentedStudyGroups(commentedPage, { enabled: activeTab === "commented" });
  
  const { logout } = useLogout();
  const router = useRouter();
  const { mutate: updateNickname } = useUpdateNickname();

  useEffect(() => {
    if (!isUserLoading && !user) router.push("/");
  }, [user, isUserLoading, router]);

  const handleNicknameUpdate = (newNickname: string) => {
    updateNickname(newNickname, {
      onSuccess: () => {
        setIsEditingNickname(false);
      },
    });
  };

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
                <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
                <AvatarFallback className="bg-primary text-2xl font-bold">{user.nickname.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl text-white">{user.nickname}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsEditingNickname(true)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">{user.kakaoEmail}</CardDescription>
              </div>
            </CardHeader>
          </Card>

          {/* 닉네임 수정 다이얼로그 */}
          {isEditingNickname && (
            <EditNicknameDialog
              isOpen={isEditingNickname}
              onClose={() => setIsEditingNickname(false)}
              onSave={handleNicknameUpdate}
              currentNickname={user.nickname}
            />
          )}

          {/* 탭 섹션 */}
          <Tabs defaultValue="hosted" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-gray-900 border-gray-800 w-full justify-start p-1 overflow-x-auto">
              <TabsTrigger value="hosted" className="data-[state=active]:bg-primary data-[state=active]:text-white">개설한 스터디</TabsTrigger>
              <TabsTrigger value="joined" className="data-[state=active]:bg-primary data-[state=active]:text-white">참여한 스터디</TabsTrigger>
              <TabsTrigger value="liked" className="data-[state=active]:bg-primary data-[state=active]:text-white">찜한 스터디</TabsTrigger>
              <TabsTrigger value="commented" className="data-[state=active]:bg-primary data-[state=active]:text-white">댓글 단 스터디</TabsTrigger>
            </TabsList>
            
            {/* 개설한 스터디 탭 */}
            <TabsContent value="hosted" className="mt-6">
               {isHostedLoading ? <Skeleton className="h-40 bg-gray-900"/> : (
                 <div className="grid md:grid-cols-2 gap-4">
                   {hostedGroups?.content.map((group: StudyGroupItemDto) => (
                     <div key={group.studyGroupId} className="relative group">
                       <StudyCard data={group} />
                       {/* Hover 시 나타나는 관리 버튼 */}
                       <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Button size="icon" variant="secondary" onClick={(e) => {
                            e.preventDefault();
                            router.push(`/study-groups/${group.studyGroupId}/edit`);
                          }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="secondary" onClick={(e) => {
                            e.preventDefault();
                            router.push(`/study-groups/${group.studyGroupId}/manage`);
                          }}>
                            <Users className="w-4 h-4" />
                          </Button>
                       </div>
                     </div>
                   ))}
                   {hostedGroups?.content.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">개설한 스터디가 없습니다.</p>}
                 </div>
               )}
            </TabsContent>
            
            {/* 참여한 스터디 탭 */}
            <TabsContent value="joined" className="mt-6">
               {isJoinedLoading ? <Skeleton className="h-40 bg-gray-900"/> : (
                 <div className="grid md:grid-cols-2 gap-4">
                   {joinedGroups?.content.map((group: StudyGroupItemDto) => (
                     <StudyCard key={group.studyGroupId} data={group} />
                   ))}
                   {joinedGroups?.content.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">참여한 스터디가 없습니다.</p>}
                 </div>
               )}
            </TabsContent>

            {/* 찜한 스터디 탭 */}
            <TabsContent value="liked" className="mt-6">
               {isLikedLoading ? <Skeleton className="h-40 bg-gray-900"/> : (
                 <div className="grid md:grid-cols-2 gap-4">
                   {likedGroups?.content.map((group: StudyGroupItemDto) => (
                     <StudyCard key={group.studyGroupId} data={group} />
                   ))}
                   {likedGroups?.content.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">찜한 스터디가 없습니다.</p>}
                 </div>
               )}
            </TabsContent>

            {/* 댓글 단 스터디 탭 */}
            <TabsContent value="commented" className="mt-6">
               {isCommentedLoading ? <Skeleton className="h-40 bg-gray-900"/> : (
                 <div className="grid md:grid-cols-2 gap-4">
                   {commentedGroups?.content.map((group: StudyGroupItemDto) => (
                     <StudyCard key={group.studyGroupId} data={group} />
                   ))}
                   {commentedGroups?.content.length === 0 && <p className="text-gray-500 col-span-2 text-center py-10">댓글을 남긴 스터디가 없습니다.</p>}
                 </div>
               )}
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}