"use client";

import { useState } from "react";
import { GlowOrbs } from "@/components/Glow";

export default function Login() {
  const [token, setToken] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function submit() {
    setErr(null);
    setOk(false);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data?.error || "Login failed");
      return;
    }
    setOk(true);
    window.location.href = "/panel";
  }

  return (
    <div className="relative min-h-screen">
      <GlowOrbs />
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl shadow-black/60">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-white/10 grid place-items-center">N</div>
            <h1 className="mt-4 text-2xl font-semibold">Login</h1>
            <p className="mt-2 text-sm text-white/60">
              Enter your authentication token to open the client panel.
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            <label className="text-xs text-white/60">Authentication Token</label>
            <input className="input" value={token} onChange={(e) => setToken(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
            {err && <div className="text-sm text-red-300">{err}</div>}
            {ok && <div className="text-sm text-emerald-300">Logged in.</div>}
            <button onClick={submit} className="btn-primary w-full">Login</button>

            <div className="mt-4 text-center text-xs text-white/50">
              Need a token? <a className="underline hover:text-white" href="/auth/generate">Generate Token</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
