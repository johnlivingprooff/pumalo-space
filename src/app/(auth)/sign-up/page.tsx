"use client";

import { SignUp } from "@stackframe/stack";

export default function SignUpPage() {
  return (
    <div>
      <SignUp />
      <div className="mt-6 text-center text-sm text-blue-900/70">
        Already have an account? <a href="/sign-in" className="text-blue-700 hover:underline">Sign in</a>
      </div>
    </div>
  );
}
