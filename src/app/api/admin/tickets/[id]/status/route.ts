import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

const Schema = z.object({ status: z.enum(["OPEN", "PENDING", "CLOSED"]) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const pass = req.headers.get("x-admin-pass");
  const auth = requireAdmin(pass);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await prisma.ticket.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json({ ok: true });
}
