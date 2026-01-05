"use client";

import { useState } from "react";

export default function NewTicket() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      window.location.href = `/support/${data.id}`;
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <a className="text-sm text-white/70 hover:text-white" href="/support">← Back</a>
      <div className="mt-6 glass rounded-3xl p-6">
        <h1 className="text-xl font-semibold">Open Ticket</h1>
        <div className="mt-6 grid gap-3">
          <label className="text-xs text-white/60">Subject</label>
          <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <label className="text-xs text-white/60">Message</label>
          <textarea className="input min-h-[140px]" value={message} onChange={(e) => setMessage(e.target.value)} />
          {err && <div className="text-sm text-red-300">{err}</div>}
          <button className="btn-primary w-full" onClick={submit} disabled={loading}>{loading ? "Sending..." : "Submit"}</button>
        </div>
      </div>
    </div>
  );
}
