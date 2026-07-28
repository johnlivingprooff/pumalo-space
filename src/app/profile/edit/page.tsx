import { stackServerApp } from "@stack/server";
import { redirect } from "next/navigation";
import { ensureUserInDatabase } from "@/lib/ensureUser";
import prisma from "@/lib/prisma";
import EditProfileForm from "./EditProfileForm";
import Link from "next/link";

export default async function EditProfilePage() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) redirect("/sign-in");

  let user = await prisma.user.findUnique({
    where: { id: stackUser.id },
    select: {
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      bio: true,
    },
  });

  if (!user) {
    await ensureUserInDatabase({
      id: stackUser.id,
      primaryEmail: stackUser.primaryEmail,
      displayName: stackUser.displayName,
      profileImageUrl: stackUser.profileImageUrl,
    });
    user = await prisma.user.findUnique({
      where: { id: stackUser.id },
      select: {
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bio: true,
      },
    });
  }

  if (!user) redirect("/profile");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/profile"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
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
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Update your personal information
            </p>
          </div>
        </div>

        <EditProfileForm profile={user} />
      </div>
    </div>
  );
}
