"use client";

import { useState } from "react";
import { GlowOrbs } from "@/components/Glow";

export default function Generate() {
  const [accepted, setAccepted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function gen() {
    setErr(null);
    if (!accepted) {
      setErr("Please accept Terms of Service to continue.");
      return;
    }
    const res = await fetch("/api/auth/generate", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setErr(data?.error || "Failed");
      return;
    }
    setToken(data.token);
    setShow(false);
  }

  async function copy() {
    if (token) await navigator.clipboard.writeText(token);
  }

  return (
    <div className="relative min-h-screen">
      <GlowOrbs />
      <div className="mx-auto max-w-3xl px-6 pt-28 pb-16">
        <div className="glass-strong rounded-3xl p-8 shadow-2xl shadow-black/60">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-white/10 grid place-items-center">N</div>
            <h1 className="mt-4 text-2xl font-semibold">Generate Token</h1>
            <p className="mt-2 text-sm text-white/60">
              Your token will be shown once. Save it securely — you’ll need it to login.
            </p>
          </div>

          {!token ? (
            <div className="mt-8 grid gap-4">
              <button onClick={gen} className="btn-primary w-full">Generate Token</button>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                I accept <a className="underline hover:text-white" href="/legal/privacy" target="_blank">Privacy policy</a> and <a className="underline hover:text-white" href="/legal/terms" target="_blank">Terms of Service</a>
              </label>

              {err && <div className="text-sm text-red-300">{err}</div>}

              <div className="mt-2 text-center text-xs text-white/50">
                Have a token? <a className="underline hover:text-white" href="/auth/login">Login</a>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              <div className="text-center text-sm text-white/70">
                Your authentication token has been generated!
              </div>

              <label className="text-xs text-white/60">Your Token</label>
              <div className="flex gap-2">
                <input className="input" value={show ? token : "•".repeat(32)} readOnly />
                <button className="btn-ghost" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
              </div>

              <button className="btn-ghost w-full" onClick={copy}>Copy Token</button>
              <a className="btn-primary w-full text-center" href="/auth/login">Login with Token</a>

              <div className="mt-2 text-center text-xs text-white/50">
                Tip: Don’t share your token with anyone.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
