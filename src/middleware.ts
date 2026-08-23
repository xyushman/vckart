import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const pathname = req.nextUrl.pathname;
    const isAuthenticated = !!token;
    const isAdmin = token?.role === "ADMIN";

    const isLoginRoute = pathname === "/login";
    const isAdminLoginRoute = pathname === "/admin/login";
    const isAdminRoute = pathname.startsWith("/admin") && !isAdminLoginRoute;
    const isConsumerRoute = ["/assistant", "/discover", "/shopping-list", "/saved", "/history", "/settings", "/profile"].some(route => pathname.startsWith(route));

    // Handle Authenticated Users
    if (isAuthenticated) {
      // 1. Authenticated ADMIN
      if (isAdmin) {
        // Redirect away from login pages
        if (isLoginRoute || isAdminLoginRoute) {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
      } 
      // 2. Authenticated USER / DEMO
      else {
        // Redirect away from consumer login
        if (isLoginRoute) {
          return NextResponse.redirect(new URL("/assistant", req.url));
        }
        // Deny access to admin routes
        if (isAdminRoute || isAdminLoginRoute) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    } 
    // Handle Unauthenticated Users
    else {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
      if (isConsumerRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle all authorization logic and redirects
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  // Apply middleware to all protected and auth routes
  matcher: [
    "/login", 
    "/admin/:path*", 
    "/assistant/:path*", 
    "/discover/:path*", 
    "/shopping-list/:path*", 
    "/saved/:path*", 
    "/history/:path*", 
    "/settings/:path*", 
    "/profile/:path*"
  ],
};
