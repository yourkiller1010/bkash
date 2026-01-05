"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  createdAt: string;
  bdtAmount: number;
  rateBdtPerUsd: number;
  usdAmount: number;
  status: string;
  bkashTrxId: string | null;
  adminNote: string | null;
};

export default function OrderPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [trx, setTrx] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/orders/${id}`);
    const data = await res.json();
    if (!res.ok) { setErr(data?.error || "Not found"); return; }
    setOrder(data);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [id]);

  async function submitTrx() {
    setErr(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}/trx`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bkashTrxId: trx }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setTrx("");
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <a className="text-sm text-white/70 hover:text-white" href="/panel/orders">← Back</a>

      <div className="mt-6 glass rounded-3xl p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Order</h1>
            <div className="mt-1 font-mono text-xs text-white/60 break-all">{id}</div>
          </div>
          {order && <div className="badge">{order.status}</div>}
        </div>

        {err && <div className="mt-4 text-sm text-red-300">{err}</div>}

        {order ? (
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm">
              <div className="flex justify-between"><span className="text-white/60">BDT</span><span className="font-semibold">{order.bdtAmount}</span></div>
              <div className="mt-1 flex justify-between"><span className="text-white/60">Rate</span><span className="font-semibold">{order.rateBdtPerUsd} / USD</span></div>
              <div className="mt-1 flex justify-between"><span className="text-white/60">USD</span><span className="font-semibold">{order.usdAmount.toFixed(2)}</span></div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">Submit Payment Reference</div>
              <div className="mt-1 text-xs text-white/60">After you pay via bKash, paste the Transaction ID here.</div>

              <div className="mt-4 flex gap-2">
                <input className="input" value={trx} onChange={(e) => setTrx(e.target.value)} placeholder="bKash Transaction ID" />
                <button className="btn-ghost" onClick={submitTrx} disabled={saving}>{saving ? "Saving..." : "Submit"}</button>
              </div>

              <div className="mt-2 text-xs text-white/60">Current: <span className="font-mono">{order.bkashTrxId ?? "-"}</span></div>
            </div>

            {order.adminNote && (
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs text-white/60">Admin note</div>
                <div className="mt-1 text-sm text-white/80">{order.adminNote}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 text-sm text-white/60">Loading...</div>
        )}
      </div>
    </div>
  );
}
