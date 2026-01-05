import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const pass = req.headers.get("x-admin-pass");
  const auth = requireAdmin(pass);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });

  const ticket = await prisma.ticket.findUnique({ where: { id: params.id }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  return NextResponse.json(ticket);
}
