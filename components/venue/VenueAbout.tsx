"use client";
import { VenueWebsite } from "@/lib/types";
import { Users, Award, Star } from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenueAbout({ venue }: Props) {
  return (
    <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-4">
            Biz Kimiz
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4">
            Hakkımızda
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Description */}
          <div className="space-y-6">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {venue.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6">
              <div className="text-center p-3 sm:p-4 bg-white rounded-xl shadow-sm">
                <Award className="w-5 h-5 sm:w-8 sm:h-8 text-rose-600 mx-auto mb-1 sm:mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-gray-900">10+</div>
                <div className="text-xs text-gray-600 leading-tight">Yıl Tecrübe</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-xl shadow-sm">
                <Star className="w-5 h-5 sm:w-8 sm:h-8 text-rose-600 mx-auto mb-1 sm:mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-gray-900">500+</div>
                <div className="text-xs text-gray-600 leading-tight">Mutlu Çift</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-xl shadow-sm">
                <Users className="w-5 h-5 sm:w-8 sm:h-8 text-rose-600 mx-auto mb-1 sm:mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-600 leading-tight">Memnuniyet</div>
              </div>
            </div>
          </div>

          {/* Capacity Card */}
          <div className="relative mt-4 lg:mt-0">
            <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 rounded-3xl p-6 sm:p-10 text-center text-white shadow-2xl">
              <div className="relative z-10">
                <Users className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-4 opacity-90" />
                <h3 className="font-serif text-xl sm:text-3xl mb-3">Salon Kapasitesi</h3>
                <div className="text-5xl sm:text-7xl font-bold mb-3">
                  {venue.capacity.min}-{venue.capacity.max}
                </div>
                <p className="text-lg sm:text-2xl opacity-90">Kişi</p>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-xs sm:text-sm opacity-80">
                    Esnek kapasite seçenekleri ile her büyüklükte organizasyon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
