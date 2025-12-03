"use client";

import Link from "next/link";
import { KakaoLoginButton } from "../shared/kakao-login-button";
import { UserMenu } from "./user-menu";
import { useMyProfile } from "@/hooks/queries/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function Header() {
  const { data: user, isLoading } = useMyProfile();
  console.log("Header user:", user);
  console.log("Header isLoading:", isLoading);
  return (
    <header className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          We<span className="text-primary">Terview</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          <Link href="/study-groups" className="text-gray-400 hover:text-white transition-colors">스터디</Link>
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