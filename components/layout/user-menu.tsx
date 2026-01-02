"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/queries/use-auth";
import { MyPageInfoDto } from "@/types/auth";
import { Button } from "@/components/ui/button";

interface UserMenuProps {
  user: MyPageInfoDto;
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9 border border-gray-700 hover:border-primary transition-colors">
            <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {user.nickname.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.nickname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.kakaoEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/mypage" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>마이페이지</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}