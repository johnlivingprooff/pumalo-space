import { stackServerApp } from "@stack/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

const protectedRoutes = [
  "/list-property",
  "/my-listings",
  "/favourites",
  "/profile",
  "/host",
  "/manage-listings",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    try {
      const user = await stackServerApp.getUser();
      if (!user) {
        const url = new URL("/sign-in", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isAdmin: true },
      });
      if (!dbUser?.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Standard auth-protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtectedRoute) {
    try {
      const user = await stackServerApp.getUser();
      if (!user) {
        const url = new URL("/sign-in", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }
    } catch {
      const url = new URL("/sign-in", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Matcher config to apply middleware to relevant paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
