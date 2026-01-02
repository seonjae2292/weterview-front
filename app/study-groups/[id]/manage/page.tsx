"use client";


import { useGetStudyGroupDetail } from "@/hooks/queries/use-study-group";
import { useGetApplicants, useManageApplicant } from "@/hooks/queries/use-mypage"; // 훅 위치 확인 필요
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ManageApplicantsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: applicants, isLoading } = useGetApplicants(params.id);
  const { data: study } = useGetStudyGroupDetail(params.id); // 스터디 제목 등 확인용
  const { mutate: manage } = useManageApplicant(params.id);

  const studyGroupId = Number(params.id);

  if (isLoading) return <div className="text-white text-center py-20">Loading...</div>;
  
  return (
    <div className="min-h-screen bg-black text-white py-12">
      <main className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" className="mb-6 pl-0 text-gray-400" onClick={() => router.back()}>
           <ArrowLeft className="mr-2 h-4 w-4" /> 돌아가기
        </Button>
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">신청자 관리</h1>
          <p className="text-gray-400">{study?.title} 스터디에 신청한 인원입니다.</p>
        </div>

        <div className="space-y-4">
          {applicants?.length === 0 ? (
             <div className="text-center py-10 text-gray-500 bg-gray-900 rounded-lg">아직 신청자가 없습니다.</div>
          ) : (
            applicants?.map((applicant) => (
              <Card key={applicant.userId} className="bg-gray-900 border-gray-800">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{applicant.nickname.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold">{applicant.nickname}</p>
                      <p className="text-xs text-gray-500">{format(new Date(applicant.appliedAt), "yyyy-MM-dd")} 신청</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => manage({ membershipId: applicant.userId, action: "accept" })}
                    >
                      <Check className="w-4 h-4 mr-1" /> 수락
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => manage({ membershipId: applicant.userId, action: "reject" })}
                    >
                      <X className="w-4 h-4 mr-1" /> 거절
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}