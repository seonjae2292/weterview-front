"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

// UI Components
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner"; // 에러 해결: Spinner 임포트
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

// Hooks
import { useCheckNickname, useSignup } from "@/hooks/queries/use-auth";

// 유효성 검사 스키마
const signupSchema = z.object({
  realName: z.string().min(2, "이름은 2글자 이상이어야 합니다."),
  nickname: z.string().min(2, "별명은 2글자 이상이어야 합니다."),
  birthDate: z.date({ error: "생년월일을 선택해주세요." }),
  gender: z.enum(["MALE", "FEMALE"] as const, { message: "성별을 선택해주세요." }),
});

function SignupForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { toast } = useToast();
  
  const { mutate: signup, isPending: isSigningUp } = useSignup();
  const { mutateAsync: checkNickname, isPending: isCheckingNickname } = useCheckNickname();
  
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      realName: "",
      nickname: "",
      gender: "MALE",
    },
  });

  // 닉네임 중복 확인
  const handleCheckNickname = async (nickname: string) => {
    if (nickname.length < 2) {
      form.setError("nickname", { message: "2글자 이상 입력해주세요." });
      return;
    }
    
    try {
      const res = await checkNickname(nickname);
      // API 응답이 { isDuplicate: boolean } 형태라고 가정 (HashMap)
      const isDuplicate = res.data["isDuplicate"]; 
      
      if (!isDuplicate) { 
        setIsNicknameChecked(true);
        toast({ title: "사용 가능한 별명입니다.", className: "bg-primary text-primary-foreground" });
        form.clearErrors("nickname");
      } else {
        setIsNicknameChecked(false);
        form.setError("nickname", { message: "이미 사용 중인 별명입니다." });
      }
    } catch (e) {
       toast({ title: "중복 확인 중 오류가 발생했습니다.", variant: "destructive" });
    }
  };

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    if (!isNicknameChecked) {
      toast({ title: "별명 중복 확인을 해주세요.", variant: "destructive" });
      return;
    }

    signup({
      ...values,
      birthDate: format(values.birthDate, "yyyy-MM-dd"),
      email, 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-primary">회원가입</h1>
          <p className="text-muted-foreground">서비스 이용을 위해 추가 정보를 입력해주세요.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 이름 */}
            <FormField
              control={form.control}
              name="realName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>실명</FormLabel>
                  <FormControl>
                    <Input placeholder="홍길동" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 별명 (중복확인 포함) */}
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>별명</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="토스매니아" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setIsNicknameChecked(false);
                        }}
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      disabled={isCheckingNickname}
                      onClick={() => handleCheckNickname(field.value)}
                    >
                      {isCheckingNickname ? <Spinner /> : "중복확인"}
                    </Button>
                  </div>
                  <FormDescription>다른 사용자와 겹치지 않는 별명을 입력해주세요.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 생년월일 (Calendar) */}
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>생년월일</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>날짜를 선택하세요</span>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        // 에러 해결: react-day-picker v9에서는 'dropdown' 사용
                        captionLayout="dropdown" 
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 성별 */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>성별</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="MALE" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">남자</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="FEMALE" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">여자</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSigningUp}>
              {isSigningUp && <Spinner className="mr-2" />}
              가입 완료
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SignupForm />
    </Suspense>
  );
}