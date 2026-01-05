import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: Request) {
  const pass = req.headers.get("x-admin-pass");
  const auth = requireAdmin(pass);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 });

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 500, select: { id: true, createdAt: true, label: true, isActive: true } });
  return NextResponse.json({ users });
}
