"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BrainCircuit, Cpu, Eye, Github, Linkedin, Mail, Rss, Twitter } from "lucide-react"
import { useRouter } from "next/navigation"

// Static topic data for GitHub Pages
const topics = [
  {
    title: "Generative AI",
    description: "Explore the latest advancements in generative AI models, including GANs, diffusion models, and more.",
    icon: <BrainCircuit className="h-6 w-6" />,
    count: 12,
    slug: "generative-ai",
  },
  {
    title: "Computer Vision",
    description:
      "Discover how AI is revolutionizing image and video analysis, object detection, and scene understanding.",
    icon: <Eye className="h-6 w-6" />,
    count: 8,
    slug: "computer-vision",
  },
  {
    title: "Deep Learning",
    description: "Learn about neural network architectures, training techniques, and applications in various domains.",
    icon: <Cpu className="h-6 w-6" />,
    count: 15,
    slug: "deep-learning",
  },
  {
    title: "AI Ethics",
    description: "Examine the ethical implications of AI development and deployment in society.",
    icon: <BrainCircuit className="h-6 w-6" />,
    count: 6,
    slug: "ai-ethics",
  },
  {
    title: "Natural Language Processing",
    description: "Explore how AI understands, generates, and interacts with human language.",
    icon: <BrainCircuit className="h-6 w-6" />,
    count: 9,
    slug: "nlp",
  },
  {
    title: "AI Research",
    description: "Stay updated with the latest research papers, breakthroughs, and academic developments in AI.",
    icon: <BrainCircuit className="h-6 w-6" />,
    count: 11,
    slug: "ai-research",
  },
]

export default function TopicsPage() {
  const router = useRouter()

  const handleSubscribeClick = () => {
    router.push("/#newsletter")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-8">Topics</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic, index) => (
              <TopicCard
                key={index}
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
                count={topic.count}
                slug={topic.slug}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

interface TopicCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  slug: string;
}

function TopicCard({ title, description, icon, count, slug = "" }: TopicCardProps) {
  return (
    <Link href={`/articles/`} className="group">
      <Card className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">{icon}</div>
            <div className="bg-gray-800 px-3 py-1 rounded-full text-sm">{count} articles</div>
          </div>
          <CardTitle className="text-xl mt-4 group-hover:text-blue-400 transition-colors">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-400">{description}</CardDescription>
        </CardContent>
        <CardFooter>
          <span className="text-primary text-sm group-hover:text-blue-400 transition-colors">View articles →</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
