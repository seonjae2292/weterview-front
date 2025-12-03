"use client";

import { useState, useRef, useEffect, Suspense } from "react"; // Suspense 추가
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useGetStudyGroups } from "@/hooks/queries/use-study-group";
import { StudyCard } from "@/components/study-group/study-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FEATURED_STUDY_GROUPS } from "@/constants/mock";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. 기존 Home 컴포넌트의 로직을 HomeContent로 이동
function HomeContent() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const newsletterRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams(); // 여기서 사용 중
  const router = useRouter();

  // 최신 스터디 조회 (1페이지, 6개)
  const { data: recentData, isLoading: isRecentLoading } = useGetStudyGroups({
    pageNumber: 1,
    pageSize: 6,
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  // [Auth Guard] 미들웨어 리다이렉트 감지
  useEffect(() => {
    const alertType = searchParams.get("alert");

    if (alertType === "login_required") {
      setTimeout(() => {
        toast({
          title: "로그인이 필요한 서비스입니다.",
          description: "로그인 후 이용해주세요.",
          variant: "destructive",
        });
      }, 0);

      router.replace("/", { scroll: false });
    }
  }, [searchParams, toast, router]);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-20 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            함께 성장하는 <span className="text-primary">스터디 커뮤니티</span>
            <br />
            WeTerview
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            혼자서는 어려운 목표, 함께라면 가능합니다. <br />
            지금 바로 나에게 딱 맞는 스터디를 찾아보세요.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/study-groups">스터디 찾기</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-700 hover:bg-gray-900">
              <Link href="/study-groups/create">스터디 개설하기</Link>
            </Button>
          </div>
        </section>

        {/* Featured Section (Mock Data) */}
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="text-yellow-500 w-6 h-6" />
            <h2 className="text-2xl font-bold">지금 뜨는 스터디</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_STUDY_GROUPS.map((study, idx) => (
              <StudyCard key={idx} id={String(study.id)} data={study} />
            ))}
          </div>
        </section>

        {/* Recent Section (API Integration) */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Zap className="text-primary w-6 h-6" />
              <h2 className="text-2xl font-bold">따끈따끈한 최신 스터디</h2>
            </div>
            <Link href="/study-groups" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              전체보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isRecentLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[280px] rounded-xl bg-gray-900" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {recentData?.content.map((study: any, index: number) => (
                // API 응답에 id가 없을 경우 index를 키로 사용
                <StudyCard key={index} id={study.id || String(index)} data={study} />
              ))}
              {recentData?.content.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  등록된 스터디가 없습니다.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section ref={newsletterRef} className="bg-gray-900 rounded-xl p-8 md:p-12 border border-gray-800 text-center">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold">새로운 스터디 소식을 놓치지 마세요</h2>
            <p className="text-gray-400">
              관심 분야의 인기 스터디가 개설되면 메일로 알려드립니다.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="bg-black border-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "구독 중..." : "구독하기"}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

// 2. Default Export를 Suspense로 감싼 컴포넌트로 변경
export default function Home() {
  return (
    // Fallback UI는 로딩 중에 보여줄 화면 (예: 빈 화면 또는 스켈레톤)
    <Suspense fallback={<div className="min-h-screen bg-black text-white" />}>
      <HomeContent />
    </Suspense>
  );
}