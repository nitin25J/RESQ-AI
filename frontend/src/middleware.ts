import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Define what mode the current Vercel deployment is running in
  // Options: 'public' | 'dashboard' | undefined (local dev or mixed)
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;

  // If we are strictly the 'public' app, block access to the dashboard
  if (appMode === 'public') {
    if (url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If we are strictly the 'dashboard' app, block access to the public scanner
  if (appMode === 'dashboard') {
    // If they hit the root, redirect them to dashboard login
    if (url.pathname === '/' || url.pathname === '/library') {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
  }

  // Otherwise (local dev or mixed deployment), let everything through
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
