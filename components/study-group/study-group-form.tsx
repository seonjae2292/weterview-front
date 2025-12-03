"use client";

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { FIELD_LABEL, LOCATION_LABEL, STATUS_LABEL } from "@/constants/enums";
import { studyGroupSchema, type StudyGroupSchema } from "@/schemas/study-group";

interface StudyGroupFormProps {
  defaultValues?: Partial<StudyGroupSchema>;
  onSubmit: (values: StudyGroupSchema) => void;
  isPending: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
}

export function StudyGroupForm({
  defaultValues,
  onSubmit,
  isPending,
  submitButtonText = "스터디 개설하기",
  cancelButtonText,
  onCancel,
}: StudyGroupFormProps) {
  const form = useForm<StudyGroupSchema>({
    resolver: zodResolver(studyGroupSchema) as unknown as Resolver<StudyGroupSchema>,
    mode: "onChange",
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
      ...defaultValues,
    },
  });

  const showStatusField = defaultValues?.status !== undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-gray-900 p-6 md:p-8 rounded-xl border border-gray-800">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold border-b border-gray-800 pb-2">기본 정보</h3>

          {showStatusField && (
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
          )}
          
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
                    <Input type="number" min="1" placeholder="1" {...field} className="bg-black border-gray-700" />
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
                    <Input type="number" min="2" placeholder="2" {...field} className="bg-black border-gray-700" />
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
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
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
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          if (startDate) {
                            const minEndDate = new Date(startDate);
                            minEndDate.setDate(startDate.getDate() + 1); // Minimum end date is 1 day after start date
                            minEndDate.setHours(0, 0, 0, 0);
                            return date < minEndDate;
                          }
                          // If startDate is not set, then disable dates before today
                          return date < today;
                        }}
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
                처리 중...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
