"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetStudyGroupDetail, useUpdateStudyGroup } from "@/hooks/queries/use-study-group";
import { FIELD_LABEL, LOCATION_LABEL, STATUS_LABEL } from "@/constants/enums";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  // ... create page와 동일한 스키마 + status 추가
  title: z.string().min(2),
  subTitle: z.string().min(2),
  field: z.string(),
  location: z.string(),
  recruitingNumber: z.coerce.number(),
  totalNumber: z.coerce.number(),
  description: z.string(),
  schedule: z.string(),
  joinCondition: z.string(),
  contact: z.string(),
  status: z.string().optional(), // 수정 시 상태 변경 가능
  // Date 처리는 생략 (복잡도 줄임)
});

export default function EditStudyGroupPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: study, isLoading } = useGetStudyGroupDetail(params.id);
  const { mutate: updateStudy, isPending } = useUpdateStudyGroup(params.id);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      // ... 초기값
    }
  });

  // 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (study) {
      form.reset({
        title: study.title,
        subTitle: study.subTitle,
        field: study.field,
        location: study.location,
        recruitingNumber: study.recruitingNumber,
        totalNumber: study.totalNumber,
        description: study.description,
        schedule: study.schedule,
        joinCondition: study.joinCondition,
        contact: study.contact,
        status: study.status,
      });
    }
  }, [study, form]);

  const onSubmit = (values: any) => {
    updateStudy(values);
  };

  if (isLoading) return <div className="p-8"><Skeleton className="h-[600px] w-full bg-gray-900" /></div>;

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <main className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-10">스터디 수정하기</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-900 p-8 rounded-xl border border-gray-800">
            {/* ... CreatePage와 유사한 필드 구성 ... */}
            
            {/* 상태 변경 필드 추가 (수정 페이지 전용) */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>모집 상태</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black border-gray-700">
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(STATUS_LABEL).map(([key, label]) => (
                         <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">취소</Button>
              <Button type="submit" className="flex-1" disabled={isPending}>수정 완료</Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}