import { stackServerApp } from "@stack/server";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidAgentNumber, sanitizeAgentNumber } from "@/lib/validation";

export async function PATCH(request: NextRequest) {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const isAgent = body.isAgent === true;
  const agentNumber =
    typeof body.agentNumber === "string" ? body.agentNumber.trim() : "";

  const profile = await prisma.hostProfile.findUnique({
    where: { userId: stackUser.id },
    select: { ownershipType: true },
  });
  if (!profile)
    return NextResponse.json(
      { error: "Host profile not found" },
      { status: 404 },
    );

  const needsAgentNumber =
    profile.ownershipType === "manage" ||
    (profile.ownershipType === "own" && isAgent);

  if (needsAgentNumber && !agentNumber) {
    return NextResponse.json(
      { error: "Real Estate Agent Number is required" },
      { status: 400 },
    );
  }

  if (agentNumber && !isValidAgentNumber(agentNumber)) {
    return NextResponse.json(
      {
        error:
          "Invalid Real Estate Agent Number (use letters and digits only, 4–30 characters)",
      },
      { status: 400 },
    );
  }

  const sanitized = needsAgentNumber ? sanitizeAgentNumber(agentNumber) : null;

  const updated = await prisma.hostProfile.update({
    where: { userId: stackUser.id },
    data: { isAgent, agentNumber: sanitized },
    select: { isAgent: true, agentNumber: true },
  });

  return NextResponse.json(updated);
}
