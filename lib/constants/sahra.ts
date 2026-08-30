/**
 * Sahra Düğün Salonu — sistem genelinde SABİT konum bilgileri.
 * Çift veya admin panelinden değiştirilemez.
 * Yalnızca geliştirici seviyesinde bu dosyadan güncellenir.
 */
export const SAHRA_VENUE_NAME = "Sahra Düğün Davet ve Balo Salonları";
export const SAHRA_ADDRESS = "Başakşehir, İstanbul";
export const SAHRA_DISTRICT = "Başakşehir";
export const SAHRA_CITY = "İstanbul";

export const SAHRA_MAPS_URL =
  "https://maps.app.goo.gl/8xw16LF6Vx7o4APr9";

export const SAHRA_MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3006.477469905241!2d28.794084200000004!3d41.1022622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caaf6f3b66a051%3A0x6ce4efa7eb30a762!2zU2FocmEgRMO8xJ_DvG4gRGF2ZXQgdmUgQmFsbyBTYWxvbmxhcsSx!5e0!3m2!1str!2str!4v1788038185381!5m2!1str!2str";

/** Davetiye kayıtlarına uygulanacak sabit venue alanları */
export const SAHRA_VENUE_FIELDS = {
  venueName: SAHRA_VENUE_NAME,
  address: SAHRA_ADDRESS,
  district: SAHRA_DISTRICT,
  city: SAHRA_CITY,
  mapUrl: SAHRA_MAPS_URL,
} as const;

/** API'den gelen location alanlarını Sahra sabitleriyle değiştirir */
export function applySahraVenue<T extends Record<string, unknown>>(data: T): T {
  return { ...data, ...SAHRA_VENUE_FIELDS };
}

/** Çift/admin tarafından gönderilen location alanlarını kaldırır */
export function stripLocationFields<T extends Record<string, unknown>>(data: T): Omit<T, "venueName" | "address" | "district" | "city" | "mapUrl"> {
  const { venueName, address, district, city, mapUrl, ...rest } = data;
  void venueName; void address; void district; void city; void mapUrl;
  return rest;
}
