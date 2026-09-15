"use client";
import { useEffect, useState, useRef } from "react";
import { VenueWebsite } from "@/lib/types";
import { MessageCircle, Phone, MapPin, Check, ChevronDown, Instagram, Sparkles, Star, Users, Award, ArrowRight } from "lucide-react";

interface Props { venue: VenueWebsite; }

/* ── Renk paleti: koyu obsidyen + altın + bordo ────────── */
const M = {
  black:  "#060608",
  deep:   "#0c0c10",
  dark:   "#12121a",
  card:   "#18181f",
  border: "rgba(180,140,60,0.18)",
  gold:   "#c9a84c",
  goldL:  "#e8d08a",
  goldD:  "#8a6a1e",
  red:    "#8b1a2a",
  redL:   "#c42840",
  white:  "#f0ece4",
  muted:  "rgba(240,236,228,0.45)",
};

/* ── utilities ─────────────────────────────────────────── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

function useInView(ref: React.RefObject<HTMLElement>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

function waOpen(venue: VenueWebsite, msg?: string) {
  const t = msg ?? `Merhaba, ${venue.venueName} hakkında bilgi almak istiyorum.`;
  window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(t)}`, "_blank");
}

/* ── FLOATING NAV ──────────────────────────────────────── */
function MerliNav({ venue }: Props) {
  const y = useScrollY();
  const show = y > 60;
  return (
    <nav className="fixed top-4 left-1/2 z-50 transition-all duration-500 w-[92%] max-w-2xl"
      style={{ transform: `translateX(-50%) translateY(${show ? 0 : -110}px)`, opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none" }}>
      <div className="flex items-center justify-between px-5 py-3 rounded-2xl"
        style={{ background: "rgba(12,12,16,0.85)", backdropFilter: "blur(20px)", border: `1px solid ${M.border}`, boxShadow: `0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.08)` }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg,${M.gold},${M.goldL})` }}>
            <span className="text-xs font-bold" style={{ color: M.black }}>LM</span>
          </div>
          <span className="font-serif text-sm tracking-wide" style={{ color: M.white }}>La Merli Event</span>
        </div>
        <button onClick={() => waOpen(venue)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg,#25D366,#128C7E)`, color: "#fff" }}>
          <MessageCircle className="w-3.5 h-3.5" /> İletişim
        </button>
      </div>
    </nav>
  );
}

/* ── HERO ──────────────────────────────────────────────── */
const FALLBACK_VIDEO = "https://videos.pexels.com/video-files/3843434/3843434-uhd_2560_1440_24fps.mp4";

