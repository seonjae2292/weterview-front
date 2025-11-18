// components/layout/header.tsx
"use client";

import Link from "next/link";
import { KakaoLoginButton } from "../shared/kakao-login-button";
import { UserMenu } from "./user-menu";
import { useMyProfile } from "@/hooks/queries/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { data: user, isLoading } = useMyProfile();

  return (
    <header className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          We<span className="text-primary">Terview</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link href="/articles/" className="text-gray-400 hover:text-white transition-colors">Articles</Link>
          <Link href="/topics/" className="text-gray-400 hover:text-white transition-colors">Topics</Link>
          <Link href="/about/" className="text-gray-400 hover:text-white transition-colors">About</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <KakaoLoginButton />
          )}
        </div>
      </div>
    </header>
  );
}