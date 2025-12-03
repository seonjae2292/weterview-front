"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useCreateStudyGroup } from "@/hooks/queries/use-study-group";
import { StudyGroupForm } from "@/components/study-group/study-group-form";
import type { StudyGroupSchema } from "@/schemas/study-group";

export default function CreateStudyGroupPage() {
  const router = useRouter();
  const { mutate: createStudyGroup, isPending } = useCreateStudyGroup();

  const onSubmit = (values: StudyGroupSchema) => {
    const formatDateTime = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

    const requestBody = {
      ...values,
      startDate: formatDateTime(values.startDate),
      endDate: formatDateTime(values.endDate),
    };

    createStudyGroup(requestBody, {
      onSuccess: () => {
        router.push("/study-groups");
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <main className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">스터디 개설하기</h1>
          <p className="text-gray-400">새로운 스터디 그룹을 만들어 동료를 모아보세요.</p>
        </div>

        <StudyGroupForm onSubmit={onSubmit} isPending={isPending} submitButtonText="스터디 개설하기" />
      </main>
    </div>
  );
}