"use client";

import { useEffect, useState } from "react";

type Msg = { id: string; createdAt: string; role: string; message: string };
type Ticket = { id: string; subject: string; status: string; messages: Msg[] };

export default function TicketPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const res = await fetch(`/api/tickets/${id}`);
    const data = await res.json();
    if (!res.ok) { setErr(data?.error || "Not found"); return; }
    setTicket(data);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [id]);

  async function send() {
    setErr(null);
    const res = await fetch(`/api/tickets/${id}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (!res.ok) { setErr(data?.error || "Failed"); return; }
    setMessage("");
    await load();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <a className="text-sm text-white/70 hover:text-white" href="/support">← Back</a>

      <div className="mt-6 glass rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{ticket?.subject ?? "Ticket"}</h1>
            <div className="mt-1 font-mono text-xs text-white/60 break-all">{id}</div>
          </div>
          {ticket && <div className="badge">{ticket.status}</div>}
        </div>

        {err && <div className="mt-4 text-sm text-red-300">{err}</div>}

        <div className="mt-6 grid gap-2">
          {(ticket?.messages ?? []).map((m) => (
            <div key={m.id} className={["rounded-2xl p-4 border", m.role === "admin" ? "border-white/10 bg-white/5" : "border-white/10 bg-black/25"].join(" ")}>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>{m.role.toUpperCase()}</span>
                <span>{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm text-white/80 whitespace-pre-wrap">{m.message}</div>
            </div>
          ))}
          {!ticket?.messages?.length && <div className="text-sm text-white/60">No messages yet.</div>}
        </div>

        <div className="mt-6 flex gap-2">
          <input className="input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." />
          <button className="btn-primary" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
