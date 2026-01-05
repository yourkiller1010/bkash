import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { z } from "zod";

const Schema = z.object({ message: z.string().min(1) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const ticket = await prisma.ticket.findUnique({ where: { id: params.id } });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  if (ticket.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.ticketMessage.create({
    data: { ticketId: params.id, role: "user", message: parsed.data.message },
  });

  await prisma.ticket.update({ where: { id: params.id }, data: { status: "PENDING" } });

  return NextResponse.json({ ok: true });
}
