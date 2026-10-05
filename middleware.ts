import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "@auth/core/jwt";

export async function middleware(req: NextRequest) {
  const hasSecureCookie = req.cookies.has("__Secure-authjs.session-token");
  const activeCookieName = hasSecureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const token = await getToken({
    req: {
      headers: req.headers,
    } as any,
    secret: process.env.AUTH_SECRET,
    cookieName: activeCookieName,
    salt: activeCookieName,
  });

  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  const { nextUrl } = req;
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
    if (userRole !== "ADMIN") {
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
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl.origin));
    }
    return NextResponse.redirect(new URL("/account", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/login", "/register"],
};
