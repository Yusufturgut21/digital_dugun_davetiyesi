"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";
import { DEFAULT_FAQ_ITEMS } from "@/lib/defaults";

interface Props { invitation?: WeddingInvitation; }

export default function FAQSection({ invitation }: Props) {
  const faqs = invitation?.faqItems?.length ? invitation.faqItems : DEFAULT_FAQ_ITEMS;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section-gap relative">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAF6F0, #F0E8D8, #FAF6F0)" }} />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "#C9A84C" }}>
            Merak Edilenler
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light" style={{ color: "#3d3530" }}>
            Sık Sorulan Sorular
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                className="w-full text-left p-5 sm:p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: open === i ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.65)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${open === i ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.15)"}`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-serif text-lg font-light" style={{ color: "#3d3530" }}>
                    {faq.q}
                  </span>
                  <motion.span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    +
                  </motion.span>
                </div>
                <AnimatePresence>
                  {open === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4 font-sans text-sm font-light leading-relaxed"
                      style={{ color: "#6b5f58" }}
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
