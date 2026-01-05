"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className={[
          "mt-4 flex items-center justify-between rounded-full border px-3 py-2",
          scrolled ? "border-white/10 bg-black/45 backdrop-blur-xl" : "border-white/10 bg-white/5 backdrop-blur-xl",
        ].join(" ")}>
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-white/10 grid place-items-center">
              <span className="text-xs font-semibold">N</span>
            </div>
            <div className="text-sm font-semibold tracking-wide">Nova</div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#panel">Panel</NavLink>
            <NavLink href="#steps">Steps</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <a className="btn-ghost hidden sm:inline-flex" href="/auth/login">Sign in</a>
            <a className="btn-primary" href="/auth/generate">Get Token</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, children }: any) {
  return (
    <a href={href} className="rounded-full px-3 py-2 text-xs text-white/70 hover:text-white hover:bg-white/5 transition">
      {children}
    </a>
  );
}
