import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers"; // Импортируем асинхронную функцию cookies
import { checkSessionServer } from "@/lib/api/serverApi";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Получаем куки через асинхронную функцию cookies() из next/headers
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // Расширяем приватные маршруты, добавляя /notes
  const isPrivateRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

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
  // Обновляем матчер, чтобы он захватывал и профиль, и заметки
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
