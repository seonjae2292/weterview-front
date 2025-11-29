"use client";

import { useGetStudyGroupDetail, useJoinStudyGroup, useToggleLike } from "@/hooks/queries/use-study-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommentSection } from "@/components/study-group/comment-section";
import { FIELD_LABEL, LOCATION_LABEL, STATUS_LABEL, STATUS_COLOR } from "@/constants/enums";
import { Calendar, MapPin, Users, Heart, ArrowLeft, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, Suspense, useEffect } from "react";

// useSearchParams를 사용하는 컴포넌트는 Suspense로 감싸야 합니다 (빌드 에러 방지)
function StudyDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studyGroupId = searchParams.get("id"); // 쿼리 파라미터에서 ID 추출
  
  const { data: study, isLoading } = useGetStudyGroupDetail(studyGroupId || "");
  const { mutate: joinStudy } = useJoinStudyGroup();
  // studyGroupId가 없을 경우를 대비해 빈 문자열 처리 (실제로는 아래에서 리턴됨)
  const { mutate: toggleLike } = useToggleLike(studyGroupId || "");
  
  const [isLiked, setIsLiked] = useState(false); 

  useEffect(() => {
    if (study && study.isLiked !== undefined) {
      setIsLiked(study.isLiked);
    }
  }, [study]);
  
  if (!studyGroupId) {
    return <div className="text-center py-20 text-white">잘못된 접근입니다.</div>;
  }
  
  const handleLike = () => {
    toggleLike({ isLiked });
    setIsLiked(!isLiked);
  };

  const handleJoin = () => {
    if (confirm("이 스터디 그룹에 참여 신청하시겠습니까?")) {
      joinStudy(studyGroupId);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try { return format(new Date(dateStr), "yyyy년 MM월 dd일"); } 
    catch { return dateStr; }
  };

  

  if (isLoading) {
    return (
      <div className="pt-20 container mx-auto px-4">
        <Skeleton className="h-8 w-24 mb-4 bg-gray-900" />
        <Skeleton className="h-12 w-3/4 mb-2 bg-gray-900" />
        <Skeleton className="h-6 w-1/2 mb-8 bg-gray-900" />
        <div className="grid md:grid-cols-3 gap-8">
          <Skeleton className="h-[500px] md:col-span-2 bg-gray-900 rounded-xl" />
          <Skeleton className="h-[300px] bg-gray-900 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!study) return <div className="text-center py-20 text-white">존재하지 않는 게시글입니다.</div>;

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-6 pl-0 text-gray-400 hover:text-white hover:bg-transparent"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> 목록으로 돌아가기
      </Button>

      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="border-primary text-primary">
            {FIELD_LABEL[study.field] || study.field}
          </Badge>
          <Badge variant={STATUS_COLOR[study.status] || "secondary"}>
            {STATUS_LABEL[study.status] || study.status}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{study.title}</h1>
        <p className="text-xl text-gray-400">{study.subTitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Content: 상세 정보 및 댓글 */}
        <div className="lg:col-span-2 space-y-12">
          {/* 상세 설명 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">스터디 소개</h2>
            <div className="bg-gray-900/50 rounded-xl p-6 md:p-8 leading-relaxed text-gray-300 whitespace-pre-wrap min-h-[200px]">
              {study.description}
            </div>
          </section>

          {/* 상세 조건들 */}
          <section className="grid gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">진행 일정</h2>
              <p className="bg-gray-900/30 p-4 rounded-lg text-gray-300">{study.schedule}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">참여 조건</h2>
              <p className="bg-gray-900/30 p-4 rounded-lg text-gray-300">{study.joinCondition}</p>
            </div>
          </section>

          {/* 댓글 섹션 */}
          <CommentSection studyGroupId={studyGroupId} />
        </div>

        {/* Right Sidebar: 요약 정보 및 액션 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="bg-gray-900 border-gray-800 p-6 space-y-6">
              {/* 모집 현황 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">모집 인원</span>
                  <span className="text-primary">{study.recruitingNumber} / {study.totalNumber}명</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(study.recruitingNumber / study.totalNumber) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="h-px bg-gray-800" />

              {/* 메타 정보 */}
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">모집 기간</p>
                    <p>{formatDate(study.startDate)} ~ {formatDate(study.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">활동 지역</p>
                    <p>{LOCATION_LABEL[study.location] || study.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">문의처</p>
                    <p>{study.contact}</p>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="grid grid-cols-5 gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className={cn(
                    "col-span-1 border-gray-700 hover:bg-gray-800", 
                    isLiked && "text-red-500 border-red-500/50 bg-red-500/10"
                  )}
                  onClick={handleLike}
                >
                  <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                </Button>
                <Button 
                  className="col-span-4 font-bold text-base"
                  disabled={study.status !== "RECRUITING" || study.recruitingNumber >= study.totalNumber}
                  onClick={handleJoin}
                >
                  {study.status === "RECRUITING" ? "참여 신청하기" : "모집 마감"}
                </Button>
              </div>
            </Card>
            
            {/* 작성자 정보 (Optional) */}
            <div className="flex items-center gap-3 px-2">
               <p className="text-xs text-gray-500">
                 작성일 {formatDate(study.createdAt)} · 수정일 {formatDate(study.updatedAt)}
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StudyDetailPage() {
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <Suspense fallback={<div className="pt-20 text-center text-white">Loading...</div>}>
        <StudyDetailContent />
      </Suspense>
    </div>
  );
}