"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";

type FormState = {
  name: string;
  phone: string;
  count: string;
  note: string;
};

interface Props { invitation?: WeddingInvitation; }

export default function RSVPSection({ invitation }: Props) {
  const [form, setForm] = useState<FormState>({ name: "", phone: "", count: "1", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation?.slug) {
      setError("Davetiye bilgisi yüklenemedi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: invitation.slug,
          guestName: form.name,
          phone: form.phone,
          guestCount: form.count === "4+" ? 4 : parseInt(form.count),
          attendance: "yes",
          note: form.note,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gönderilemedi");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const deadlineText = invitation?.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : "düğün tarihine";

  return (
    <section id="rsvp" className="section-gap relative">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1a0f08 0%, #2d1f12 50%, #1a110a 100%)",
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "#C9A84C" }}>
            Katılım
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-white/90">
            Katılım Durumunuzu Bildirin
          </h2>
          <div className="gold-divider mt-6" />
          <p className="mt-6 font-sans font-light text-sm text-white/50 tracking-wide">
            Lütfen {deadlineText} kadar bildirim yapınız.
          </p>
          {error && (
            <p className="mt-3 font-sans text-sm text-red-400">{error}</p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Animated check */}
              <motion.div
                className="w-20 h-20 rounded-full mx-auto mb-8 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(232,213,163,0.1))",
                  border: "2px solid rgba(201,168,76,0.5)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <motion.svg
                  width="32" height="32" viewBox="0 0 32 32" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <motion.path
                    d="M6 16 L13 23 L26 10"
                    stroke="#C9A84C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  />
                </motion.svg>
              </motion.div>
              <h3 className="font-serif text-3xl font-light text-white/90 mb-4">
                Teşekkürler, {form.name.split(" ")[0]}
              </h3>
              <p className="font-sans font-light text-white/50">
                Katılımınızı aldık. Sizi görmek için sabırsızlanıyoruz.
              </p>
              <div className="flex justify-center mt-6">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    🌸
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {[
                { id: "name", label: "Ad Soyad", type: "text", placeholder: "Adınızı giriniz", required: true },
                { id: "phone", label: "Telefon", type: "tel", placeholder: "+90 5__ ___ __ __", required: true },
              ].map(field => (
                <div key={field.id}>
                  <label className="block font-sans text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(201,168,76,0.7)" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={form[field.id as keyof FormState]}
                    onChange={e => setForm(f => ({ ...f, [field.id]: e.target.value }))}
                    className="w-full px-5 py-4 rounded-2xl font-sans text-sm font-light outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      color: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(10px)",
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.6)"}
                    onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"}
                  />
                </div>
              ))}

              <div>
                <label className="block font-sans text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(201,168,76,0.7)" }}>
                  Kaç Kişi Geleceksiniz?
                </label>
                <div className="flex gap-3">
                  {["1", "2", "3", "4+"].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, count: n }))}
                      className="flex-1 py-3 rounded-xl font-sans text-sm transition-all"
                      style={{
                        background: form.count === n ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${form.count === n ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.15)"}`,
                        color: form.count === n ? "#E8D5A3" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(201,168,76,0.7)" }}>
                  Notunuz (İsteğe Bağlı)
                </label>
                <textarea
                  rows={3}
                  placeholder="Bir mesaj bırakmak ister misiniz?"
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  className="w-full px-5 py-4 rounded-2xl font-sans text-sm font-light outline-none transition-all resize-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(10px)",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.2)"}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full font-sans text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
                style={{
                  background: "linear-gradient(135deg, #C9A84C, #E8D5A3, #C9A84C)",
                  backgroundSize: "200% auto",
                  color: "#1a0f08",
                  boxShadow: "0 4px 30px rgba(201,168,76,0.4)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    Gönderiliyor…
                  </span>
                ) : (
                  "Katılımımı Onayla"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
