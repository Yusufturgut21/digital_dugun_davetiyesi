"use client";
import { useEffect, useState, useRef } from "react";
import { VenueWebsite } from "@/lib/types";
import {
  MessageCircle, Phone, MapPin, Check, ChevronDown,
  Instagram, Sparkles, Star, Users, Award, ArrowRight
} from "lucide-react";

interface Props { venue: VenueWebsite; }

/* ── Bej / Krem / Altın Paleti ─────────────────────────── */
const P = {
  bg:      "#faf7f2",       // ana arka plan — sıcak krem
  bg2:     "#f5f0e8",       // ikincil bölümler
  bg3:     "#ede8de",       // koyu bej
  card:    "#ffffff",
  border:  "rgba(180,150,90,0.18)",
  borderM: "rgba(180,150,90,0.35)",
  gold:    "#b8943a",
  goldL:   "#d4ae5a",
  goldD:   "#8a6820",
  text:    "#1a1510",       // koyu kahve metin
  textM:   "#6b5a42",       // orta ton metin
  textL:   "#a08060",       // açık metin
  rose:    "#c9a8a0",       // hafif gül tonu
  roseL:   "#f0e8e4",
};

/* ── Utilities ─────────────────────────────────────────── */
function useInView(ref: React.RefObject<HTMLElement>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [ref]);
  return v;
}

