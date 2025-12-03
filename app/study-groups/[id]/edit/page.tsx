"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useGetStudyGroupDetail, useUpdateStudyGroup } from "@/hooks/queries/use-study-group";
import { Skeleton } from "@/components/ui/skeleton";
import { StudyGroupForm } from "@/components/study-group/study-group-form";
import type { StudyGroupSchema } from "@/schemas/study-group";

export default function EditStudyGroupPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: study, isLoading } = useGetStudyGroupDetail(params.id);
  const { mutate: updateStudy, isPending } = useUpdateStudyGroup(params.id);

  const onSubmit = (values: StudyGroupSchema) => {
    const formatDateTime = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

    const requestBody = {
      ...values,
      startDate: formatDateTime(values.startDate),
      endDate: formatDateTime(values.endDate),
      status: values.status as "RECRUITING" | "CLOSED" | "DELETED" | undefined,
    };

    updateStudy(requestBody, {
      onSuccess: () => {
        router.push(`/study-groups/detail/${params.id}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white py-12 px-4">
        <Skeleton className="max-w-3xl mx-auto h-[800px] bg-gray-900 rounded-xl" />
      </div>
    );
  }

  if (!study) {
    return <div className="text-center text-white py-20">존재하지 않는 스터디입니다.</div>;
  }

  const defaultValues = {
    ...study,
    startDate: new Date(study.startDate),
    endDate: new Date(study.endDate),
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <main className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">스터디 수정하기</h1>
          <p className="text-gray-400">스터디 정보를 최신 상태로 업데이트하세요.</p>
        </div>
        
        <StudyGroupForm
          onSubmit={onSubmit}
          isPending={isPending}
          defaultValues={defaultValues}
          submitButtonText="수정 완료"
          cancelButtonText="취소"
          onCancel={() => router.back()}
        />
      </main>
    </div>
  );
}