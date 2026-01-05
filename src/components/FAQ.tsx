"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "How does token login work?", a: "You generate a token once and use it to access your client panel. Tokens can be disabled by admin anytime." },
  { q: "Is payment automatic?", a: "This template supports verified workflows. You can integrate official bKash Payment Gateway (merchant) for true automation." },
  { q: "Can I track orders?", a: "Yes. Every order has a status pipeline and admin notes so users can see progress." },
  { q: "24/7 Support how?", a: "Built-in ticket system. Users can open tickets, you reply from admin panel." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid gap-3">
      {faqs.map((f, i) => (
        <div key={f.q} className="glass rounded-2xl p-4">
          <button onClick={() => setOpen(open === i ? null : i)} className="w-full text-left flex items-center justify-between gap-4">
            <div className="font-semibold">{f.q}</div>
            <div className="text-white/50 text-sm">{open === i ? "—" : "+"}</div>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-2 text-sm text-white/70">{f.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
