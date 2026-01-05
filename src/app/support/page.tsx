import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export default async function Support() {
  const user = await getSessionUser();
  if (!user) return null;

  const tickets = await prisma.ticket.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <a className="text-sm text-white/70 hover:text-white" href="/panel">← Back</a>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Support</h1>
        <a className="btn-primary" href="/support/new">Open Ticket</a>
      </div>

      <div className="mt-6 glass rounded-3xl p-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-white/60">
            <tr>
              <th className="py-2">Updated</th>
              <th>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-t border-white/10">
                <td className="py-3 text-xs text-white/60 whitespace-nowrap">{new Date(t.updatedAt).toLocaleString()}</td>
                <td className="py-3 font-mono text-xs break-all">{t.id}</td>
                <td className="py-3">{t.subject}</td>
                <td className="py-3 text-xs">{t.status}</td>
                <td className="py-3"><a className="underline text-xs text-white/70 hover:text-white" href={`/support/${t.id}`}>Open</a></td>
              </tr>
            ))}
            {!tickets.length && <tr><td colSpan={5} className="py-6 text-white/60">No tickets.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
