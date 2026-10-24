// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token =
//     request.cookies.get("accessToken")?.value ||
//     request.cookies.get("refreshToken")?.value;

//   const allCookies = request.cookies.getAll();
//   const hasSession = allCookies.length > 0;

//   const { pathname } = request.nextUrl;

//   const isPrivateAuthRoute =
//     pathname.startsWith("/profile") || pathname.startsWith("/notes/create");

//   const isAuthRoute =
//     pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

//   const sessionCookie =
//     request.cookies.get("connect.sid") || request.cookies.get("token");

//   const isAuthenticated =
//     request.cookies.has("accessToken") || request.cookies.has("refreshToken");

//   if (isPrivateAuthRoute && !isAuthenticated) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   if (isAuthRoute && isAuthenticated) {
//     return NextResponse.redirect(new URL("/profile", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/profile/:path*", "/sign-in", "/sign-up", "/notes/:path*"],
// };
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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
