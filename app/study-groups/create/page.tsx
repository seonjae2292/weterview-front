"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCreateStudyGroup } from "@/hooks/queries/use-study-group";
import { FIELD_LABEL, LOCATION_LABEL } from "@/constants/enums";

// Zod Schema - API Req DTO와 일치
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
});

export default function CreateStudyGroupPage() {
  const router = useRouter();
  const { mutate: createStudyGroup, isPending } = useCreateStudyGroup();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as unknown as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      title: "",
      subTitle: "",
      field: "",
      location: "",
      recruitingNumber: 0,
      totalNumber: 0,
      description: "",
      schedule: "",
      joinCondition: "",
      contact: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Date -> ISO string (yyyy-MM-ddTHH:mm:ss) 변환
    // LocalDateTime.parse()가 시간을 요구하므로 시간까지 포맷팅
    const formatDateTime = (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm:ss");

    const requestBody = {
      ...values,
      startDate: formatDateTime(values.startDate),
      endDate: formatDateTime(values.endDate),
    };

    createStudyGroup(requestBody, {
      onSuccess: () => {
        router.push("/study-groups"); // 생성 후 목록으로 이동
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-800">
            
            {/* 기본 정보 섹션 */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold border-b border-gray-800 pb-2">기본 정보</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스터디 제목</FormLabel>
                    <FormControl>
                      <Input placeholder="예) [강남] 프론트엔드 면접 스터디" {...field} className="bg-black border-gray-700" />
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

            {/* 모집 정보 섹션 */}
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
                        <Input type="number" placeholder="0" {...field} className="bg-black border-gray-700" />
                      </FormControl>
                      <FormDescription>현재 확정된 인원수를 입력하세요.</FormDescription>
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
                        <Input type="number" placeholder="4" {...field} className="bg-black border-gray-700" />
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

            {/* 상세 내용 섹션 */}
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
                        placeholder="스터디의 목표, 커리큘럼 등을 자세히 적어주세요." 
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
                      <Input placeholder="예) 매주 토요일 오후 2시 ~ 5시" {...field} className="bg-black border-gray-700" />
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
                      <Input placeholder="예) 프론트엔드 개발 1년 이상, 성실하게 참여하실 분" {...field} className="bg-black border-gray-700" />
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
                      <Input placeholder="오픈카톡 링크 또는 이메일 주소" {...field} className="bg-black border-gray-700" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full text-lg h-12" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  "스터디 개설하기"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}