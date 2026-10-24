import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSessionServer } from "@/lib/api/serverApi";
import * as cookie from "cookie";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  let isAuthenticated = !!accessToken;

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const res = await checkSessionServer();
      if (res && res.status === 200) {
        isAuthenticated = true;

        const setCookieHeader = res.headers["set-cookie"];
        if (setCookieHeader) {
          const cookieStrings = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookieStrings.forEach((cookieStr) => {
            const parsed = cookie.parseSetCookie(cookieStr);
            if (parsed && parsed.name && parsed.value) {
              response.cookies.set(parsed.name, parsed.value, {
                path: parsed.path,
                expires: parsed.expires ? new Date(parsed.expires) : undefined,
                maxAge: parsed.maxAge,
                domain: parsed.domain,
                secure: parsed.secure,
                httpOnly: parsed.httpOnly,
                sameSite: parsed.sameSite as
                  | "strict"
                  | "lax"
                  | "none"
                  | undefined,
              });
            }
          });
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Упрощенные условия согласно фидбеку
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
