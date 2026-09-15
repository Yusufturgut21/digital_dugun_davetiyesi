"use client";
import { useEffect, useState, useRef } from "react";
import { VenueWebsite } from "@/lib/types";
import { MessageCircle, Phone, MapPin, Check, ChevronDown, Instagram, Sparkles, Waves, Anchor, Wind } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function LinaHero({ venue }: Props) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const wa = () => {
    window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Merhaba, ${venue.venueName} hakkında bilgi almak istiyorum.`)}`, "_blank");
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
      {/* Animated ocean gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #0a1628 0%, #0d2744 25%, #0e3d6e 50%, #1a6b8a 75%, #2d9eb5 100%)",
          transform: `scale(1.05) translateY(${scrollY * 0.2}px)`,
        }}
      />

      {/* Wave layers */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 200" className="w-full" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <path fill="rgba(255,255,255,0.04)" d="M0,80 C360,140 720,20 1080,100 C1260,140 1380,60 1440,80 L1440,200 L0,200 Z" />
        </svg>
        <svg viewBox="0 0 1440 160" className="w-full absolute bottom-0" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
          <path fill="rgba(255,255,255,0.06)" d="M0,60 C180,100 360,20 540,80 C720,140 900,20 1080,60 C1260,100 1380,40 1440,60 L1440,160 L0,160 Z" />
        </svg>
        <svg viewBox="0 0 1440 120" className="w-full absolute bottom-0">
          <path fill="rgba(255,255,255,0.08)" d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,40 L1440,120 L0,120 Z" />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${4 + (i % 4) * 6}px`,
              height: `${4 + (i % 4) * 6}px`,
              left: `${(i * 8.33) + 2}%`,
              top: `${20 + (i % 5) * 12}%`,
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-32 md:pb-40">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 border border-white/20 backdrop-blur-sm bg-white/5">
            <Waves className="w-4 h-4 text-cyan-300" />
            <span className="text-white/80 text-sm tracking-widest uppercase">Florya · İstanbul</span>
            <Anchor className="w-4 h-4 text-cyan-300" />
          </div>

          <h1
            className="font-serif mb-6 leading-none text-white"
            style={{ fontSize: "clamp(3rem, 9vw, 8rem)", textShadow: "0 4px 40px rgba(0,0,0,0.4)" }}
          >
            Lina Davet
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl font-light mb-2 text-cyan-200" style={{ letterSpacing: "0.15em" }}>
            FLORYA
          </p>

          <p className="text-base sm:text-xl text-white/70 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            {venue.tagline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={wa}
              className="flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 shadow-2xl"
              style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#fff" }}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile Yaz
            </button>
            <a
              href={`tel:${venue.phone}`}
              className="flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Phone className="w-5 h-5" />
              {venue.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/40 animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(-20px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function LinaAbout({ venue }: Props) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-cyan-600 text-sm font-medium tracking-widest uppercase mb-4">
              Hakkımızda
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              Denizin Kıyısında<br />
              <span style={{ color: "#0e3d6e" }}>Sonsuz Bir Gün</span>
            </h2>
            <div className="w-16 h-1 rounded-full mb-8" style={{ background: "linear-gradient(90deg, #0e3d6e, #2d9eb5)" }} />
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {venue.description}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🌊", val: "15+", label: "Yıl Tecrübe" },
              { icon: "💍", val: "1000+", label: "Mutlu Çift" },
              { icon: "👥", val: `${venue.capacity.min}-${venue.capacity.max}`, label: "Kişi Kapasitesi" },
              { icon: "⭐", val: "100%", label: "Memnuniyet" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 text-center"
                style={{ background: i % 2 === 0 ? "linear-gradient(135deg, #f0f9ff, #e0f2fe)" : "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: "#0e3d6e" }}>{s.val}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function LinaFeatures({ venue }: Props) {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #0d2744 60%, #0e3d6e 100%)" }}>
      {/* Decorative waves */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1440 80" className="w-full">
          <path fill="white" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 80" className="w-full">
          <path fill="white" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 pt-8 pb-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 text-cyan-300 text-sm font-medium tracking-widest uppercase mb-4">
            <Wind className="w-4 h-4" /> Özelliklerimiz
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            Neden Lina Davet?
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto" style={{ background: "linear-gradient(90deg, #2d9eb5, #67e8f9)" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {venue.features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border border-white/5"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}
            >
              <div className="text-3xl sm:text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PACKAGES ─────────────────────────────────────────────────────────────────
function LinaPackages({ venue }: Props) {
  const wa = (pkg?: string) => {
    const msg = pkg
      ? `Merhaba, "${pkg}" paketi hakkında bilgi almak istiyorum.`
      : "Merhaba, düğün paketleriniz hakkında bilgi almak istiyorum.";
    window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-cyan-600 text-sm font-medium tracking-widest uppercase mb-4">Paketler</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">Düğün Paketlerimiz</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Her düğün özeldir. Sizin için en uygun paketi birlikte belirleyelim.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
          {venue.packages.map((pkg, i) => (
            <div
              key={i}
              className={`rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${pkg.highlighted ? "ring-2 shadow-2xl scale-105" : ""}`}
              style={pkg.highlighted ? { ringColor: "#2d9eb5" } : {}}
            >
              {pkg.highlighted && (
                <div className="py-3 text-center text-white text-sm font-bold tracking-wider flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(90deg, #0e3d6e, #2d9eb5)" }}>
                  <Sparkles className="w-4 h-4" /> EN POPÜLER
                </div>
              )}
              <div className="p-6 sm:p-8 border border-gray-100 rounded-b-3xl" style={pkg.highlighted ? { borderColor: "#bae6fd" } : {}}>
                <h3 className="font-serif text-2xl sm:text-3xl mb-2" style={{ color: "#0e3d6e" }}>{pkg.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{pkg.description}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, #0e3d6e, #2d9eb5)" }}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-600 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => wa(pkg.name)}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105"
                  style={pkg.highlighted
                    ? { background: "linear-gradient(135deg, #0e3d6e, #2d9eb5)", color: "#fff" }
                    : { background: "#f0f9ff", color: "#0e3d6e", border: "1.5px solid #bae6fd" }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Bilgi Al
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => wa()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg text-white"
            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          >
            <MessageCircle className="w-5 h-5" />
            Özel Paket İçin Yazın
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function LinaContact({ venue }: Props) {
  const wa = () => {
    window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Merhaba, ${venue.venueName} hakkında bilgi almak istiyorum.`)}`, "_blank");
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0a1628 0%, #0d2744 60%, #0e3d6e 100%)" }}>
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1440 80" className="w-full">
          <path fill="white" d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 pt-8 text-center">
        <span className="inline-block text-cyan-300 text-sm font-medium tracking-widest uppercase mb-4">İletişim</span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">Hayalini Konuşalım</h2>
        <p className="text-white/60 mb-10 max-w-lg mx-auto">
          Özel gününüz için en iyi teklifi almak üzere bize ulaşın. 7/24 hizmetinizdeyiz.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={wa}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold text-lg text-white hover:scale-105 transition-all shadow-2xl"
            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
          >
            <MessageCircle className="w-6 h-6" />
            WhatsApp&apos;tan Yaz
          </button>
          <a
            href={`tel:${venue.phone}`}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-full font-semibold text-lg text-white hover:scale-105 transition-all border border-white/20 backdrop-blur-sm bg-white/10 hover:bg-white/20"
          >
            <Phone className="w-6 h-6" />
            {venue.phone}
          </a>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl p-5 border border-white/10 bg-white/5">
            <MapPin className="w-6 h-6 text-cyan-300 mx-auto mb-2" />
            <p className="text-white/60 text-xs mb-1">Adres</p>
            <p className="text-white text-sm font-medium leading-snug">{venue.address}</p>
          </div>
          <div className="rounded-2xl p-5 border border-white/10 bg-white/5">
            <Phone className="w-6 h-6 text-cyan-300 mx-auto mb-2" />
            <p className="text-white/60 text-xs mb-1">Telefon</p>
            <p className="text-white text-sm font-medium">{venue.phone}</p>
          </div>
          {venue.instagramUrl && (
            <a
              href={venue.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-5 border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              <Instagram className="w-6 h-6 text-pink-300 mx-auto mb-2" />
              <p className="text-white/60 text-xs mb-1">Instagram</p>
              <p className="text-white text-sm font-medium">@linadavetflorya</p>
            </a>
          )}
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden h-56 sm:h-72 border border-white/10">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-placeholder&q=${encodeURIComponent(venue.address + ", " + venue.city)}`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Lina Davet Florya Konum"
          />
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-white/30 text-xs">
          © {new Date().getFullYear()} {venue.venueName}. Tüm hakları saklıdır.
        </div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function LinaVenuePage({ venue }: Props) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <LinaHero venue={venue} />
      <LinaAbout venue={venue} />
      <LinaFeatures venue={venue} />
      <LinaPackages venue={venue} />
      <LinaContact venue={venue} />
    </div>
  );
}
