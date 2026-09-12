"use client";
import { VenueWebsite } from "@/lib/types";
import { Check, MessageCircle } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenuePackages({ venue }: Props) {
  if (!venue.packages || venue.packages.length === 0) return null;

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Merhaba, paketleriniz hakkında bilgi almak istiyorum.`);
    window.open(`https://wa.me/${venue.whatsapp.replace(/\D/g, "")}?text=${message}`, "_blank");
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
            Düğün Paketlerimiz
          </h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venue.packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 ${
                pkg.highlighted
                  ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-2xl scale-105"
                  : "bg-white border-2 border-gray-200"
              }`}
            >
              <h3
                className={`font-serif text-2xl mb-2 ${
                  pkg.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {pkg.name}
              </h3>
              <p
                className={`mb-4 ${
                  pkg.highlighted ? "text-white/90" : "text-gray-600"
                }`}
              >
                {pkg.description}
              </p>

              {pkg.price && (
                <div className="mb-6">
                  <p
                    className={`text-3xl font-bold ${
                      pkg.highlighted ? "text-white" : "text-rose-600"
                    }`}
                  >
                    {pkg.price}
                  </p>
                </div>
              )}

              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        pkg.highlighted ? "text-white" : "text-green-600"
                      }`}
                    />
                    <span
                      className={pkg.highlighted ? "text-white/95" : "text-gray-700"}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleWhatsApp}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  pkg.highlighted
                    ? "bg-white text-rose-600 hover:bg-gray-50"
                    : "bg-rose-600 text-white hover:bg-rose-700"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Fiyat Bilgisi Al
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
