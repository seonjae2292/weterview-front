// "use client"

// import { useState, useRef, type FormEvent } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { BrainCircuit, Cpu, Eye } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
// import FeaturedCard from "@/components/shared/featured-card"
// import ArticleCard from "@/components/shared/article-card"

// export default function Home() {
//   const [email, setEmail] = useState("")
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { toast } = useToast()
//   const newsletterRef = useRef<HTMLElement>(null)

//   const scrollToNewsletter = () => {
//     newsletterRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   const handleSubscribe = async (e: FormEvent) => {
//     e.preventDefault()

//     if (!email || !email.includes("@")) {
//       toast({
//         title: "Invalid email",
//         description: "Please enter a valid email address.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     // Simulate subscription process
//     setTimeout(() => {
//       toast({
//         title: "Subscription successful!",
//         description: "Thank you for subscribing to our newsletter.",
//       })
//       setEmail("")
//       setIsSubmitting(false)
//     }, 1000)
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <main className="container mx-auto px-4 py-12">
//         <section className="mb-20">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-6">
//               <h1 className="text-4xl md:text-6xl font-bold leading-tight">
//                 Exploring the Frontiers of <span className="text-primary">Artificial Intelligence</span>
//               </h1>
//               <p className="text-gray-400 text-lg md:text-xl">
//                 Deep insights into AI, GenAI, Computer Vision, and Deep Learning advancements.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Button className="bg-purple-600 hover:bg-purple-700">
//                   <Link href="/articles/">Latest Articles</Link>
//                 </Button>
//                 <Button variant="outline" className="border-gray-700 hover:bg-gray-900" onClick={scrollToNewsletter}>
//                   Join Newsletter
//                 </Button>
//               </div>
//             </div>
//             <div className="relative h-[400px] rounded-xl overflow-hidden border border-gray-800">
//               <Image
//                 src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&h=800&auto=format&fit=crop"
//                 alt="AI visualization showing neural network connections"
//                 fill
//                 className="object-cover"
//                 priority
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
//             </div>
//           </div>
//         </section>

//         <section className="mb-20">
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-2xl font-bold">Featured Articles</h2>
//             <Link href="/articles/" className="text-primary hover:text-primary text-sm flex items-center gap-2">
//               View all <Eye className="h-4 w-4" />
//             </Link>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             <FeaturedCard
//               title="The Evolution of Generative Adversarial Networks: From GAN to StyleGAN-3"
//               description="Explore the development of GAN architectures, highlighting key milestones like Progressive GAN, StyleGAN-1, StyleGAN-2, and the latest advancements in StyleGAN-3."
//               image="https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=600&h=400&auto=format&fit=crop"
//               date="May 15, 2023"
//               category="GenAI"
//               icon={<BrainCircuit className="h-5 w-5" />}
//               slug="evolution-of-gans"
//             />
//             <FeaturedCard
//               title="AI in 2025: Transforming Daily Life"
//               description="Discuss how generative AI has integrated into everyday activities by 2025, providing personal style tips, translating conversations, analyzing diets, and more."
//               image="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600&h=400&auto=format&fit=crop"
//               date="June 2, 2023"
//               category="Future Tech"
//               icon={<Cpu className="h-5 w-5" />}
//               slug="ai-in-2025"
//             />
//             <FeaturedCard
//               title="The Rise of Multimodal AI Models: Bridging Text, Image, and Beyond"
//               description="Examine the emergence of multimodal AI models that process and generate multiple data types, such as text, images, and videos, and their applications in various industries."
//               image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&h=400&auto=format&fit=crop"
//               date="June 28, 2023"
//               category="AI Research"
//               icon={<Eye className="h-5 w-5" />}
//               slug="multimodal-ai-models"
//             />
//           </div>
//         </section>

//         <section className="mb-20">
//           <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <ArticleCard
//               title="Advancements in AI-Driven 3D Modeling and Virtual World Creation"
//               description="Explore how AI is revolutionizing 3D modeling and virtual world creation, enabling users to transform written prompts into immersive experiences."
//               category="3D Modeling"
//               date="July 5, 2023"
//               slug="ai-driven-3d-modeling"
//               image="https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=600&h=400&auto=format&fit=crop"
//             />
//             <ArticleCard
//               title="The Integration of AI in Wearable Technology: Enhancing User Experience"
//               description="Analyze the incorporation of AI into wearable devices, such as smart glasses, and how it enhances user interaction through features like real-world navigation and information accessibility."
//               category="Wearable Tech"
//               date="July 18, 2023"
//               slug="ai-in-wearable-technology"
//               image="https://images.unsplash.com/photo-1551808525-51a94da548ce?q=80&w=600&h=400&auto=format&fit=crop"
//             />
//             <ArticleCard
//               title="Computer Vision in Autonomous Vehicles"
//               description="Exploring how computer vision algorithms are enabling self-driving cars to perceive and navigate complex environments."
//               category="Computer Vision"
//               date="August 3, 2023"
//               slug="computer-vision-autonomous-vehicles"
//               image="https://images.unsplash.com/photo-1563630381190-77c336ea545a?q=80&w=600&h=400&auto=format&fit=crop"
//             />
//             <ArticleCard
//               title="Deep Learning for Natural Language Processing"
//               description="How transformer models have revolutionized our ability to understand and generate human language."
//               category="NLP"
//               date="August 15, 2023"
//               slug="deep-learning-nlp"
//               image="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&h=400&auto=format&fit=crop"
//             />
//             <ArticleCard
//               title="Ethical Considerations in Generative AI"
//               description="Examining the ethical implications of AI-generated content and the responsibility of AI researchers and practitioners."
//               category="AI Ethics"
//               date="September 2, 2023"
//               slug="ethical-considerations-genai"
//               image="https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=600&h=400&auto=format&fit=crop"
//             />
//             <ArticleCard
//               title="The Future of AI Research: What's Next?"
//               description="Predictions and insights into the next frontiers of artificial intelligence research and development."
//               category="Future of AI"
//               date="September 20, 2023"
//               slug="future-of-ai-research"
//               image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&h=400&auto=format&fit=crop"
//             />
//           </div>
//         </section>

//         <section ref={newsletterRef} id="newsletter" className="bg-gray-900 rounded-xl p-8 mb-20">
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold">Stay Updated</h2>
//               <p className="text-gray-400">
//                 Subscribe to our newsletter to receive the latest insights on AI advancements, tutorials, and industry
//                 news.
//               </p>
//             </div>
//             <form onSubmit={handleSubscribe} className="flex gap-2">
//               <Input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="bg-black border-gray-800 focus-visible:ring-primary"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <Button
//                 type="submit"
//                 className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Subscribing..." : "Subscribe"}
//               </Button>
//             </form>
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useGetStudyGroups } from "@/hooks/queries/use-study-group";
import { StudyCard } from "@/components/study-group/study-card";
import { Skeleton } from "@/components/ui/skeleton";
import { FEATURED_STUDY_GROUPS } from "@/constants/mock";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const newsletterRef = useRef<HTMLElement>(null);

  // 최신 스터디 조회 (1페이지, 6개)
  const { data: recentData, isLoading: isRecentLoading } = useGetStudyGroups({
    pageNumber: 1,
    pageSize: 6,
  });

  const scrollToNewsletter = () => {
    newsletterRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
                // API 응답에 id가 없을 경우 index를 키로 사용 (주의: 상세 페이지 이동 불가 가능성 있음)
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