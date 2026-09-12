"use client";
import { VenueWebsite } from "@/lib/types";
import { Check, MessageCircle, Sparkles } from "lucide-react";

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
    <section className="py-24 px-6 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-40 left-20 w-96 h-96 bg-rose-500 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-4">
            Paketlerimiz
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4">
            Düğün Paketlerimiz
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            İhtiyaçlarınıza uygun paketlerimizden birini seçin veya özel paket oluşturalım
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {venue.packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                pkg.highlighted
                  ? "bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-2xl scale-105 lg:scale-110 -translate-y-4"
                  : "bg-white border-2 border-gray-200 hover:border-rose-200 hover:shadow-xl"
              }`}
            >
              {/* Popular badge */}
              {pkg.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>En Popüler</span>
                  </div>
                </div>
              )}

              {/* Package name */}
              <h3
                className={`font-serif text-3xl mb-3 ${
                  pkg.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {pkg.name}
              </h3>
              
              {/* Package description */}
              <p
                className={`mb-6 text-sm ${
                  pkg.highlighted ? "text-white/90" : "text-gray-600"
                }`}
              >
                {pkg.description}
              </p>

              {/* Price */}
              {pkg.price && (
                <div className="mb-8">
                  <p
                    className={`text-3xl font-bold ${
                      pkg.highlighted ? "text-white" : "text-rose-600"
                    }`}
                  >
                    {pkg.price}
                  </p>
                </div>
              )}

              {/* Features list */}
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                      pkg.highlighted ? "bg-white/20" : "bg-green-100"
                    }`}>
                      <Check
                        className={`w-4 h-4 ${
                          pkg.highlighted ? "text-white" : "text-green-600"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm leading-relaxed ${
                        pkg.highlighted ? "text-white/95" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={handleWhatsApp}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  pkg.highlighted
                    ? "bg-white text-rose-600 hover:bg-gray-50 shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-700 hover:to-pink-700 shadow-md hover:shadow-lg"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Fiyat Bilgisi Al</span>
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Özel ihtiyaçlarınız için kişiselleştirilmiş paket oluşturabiliriz
          </p>
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Özel Paket İçin İletişime Geç</span>
          </button>
        </div>
      </div>
    </section>
  );
}
