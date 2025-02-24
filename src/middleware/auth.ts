import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Define routes that require specific roles
const roleRestrictedRoutes = {
  '/admin': ['ADMIN'],
  '/reports/manage': ['ADMIN', 'MANAGER'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth_token');
  
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For role-restricted routes, verify user role
  const restrictedPath = Object.keys(roleRestrictedRoutes).find(
    route => pathname.startsWith(route)
  );

  if (restrictedPath) {
    try {
      // Get user role from token or request header
      const userRole = request.headers.get('x-user-role');
      const allowedRoles = roleRestrictedRoutes[restrictedPath];

      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect to dashboard if user doesn't have required role
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // If there's any error in role verification, redirect to login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 