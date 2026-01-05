import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = process.env.COOKIE_NAME || "ex_session";
const TTL_HOURS = Number(process.env.SESSION_TTL_HOURS || "72");

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000);
  const session = await prisma.session.create({ data: { userId, expiresAt } });
  cookies().set(COOKIE_NAME, session.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  return session;
}

export async function destroySession() {
  const c = cookies().get(COOKIE_NAME)?.value;
  if (c) {
    await prisma.session.delete({ where: { id: c } }).catch(() => null);
  }
  cookies().set(COOKIE_NAME, "", { path: "/", expires: new Date(0) });
}

export async function getSessionUser() {
  const c = cookies().get(COOKIE_NAME)?.value;
  if (!c) return null;
  const s = await prisma.session.findUnique({ where: { id: c }, include: { user: true } });
  if (!s) return null;
  if (s.expiresAt.getTime() < Date.now()) {
    await prisma.session.delete({ where: { id: c } }).catch(() => null);
    return null;
  }
  if (!s.user.isActive) return null;
  return s.user;
}
