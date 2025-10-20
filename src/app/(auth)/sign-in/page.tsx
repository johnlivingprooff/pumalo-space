"use client";

import { SignIn } from "@stackframe/stack";

export default function SignInPage() {
  return (
    <div>
      <SignIn />
      <div className="mt-6 text-center text-sm text-blue-900/70">
        New here? <a href="/sign-up" className="text-blue-700 hover:underline">Create an account</a>
      </div>
    </div>
  );
}
