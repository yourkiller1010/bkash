import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sha256, safeToken } from "@/lib/crypto";

export async function POST() {
  const token = safeToken();
  const tokenHash = sha256(token);

  await prisma.user.create({
    data: { tokenHash },
    select: { id: true },
  });

  // return token ONCE
  return NextResponse.json({ token });
}
