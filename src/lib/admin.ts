export function requireAdmin(pass?: string | null) {
  const p = process.env.ADMIN_PASSWORD || "";
  if (!pass || pass !== p) return { ok: false as const, error: "Unauthorized" };
  return { ok: true as const };
}
