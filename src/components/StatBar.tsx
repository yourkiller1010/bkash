export function StatBar() {
  const items = [
    { k: "Instant Orders", v: "Auto", s: "Create + track" },
    { k: "Token Access", v: "UUID", s: "Secure portal" },
    { k: "24/7 Support", v: "Live", s: "Tickets + chat" },
    { k: "Admin Control", v: "Full", s: "Manage everything" },
    { k: "Audit Logs", v: "Built-in", s: "Transparent flow" },
  ];

  return (
    <div className="mx-auto mt-10 max-w-5xl">
      <div className="glass rounded-2xl px-6 py-4 shadow-2xl shadow-black/50">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
          {items.map((it) => (
            <div key={it.k}>
              <div className="text-sm font-semibold">{it.v}</div>
              <div className="text-[11px] text-white/50">{it.k}</div>
              <div className="text-[11px] text-white/35">{it.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