function MerliHero({ venue }: Props) {
  const scrollY = useScrollY();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const hasVideo = !!venue.heroVideo;
  const hasImage = !!venue.heroImage;
  const videoSrc = venue.heroVideo || (!hasImage ? FALLBACK_VIDEO : null);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">

      {/* Base dark gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg,${M.black} 0%,${M.deep} 40%,#1a0a12 70%,#0e0810 100%)` }} />

      {/* Hero image */}
      {hasImage && !hasVideo && (
        <div className="absolute inset-0"
          style={{ backgroundImage: `url(${venue.heroImage})`, backgroundSize: "cover", backgroundPosition: "center", transform: `scale(1.05) translateY(${scrollY * 0.07}px)` }} />
      )}

      {/* Video */}
      {videoSrc && (
        <video autoPlay muted loop playsInline preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: videoLoaded ? 1 : 0, transform: `scale(1.04) translateY(${scrollY * 0.07}px)` }}>
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Multi-layer cinematic overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(6,6,8,0.72) 0%,rgba(6,6,8,0.28) 40%,rgba(6,6,8,0.18) 62%,rgba(6,6,8,0.82) 100%)" }} />
      {/* Gold vignette edges */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 55%, rgba(6,6,8,0.7) 100%)" }} />
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, transparent, ${M.gold}, transparent)`, opacity: 0.6 }} />

      {/* Particle dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 2 + (i % 3), height: 2 + (i % 3),
              left: `${6 + (i * 6.8) % 88}%`,
              top: `${8 + (i * 5.9) % 70}%`,
              background: i % 3 === 0 ? M.gold : "rgba(255,255,255,0.25)",
              animation: `glimmer ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.45}s`,
            }} />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">

        {/* Monogram badge */}
        <div className="inline-flex items-center gap-3 mb-10">
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(90deg,transparent,${M.gold})` }} />
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: `linear-gradient(135deg,${M.gold},${M.goldL})`, color: M.black, boxShadow: `0 0 24px rgba(201,168,76,0.4)` }}>
            LM
          </div>
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(90deg,${M.gold},transparent)` }} />
        </div>

        {/* Title */}
        <h1 className="font-serif mb-3 leading-none"
          style={{ fontSize: "clamp(3rem,10vw,8rem)", color: M.white, letterSpacing: "-0.02em", textShadow: `0 0 80px rgba(201,168,76,0.2), 0 4px 60px rgba(0,0,0,0.7)` }}>
          La Merli
        </h1>
        <p className="font-serif mb-6" style={{ fontSize: "clamp(1.2rem,3.5vw,2.2rem)", color: M.gold, letterSpacing: "0.18em", fontStyle: "italic" }}>
          Event
        </p>

        <p className="mb-12 mx-auto font-light leading-relaxed" style={{ color: M.muted, fontSize: "clamp(0.9rem,2vw,1.1rem)", maxWidth: 500 }}>
          {venue.tagline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => waOpen(venue)}
            className="group flex items-center justify-center gap-3 font-semibold hover:scale-105 transition-all duration-300"
            style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff", padding: "15px 36px", borderRadius: 14, fontSize: "0.95rem", boxShadow: "0 8px 28px rgba(37,211,102,0.3)" }}>
            <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            WhatsApp ile Yaz
          </button>
          <a href={`tel:${venue.phone}`}
            className="flex items-center justify-center gap-3 font-semibold hover:scale-105 transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: `1px solid ${M.border}`, color: M.white, padding: "15px 36px", borderRadius: 14, fontSize: "0.95rem" }}>
            <Phone className="w-5 h-5" />
            {venue.phone}
          </a>
        </div>

        {/* Detaylı incele */}
        <div className="mt-6">
          <button onClick={() => document.getElementById("merli-about")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-2 font-medium transition-all hover:gap-3"
            style={{ color: "rgba(201,168,76,0.6)", fontSize: "0.85rem", letterSpacing: "0.06em" }}>
            Detaylı İncele
            <div className="w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-y-0.5 transition-transform"
              style={{ border: `1.5px solid rgba(201,168,76,0.35)` }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-6 h-9 rounded-full border-2 flex justify-center pt-1.5"
          style={{ borderColor: "rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.04)" }}>
          <div className="w-1 h-2 rounded-full" style={{ background: M.gold, animation: "scrollDot 1.8s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes glimmer { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }
        @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 60%{transform:translateY(12px);opacity:0} 61%{transform:translateY(0);opacity:0} 100%{opacity:1} }
      `}</style>
    </section>
  );
}

