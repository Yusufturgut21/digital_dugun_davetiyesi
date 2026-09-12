"use client";
import { Heart, Building2, MessageCircle, Mail, MapPin, Clock, Camera, Music } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 via-pink-100/30 to-purple-100/50" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="mb-8">
            <Heart className="w-20 h-20 text-rose-600 mx-auto mb-6 animate-pulse" />
            <h1 className="font-serif text-5xl md:text-7xl text-gray-900 mb-4">
              Sahra Düğün Salonu
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-light mb-8">
              Hayalinizdeki düğün için her şey bir arada
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Dijital Davetiye */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-3xl text-gray-900 mb-3">
                Dijital Davetiye
              </h2>
              <p className="text-gray-600 mb-6">
                Kişiselleştirilmiş, modern ve şık dijital davetiyeler ile sevdiklerinizi davet edin
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Camera className="w-4 h-4" />
                  Galeri
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  Müzik
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Konum
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Geri Sayım
                </span>
              </div>
              <Link
                href="/login"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-medium transition-all"
              >
                Davetiye Oluştur
              </Link>
            </div>

            {/* Düğün Salonu */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-rose-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-3xl text-gray-900 mb-3">
                Düğün Salonu
              </h2>
              <p className="text-gray-600 mb-6">
                Premium düğün salonumuzda unutulmaz bir düğün deneyimi yaşayın
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6 text-sm text-gray-500">
                <span>Modern tasarım</span>
                <span>•</span>
                <span>Geniş kapasite</span>
                <span>•</span>
                <span>Premium hizmet</span>
              </div>
              <Link
                href="/salon/sahra-dugun-salonu"
                className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-8 py-3 rounded-full font-medium transition-all"
              >
                Salon Detayları
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                veya <Link href="/admin/venues" className="underline hover:text-rose-600">Admin Panelden</Link> yeni salon ekleyin
              </p>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-12">
            <a
              href="https://wa.me/905321234567?text=Merhaba, hizmetleriniz hakkında bilgi almak istiyorum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-medium text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp ile İletişim
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
              Neden Bizi Seçmelisiniz?
            </h2>
            <div className="w-24 h-1 bg-rose-500 mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                Modern & Şık Tasarım
              </h3>
              <p className="text-gray-600">
                En güncel tasarım trendleri ile unutulmaz bir düğün deneyimi
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                Kolay İletişim
              </h3>
              <p className="text-gray-600">
                WhatsApp üzerinden 7/24 hızlı ve kolay iletişim
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">
                Kişiselleştirilebilir
              </h3>
              <p className="text-gray-600">
                Tüm detayları istediğiniz gibi özelleştirin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Sahra Düğün Salonu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
