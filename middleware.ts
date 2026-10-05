import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const userRole = req.auth?.user?.role as string | undefined;

  const { nextUrl } = req;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = nextUrl.pathname.startsWith("/account");
  const isAuthRoute =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  // 1. Protect Admin Routes (requires logged-in user with ADMIN role)
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const redirectUrl = new URL("/login", nextUrl.origin);
      redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    if (userRole !== "ADMIN") {
      // Forbidden: redirect to home
      return NextResponse.redirect(new URL("/", nextUrl.origin));
    }
    return NextResponse.next();
  }

  // 2. Protect Account Routes (requires logged-in user)
  if (isAccountRoute && !isLoggedIn) {
    const redirectUrl = new URL("/login", nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Redirect authenticated users away from Login/Register ONLY IF they are NOT visiting with a callbackUrl
  // This strictly prevents infinite redirect loops between /admin and /login?callbackUrl=/admin
  if (isAuthRoute && isLoggedIn) {
    const callbackUrl = nextUrl.searchParams.get("callbackUrl");
    if (!callbackUrl || callbackUrl.startsWith("/login") || callbackUrl.startsWith("/register")) {
      if (userRole === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", nextUrl.origin));
      }
      return NextResponse.redirect(new URL("/account", nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/register"],
};
