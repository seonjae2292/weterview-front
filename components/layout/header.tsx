"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export default function Header() {
  const newsletterRef = useRef<HTMLElement>(null)

  const scrollToNewsletter = () => {
    newsletterRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          We<span className="text-primary">Terview</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/articles/" className="text-gray-400 hover:text-white transition-colors">
            Articles
          </Link>
          <Link href="/topics/" className="text-gray-400 hover:text-white transition-colors">
            Topics
          </Link>
          <Link href="/about/" className="text-gray-400 hover:text-white transition-colors">
            About
          </Link>
        </nav>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-blue-950 hover:text-white"
          onClick={scrollToNewsletter}
        >
          Subscribe
        </Button>
      </div>
    </header>
  )
}
