import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sha256 } from "@/lib/crypto";
import { createSession } from "@/lib/session";
import { z } from "zod";

const Schema = z.object({ token: z.string().min(10) });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

  const tokenHash = sha256(parsed.data.token.trim());
  const user = await prisma.user.findUnique({ where: { tokenHash } });

  if (!user || !user.isActive) return NextResponse.json({ error: "Token not found or disabled" }, { status: 401 });

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
