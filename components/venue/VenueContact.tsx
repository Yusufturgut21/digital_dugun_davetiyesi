"use client";
import { VenueWebsite } from "@/lib/types";
import { Phone, MessageCircle, Instagram, Mail, MapPin } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenueContact({ venue }: Props) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Merhaba, ${venue.venueName} hakkında bilgi almak istiyorum.`);
    window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.location.href = `tel:${venue.phone}`;
  };

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-rose-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-4">
            İletişim
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
            Hemen İletişime Geçin
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Hayalinizdeki düğün için bizimle iletişime geçin, size özel fiyat teklifi alalım
          </p>
        </div>

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={handleWhatsApp}
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-10 py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl hover:shadow-green-500/50 hover:scale-105 transform"
          >
            <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>WhatsApp ile Yaz</span>
          </button>
          <button
            onClick={handleCall}
            className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 px-10 py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 transform"
          >
            <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>{venue.phone}</span>
          </button>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Phone */}
          <a
            href={`tel:${venue.phone}`}
            className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <Phone className="w-8 h-8 text-rose-400 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-sm text-white/60 mb-1">Telefon</div>
            <div className="font-semibold">{venue.phone}</div>
          </a>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-left"
          >
            <MessageCircle className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <div className="text-sm text-white/60 mb-1">WhatsApp</div>
            <div className="font-semibold">{venue.phone}</div>
          </button>

          {/* Email */}
          {venue.email && (
            <a
              href={`mailto:${venue.email}`}
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <Mail className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-sm text-white/60 mb-1">E-posta</div>
              <div className="font-semibold text-sm">{venue.email}</div>
            </a>
          )}

          {/* Instagram */}
          {venue.instagramUrl && (
            <a
              href={venue.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <Instagram className="w-8 h-8 text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-sm text-white/60 mb-1">Instagram</div>
              <div className="font-semibold">@{venue.instagramUrl.split('/').pop()}</div>
            </a>
          )}
        </div>

        {/* Address */}
        <div className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
          <MapPin className="w-10 h-10 text-rose-400 mx-auto mb-4" />
          <h3 className="font-semibold text-xl mb-2">Adres</h3>
          <p className="text-white/80 text-lg">
            {venue.address}
            {venue.district && `, ${venue.district}`}
            {venue.city && `, ${venue.city}`}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} {venue.venueName}. Tüm hakları saklıdır.</p>
          <p className="mt-2">Powered by Digital Wedding Platform</p>
        </div>
      </div>
    </section>
  );
}