function waOpen(venue: VenueWebsite, msg?: string) {
  const t = msg ?? `Merhaba, ${venue.venueName} hakkında bilgi almak istiyorum.`;
  window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(t)}`, "_blank");
}

/* ══════════════════════════════════════════════════════════
   PERDE ANİMASYONU  — iki yarı soldan/sağdan kapanıp açılır
   Ortada isim + slogan belirir, sonra sayfa aşağı kayar
═══════════════════════════════════════════════════════════ */
function CurtainIntro({ venue, onDone }: { venue: VenueWebsite; onDone: () => void }) {
  const [phase, setPhase] = useState<"hold" | "open" | "done">("hold");

  useEffect(() => {
    // 1.8s bekle → perdeler açılmaya başlar
    const t1 = setTimeout(() => setPhase("open"), 1800);
    // 2.8s sonra tamamen bitti → içeriği göster
    const t2 = setTimeout(() => { setPhase("done"); onDone(); }, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden pointer-events-none">

      {/* Sol perde */}
      <div className="absolute inset-y-0 left-0 w-1/2 transition-transform duration-[1600ms]"
        style={{
          transitionTimingFunction: "cubic-bezier(0.76,0,0.24,1)",
          transform: phase === "open" ? "translateX(-100%)" : "translateX(0)",
          background: `linear-gradient(160deg, #f5f0e8 0%, #ede8de 40%, #e0d9cc 100%)`,
          boxShadow: "inset -12px 0 40px rgba(100,80,40,0.08)",
        }}>
        {/* Perde dokusu — dikey çizgiler */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(150,120,60,0.15) 18px, rgba(150,120,60,0.15) 19px)" }} />
        {/* Perde kıvrım gölgesi sağ kenar */}
        <div className="absolute top-0 right-0 bottom-0 w-16"
          style={{ background: "linear-gradient(90deg, transparent, rgba(80,60,20,0.12))" }} />
        {/* Perde üst şerit */}
        <div className="absolute top-0 left-0 right-0 h-3"
          style={{ background: `linear-gradient(90deg, ${P.goldD}, ${P.gold}, ${P.goldL}, ${P.gold}, ${P.goldD})` }} />
      </div>

      {/* Sağ perde */}
      <div className="absolute inset-y-0 right-0 w-1/2 transition-transform duration-[1600ms]"
        style={{
          transitionTimingFunction: "cubic-bezier(0.76,0,0.24,1)",
          transform: phase === "open" ? "translateX(100%)" : "translateX(0)",
          background: `linear-gradient(200deg, #f5f0e8 0%, #ede8de 40%, #e0d9cc 100%)`,
          boxShadow: "inset 12px 0 40px rgba(100,80,40,0.08)",
        }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(150,120,60,0.15) 18px, rgba(150,120,60,0.15) 19px)" }} />
        <div className="absolute top-0 left-0 bottom-0 w-16"
          style={{ background: "linear-gradient(270deg, transparent, rgba(80,60,20,0.12))" }} />
        <div className="absolute top-0 left-0 right-0 h-3"
          style={{ background: `linear-gradient(90deg, ${P.goldD}, ${P.gold}, ${P.goldL}, ${P.gold}, ${P.goldD})` }} />
      </div>

      {/* Merkezdeki içerik — perdeler açılana kadar görünür */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div className="text-center px-8 transition-all duration-700"
          style={{ opacity: phase === "open" ? 0 : 1, transform: phase === "open" ? "scale(0.92)" : "scale(1)" }}>

          {/* Üst süsleme */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 sm:w-28" style={{ background: `linear-gradient(90deg,transparent,${P.gold})` }} />
            <span style={{ color: P.gold, fontSize: "1.2rem" }}>✦</span>
            <div className="h-px w-16 sm:w-28" style={{ background: `linear-gradient(90deg,${P.gold},transparent)` }} />
          </div>

          {/* Salon ismi */}
          <h1 className="font-serif mb-2" style={{ fontSize: "clamp(2.2rem,7vw,5rem)", color: P.text, letterSpacing: "-0.01em", lineHeight: 1.1, textShadow: "0 2px 20px rgba(120,90,30,0.12)" }}>
            La Merli
          </h1>
          <p className="font-serif mb-6" style={{ fontSize: "clamp(1rem,3vw,1.8rem)", color: P.gold, letterSpacing: "0.25em", fontStyle: "italic" }}>
            Event
          </p>

          {/* Reklam sloganı */}
          <p className="font-sans font-light mb-8" style={{ fontSize: "clamp(0.8rem,2vw,1.05rem)", color: P.textM, letterSpacing: "0.12em", maxWidth: 420, margin: "0 auto 2rem" }}>
            Hayalinizdeki Düğün İçin Tek Adres
          </p>

          {/* Alt süsleme */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-full"
                style={{ width: i === 2 ? 8 : 4, height: i === 2 ? 8 : 4, background: i === 2 ? P.gold : P.goldL, opacity: i === 2 ? 1 : 0.5 }} />
            ))}
          </div>

          {/* Başakşehir etiketi */}
          <p className="mt-6 text-xs tracking-[0.3em] uppercase" style={{ color: P.textL }}>
            Başakşehir · İstanbul
          </p>
        </div>
      </div>

      {/* Altın orta çizgi — perdeler kapandığında görünür */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 transition-opacity duration-300"
        style={{ background: `linear-gradient(180deg,${P.goldD},${P.gold},${P.goldD})`, opacity: phase === "hold" ? 0.5 : 0 }} />

      <style>{`
        @keyframes curtainFade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

/* ── FLOATING NAV ──────────────────────────────────────── */
function MerliNav({ venue, show }: Props & { show: boolean }) {
  return (
    <nav className="fixed top-4 left-1/2 z-50 transition-all duration-500 w-[92%] max-w-2xl"
      style={{ transform: `translateX(-50%) translateY(${show ? 0 : -110}px)`, opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none" }}>
      <div className="flex items-center justify-between px-5 py-3 rounded-2xl"
        style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(20px)", border: `1px solid ${P.borderM}`, boxShadow: "0 8px 40px rgba(100,80,40,0.12), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
            style={{ background: `linear-gradient(135deg,${P.gold},${P.goldL})`, color: "#fff" }}>LM</div>
          <span className="font-serif text-sm" style={{ color: P.text }}>La Merli Event</span>
        </div>
        <button onClick={() => waOpen(venue)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold hover:scale-105 transition-all"
          style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff" }}>
          <MessageCircle className="w-3.5 h-3.5" /> Yaz
        </button>
      </div>
    </nav>
  );
}

/* ── HERO ──────────────────────────────────────────────── */
const FALLBACK_VIDEO = "https://videos.pexels.com/video-files/3843434/3843434-uhd_2560_1440_24fps.mp4";

function MerliHero({ venue }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const hasVideo = !!venue.heroVideo;
  const hasImage = !!venue.heroImage;
  const videoSrc = venue.heroVideo || (!hasImage ? FALLBACK_VIDEO : null);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">

      {/* Bej gradient base */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(160deg,#f8f4ee 0%,#f0ebe0 35%,#e8e0d0 65%,#ede6d8 100%)` }} />

      {/* Hero image */}
      {hasImage && !hasVideo && (
        <div className="absolute inset-0"
          style={{ backgroundImage: `url(${venue.heroImage})`, backgroundSize: "cover", backgroundPosition: "center", transform: `scale(1.04) translateY(${scrollY * 0.06}px)` }} />
      )}

      {/* Video */}
      {videoSrc && (
        <video autoPlay muted loop playsInline preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: videoLoaded ? 1 : 0, transform: `scale(1.04) translateY(${scrollY * 0.06}px)` }}>
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Light warm overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(250,247,242,0.55) 0%,rgba(245,240,232,0.3) 40%,rgba(240,234,220,0.2) 65%,rgba(250,247,242,0.85) 100%)" }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 50%, rgba(200,190,170,0.35) 100%)" }} />

      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg,transparent 0%,${P.gold} 30%,${P.goldL} 50%,${P.gold} 70%,transparent 100%)` }} />

      {/* Floating petals / decorative dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: 3 + (i % 3) * 2, height: 3 + (i % 3) * 2,
              left: `${8 + (i * 9) % 84}%`,
              top: `${10 + (i * 7.5) % 65}%`,
              background: i % 2 === 0 ? P.gold : P.rose,
              opacity: 0.35,
              animation: `petal ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }} />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">

        {/* Ornament line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(90deg,transparent,${P.gold})` }} />
          <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
            style={{ borderColor: P.gold, color: P.gold, background: "rgba(184,148,58,0.08)" }}>LM</div>
          <div className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(90deg,${P.gold},transparent)` }} />
        </div>

        <h1 className="font-serif leading-none mb-2"
          style={{ fontSize: "clamp(3rem,9vw,7.5rem)", color: P.text, letterSpacing: "-0.02em", textShadow: "0 2px 30px rgba(120,90,30,0.1)" }}>
          La Merli
        </h1>
        <p className="font-serif mb-5" style={{ fontSize: "clamp(1rem,3vw,2rem)", color: P.gold, letterSpacing: "0.22em", fontStyle: "italic" }}>
          Event
        </p>

        <p className="font-light mb-3 mx-auto" style={{ color: P.textM, fontSize: "clamp(0.9rem,2vw,1.1rem)", maxWidth: 440, lineHeight: 1.7 }}>
          Hayalinizdeki Düğün İçin Tek Adres
        </p>
        <p className="mb-10 mx-auto text-xs tracking-widest uppercase" style={{ color: P.textL }}>
          Başakşehir · İstanbul
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => waOpen(venue)}
            className="group flex items-center justify-center gap-3 font-semibold hover:scale-105 transition-all duration-300"
            style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff", padding: "14px 34px", borderRadius: 12, fontSize: "0.95rem", boxShadow: "0 6px 24px rgba(37,211,102,0.25)" }}>
            <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" /> WhatsApp ile Yaz
          </button>
          <a href={`tel:${venue.phone}`}
            className="flex items-center justify-center gap-3 font-semibold hover:scale-105 transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: `1.5px solid ${P.borderM}`, color: P.text, padding: "14px 34px", borderRadius: 12, fontSize: "0.95rem" }}>
            <Phone className="w-5 h-5" style={{ color: P.gold }} /> {venue.phone}
          </a>
        </div>

        {/* Detaylı incele */}
        <div className="mt-6">
          <button onClick={() => document.getElementById("merli-about")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
            style={{ color: P.textL }}>
            Detaylı İncele
            <div className="w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-y-0.5 transition-transform"
              style={{ border: `1.5px solid ${P.border}` }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-6 h-9 rounded-full border-2 flex justify-center pt-1.5"
          style={{ borderColor: P.borderM, background: "rgba(184,148,58,0.06)" }}>
          <div className="w-1 h-2 rounded-full" style={{ background: P.gold, animation: "scrollDot 1.8s ease-in-out infinite" }} />
        </div>
      </div>

      {/* Shore fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: `linear-gradient(180deg,transparent,${P.bg})` }} />

      <style>{`
        @keyframes petal { 0%,100%{transform:translateY(0) rotate(0deg);opacity:0.35} 50%{transform:translateY(-14px) rotate(8deg);opacity:0.6} }
        @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 60%{transform:translateY(12px);opacity:0} 61%{transform:translateY(0);opacity:0} 100%{opacity:1} }
      `}</style>
    </section>
  );
}

/* ── TAGLINE STRIP ─────────────────────────────────────── */
function MerliStrip() {
  const items = ["✦ Premium Organizasyon","✦ VIP Lounge","✦ 600 Kişi Kapasitesi","✦ Vale Hizmeti","✦ Özel Dekorasyon","✦ Gala Menüsü","✦ Başakşehir'in Kalbinde","✦ 7/24 Destek"];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-3 border-y" style={{ background: P.bg3, borderColor: P.borderM }}>
      <div className="flex gap-10 whitespace-nowrap" style={{ animation: "marquee 32s linear infinite" }}>
        {doubled.map((t, i) => (
          <span key={i} className="text-xs font-semibold tracking-widest shrink-0 uppercase" style={{ color: P.gold }}>{t}</span>
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
    <section ref={ref} id="merli-about" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden" style={{ background: P.bg }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px" style={{ background: `linear-gradient(90deg,transparent,${P.gold},transparent)` }} />
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="transition-all duration-1000" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(-40px)" }}>
            <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-5" style={{ color: P.gold }}>Hakkımızda</p>
            <h2 className="font-serif mb-6 leading-tight" style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)", color: P.text }}>
              Lüksün Yeni<br /><span style={{ color: P.gold, fontStyle: "italic" }}>Tanımı</span>
            </h2>
            <div className="w-10 h-0.5 mb-8 rounded-full" style={{ background: `linear-gradient(90deg,${P.gold},transparent)` }} />
            <p className="leading-relaxed whitespace-pre-line" style={{ color: P.textM, fontSize: "1rem" }}>{venue.description}</p>
            <button onClick={() => waOpen(venue)}
              className="mt-10 group inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-4"
              style={{ color: P.gold }}>
              Rezervasyon Yap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 transition-all duration-1000 delay-200" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateX(40px)" }}>
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: i % 2 === 0 ? P.bg2 : P.roseL, border: `1px solid ${P.border}` }}>
                <div className="mb-3" style={{ color: P.gold }}>{s.icon}</div>
                <div className="text-3xl font-bold mb-1" style={{ color: P.text }}>{s.val}</div>
                <div className="text-xs tracking-wide" style={{ color: P.textL }}>{s.label}</div>
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
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: P.bg2 }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 transition-all duration-700" style={{ opacity: v ? 1 : 0 }}>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: P.gold }}>Özelliklerimiz</p>
          <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)", color: P.text }}>Neden La Merli?</h2>
          <div className="w-10 h-0.5 mx-auto mt-4" style={{ background: `linear-gradient(90deg,transparent,${P.gold},transparent)` }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {venue.features.map((f, i) => (
            <div key={i} className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default"
              style={{ background: P.card, border: `1px solid ${P.border}`, opacity: v ? 1 : 0, transitionDelay: `${i * 55}ms`, boxShadow: "0 2px 12px rgba(120,90,30,0.06)" }}>
              <div className="h-0.5 w-0 group-hover:w-full rounded-full mb-5 transition-all duration-500" style={{ background: `linear-gradient(90deg,${P.gold},${P.goldL})` }} />
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: P.text }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: P.textL }}>{f.description}</p>
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
    <section ref={ref} className="py-20 sm:py-32 px-4 sm:px-6" style={{ background: P.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 transition-all duration-700" style={{ opacity: v ? 1 : 0 }}>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: P.gold }}>Paketler</p>
          <h2 className="font-serif mb-3" style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)", color: P.text }}>Düğün Paketlerimiz</h2>
          <p style={{ color: P.textL, fontSize: "0.9rem" }}>Her düğün özeldir — sizin için en iyisini birlikte seçelim.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {venue.packages.map((pkg, i) => {
            const hot = pkg.highlighted;
            return (
              <div key={i} className="relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                style={{ background: hot ? `linear-gradient(160deg,#fffdf8,#fdf6e8)` : P.card, border: hot ? `1.5px solid ${P.goldL}` : `1px solid ${P.border}`, boxShadow: hot ? `0 20px 60px rgba(184,148,58,0.18)` : "0 4px 16px rgba(120,90,30,0.06)", opacity: v ? 1 : 0, transitionDelay: `${i * 100}ms`, transform: hot ? "scale(1.03)" : "scale(1)" }}>
                <div className="h-0.5 w-full" style={{ background: hot ? `linear-gradient(90deg,${P.goldD},${P.gold},${P.goldL},${P.gold},${P.goldD})` : `linear-gradient(90deg,transparent,${P.border},transparent)` }} />
                {hot && (
                  <div className="py-2 text-center text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5"
                    style={{ background: `linear-gradient(90deg,rgba(184,148,58,0.08),rgba(212,174,90,0.15),rgba(184,148,58,0.08))`, color: P.gold, borderBottom: `1px solid ${P.border}` }}>
                    <Sparkles className="w-3 h-3" /> En Popüler
                  </div>
                )}
                <div className="p-7">
                  <h3 className="font-serif text-2xl mb-1" style={{ color: hot ? P.gold : P.text }}>{pkg.name}</h3>
                  <p className="text-xs mb-6" style={{ color: P.textL }}>{pkg.description}</p>
                  <ul className="space-y-2.5 mb-8">
                    {pkg.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: hot ? `rgba(184,148,58,0.12)` : P.bg2, border: `1px solid ${hot ? P.gold : P.border}` }}>
                          <Check className="w-2.5 h-2.5" style={{ color: P.gold }} />
                        </div>
                        <span className="text-xs leading-relaxed" style={{ color: P.textM }}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => waOpen(venue, `Merhaba, "${pkg.name}" paketi hakkında bilgi almak istiyorum.`)}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={hot ? { background: `linear-gradient(135deg,${P.goldD},${P.gold})`, color: "#fff" } : { background: P.bg2, border: `1px solid ${P.borderM}`, color: P.text }}>
                    <MessageCircle className="w-4 h-4" /> Bilgi Al
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs mt-10" style={{ color: P.textL }}>
          Özel talep için{" "}
          <button onClick={() => waOpen(venue)} className="underline underline-offset-2 hover:opacity-70" style={{ color: P.gold }}>bizimle iletişime geçin</button>
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
    <section ref={ref} className="py-20 sm:py-28 px-4 sm:px-6" style={{ background: P.bg2 }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 transition-all duration-700" style={{ opacity: v ? 1 : 0 }}>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: P.gold }}>Galeri</p>
          <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)", color: P.text }}>Salonumuzdan Kareler</h2>
          <div className="w-10 h-0.5 mx-auto mt-4" style={{ background: `linear-gradient(90deg,transparent,${P.gold},transparent)` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {all.map((img, i) => (
            <div key={i} onClick={() => setSel(i)} className="relative overflow-hidden rounded-xl cursor-pointer group"
              style={{ aspectRatio: "1/1", opacity: v ? 1 : 0, transition: "all 0.5s", transitionDelay: `${i * 35}ms` }}>
              <img src={img} alt={`${venue.venueName} ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                style={{ background: "linear-gradient(to top,rgba(120,90,40,0.5),transparent)" }}>
                <span className="text-xs font-medium text-white">{i + 1}/{all.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {sel !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,21,16,0.96)", backdropFilter: "blur(8px)" }} onClick={() => setSel(null)}>
          <button onClick={() => setSel(null)} className="absolute top-5 right-5 w-9 h-9 rounded-xl flex items-center justify-center text-sm" style={{ border: `1px solid ${P.border}`, color: P.textM }}>✕</button>
          <button onClick={(e) => { e.stopPropagation(); setSel((sel - 1 + all.length) % all.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ border: `1px solid ${P.border}`, color: P.textM }}>‹</button>
          <button onClick={(e) => { e.stopPropagation(); setSel((sel + 1) % all.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ border: `1px solid ${P.border}`, color: P.textM }}>›</button>
          <div className="absolute top-5 left-5 px-3 py-1 rounded-lg text-xs" style={{ background: "rgba(184,148,58,0.15)", border: `1px solid ${P.border}`, color: P.gold }}>{sel + 1} / {all.length}</div>
          <img src={all[sel]} alt="Büyük" className="max-w-full max-h-[88vh] object-contain rounded-xl" onClick={(e) => e.stopPropagation()} />
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
    <section ref={ref} className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden" style={{ background: P.bg }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${P.borderM},transparent)` }} />
      <div className="max-w-3xl mx-auto text-center">
        <div className="transition-all duration-700" style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)" }}>
          <p className="text-xs tracking-[0.4em] uppercase font-semibold mb-4" style={{ color: P.gold }}>İletişim</p>
          <h2 className="font-serif mb-4" style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)", color: P.text }}>
            Hayalinizi<br /><span style={{ color: P.gold, fontStyle: "italic" }}>Birlikte Kuralım</span>
          </h2>
          <p className="mb-10 mx-auto" style={{ color: P.textM, maxWidth: 380, fontSize: "0.9rem" }}>
            Özel gününüz için en iyi teklifi almak üzere bize ulaşın. 7/24 hizmetinizdeyiz.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <button onClick={() => waOpen(venue)}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-semibold text-white hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", boxShadow: "0 6px 24px rgba(37,211,102,0.2)" }}>
            <MessageCircle className="w-5 h-5" /> WhatsApp&apos;tan Yaz
          </button>
          <a href={`tel:${venue.phone}`}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-semibold hover:scale-105 transition-all"
            style={{ background: P.card, border: `1.5px solid ${P.borderM}`, color: P.text }}>
            <Phone className="w-5 h-5" style={{ color: P.gold }} /> {venue.phone}
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {[
            { icon: <MapPin className="w-4 h-4" />, label: "Adres", val: venue.address, href: venue.mapUrl },
            { icon: <Phone className="w-4 h-4" />, label: "Telefon", val: venue.phone, href: `tel:${venue.phone}` },
            { icon: <Instagram className="w-4 h-4" />, label: "Instagram", val: "@lamerlivent", href: venue.instagramUrl },
          ].map((c, i) => (
            <a key={i} href={c.href || "#"} target={c.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              className="rounded-2xl p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: P.card, border: `1px solid ${P.border}` }}>
              <div className="mb-2 flex justify-center" style={{ color: P.gold }}>{c.icon}</div>
              <p className="text-xs mb-1" style={{ color: P.textL }}>{c.label}</p>
              <p className="text-xs font-medium leading-snug" style={{ color: P.textM }}>{c.val}</p>
            </a>
          ))}
        </div>
        <p className="text-xs" style={{ color: P.textL }}>© {new Date().getFullYear()} {venue.venueName}. Tüm hakları saklıdır.</p>
      </div>
    </section>
  );
}

/* ── EXPORT ─────────────────────────────────────────────── */
export default function LaMerliVenuePage({ venue }: Props) {
  const [curtainDone, setCurtainDone] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: P.bg }}>
      {/* Perde animasyonu — sadece ilk yüklemede */}
      <CurtainIntro venue={venue} onDone={() => setCurtainDone(true)} />

      {/* İçerik — perde açılınca görünür */}
      <div className="transition-opacity duration-700" style={{ opacity: curtainDone ? 1 : 0 }}>
        <MerliNav venue={venue} show={curtainDone && scrollY > 60} />
        <MerliHero venue={venue} />
        <MerliStrip />
        <MerliGallery venue={venue} />
        <MerliAbout venue={venue} />
        <MerliFeatures venue={venue} />
        <MerliPackages venue={venue} />
        <MerliContact venue={venue} />
      </div>
    </div>
  );
}
