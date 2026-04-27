import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protect /academic routes (except login/guest if they exist)
  if (pathname.startsWith('/academic')) {
    // Check if it's a login page or guest page inside /academic if any
    if (pathname.startsWith('/academic/login') || pathname.startsWith('/academic/guest')) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/academic/:path*'],
};
