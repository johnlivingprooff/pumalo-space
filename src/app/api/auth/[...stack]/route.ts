import { stackServerApp } from "@stack/server";

// Stack Auth API route handler
// This handles OAuth endpoints: /api/auth/oauth/token, /api/auth/sessions, etc.
// The handler is a Next.js Route Handler that returns { GET, POST, PUT, DELETE }
const handler = stackServerApp.handler;

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
