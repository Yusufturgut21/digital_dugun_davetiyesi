"use client";
import { VenueWebsite } from "@/lib/types";
import * as LucideIcons from "lucide-react";

interface Props {
  venue: VenueWebsite;
}

export default function VenueFeatures({ venue }: Props) {
  if (!venue.features || venue.features.length === 0) return null;

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Star;
    return <Icon className="w-12 h-12 text-rose-600" />;
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
            Özelliklerimiz
          </h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venue.features.map((feature, idx) => (
            <div
              key={idx}
              className="text-center p-6 rounded-xl hover:bg-rose-50 transition-colors duration-300"
            >
              <div className="mb-4 flex justify-center">{getIcon(feature.icon)}</div>
              <h3 className="font-semibold text-xl text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
