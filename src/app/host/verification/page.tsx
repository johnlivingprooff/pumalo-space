import { redirect } from "next/navigation";
import { stackServerApp } from "@stack/server";
import prisma from "@/lib/prisma";
import { VerificationClient } from "./VerificationClient";

export default async function VerificationPage() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) redirect("/sign-in");

  const profile = await prisma.hostProfile.findUnique({
    where: { userId: stackUser.id },
    select: {
      verificationStatus: true,
      rejectionReason: true,
      verifiedAt: true,
    },
  });

  if (!profile) redirect("/host/onboarding");

  const documents = await prisma.verificationDocument.findMany({
    where: { userId: stackUser.id },
    select: {
      id: true,
      fileName: true,
      verificationType: true,
      createdAt: true,
      webViewLink: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <VerificationClient
      initialStatus={profile.verificationStatus}
      rejectionReason={profile.rejectionReason}
      verifiedAt={profile.verifiedAt?.toISOString() ?? null}
      initialDocuments={documents.map((d) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
      }))}
    />
  );
}
