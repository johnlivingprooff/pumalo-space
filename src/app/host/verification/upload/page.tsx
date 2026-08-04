import { stackServerApp } from "@stack/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import DriveUploader from "@/components/host/DriveUploader";

export default async function VerificationUploadPage() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/host/verification"
          className="text-sm text-gray-900 font-medium hover:text-gray-600 flex items-center gap-1 mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to verification
        </Link>
        <DriveUploader />
      </div>
    </div>
  );
}
