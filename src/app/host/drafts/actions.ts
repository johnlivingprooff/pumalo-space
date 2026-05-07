"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function deleteDraftAction(id: string) {
  await prisma.propertyDraft.delete({ where: { id } });
  redirect("/host/drafts");
}
