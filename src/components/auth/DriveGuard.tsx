"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";

interface DriveGuardProps {
  children: React.ReactNode;
  requireDrive?: boolean;
}

export function DriveGuard({
  children,
  requireDrive = false,
}: DriveGuardProps) {
  const router = useRouter();
  const user = useUser();
  const [hasDriveAccess, setHasDriveAccess] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // If user isn't authenticated, let AuthGuard handle it
    if (!user) {
      setIsChecking(false);
      return;
    }

    // Check Google Drive connection status
    const checkDriveAccess = async () => {
      try {
        const response = await fetch("/api/drive/auth");
        const data = await response.json();

        if (data.connected) {
          setHasDriveAccess(true);
        } else {
          setHasDriveAccess(false);

          // If this route requires Drive access, redirect to connect page
          if (requireDrive) {
            router.push(
              `/connect-drive?redirect=${encodeURIComponent(window.location.pathname)}`,
            );
          }
        }
      } catch (error) {
        console.error("Error checking Drive access:", error);
        setHasDriveAccess(false);

        // If this route requires Drive access, redirect to connect page
        if (requireDrive) {
          router.push(
            `/connect-drive?redirect=${encodeURIComponent(window.location.pathname)}`,
          );
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkDriveAccess();
  }, [user, requireDrive, router]);

  // Show loading state while checking Drive access
  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render children if Drive is not required or user has access
  return <>{children}</>;
}
