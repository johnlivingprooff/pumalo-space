import { stackServerApp } from "@stack/server";
import { notFound, redirect } from "next/navigation";
import { PropertyVerificationClient } from "@/components/host/PropertyVerificationClient";
import prisma from "@/lib/prisma";

export default async function PropertyVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) redirect("/sign-in");

  const { id } = await params;

  const property = await prisma.property.findFirst({
    where: { id, hostId: stackUser.id },
    select: {
      title: true,
      verificationStatus: true,
      rejectionReason: true,
      verifiedAt: true,
    },
  });

  if (!property) notFound();

  const documents = await prisma.verificationDocument.findMany({
    where: { userId: stackUser.id, propertyId: id },
    select: {
      id: true,
      fileName: true,
      verificationType: true,
      createdAt: true,
      webViewLink: true,
      webContentLink: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PropertyVerificationClient
      propertyId={id}
      propertyTitle={property.title}
      initialStatus={property.verificationStatus}
      rejectionReason={property.rejectionReason}
      verifiedAt={property.verifiedAt?.toISOString() ?? null}
      initialDocuments={documents.map((d) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
      }))}
    />
  );
}