/* ── TAGLINE STRIP ─────────────────────────────────────── */
function MerliStrip() {
  const items = ["◆ Premium Organizasyon","◆ VIP Lounge","◆ 600 Kişi Kapasitesi","◆ Vale Hizmeti","◆ Pro Ses & Işık","◆ Gala Menüsü","◆ Başakşehir'in Kalbinde","◆ 7/24 Destek"];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-3 border-y" style={{ background: M.dark, borderColor: M.border }}>
      <div className="flex gap-10 whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
        {doubled.map((t, i) => (
          <span key={i} className="text-xs font-medium tracking-widest shrink-0 uppercase" style={{ color: M.gold }}>{t}</span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* ── ABOUT ─────────────────────────────────────────────── */
function MerliAbout({ venue }: Props) {
  const ref = useRef<HTMLElement>(null!);
  const v = useInView(ref);
  const stats = [
    { icon: <Award className="w-5 h-5" />, val: "10+", label: "Yıl Tecrübe" },
    { icon: <Users className="w-5 h-5" />, val: "800+", label: "Mutlu Çift" },
    { icon: <Star className="w-5 h-5" />, val: `${venue.capacity.max}`, label: "Kişi Kapasitesi" },
    { icon: <Sparkles className="w-5 h-5" />, val: "100%", label: "Memnuniyet" },
  ];
  return (
    <section ref={ref} id="merli-about" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden" style={{ background: M.deep }}>
      {/* Gold top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px" style={{ background: `linear-gradient(90deg,transparent,${M.gold},transparent)` }} />
      {/* Glow blob */}
      <div className="absolute top-1/2 left-0 w-96 h-96 -translate-y-1/2 pointer-events-none opacity-8" style={{ background: M.redL, filter: "blur(120px)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <div className="transition-all duration-1000" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(-40px)" }}>
            <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-5" style={{ color: M.gold }}>Hakkımızda</p>
            <h2 className="font-serif mb-6 leading-tight" style={{ fontSize: "clamp(1.9rem,4.5vw,3.2rem)", color: M.white }}>
              Lüksün Yeni<br />
              <span style={{ color: M.gold, fontStyle: "italic" }}>Tanımı</span>
            </h2>
            <div className="w-10 h-0.5 mb-8 rounded-full" style={{ background: `linear-gradient(90deg,${M.gold},transparent)` }} />
            <p className="leading-relaxed whitespace-pre-line" style={{ color: M.muted, fontSize: "1rem" }}>
              {venue.description}
            </p>
            <button onClick={() => waOpen(venue)}
              className="mt-10 group inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-4"
              style={{ color: M.gold }}>
              Rezervasyon Yap
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 transition-all duration-1000 delay-200" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(40px)" }}>
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 sm:p-7 transition-all hover:-translate-y-1"
                style={{
                  background: i % 2 === 0 ? `linear-gradient(135deg,${M.card},#20202a)` : `linear-gradient(135deg,${M.red}22,${M.red}08)`,
                  border: `1px solid ${i % 2 === 0 ? M.border : "rgba(139,26,42,0.25)"}`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}>
                <div className="mb-3" style={{ color: M.gold }}>{s.icon}</div>
                <div className="text-3xl font-bold mb-1" style={{ color: M.white }}>{s.val}</div>
                <div className="text-xs tracking-wide" style={{ color: "rgba(240,236,228,0.35)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FEATURES ───────────────────────────────────────────── */
function MerliFeatures({ venue }: Props) {
  const ref = useRef<HTMLElement>(null!);
  const v = useInView(ref);
  return (
    <section ref={ref} className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden" style={{ background: M.black }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${M.border},transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${M.border},transparent)` }} />
      {/* Red glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 -translate-y-1/2 pointer-events-none opacity-10" style={{ background: M.red, filter: "blur(100px)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14 transition-all duration-700" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)" }}>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: M.gold }}>Özelliklerimiz</p>
          <h2 className="font-serif" style={{ fontSize: "clamp(1.9rem,4.5vw,3.2rem)", color: M.white }}>Neden La Merli?</h2>
          <div className="w-10 h-0.5 mx-auto mt-5 rounded-full" style={{ background: `linear-gradient(90deg,transparent,${M.gold},transparent)` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {venue.features.map((f, i) => (
            <div key={i}
              className="group rounded-2xl p-6 transition-all duration-400 hover:-translate-y-2 cursor-default"
              style={{
                background: M.card,
                border: `1px solid ${M.border}`,
                opacity: v ? 1 : 0,
                transitionDelay: `${i * 55}ms`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}>
              {/* Gold top accent on hover */}
              <div className="h-0.5 w-0 group-hover:w-full rounded-full mb-5 transition-all duration-500" style={{ background: `linear-gradient(90deg,${M.gold},${M.goldL})` }} />
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: M.white }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(240,236,228,0.4)" }}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PACKAGES ───────────────────────────────────────────── */
function MerliPackages({ venue }: Props) {
  const ref = useRef<HTMLElement>(null!);
  const v = useInView(ref);
  return (
    <section ref={ref} className="py-20 sm:py-32 px-4 sm:px-6" style={{ background: M.deep }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 transition-all duration-700" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)" }}>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: M.gold }}>Paketler</p>
          <h2 className="font-serif mb-3" style={{ fontSize: "clamp(1.9rem,4.5vw,3.2rem)", color: M.white }}>Düğün Paketlerimiz</h2>
          <p style={{ color: "rgba(240,236,228,0.35)", fontSize: "0.9rem" }}>Her düğün özeldir — sizin için en iyisini birlikte seçelim.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {venue.packages.map((pkg, i) => {
            const hot = pkg.highlighted;
            return (
              <div key={i}
                className="relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: hot ? `linear-gradient(160deg,${M.card},#22202e)` : M.card,
                  border: hot ? `1px solid rgba(201,168,76,0.45)` : `1px solid ${M.border}`,
                  boxShadow: hot ? `0 20px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(201,168,76,0.12)` : "0 4px 20px rgba(0,0,0,0.3)",
                  opacity: v ? 1 : 0,
                  transitionDelay: `${i * 100}ms`,
                  transform: hot ? "scale(1.03)" : "scale(1)",
                }}>
                {/* Top gold bar */}
                <div className="h-0.5 w-full" style={{ background: hot ? `linear-gradient(90deg,${M.goldD},${M.gold},${M.goldL},${M.gold},${M.goldD})` : `linear-gradient(90deg,transparent,${M.border},transparent)` }} />

                {hot && (
                  <div className="py-2 text-center text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5"
                    style={{ background: `linear-gradient(90deg,${M.goldD}44,${M.gold}22,${M.goldD}44)`, color: M.gold, borderBottom: `1px solid rgba(201,168,76,0.2)` }}>
                    <Sparkles className="w-3 h-3" /> En Popüler
                  </div>
                )}

                <div className="p-7">
                  <h3 className="font-serif text-2xl mb-1" style={{ color: hot ? M.gold : M.white }}>{pkg.name}</h3>
                  <p className="text-xs mb-6" style={{ color: "rgba(240,236,228,0.35)" }}>{pkg.description}</p>

                  <ul className="space-y-2.5 mb-8">
                    {pkg.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: hot ? `${M.gold}22` : "rgba(255,255,255,0.06)", border: `1px solid ${hot ? M.gold : M.border}` }}>
                          <Check className="w-2.5 h-2.5" style={{ color: hot ? M.gold : M.muted }} />
                        </div>
                        <span className="text-xs leading-relaxed" style={{ color: hot ? "rgba(240,236,228,0.75)" : "rgba(240,236,228,0.45)" }}>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => waOpen(venue, `Merhaba, "${pkg.name}" paketi hakkında bilgi almak istiyorum.`)}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={hot
                      ? { background: `linear-gradient(135deg,${M.goldD},${M.gold})`, color: M.black }
                      : { background: "rgba(255,255,255,0.05)", border: `1px solid ${M.border}`, color: M.muted }}>
                    <MessageCircle className="w-4 h-4" /> Bilgi Al
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-10" style={{ color: "rgba(240,236,228,0.25)" }}>
          Özel talep için{" "}
          <button onClick={() => waOpen(venue)} className="underline underline-offset-2 hover:opacity-70" style={{ color: M.gold }}>
            bizimle iletişime geçin
          </button>
        </p>
      </div>
    </section>
  );
}

/* ── GALLERY ────────────────────────────────────────────── */
function MerliGallery({ venue }: Props) {
  const [sel, setSel] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null!);
  const v = useInView(ref);
  const all = [...(venue.galleryImages || []), ...(venue.realWeddingImages || [])];
  if (all.length === 0) return null;

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: M.black }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 transition-all duration-700" style={{ opacity: v ? 1 : 0 }}>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: M.gold }}>Galeri</p>
          <h2 className="font-serif" style={{ fontSize: "clamp(1.9rem,4.5vw,3.2rem)", color: M.white }}>Salonumuzdan Kareler</h2>
          <div className="w-10 h-0.5 mx-auto mt-4 rounded-full" style={{ background: `linear-gradient(90deg,transparent,${M.gold},transparent)` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {all.map((img, i) => (
            <div key={i} onClick={() => setSel(i)} className="relative overflow-hidden rounded-xl cursor-pointer group"
              style={{ aspectRatio: "1/1", opacity: v ? 1 : 0, transition: "all 0.5s", transitionDelay: `${i * 35}ms` }}>
              <img src={img} alt={`${venue.venueName} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                style={{ background: "linear-gradient(to top,rgba(6,6,8,0.8),transparent)" }}>
                <span className="text-xs font-medium" style={{ color: M.gold }}>{i + 1}/{all.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sel !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(6,6,8,0.97)", backdropFilter: "blur(8px)" }} onClick={() => setSel(null)}>
          <button onClick={() => setSel(null)} className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all hover:opacity-70" style={{ border: `1px solid ${M.border}`, color: M.muted }}>✕</button>
          <button onClick={(e) => { e.stopPropagation(); setSel((sel - 1 + all.length) % all.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70 text-xl" style={{ border: `1px solid ${M.border}`, color: M.muted }}>‹</button>
          <button onClick={(e) => { e.stopPropagation(); setSel((sel + 1) % all.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70 text-xl" style={{ border: `1px solid ${M.border}`, color: M.muted }}>›</button>
          <div className="absolute top-5 left-5 px-3 py-1 rounded-lg text-xs" style={{ background: "rgba(201,168,76,0.1)", border: `1px solid ${M.border}`, color: M.gold }}>{sel + 1} / {all.length}</div>
          <img src={all[sel]} alt="Büyük" className="max-w-full max-h-[88vh] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} style={{ boxShadow: `0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px ${M.border}` }} />
        </div>
      )}
    </section>
  );
}

/* ── CONTACT ────────────────────────────────────────────── */
function MerliContact({ venue }: Props) {
  const ref = useRef<HTMLElement>(null!);
  const v = useInView(ref);
  return (
    <section ref={ref} className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden" style={{ background: M.deep }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${M.border},transparent)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${M.red}18, transparent)` }} />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <div className="transition-all duration-700" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)" }}>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: M.gold }}>İletişim</p>
          <h2 className="font-serif mb-4" style={{ fontSize: "clamp(1.9rem,4.5vw,3.2rem)", color: M.white }}>
            Hayalinizi<br /><span style={{ color: M.gold, fontStyle: "italic" }}>Birlikte Kuralım</span>
          </h2>
          <p className="mb-10 mx-auto" style={{ color: M.muted, maxWidth: 400, fontSize: "0.9rem" }}>
            Özel gününüz için en iyi teklifi almak üzere bize ulaşın. 7/24 hizmetinizdeyiz.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 transition-all duration-700 delay-100" style={{ opacity: v ? 1 : 0 }}>
          <button onClick={() => waOpen(venue)}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-semibold text-white hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", fontSize: "0.95rem", boxShadow: "0 8px 28px rgba(37,211,102,0.25)" }}>
            <MessageCircle className="w-5 h-5" /> WhatsApp&apos;tan Yaz
          </button>
          <a href={`tel:${venue.phone}`}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-semibold hover:scale-105 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${M.border}`, color: M.white, fontSize: "0.95rem" }}>
            <Phone className="w-5 h-5" /> {venue.phone}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 transition-all duration-700 delay-200" style={{ opacity: v ? 1 : 0 }}>
          {[
            { icon: <MapPin className="w-4 h-4" />, label: "Adres", val: venue.address, href: venue.mapUrl },
            { icon: <Phone className="w-4 h-4" />, label: "Telefon", val: venue.phone, href: `tel:${venue.phone}` },
            { icon: <Instagram className="w-4 h-4" />, label: "Instagram", val: "@lamerlivent", href: venue.instagramUrl },
          ].map((c, i) => (
            <a key={i} href={c.href || "#"} target={c.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              className="rounded-2xl p-5 text-center transition-all hover:-translate-y-0.5"
              style={{ background: M.card, border: `1px solid ${M.border}` }}>
              <div className="mb-2 flex justify-center" style={{ color: M.gold }}>{c.icon}</div>
              <p className="text-xs mb-1" style={{ color: "rgba(240,236,228,0.3)" }}>{c.label}</p>
              <p className="text-xs font-medium leading-snug" style={{ color: M.white }}>{c.val}</p>
            </a>
          ))}
        </div>

        <p className="text-xs" style={{ color: "rgba(240,236,228,0.18)" }}>
          © {new Date().getFullYear()} {venue.venueName}. Tüm hakları saklıdır.
        </p>
      </div>
    </section>
  );
}

/* ── EXPORT ─────────────────────────────────────────────── */
export default function LaMerliVenuePage({ venue }: Props) {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: M.black }}>
      <MerliNav venue={venue} />
      <MerliHero venue={venue} />
      <MerliStrip />
      <MerliAbout venue={venue} />
      <MerliFeatures venue={venue} />
      <MerliPackages venue={venue} />
      <MerliGallery venue={venue} />
      <MerliContact venue={venue} />
    </div>
  );
}
