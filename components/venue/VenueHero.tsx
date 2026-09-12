"use client";
import { VenueWebsite } from "@/lib/types";
import { MessageCircle, Phone, ChevronDown } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenueHero({ venue }: Props) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Merhaba, ${venue.venueName} hakkında bilgi almak istiyorum.`);
    window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${venue.phone}`;
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      {venue.heroVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src={venue.heroVideo} type="video/mp4" />
        </video>
      ) : venue.heroImage ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transform scale-105 transition-transform duration-700"
          style={{ backgroundImage: `url(${venue.heroImage})` }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100" />
      )}

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8">
        {/* Premium badge */}
        <div className="inline-block">
          <span className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-sm font-medium tracking-wider uppercase">
            ✨ Premium Düğün Mekanı
          </span>
        </div>

        {/* Main title with animation */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-6 drop-shadow-2xl leading-tight animate-fade-in">
          {venue.venueName}
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-10 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
          {venue.tagline}
        </p>

        {/* CTA Buttons - Enhanced */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleWhatsApp}
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-5 rounded-full font-semibold text-lg flex items-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 hover:scale-105 transform"
          >
            <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>WhatsApp ile İletişim</span>
          </button>
          <button
            onClick={handleCall}
            className="group bg-white/95 backdrop-blur-sm hover:bg-white text-gray-900 px-10 py-5 rounded-full font-semibold text-lg flex items-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-105 transform"
          >
            <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Hemen Ara</span>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="pt-8 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>7/24 İletişim</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Profesyonel Hizmet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Modern Tesis</span>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer group"
      >
        <div className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors">
          <span className="text-sm font-medium tracking-wide">Keşfet</span>
          <div className="w-8 h-12 border-2 border-white/40 group-hover:border-white/60 rounded-full flex justify-center p-2 transition-colors">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </button>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </section>
  );
}
