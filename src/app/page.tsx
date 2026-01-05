"use client";

import { useEffect, useState } from "react";

type User = { id: string; createdAt: string; label: string | null; isActive: boolean };
type Order = { id: string; createdAt: string; customerName: string; customerPhone: string; bdtAmount: number; usdAmount: number; status: string; bkashTrxId: string | null; adminNote: string | null };
type Ticket = { id: string; updatedAt: string; subject: string; status: string; userId: string };

export default function Admin() {
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState<"orders"|"users"|"tickets">("orders");
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const headers = { "x-admin-pass": pass };
    const [u, o, t] = await Promise.all([
      fetch("/api/admin/users", { headers }),
      fetch("/api/admin/orders", { headers }),
      fetch("/api/admin/tickets", { headers }),
    ]);

    const ju = await u.json(); const jo = await o.json(); const jt = await t.json();
    if (!u.ok) return setErr(ju?.error || "Unauthorized");
    setUsers(ju.users);
    setOrders(jo.orders);
    setTickets(jt.tickets);
  }

  useEffect(() => {}, []);

  async function setOrderStatus(id: string, status: string) {
    const note = prompt("Admin note (optional)") ?? "";
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pass": pass },
      body: JSON.stringify({ status, adminNote: note }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Failed");
    await load();
  }

  async function toggleUser(id: string, isActive: boolean) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pass": pass },
      body: JSON.stringify({ isActive }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Failed");
    await load();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <a className="text-sm text-white/70 hover:text-white" href="/">← Home</a>

      <div className="mt-6 glass rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <p className="mt-1 text-sm text-white/60">Manage everything: users/tokens, orders, tickets.</p>
          </div>
          <div className="flex gap-2">
            <input className="input max-w-[260px]" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Admin password" />
            <button className="btn-primary" onClick={load}>Load</button>
          </div>
        </div>

        {err && <div className="mt-4 text-sm text-red-300">{err}</div>}

        <div className="mt-6 flex gap-2">
          <button className={tab==="orders" ? "btn-primary" : "btn-ghost"} onClick={() => setTab("orders")}>Orders</button>
          <button className={tab==="users" ? "btn-primary" : "btn-ghost"} onClick={() => setTab("users")}>Users</button>
          <button className={tab==="tickets" ? "btn-primary" : "btn-ghost"} onClick={() => setTab("tickets")}>Tickets</button>
        </div>

        {tab === "orders" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-white/60">
                <tr>
                  <th className="py-2">Created</th><th>ID</th><th>Customer</th><th>BDT</th><th>USD</th><th>Status</th><th>Trx</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-t border-white/10">
                    <td className="py-3 text-xs text-white/60 whitespace-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="py-3 font-mono text-xs break-all">{o.id}</td>
                    <td className="py-3"><div className="font-semibold">{o.customerName}</div><div className="text-xs text-white/60">{o.customerPhone}</div></td>
                    <td className="py-3">{o.bdtAmount}</td>
                    <td className="py-3">{o.usdAmount.toFixed(2)}</td>
                    <td className="py-3 text-xs">{o.status}</td>
                    <td className="py-3 font-mono text-xs">{o.bkashTrxId ?? "-"}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <Small onClick={() => setOrderStatus(o.id, "PAID_WAITING_USD")}>Mark Paid</Small>
                        <Small onClick={() => setOrderStatus(o.id, "USD_RECEIVED")}>USD Received</Small>
                        <Small onClick={() => setOrderStatus(o.id, "COMPLETED")}>Complete</Small>
                        <SmallDanger onClick={() => setOrderStatus(o.id, "REJECTED")}>Reject</SmallDanger>
                      </div>
                    </td>
                  </tr>
                ))}
                {!orders.length && !err && <tr><td colSpan={8} className="py-6 text-white/60">No orders.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === "users" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-white/60">
                <tr><th className="py-2">Created</th><th>User ID</th><th>Label</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t border-white/10">
                    <td className="py-3 text-xs text-white/60 whitespace-nowrap">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="py-3 font-mono text-xs break-all">{u.id}</td>
                    <td className="py-3">{u.label ?? "-"}</td>
                    <td className="py-3 text-xs">{u.isActive ? "ACTIVE" : "DISABLED"}</td>
                    <td className="py-3">
                      {u.isActive ? (
                        <SmallDanger onClick={() => toggleUser(u.id, false)}>Disable</SmallDanger>
                      ) : (
                        <Small onClick={() => toggleUser(u.id, true)}>Enable</Small>
                      )}
                    </td>
                  </tr>
                ))}
                {!users.length && !err && <tr><td colSpan={5} className="py-6 text-white/60">No users.</td></tr>}
              </tbody>
            </table>
            <div className="mt-4 text-xs text-white/50">
              Note: tokens are stored hashed. To create a new token, use the public generate page.
            </div>
          </div>
        )}

        {tab === "tickets" && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-white/60">
                <tr><th className="py-2">Updated</th><th>ID</th><th>Subject</th><th>Status</th><th>User</th><th></th></tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id} className="border-t border-white/10">
                    <td className="py-3 text-xs text-white/60 whitespace-nowrap">{new Date(t.updatedAt).toLocaleString()}</td>
                    <td className="py-3 font-mono text-xs break-all">{t.id}</td>
                    <td className="py-3">{t.subject}</td>
                    <td className="py-3 text-xs">{t.status}</td>
                    <td className="py-3 font-mono text-xs">{t.userId}</td>
                    <td className="py-3"><a className="underline text-xs text-white/70 hover:text-white" href={`/admin/tickets/${t.id}?pass=${encodeURIComponent(pass)}`}>Open</a></td>
                  </tr>
                ))}
                {!tickets.length && !err && <tr><td colSpan={6} className="py-6 text-white/60">No tickets.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Small({ children, onClick }: any) {
  return <button onClick={onClick} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">{children}</button>;
}
function SmallDanger({ children, onClick }: any) {
  return <button onClick={onClick} className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs hover:bg-red-500/20">{children}</button>;
}
