import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

const Schema = z.object({
  status: z.enum(["PENDING_PAYMENT", "PAID_WAITING_USD", "USD_RECEIVED", "COMPLETED", "REJECTED"]),
  adminNote: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const pass = req.headers.get("x-admin-pass");
  const auth = requireAdmin(pass);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: { status: parsed.data.status, adminNote: parsed.data.adminNote?.trim() || null },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
