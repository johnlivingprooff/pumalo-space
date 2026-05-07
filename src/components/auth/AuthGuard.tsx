"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@stackframe/stack";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUser();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to sign-in with original destination
      const redirectUrl = `/sign-in?redirect=${encodeURIComponent(pathname || "/")}`;
      router.push(redirectUrl);
      return;
    }

    // User is authenticated
    setIsChecking(false);
  }, [user, pathname, router]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render children if user is authenticated
  return <>{children}</>;
}
