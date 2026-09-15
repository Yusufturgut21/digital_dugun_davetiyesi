"use client";
import { useEffect, useState, useRef } from "react";
import { VenueWebsite } from "@/lib/types";
import {
  MessageCircle, Phone, MapPin, Check, ChevronDown,
  Instagram, Sparkles, Star, Users, Award, ArrowRight
} from "lucide-react";
import OceanCanvas from "./OceanCanvas";

interface Props { venue: VenueWebsite; }

const OCEAN = {
  deep: "#020d1a",
  navy: "#061428",
  mid: "#0a2540",
  teal: "#0d4f6e",
  aqua: "#1a7fa0",
  light: "#38b2cc",
  foam: "#a8e6f0",
  sand: "#f5efe6",
  gold: "#c9a84c",
};

/* ── utility ─────────────────────────────────────────── */
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function wa(venue: VenueWebsite, msg?: string) {
  const text = msg ?? `Merhaba, ${venue.venueName} hakkında bilgi almak istiyorum.`;
  window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
}

/* ── FLOATING NAV ────────────────────────────────────── */
function FloatingNav({ venue }: Props) {
  const scrollY = useScrollY();
  const show = scrollY > 80;
  return (
    <nav
      className="fixed top-4 left-1/2 z-50 transition-all duration-500"
      style={{
        transform: `translateX(-50%) translateY(${show ? 0 : -100}px)`,
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-full border"
        style={{
          background: "rgba(2,13,26,0.75)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(56,178,204,0.25)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <span className="font-serif text-white text-sm tracking-wide">Lina Davet</span>
        <span className="w-px h-4 bg-white/20" />
        <span className="text-cyan-300 text-xs tracking-widest uppercase">Florya</span>
        <span className="w-px h-4 bg-white/20" />
        <button
          onClick={() => wa(venue)}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", color: "#fff" }}
        >
          <MessageCircle className="w-3.5 h-3.5" /> Yaz
        </button>
      </div>
    </nav>
  );
}

/* ── HERO ────────────────────────────────────────────── */

// Sadece heroVideo da heroImage da yoksa kullanılır
const FALLBACK_VIDEO = "https://videos.pexels.com/video-files/1409899/1409899-uhd_2560_1440_25fps.mp4";

function LinaHero({ venue }: Props) {
  const scrollY = useScrollY();
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Öncelik: admin'den yüklenen video > admin'den yüklenen fotoğraf > stok video
  const hasCustomVideo = !!venue.heroVideo;
  const hasHeroImage   = !!venue.heroImage;
  const videoSrc       = venue.heroVideo || (!hasHeroImage ? FALLBACK_VIDEO : null);
  const showVideo      = !!videoSrc;

  return (
    <section className="relative h-screen min-h-[680px] overflow-hidden flex items-center justify-center">

      {/* 1. Gradient — her zaman en altta */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(180deg,
          ${OCEAN.deep} 0%,
          ${OCEAN.navy} 18%,
          #0c3356 36%,
          #0d4a6a 52%,
          #0e5f82 65%,
          #117598 78%,
          #1a8fb5 90%,
          #2aa8cc 100%)`
      }} />

      {/* 2. Hero IMAGE — video yoksa tam arka plan olarak göster */}
      {hasHeroImage && !hasCustomVideo && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${venue.heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `scale(1.04) translateY(${scrollY * 0.06}px)`,
          }}
        />
      )}

      {/* 3. VIDEO — admin'den yüklenmiş video VEYA heroImage yoksa stok video */}
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{
            opacity: videoLoaded ? 1 : 0,
            transform: `scale(1.04) translateY(${scrollY * 0.08}px)`,
          }}
        >
          <source src={videoSrc!} type="video/mp4" />
        </video>
      )}

      {/* Sinematik overlay — videoyu premium gösterir, kontrast sağlar */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(
          180deg,
          rgba(2,13,26,0.62) 0%,
          rgba(4,18,36,0.38) 30%,
          rgba(6,22,44,0.22) 55%,
          rgba(8,28,56,0.42) 78%,
          rgba(2,13,26,0.75) 100%
        )`
      }} />

      {/* Işık kırınımı — sol üstten hafif mavi halo */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 20% 10%, rgba(56,178,204,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Subtle shimmer rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[20, 50, 80].map((left, i) => (
          <div key={i} className="absolute top-0 h-full"
            style={{
              left: `${left}%`,
              width: `${80 + i * 50}px`,
              background: `linear-gradient(180deg, rgba(200,235,255,${0.018 + i * 0.006}) 0%, transparent 60%)`,
              transform: `skewX(${-6 + i * 4}deg)`,
              animation: `shimmer ${8 + i * 3}s ease-in-out infinite`,
              animationDelay: `${i * 2.2}s`,
            }}
          />
        ))}
      </div>

      {/* ── OCEAN CANVAS — deniz Canvas animasyonu video üzerine bindirme ── */}
      <OceanCanvas
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{ height: "42%", width: "100%", opacity: videoLoaded ? 0.55 : 1 }}
      />

      {/* Horizon glow where sky meets sea */}
      <div className="absolute pointer-events-none"
        style={{
          left: 0, right: 0,
          bottom: "38%",
          height: "60px",
          background: "linear-gradient(180deg, transparent 0%, rgba(40,170,210,0.12) 50%, transparent 100%)",
          filter: "blur(14px)",
        }}
      />

      {/* Shore fade at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: `linear-gradient(180deg, transparent, ${OCEAN.sand})` }} />


      {/* CONTENT */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Main title */}
        <h1 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(3.5rem,11vw,9.5rem)",
          lineHeight: 0.9,
          color: "#fff",
          textShadow: `0 0 80px rgba(56,178,204,0.3), 0 4px 60px rgba(0,0,0,0.5)`,
          letterSpacing: "-0.02em",
          marginBottom: "1rem",
        }}>
          Lina<br />
          <span style={{ color: OCEAN.foam, opacity: 0.9 }}>Davet</span>
        </h1>

        <p style={{
          color: "rgba(168,230,240,0.7)",
          fontSize: "clamp(0.75rem,2vw,1rem)",
          letterSpacing: "0.5em",
          textTransform: "uppercase",
          marginBottom: "1.5rem",
          fontWeight: 300,
        }}>
          FLORYA
        </p>

        <p style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "clamp(1rem,2.5vw,1.25rem)",
          maxWidth: 520,
          margin: "0 auto 3rem",
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          {venue.tagline}
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => wa(venue)}
            className="group flex items-center justify-center gap-3 font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg,#25D366,#128C7E)",
              color: "#fff", padding: "16px 36px", borderRadius: 999,
              fontSize: "1rem",
              boxShadow: "0 8px 32px rgba(37,211,102,0.35)",
            }}>
            <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            WhatsApp ile Yaz
          </button>
          <a href={`tel:${venue.phone}`}
            className="flex items-center justify-center gap-3 font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff", padding: "16px 36px", borderRadius: 999,
              fontSize: "1rem",
            }}>
            <Phone className="w-5 h-5" />
            {venue.phone}
          </a>
        </div>

        {/* Detaylı İncele butonu */}
        <div className="mt-5">
          <button
            onClick={() => {
              document.getElementById("lina-about")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 font-medium transition-all duration-300 hover:gap-3"
            style={{
              color: "rgba(168,230,240,0.75)",
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span>Detaylı İncele</span>
            <div className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 group-hover:translate-y-1"
              style={{
                border: "1.5px solid rgba(168,230,240,0.4)",
                background: "rgba(255,255,255,0.04)",
              }}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-white/70 text-xs tracking-[0.3em] uppercase font-light"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          Keşfet
        </span>
        {/* Mouse icon with animated dot */}
        <div className="relative flex flex-col items-center gap-1">
          <div
            className="w-7 h-11 rounded-full border-2 flex justify-center pt-2"
            style={{
              borderColor: "rgba(255,255,255,0.55)",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 0 20px rgba(56,178,204,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.85)",
                animation: "scrollDot 1.8s ease-in-out infinite",
              }}
            />
          </div>
          {/* Arrow chevrons */}
          <div className="flex flex-col items-center -mt-0.5" style={{ gap: "2px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 10 + i * 4,
                  height: 2,
                  borderLeft: "2px solid rgba(255,255,255,0.7)",
                  borderBottom: "2px solid rgba(255,255,255,0.7)",
                  transform: "rotate(-45deg) skew(-5deg)",
                  animation: `chevronFade 1.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                  borderRadius: "1px",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes scrollDot {
          0% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(10px); opacity: 0; }
          61% { transform: translateY(0); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes chevronFade {
          0%,100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}

/* ── TAGLINE STRIP ───────────────────────────────────── */
function TaglineStrip() {
  const tags = ["🌊 Deniz Manzarası","✨ Premium Hizmet","💍 800 Kişi Kapasitesi","🎵 Canlı Müzik","🍽️ Gala Menüsü","📸 VIP Lounge","🚗 Ücretsiz Otopark","⭐ 15+ Yıl Tecrübe"];
  const doubled = [...tags, ...tags];
  return (
    <div className="overflow-hidden py-4 border-y" style={{ background: OCEAN.sand, borderColor: "rgba(201,168,76,0.15)" }}>
      <div className="flex gap-8 whitespace-nowrap" style={{ animation: "marquee 28s linear infinite" }}>
        {doubled.map((t, i) => (
          <span key={i} className="text-sm font-medium shrink-0" style={{ color: OCEAN.teal }}>{t}</span>
        ))}
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

/* ── ABOUT ───────────────────────────────────────────── */
function LinaAbout({ venue }: Props) {
  const ref = useRef<HTMLElement>(null!);
  const visible = useInView(ref);
  const stats = [
    { icon: <Star className="w-6 h-6" />, val: "15+", label: "Yıl Tecrübe" },
    { icon: <Users className="w-6 h-6" />, val: "1000+", label: "Mutlu Çift" },
    { icon: <Award className="w-6 h-6" />, val: `${venue.capacity.max}`, label: "Kişi Kapasitesi" },
    { icon: <Sparkles className="w-6 h-6" />, val: "100%", label: "Memnuniyet" },
  ];
  return (
    <section ref={ref} id="lina-about" className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden" style={{ background: OCEAN.sand }}>
      {/* Decorative circle */}
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${OCEAN.aqua}, transparent)` }} />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Text */}
          <div className="transition-all duration-1000" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-40px)" }}>
            <p className="text-xs tracking-[0.35em] uppercase font-semibold mb-5" style={{ color: OCEAN.aqua }}>Hakkımızda</p>
            <h2 className="font-serif mb-6 leading-tight" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: OCEAN.deep }}>
              Denizin Kıyısında<br />
              <em style={{ color: OCEAN.teal, fontStyle: "italic" }}>Sonsuz Bir Gün</em>
            </h2>
            <div className="w-12 h-0.5 mb-8 rounded-full" style={{ background: `linear-gradient(90deg,${OCEAN.teal},${OCEAN.light})` }} />
            <p className="leading-relaxed whitespace-pre-line" style={{ color: "#4a5568", fontSize: "1.0625rem" }}>
              {venue.description}
            </p>
            <button onClick={() => wa(venue)}
              className="mt-10 group inline-flex items-center gap-3 font-semibold text-sm transition-all hover:gap-5"
              style={{ color: OCEAN.teal }}>
              Rezervasyon Yap
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 transition-all duration-1000 delay-200" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(40px)" }}>
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl p-6 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: i % 2 === 0 ? `linear-gradient(135deg,${OCEAN.mid},${OCEAN.teal})` : "#fff",
                  boxShadow: "0 4px 24px rgba(10,37,64,0.08)",
                }}>
                <div className="mb-3" style={{ color: i % 2 === 0 ? OCEAN.foam : OCEAN.teal }}>{s.icon}</div>
                <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: i % 2 === 0 ? "#fff" : OCEAN.deep }}>{s.val}</div>
                <div className="text-xs tracking-wide" style={{ color: i % 2 === 0 ? "rgba(255,255,255,0.6)" : "#718096" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FEATURES ────────────────────────────────────────── */
function LinaFeatures({ venue }: Props) {
  const ref = useRef<HTMLElement>(null!);
  const visible = useInView(ref);
  return (
    <section ref={ref} className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden"
      style={{ background: `linear-gradient(175deg, ${OCEAN.deep} 0%, ${OCEAN.navy} 50%, ${OCEAN.mid} 100%)` }}>

      {/* Top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none" style={{ transform: "rotate(180deg)" }}>
          <path fill={OCEAN.sand} d="M0,40 C360,80 720,0 1080,50 C1260,70 1380,20 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path fill={OCEAN.sand} d="M0,40 C360,80 720,0 1080,50 C1260,70 1380,20 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* Glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: OCEAN.aqua, filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8" style={{ background: OCEAN.light, filter: "blur(80px)" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 py-8">
        <div className="text-center mb-16 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}>
          <p className="text-xs tracking-[0.35em] uppercase font-semibold mb-4" style={{ color: OCEAN.foam }}>Özelliklerimiz</p>
          <h2 className="font-serif text-white mb-3" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
            Neden Lina Davet?
          </h2>
          <div className="w-12 h-0.5 mx-auto rounded-full" style={{ background: `linear-gradient(90deg,${OCEAN.light},${OCEAN.foam})` }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {venue.features.map((f, i) => (
            <div key={i}
              className="group rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 cursor-default"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(56,178,204,0.12)",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(30px)",
                transitionDelay: `${i * 60}ms`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
              }}>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
              <h3 className="font-semibold text-white text-base mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(168,230,240,0.55)" }}>{f.description}</p>
              {/* Bottom accent */}
              <div className="mt-4 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg,${OCEAN.light},transparent)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PACKAGES ────────────────────────────────────────── */
function LinaPackages({ venue }: Props) {
  const ref = useRef<HTMLElement>(null!);
  const visible = useInView(ref);

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4 sm:px-6" style={{ background: OCEAN.sand }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}>
          <p className="text-xs tracking-[0.35em] uppercase font-semibold mb-4" style={{ color: OCEAN.aqua }}>Paketler</p>
          <h2 className="font-serif mb-3" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: OCEAN.deep }}>Düğün Paketlerimiz</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">Her düğün özeldir. En uygun paketi birlikte belirleyelim.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {venue.packages.map((pkg, i) => {
            const isHot = pkg.highlighted;
            return (
              <div key={i}
                className="relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
                style={{
                  background: isHot ? `linear-gradient(160deg,${OCEAN.mid},${OCEAN.teal})` : "#fff",
                  boxShadow: isHot ? `0 20px 60px rgba(13,79,110,0.4)` : "0 4px 24px rgba(10,37,64,0.08)",
                  transform: isHot ? "scale(1.03)" : "scale(1)",
                  opacity: visible ? 1 : 0,
                  transitionDelay: `${i * 100}ms`,
                }}>

                {isHot && (
                  <div className="absolute top-0 left-0 right-0 py-2 text-center text-xs font-bold tracking-widest uppercase"
                    style={{ background: OCEAN.gold, color: OCEAN.deep }}>
                    ✦ En Popüler ✦
                  </div>
                )}

                <div className="p-7 sm:p-8" style={{ paddingTop: isHot ? "3rem" : undefined }}>
                  <h3 className="font-serif text-2xl sm:text-3xl mb-1" style={{ color: isHot ? "#fff" : OCEAN.deep }}>
                    {pkg.name}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: isHot ? "rgba(255,255,255,0.55)" : "#718096" }}>{pkg.description}</p>

                  <div className="space-y-2.5 mb-8">
                    {pkg.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: isHot ? "rgba(255,255,255,0.15)" : `linear-gradient(135deg,${OCEAN.teal},${OCEAN.light})` }}>
                          <Check className="w-3 h-3" style={{ color: isHot ? OCEAN.foam : "#fff" }} />
                        </div>
                        <span className="text-sm" style={{ color: isHot ? "rgba(255,255,255,0.8)" : "#4a5568" }}>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => wa(venue, `Merhaba, "${pkg.name}" paketi hakkında bilgi almak istiyorum.`)}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={isHot
                      ? { background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }
                      : { background: `linear-gradient(135deg,${OCEAN.mid},${OCEAN.teal})`, color: "#fff" }}>
                    <MessageCircle className="w-4 h-4" />
                    Fiyat Öğren
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm mt-10 text-gray-400">
          Özel ihtiyaçlarınız için{" "}
          <button onClick={() => wa(venue)} className="underline underline-offset-2 hover:opacity-70" style={{ color: OCEAN.teal }}>
            bizimle iletişime geçin
          </button>
        </p>
      </div>
    </section>
  );
}

/* ── CONTACT ─────────────────────────────────────────── */
function LinaContact({ venue }: Props) {
  const ref = useRef<HTMLElement>(null!);
  const visible = useInView(ref);

  return (
    <section ref={ref} className="relative py-20 sm:py-32 px-4 sm:px-6 overflow-hidden"
      style={{ background: `linear-gradient(175deg,${OCEAN.deep} 0%,${OCEAN.navy} 40%,${OCEAN.mid} 100%)` }}>

      {/* Top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none" style={{ transform: "rotate(180deg)" }}>
          <path fill={OCEAN.sand} d="M0,30 C360,80 720,0 1080,50 C1260,70 1380,15 1440,35 L1440,80 L0,80 Z" />
        </svg>
      </div>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: OCEAN.aqua, filter: "blur(100px)" }} />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 pt-10">
        {/* Header */}
        <div className="text-center mb-12 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}>
          <p className="text-xs tracking-[0.35em] uppercase font-semibold mb-4" style={{ color: OCEAN.foam }}>İletişim</p>
          <h2 className="font-serif text-white mb-3" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>Hayalini Konuşalım</h2>
          <p style={{ color: "rgba(168,230,240,0.5)", maxWidth: 400, margin: "0 auto", fontSize: "0.9375rem" }}>
            Özel gününüz için en iyi teklifi almak üzere bize ulaşın. 7/24 hizmetinizdeyiz.
          </p>
        </div>

        {/* Main CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 delay-100"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}>
          <button onClick={() => wa(venue)}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold text-white hover:scale-105 transition-all"
            style={{ background: "linear-gradient(135deg,#25D366,#128C7E)", boxShadow: "0 8px 32px rgba(37,211,102,0.3)", fontSize: "1rem" }}>
            <MessageCircle className="w-5 h-5" />
            WhatsApp&apos;tan Yaz
          </button>
          <a href={`tel:${venue.phone}`}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold text-white hover:scale-105 transition-all"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "1rem" }}>
            <Phone className="w-5 h-5" />
            {venue.phone}
          </a>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 transition-all duration-700 delay-200"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}>
          {[
            { icon: <MapPin className="w-5 h-5" />, label: "Adres", val: venue.address, href: venue.mapUrl },
            { icon: <Phone className="w-5 h-5" />, label: "Telefon", val: venue.phone, href: `tel:${venue.phone}` },
            { icon: <Instagram className="w-5 h-5" />, label: "Instagram", val: "@linadavetflorya", href: venue.instagramUrl },
          ].map((c, i) => c.href ? (
            <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
              className="group rounded-2xl p-5 text-center transition-all hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(56,178,204,0.1)" }}>
              <div className="mb-2 flex justify-center" style={{ color: OCEAN.foam }}>{c.icon}</div>
              <p className="text-xs mb-1" style={{ color: "rgba(168,230,240,0.4)" }}>{c.label}</p>
              <p className="text-white text-sm font-medium leading-snug">{c.val}</p>
            </a>
          ) : (
            <div key={i} className="rounded-2xl p-5 text-center"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(56,178,204,0.1)" }}>
              <div className="mb-2 flex justify-center" style={{ color: OCEAN.foam }}>{c.icon}</div>
              <p className="text-xs mb-1" style={{ color: "rgba(168,230,240,0.4)" }}>{c.label}</p>
              <p className="text-white text-sm font-medium leading-snug">{c.val}</p>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border transition-all duration-700 delay-300"
          style={{ height: 260, borderColor: "rgba(56,178,204,0.15)", opacity: visible ? 1 : 0 }}>
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(venue.address + " " + venue.city)}&output=embed`}
            width="100%" height="100%"
            style={{ border: 0, filter: "saturate(0.3) brightness(0.6) hue-rotate(180deg)" }}
            allowFullScreen loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title={`${venue.venueName} Konum`}
          />
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-xs" style={{ color: "rgba(168,230,240,0.2)" }}>
          © {new Date().getFullYear()} {venue.venueName}. Tüm hakları saklıdır.
        </p>
      </div>
    </section>
  );
}

/* ── GALLERY ─────────────────────────────────────────── */
function LinaGallery({ venue }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null!);
  const visible = useInView(ref);

  const allImages = [
    ...(venue.galleryImages || []),
    ...(venue.realWeddingImages || []),
  ];

  if (allImages.length === 0) return null;

  const prev = () => setSelected((s) => s !== null ? (s - 1 + allImages.length) % allImages.length : 0);
  const next = () => setSelected((s) => s !== null ? (s + 1) % allImages.length : 0);

  return (
    <section ref={ref} className="py-16 sm:py-24 px-4 sm:px-6"
      style={{ background: `linear-gradient(180deg, ${OCEAN.sand} 0%, #eef6f9 100%)` }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)" }}>
          <p className="text-xs tracking-[0.35em] uppercase font-semibold mb-4" style={{ color: OCEAN.aqua }}>Galeri</p>
          <h2 className="font-serif mb-3" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", color: OCEAN.deep }}>
            Salonumuzdan Kareler
          </h2>
          <div className="w-12 h-0.5 mx-auto rounded-full" style={{ background: `linear-gradient(90deg,${OCEAN.teal},${OCEAN.light})` }} />
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              className="relative overflow-hidden rounded-xl cursor-pointer group transition-all duration-500"
              style={{
                aspectRatio: i % 7 === 0 ? "1/1.3" : i % 5 === 2 ? "1.3/1" : "1/1",
                gridRow: i % 7 === 0 ? "span 1" : "span 1",
                opacity: visible ? 1 : 0,
                transitionDelay: `${i * 40}ms`,
              }}
            >
              <img
                src={img}
                alt={`${venue.venueName} ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-end p-3"
                style={{ background: "linear-gradient(to top, rgba(2,13,26,0.7), transparent)" }}>
                <span className="text-white text-xs font-medium">{i + 1} / {allImages.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2,13,26,0.96)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelected(null)}
        >
          {/* Close */}
          <button
            onClick={() => setSelected(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            ✕
          </button>
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            ‹
          </button>
          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.2)" }}
          >
            ›
          </button>
          {/* Counter */}
          <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full text-white text-xs"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
            {selected + 1} / {allImages.length}
          </div>
          <img
            src={allImages[selected]}
            alt="Büyük görsel"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
          />
        </div>
      )}
    </section>
  );
}

/* ── EXPORT ───────────────────────────────────────────── */
export default function LinaVenuePage({ venue }: Props) {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: OCEAN.sand }}>
      <FloatingNav venue={venue} />
      <LinaHero venue={venue} />
      <TaglineStrip />
      <LinaAbout venue={venue} />
      <LinaGallery venue={venue} />
      <LinaFeatures venue={venue} />
      <LinaPackages venue={venue} />
      <LinaContact venue={venue} />
    </div>
  );
}

