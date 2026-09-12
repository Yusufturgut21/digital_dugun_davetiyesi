"use client";
import { useState } from "react";
import { Heart, Mail, MapPin, Clock, MessageCircle, X } from "lucide-react";

export default function VenueInvitationPromo() {
  const [showModal, setShowModal] = useState(false);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Merhaba, dijital davetiye hizmetiniz hakkında bilgi almak istiyorum."
    );
    window.open(`https://wa.me/905321234567?text=${message}`, "_blank");
    setShowModal(false);
  };

  return (
    <>
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-rose-600 mx-auto mb-4" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
              Düğününüz İçin Dijital Davetiye
            </h2>
            <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
              Sevdiklerinizle özel anınızı paylaşmak için modern, şık ve kişiselleştirilmiş dijital davetiye hizmetimizden yararlanın.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
            <div className="bg-white rounded-xl p-5 sm:p-6 text-center shadow-sm">
              <Mail className="w-9 h-9 sm:w-10 sm:h-10 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">Kolay Paylaşım</h3>
              <p className="text-gray-600 text-sm">WhatsApp, SMS veya sosyal medyadan kolayca paylaşın</p>
            </div>
            <div className="bg-white rounded-xl p-5 sm:p-6 text-center shadow-sm">
              <MapPin className="w-9 h-9 sm:w-10 sm:h-10 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">Konum & Yol Tarifi</h3>
              <p className="text-gray-600 text-sm">Misafirleriniz tek tıkla konuma ulaşsın</p>
            </div>
            <div className="bg-white rounded-xl p-5 sm:p-6 text-center shadow-sm">
              <Clock className="w-9 h-9 sm:w-10 sm:h-10 text-rose-600 mx-auto mb-3" />
              <h3 className="font-semibold text-base sm:text-lg mb-2">Geri Sayım</h3>
              <p className="text-gray-600 text-sm">Düğüne özel geri sayım ile heyecanı artırın</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 sm:px-10 py-4 rounded-full font-medium text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Heart className="w-5 h-5" />
              Dijital Davetiye İçin Başvurun
            </button>
            <p className="text-gray-600 text-sm mt-4">
              Özel tasarımlar, fotoğraf galerisi, müzik ve daha fazlası...
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-serif text-2xl text-gray-900 mb-2">Başvuru</h3>
              <p className="text-gray-600 text-sm">
                Dijital davetiye hizmetimiz hakkında bilgi almak için WhatsApp üzerinden bize ulaşın.
              </p>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp&apos;tan Yaz
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              WhatsApp uygulaması açılacak
            </p>
          </div>
        </div>
      )}
    </>
  );
}
