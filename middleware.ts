// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/study-groups/create',
  '/mypage',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );

  if (isProtected) {
    const token = request.cookies.get('accessToken')?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      
      url.searchParams.set('alert', 'login_required'); 
      
      return NextResponse.redirect(url);
    }
  }

  // 검증을 통과했거나 보호된 경로가 아니라면 요청을 계속 진행
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 경로에서 미들웨어가 실행됩니다:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};