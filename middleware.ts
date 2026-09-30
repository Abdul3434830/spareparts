import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = nextUrl.pathname.startsWith("/account");
  const isAuthRoute =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // 1. Protect Admin Routes (requires ADMIN role)
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const redirectUrl = new URL("/login", nextUrl.origin);
      redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    if (userRole !== Role.ADMIN) {
      // Forbidden: redirect to home
      return NextResponse.redirect(new URL("/", nextUrl.origin));
    }
  }

  // 2. Protect Account Routes (requires logged-in user)
  if (isAccountRoute && !isLoggedIn) {
    const redirectUrl = new URL("/login", nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Redirect authenticated users away from Login/Register
  if (isAuthRoute && isLoggedIn) {
    if (userRole === Role.ADMIN) {
      return NextResponse.redirect(new URL("/admin", nextUrl.origin));
    }
    return NextResponse.redirect(new URL("/account", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/register"],
};
