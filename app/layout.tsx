import type React from "react"
import "./globals.css"
import { Inter } from 'next/font/google'
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/components/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NeuralPulse - AI, GenAI, Computer Vision & Deep Learning Blog",
  description: "Exploring the frontiers of artificial intelligence, generative AI, computer vision, and deep learning.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
