"use client";

import { useMemo, useState } from "react";

export default function NewOrder() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bdt, setBdt] = useState<number>(0);
  const [rate, setRate] = useState<number>(Number(process.env.NEXT_PUBLIC_DEFAULT_RATE ?? 125));
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const usd = useMemo(() => (bdt && rate ? Math.max(0, bdt / rate) : 0), [bdt, rate]);

  async function submit() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, bdtAmount: bdt, rateBdtPerUsd: rate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setId(data.id);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <a className="text-sm text-white/70 hover:text-white" href="/panel">← Back</a>

      <div className="mt-6 glass rounded-3xl p-6">
        <h1 className="text-xl font-semibold">Create Order</h1>
        <p className="mt-2 text-sm text-white/60">Fill details. You can submit your bKash transaction after creating order.</p>

        <div className="mt-6 grid gap-3">
          <Input label="Name" value={name} setValue={setName} />
          <Input label="Phone (bKash)" value={phone} setValue={setPhone} />
          <Input label="Email (optional)" value={email} setValue={setEmail} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="BDT Amount" value={String(bdt || "")} setValue={(v) => setBdt(Number(v || 0))} />
            <Input label="Rate (BDT per 1 USD)" value={String(rate || "")} setValue={(v) => setRate(Number(v || 0))} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Estimated USD</span>
              <span className="font-semibold">{usd.toFixed(2)}</span>
            </div>
          </div>

          {err && <div className="text-sm text-red-300">{err}</div>}

          <button className="btn-primary w-full" onClick={submit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>

          {id && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Order created</div>
              <div className="mt-1 font-mono text-xs break-all">{id}</div>
              <a className="btn-ghost w-full mt-4 block text-center" href={`/panel/orders/${id}`}>Open Order</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, setValue }: any) {
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/60">{label}</span>
      <input className="input" value={value} onChange={(e) => setValue(e.target.value)} />
    </label>
  );
}
