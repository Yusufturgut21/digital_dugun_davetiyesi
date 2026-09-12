"use client";
import { VenueWebsite } from "@/lib/types";
import { MessageCircle, Phone } from "lucide-react";

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

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {venue.heroVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={venue.heroVideo} type="video/mp4" />
        </video>
      ) : venue.heroImage ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${venue.heroImage})` }}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 drop-shadow-lg">
          {venue.venueName}
        </h1>
        <p className="text-xl md:text-2xl text-white/95 mb-8 font-light">
          {venue.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleWhatsApp}
            className="group bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-medium text-lg flex items-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
            WhatsApp ile İletişim
          </button>
          <button
            onClick={handleCall}
            className="group bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-medium text-lg flex items-center gap-3 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <Phone className="w-6 h-6" />
            Hemen Ara
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
