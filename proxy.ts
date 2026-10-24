import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateAuthRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes/create");

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const isAuthenticated =
    request.cookies.has("accessToken") || request.cookies.has("refreshToken");

  if (isPrivateAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up", "/notes/:path*"],
};
