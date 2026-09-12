"use client";
import { Heart, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function VenueInvitationPromo() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
            Düğününüz İçin Dijital Davetiye
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Sevdiklerinizle özel anınızı paylaşmak için modern, şık ve kişiselleştirilmiş dijital davetiye hizmetimizden yararlanın.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <Mail className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Kolay Paylaşım</h3>
            <p className="text-gray-600 text-sm">WhatsApp, SMS veya sosyal medyadan kolayca paylaşın</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <MapPin className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Konum & Yol Tarifi</h3>
            <p className="text-gray-600 text-sm">Misafirleriniz tek tıkla konuma ulaşsın</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <Clock className="w-10 h-10 text-rose-600 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Geri Sayım</h3>
            <p className="text-gray-600 text-sm">Düğüne özel geri sayım ile heyecanı artırın</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-10 py-4 rounded-full font-medium text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            Dijital Davetiye Oluştur
          </Link>
          <p className="text-gray-600 text-sm mt-4">
            Özel tasarımlar, fotoğraf galerisi, müzik ve daha fazlası...
          </p>
        </div>
      </div>
    </section>
  );
}
