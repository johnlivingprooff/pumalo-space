import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const origin = new URL(request.url).origin;

  if (error) {
    return NextResponse.redirect(new URL("/?drive_denied=1", request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  let userId: string;
  let next = "/";
  try {
    const parsed = JSON.parse(state);
    userId = parsed.userId;
    next = parsed.next || "/";
  } catch {
    userId = state;
  }

  try {
    await exchangeCodeForTokens(code, userId);
    return NextResponse.redirect(new URL(next, origin));
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(new URL("/?error=drive_auth_failed", origin));
  }
}
