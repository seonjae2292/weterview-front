"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { useGetStudyGroupDetail, useUpdateStudyGroup } from "@/hooks/queries/use-study-group";
import { FIELD_LABEL, LOCATION_LABEL, STATUS_LABEL } from "@/constants/enums";
import { StudyGroupDetailDto } from "@/types/study-group";

// 폼 유효성 검사 스키마
const formSchema = z.object({
  title: z.string().min(2, "제목은 2글자 이상이어야 합니다."),
  subTitle: z.string().min(2, "부제목을 입력해주세요."),
  field: z.string().min(1, "분야를 선택해주세요."),
  location: z.string().min(1, "지역을 선택해주세요."),
  recruitingNumber: z.coerce.number().min(1, "모집 인원은 1명 이상이어야 합니다."),
  totalNumber: z.coerce.number().min(2, "총 인원은 2명 이상이어야 합니다."),
  startDate: z.date({ error: "시작일을 선택해주세요." }),
  endDate: z.date({ error: "종료일을 선택해주세요." }),
  description: z.string().min(10, "상세 설명은 10자 이상 입력해주세요."),
  schedule: z.string().min(2, "진행 일정을 입력해주세요."),
  joinCondition: z.string().min(2, "참여 조건을 입력해주세요."),
  contact: z.string().min(2, "연락처/문의처를 입력해주세요."),
  status: z.string().optional(),
});

// [핵심 변경] 폼 컴포넌트를 분리하여 데이터가 있을 때만 렌더링합니다.
function EditForm({ study, studyGroupId }: { study: StudyGroupDetailDto; studyGroupId: string }) {
  const router = useRouter();
  const { mutate: updateStudy, isPending } = useUpdateStudyGroup(studyGroupId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<z.infer<typeof formSchema>>,
    // 데이터가 이미 로드된 상태이므로 defaultValues에 바로 주입합니다.
    defaultValues: {
      title: study.title,
      subTitle: study.subTitle,
      field: study.field,
      location: study.location,
      recruitingNumber: study.recruitingNumber,
      totalNumber: study.totalNumber,
      startDate: new Date(study.startDate),
      endDate: new Date(study.endDate),
      description: study.description,
      schedule: study.schedule,
      joinCondition: study.joinCondition,
      contact: study.contact,
      status: study.status,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formatDateTime = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

    const requestBody = {
      ...values,
      startDate: formatDateTime(values.startDate),
      endDate: formatDateTime(values.endDate),
      status: values.status as "RECRUITING" | "CLOSED" | "DELETED" | undefined,
    };

    updateStudy(requestBody);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-800">
        
        {/* 1. 기본 정보 및 상태 수정 */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold border-b border-gray-800 pb-2">기본 정보</h3>
          
          {/* 상태 변경 필드 */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>모집 상태</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>스터디 제목</FormLabel>
                <FormControl>
                  <Input placeholder="스터디 제목 입력" {...field} className="bg-black border-gray-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>한줄 소개 (부제목)</FormLabel>
                <FormControl>
                  <Input placeholder="스터디의 핵심을 한 문장으로 표현해주세요." {...field} className="bg-black border-gray-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>분야</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black border-gray-700">
                        <SelectValue placeholder="분야 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(FIELD_LABEL).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>지역</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-black border-gray-700">
                        <SelectValue placeholder="지역 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(LOCATION_LABEL).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 2. 모집 정보 섹션 */}
        <div className="space-y-6 mt-8">
          <h3 className="text-xl font-semibold border-b border-gray-800 pb-2">모집 정보</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="recruitingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>현재 모집된 인원</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-black border-gray-700" />
                  </FormControl>
                  <FormDescription>현재 확정된 인원수입니다.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>총 모집 인원</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-black border-gray-700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>모집 시작일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-black border-gray-700",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>날짜 선택</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>모집 마감일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-black border-gray-700",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>날짜 선택</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 3. 상세 내용 섹션 */}
        <div className="space-y-6 mt-8">
          <h3 className="text-xl font-semibold border-b border-gray-800 pb-2">상세 내용</h3>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>스터디 소개</FormLabel>
                <FormControl>
                  <Textarea 
                    className="bg-black border-gray-700 min-h-[150px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormLabel>진행 일정</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-black border-gray-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="joinCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>참여 조건</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-black border-gray-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>문의 연락처</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-black border-gray-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()} 
            className="flex-1 h-12 text-lg border-gray-700 hover:bg-gray-800"
          >
            취소
          </Button>
          <Button 
            type="submit" 
            className="flex-1 h-12 text-lg" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                수정 중...
              </>
            ) : (
              "수정 완료"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function EditStudyGroupPage({ params }: { params: { id: string } }) {
  // 데이터 로딩을 상위 컴포넌트에서 처리
  const { data: study, isLoading } = useGetStudyGroupDetail(params.id);

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

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <main className="container mx-auto px-4 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">스터디 수정하기</h1>
          <p className="text-gray-400">스터디 정보를 최신 상태로 업데이트하세요.</p>
        </div>
        
        <EditForm study={study} studyGroupId={params.id} />
      </main>
    </div>
  );
}