import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = process.env.COOKIE_NAME || "ex_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /panel and /support
  const protectedUser = pathname.startsWith("/panel") || pathname.startsWith("/support");
  if (protectedUser) {
    const sid = req.cookies.get(COOKIE_NAME)?.value;
    if (!sid) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    // admin uses header password in API; UI asks for password and stores in sessionStorage only.
    // Here we just allow page load; APIs are protected.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/support/:path*", "/admin/:path*"],
};
