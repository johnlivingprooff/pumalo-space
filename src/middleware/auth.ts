import { stackServerApp } from "@stack/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
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

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    try {
      // Validate user authentication
      const user = await stackServerApp.getUser();

      if (!user) {
        // Redirect to sign-in with original destination as query param
        const redirectUrl = new URL("/sign-in", request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      // If auth check fails, redirect to sign-in
      const redirectUrl = new URL("/sign-in", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Continue with the request
  return NextResponse.next();
}

// Matcher config to apply middleware to relevant paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
