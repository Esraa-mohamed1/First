import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  const tokenFromQuery = request.nextUrl.searchParams.get('token');

  // Redirect logged-in users away from landing page
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/academic', request.url));
  }

  // Protect /academic routes (except login/guest if they exist)
  if (pathname.startsWith('/academic')) {
    // Support one-time token handoff via query param (used after onboarding redirects).
    // If present, persist it to cookie then redirect to same URL without the token param.
    if (!token && tokenFromQuery) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete('token');

      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set('token', tokenFromQuery, {
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'lax',
        httpOnly: true,
        secure: request.nextUrl.protocol === 'https:',
      });
      return response;
    }

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
