import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

export default async function Orders() {
  const user = await getSessionUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <a className="text-sm text-white/70 hover:text-white" href="/panel">← Back</a>
      <div className="mt-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">My Orders</h1>
        <a className="btn-primary" href="/panel/orders/new">New Order</a>
      </div>

      <div className="mt-6 overflow-x-auto glass rounded-3xl p-4">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-white/60">
            <tr>
              <th className="py-2">Created</th>
              <th>ID</th>
              <th>BDT</th>
              <th>USD</th>
              <th>Status</th>
              <th>Trx</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/10">
                <td className="py-3 text-xs text-white/60 whitespace-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="py-3 font-mono text-xs break-all">{o.id}</td>
                <td className="py-3">{o.bdtAmount}</td>
                <td className="py-3">{o.usdAmount.toFixed(2)}</td>
                <td className="py-3 text-xs">{o.status}</td>
                <td className="py-3 font-mono text-xs">{o.bkashTrxId ?? "-"}</td>
                <td className="py-3">
                  <a className="underline text-xs text-white/70 hover:text-white" href={`/panel/orders/${o.id}`}>Open</a>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr><td className="py-6 text-white/60" colSpan={7}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
