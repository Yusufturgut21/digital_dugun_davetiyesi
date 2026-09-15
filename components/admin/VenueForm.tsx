"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { VenueWebsite, VenueFeature, VenuePackage } from "@/lib/types";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import ImageUpload from "./ImageUpload";
import MultiImageUpload from "./MultiImageUpload";
import VideoUpload from "./VideoUpload";

interface Props {
  venueId?: string;
}

export default function VenueForm({ venueId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [venue, setVenue] = useState<Partial<VenueWebsite>>({
    venueName: "",
    tagline: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    district: "",
    mapUrl: "",
    instagramUrl: "",
    heroImage: "",
    heroVideo: "",
    galleryImages: [],
    realWeddingImages: [],
    capacity: { min: 100, max: 500 },
    features: [],
    packages: [],
    isActive: true,
  });

  useEffect(() => {
    if (venueId) {
      apiFetch<VenueWebsite>(`/api/venues/${venueId}`)
        .then(setVenue)
        .catch(console.error);
    }
  }, [venueId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (venueId) {
        await apiFetch(`/api/venues/${venueId}`, {
          method: "PUT",
          body: JSON.stringify(venue),
        });
      } else {
        await apiFetch("/api/venues", {
          method: "POST",
          body: JSON.stringify(venue),
        });
      }
      router.push("/admin/venues");
    } catch (error) {
      console.error(error);
      alert("Kaydetme işlemi başarısız");
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setVenue({
      ...venue,
      features: [...(venue.features || []), { icon: "Star", title: "", description: "" }],
    });
  };

  const removeFeature = (index: number) => {
    setVenue({
      ...venue,
      features: venue.features?.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, field: keyof VenueFeature, value: string) => {
    const features = [...(venue.features || [])];
    features[index] = { ...features[index], [field]: value };
    setVenue({ ...venue, features });
  };

  const addPackage = () => {
    setVenue({
      ...venue,
      packages: [...(venue.packages || []), { name: "", description: "", price: "", features: [], highlighted: false }],
    });
  };

  const removePackage = (index: number) => {
    setVenue({
      ...venue,
      packages: venue.packages?.filter((_, i) => i !== index),
    });
  };

  const updatePackage = (index: number, field: keyof VenuePackage, value: any) => {
    const packages = [...(venue.packages || [])];
    packages[index] = { ...packages[index], [field]: value };
    setVenue({ ...venue, packages });
  };

  const addPackageFeature = (pkgIndex: number) => {
    const packages = [...(venue.packages || [])];
    packages[pkgIndex].features = [...packages[pkgIndex].features, ""];
    setVenue({ ...venue, packages });
  };

  const updatePackageFeature = (pkgIndex: number, featIndex: number, value: string) => {
    const packages = [...(venue.packages || [])];
    packages[pkgIndex].features[featIndex] = value;
    setVenue({ ...venue, packages });
  };

  const removePackageFeature = (pkgIndex: number, featIndex: number) => {
    const packages = [...(venue.packages || [])];
    packages[pkgIndex].features = packages[pkgIndex].features.filter((_, i) => i !== featIndex);
    setVenue({ ...venue, packages });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/venues" className="admin-btn admin-btn-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h2 className="font-serif text-3xl" style={{ color: "#E8D5A3" }}>
            {venueId ? "Salonu Düzenle" : "Yeni Salon Ekle"}
          </h2>
        </div>
        <button type="submit" disabled={loading} className="admin-btn admin-btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {/* Temel Bilgiler */}
      <div className="admin-card">
        <h3 className="admin-card-title">Temel Bilgiler</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="admin-field">
            <label>Salon Adı *</label>
            <input
              type="text"
              value={venue.venueName}
              onChange={(e) => setVenue({ ...venue, venueName: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label>Slogan / Kısa Tanıtım *</label>
            <input
              type="text"
              value={venue.tagline}
              onChange={(e) => setVenue({ ...venue, tagline: e.target.value })}
              placeholder="Hayalinizdeki düğün burada gerçek oluyor"
              required
            />
          </div>
        </div>
        <div className="admin-field">
          <label>Detaylı Açıklama *</label>
          <textarea
            value={venue.description}
            onChange={(e) => setVenue({ ...venue, description: e.target.value })}
            rows={5}
            required
          />
        </div>
      </div>

      {/* İletişim */}
      <div className="admin-card">
        <h3 className="admin-card-title">İletişim Bilgileri</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="admin-field">
            <label>Telefon *</label>
            <input
              type="tel"
              value={venue.phone}
              onChange={(e) => setVenue({ ...venue, phone: e.target.value })}
              placeholder="0532 123 45 67"
              required
            />
          </div>
          <div className="admin-field">
            <label>WhatsApp *</label>
            <input
              type="tel"
              value={venue.whatsapp}
              onChange={(e) => setVenue({ ...venue, whatsapp: e.target.value })}
              placeholder="905321234567"
              required
            />
          </div>
          <div className="admin-field">
            <label>E-posta</label>
            <input
              type="email"
              value={venue.email}
              onChange={(e) => setVenue({ ...venue, email: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Instagram URL</label>
            <input
              type="url"
              value={venue.instagramUrl}
              onChange={(e) => setVenue({ ...venue, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/salonadi"
            />
          </div>
        </div>
      </div>

      {/* Adres */}
      <div className="admin-card">
        <h3 className="admin-card-title">Adres & Konum</h3>
        <div className="admin-field">
          <label>Adres *</label>
          <textarea
            value={venue.address}
            onChange={(e) => setVenue({ ...venue, address: e.target.value })}
            rows={2}
            required
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="admin-field">
            <label>İlçe</label>
            <input
              type="text"
              value={venue.district}
              onChange={(e) => setVenue({ ...venue, district: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>İl *</label>
            <input
              type="text"
              value={venue.city}
              onChange={(e) => setVenue({ ...venue, city: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="admin-field">
          <label>Google Maps URL</label>
          <input
            type="url"
            value={venue.mapUrl}
            onChange={(e) => setVenue({ ...venue, mapUrl: e.target.value })}
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      {/* Görseller */}
      <div className="admin-card">
        <h3 className="admin-card-title">Görseller</h3>
        
        <ImageUpload
          label="Ana Görsel (Hero)"
          value={venue.heroImage}
          onChange={(value) => setVenue({ ...venue, heroImage: value })}
          maxWidth={1920}
          quality={0.85}
        />

        <div className="admin-field mt-6">
          <VideoUpload
            label="Hero Video (Telefon veya Bilgisayardan)"
            value={venue.heroVideo}
            onChange={(url) => setVenue({ ...venue, heroVideo: url })}
          />
        </div>

        <div className="mt-6">
          <MultiImageUpload
            label="Salon Galerisi"
            images={venue.galleryImages || []}
            onChange={(images) => setVenue({ ...venue, galleryImages: images })}
            maxImages={20}
          />
        </div>

        <div className="mt-6">
          <MultiImageUpload
            label="Gerçek Düğün Görselleri"
            images={venue.realWeddingImages || []}
            onChange={(images) => setVenue({ ...venue, realWeddingImages: images })}
            maxImages={20}
          />
        </div>
      </div>

      {/* Kapasite */}
      <div className="admin-card">
        <h3 className="admin-card-title">Kapasite</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="admin-field">
            <label>Minimum Kişi *</label>
            <input
              type="number"
              value={venue.capacity?.min}
              onChange={(e) => setVenue({ ...venue, capacity: { ...venue.capacity!, min: Number(e.target.value) } })}
              required
            />
          </div>
          <div className="admin-field">
            <label>Maksimum Kişi *</label>
            <input
              type="number"
              value={venue.capacity?.max}
              onChange={(e) => setVenue({ ...venue, capacity: { ...venue.capacity!, max: Number(e.target.value) } })}
              required
            />
          </div>
        </div>
      </div>

      {/* Özellikler */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="admin-card-title mb-0">Özellikler</h3>
          <button type="button" onClick={addFeature} className="admin-btn admin-btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Özellik Ekle
          </button>
        </div>
        <div className="space-y-4">
          {venue.features?.map((feature, idx) => (
            <div key={idx} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>Özellik #{idx + 1}</span>
                <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid gap-3">
                <div className="admin-field">
                  <label>İkon (Lucide ikon adı)</label>
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => updateFeature(idx, "icon", e.target.value)}
                    placeholder="Star, Heart, Music, vb."
                  />
                </div>
                <div className="admin-field">
                  <label>Başlık</label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => updateFeature(idx, "title", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Açıklama</label>
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(e) => updateFeature(idx, "description", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paketler */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="admin-card-title mb-0">Düğün Paketleri</h3>
          <button type="button" onClick={addPackage} className="admin-btn admin-btn-secondary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Paket Ekle
          </button>
        </div>
        <div className="space-y-6">
          {venue.packages?.map((pkg, pkgIdx) => (
            <div key={pkgIdx} className="p-4 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm" style={{ color: "rgba(201,168,76,0.6)" }}>Paket #{pkgIdx + 1}</span>
                <button type="button" onClick={() => removePackage(pkgIdx)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid gap-3">
                <div className="admin-field">
                  <label>Paket Adı</label>
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => updatePackage(pkgIdx, "name", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Açıklama</label>
                  <input
                    type="text"
                    value={pkg.description}
                    onChange={(e) => updatePackage(pkgIdx, "description", e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Fiyat (Opsiyonel)</label>
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => updatePackage(pkgIdx, "price", e.target.value)}
                    placeholder="Örn: ₺50.000"
                  />
                </div>
                <div className="admin-field">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={pkg.highlighted}
                      onChange={(e) => updatePackage(pkgIdx, "highlighted", e.target.checked)}
                    />
                    Öne Çıkan Paket
                  </label>
                </div>
                <div className="admin-field">
                  <div className="flex items-center justify-between mb-2">
                    <label className="mb-0">Özellikler</label>
                    <button
                      type="button"
                      onClick={() => addPackageFeature(pkgIdx)}
                      className="text-xs admin-btn admin-btn-secondary"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pkg.features.map((feat, featIdx) => (
                      <div key={featIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => updatePackageFeature(pkgIdx, featIdx, e.target.value)}
                          placeholder="Özellik"
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removePackageFeature(pkgIdx, featIdx)}
                          className="text-red-400 hover:text-red-300 px-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Durum */}
      <div className="admin-card">
        <h3 className="admin-card-title">Durum</h3>
        <label className="flex items-center gap-2" style={{ color: "rgba(201,168,76,0.8)" }}>
          <input
            type="checkbox"
            checked={venue.isActive}
            onChange={(e) => setVenue({ ...venue, isActive: e.target.checked })}
          />
          Aktif
        </label>
      </div>

      <style jsx global>{`
        .admin-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(201,168,76,0.12); border-radius: 16px; padding: 24px; }
        .admin-card-title { font-family: serif; font-size: 20px; color: #E8D5A3; margin-bottom: 16px; }
        .admin-field { display: flex; flex-direction: column; gap: 8px; }
        .admin-field label { font-size: 12px; color: rgba(201,168,76,0.7); letter-spacing: 0.05em; text-transform: uppercase; }
        .admin-field input, .admin-field textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(201,168,76,0.2); border-radius: 8px; padding: 10px 14px; color: rgba(232,213,163,0.9); font-size: 14px; font-family: sans-serif; }
        .admin-field input:focus, .admin-field textarea:focus { outline: none; border-color: rgba(201,168,76,0.5); background: rgba(255,255,255,0.08); }
        .admin-btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 18px; border-radius: 10px; font-size: 12px; font-family: sans-serif; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .admin-btn-primary { background: linear-gradient(135deg, #C9A84C, #E8D5A3); color: #1a0f08; font-weight: 500; }
        .admin-btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(201,168,76,0.2); color: rgba(201,168,76,0.8); }
        .admin-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </form>
  );
}
