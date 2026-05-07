import { redirect } from "next/navigation";
import Link from "next/link";
import { stackServerApp } from "@stack/server";
import prisma from "@/lib/prisma";
import { deleteDraftAction } from "./actions";

export default async function DraftsPage() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) redirect("/sign-in");

  const drafts = await prisma.propertyDraft.findMany({
    where: { userId: stackUser.id },
    select: { id: true, title: true, step: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Drafts</h1>
          <Link
            href="/host/create-listing"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            + New Listing
          </Link>
        </div>

        {drafts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">No drafts yet.</p>
            <Link
              href="/host/create-listing"
              className="text-blue-600 hover:underline text-sm"
            >
              Start a new listing
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {draft.title || "Untitled draft"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Step {draft.step} of 4 · Last saved{" "}
                    {new Date(draft.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/host/create-listing?draft=${draft.id}`}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Continue
                  </Link>
                  <form action={deleteDraftAction.bind(null, draft.id)}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
