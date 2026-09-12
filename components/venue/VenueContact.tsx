"use client";
import { VenueWebsite } from "@/lib/types";
import { Phone, MessageCircle, Instagram, Mail } from "lucide-react";

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
    <section className="py-20 px-6 bg-gradient-to-br from-rose-600 to-pink-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl mb-6">
          Hemen İletişime Geçin
        </h2>
        <p className="text-xl text-white/90 mb-10">
          Hayalinizdeki düğün için bizimle iletişime geçin, size özel fiyat teklifi alalım
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={handleWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-medium text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
            WhatsApp ile Yaz
          </button>
          <button
            onClick={handleCall}
            className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-medium text-lg flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-105"
          >
            <Phone className="w-6 h-6" />
            {venue.phone}
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-white/80">
          {venue.email && (
            <a
              href={`mailto:${venue.email}`}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="hidden sm:inline">{venue.email}</span>
            </a>
          )}
          {venue.instagramUrl && (
            <a
              href={venue.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} {venue.venueName}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </section>
  );
}
