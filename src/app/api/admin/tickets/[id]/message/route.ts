import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

const Schema = z.object({ message: z.string().min(1) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const pass = req.headers.get("x-admin-pass");
  const auth = requireAdmin(pass);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({ where: { id: params.id } });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  await prisma.ticketMessage.create({ data: { ticketId: params.id, role: "admin", message: parsed.data.message } });
  await prisma.ticket.update({ where: { id: params.id }, data: { status: "PENDING" } });

  return NextResponse.json({ ok: true });
}
