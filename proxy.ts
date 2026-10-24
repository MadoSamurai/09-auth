import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSessionServer } from "@/lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = request.cookies;

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute = pathname.startsWith("/profile");

  let isAuthenticated = !!accessToken;

  let response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const res = await checkSessionServer();
      if (res && res.status === 200) {
        isAuthenticated = true;

        const setCookieHeader = res.headers["set-cookie"];
        if (setCookieHeader) {
          if (Array.isArray(setCookieHeader)) {
            setCookieHeader.forEach((cookie) => {
              response.headers.append("set-cookie", cookie);
            });
          } else {
            response.headers.set("set-cookie", setCookieHeader);
          }
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (isAuthRoute && (isAuthenticated || accessToken)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPrivateRoute && !isAuthenticated && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
};
