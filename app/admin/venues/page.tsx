"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { VenueWebsite } from "@/lib/types";
import { Building2, Eye, Pencil, Trash2 } from "lucide-react";

export default function VenuesPage() {
  const [venues, setVenues] = useState<VenueWebsite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const data = await apiFetch<VenueWebsite[]>("/api/venues");
      setVenues(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu salonu silmek istediğinizden emin misiniz?")) return;
    
    try {
      await apiFetch(`/api/venues/${id}`, { method: "DELETE" });
      loadVenues();
    } catch (error) {
      console.error(error);
      alert("Silme işlemi başarısız");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(201,168,76,0.4)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-light" style={{ color: "#E8D5A3" }}>Düğün Salonları</h2>
          <p className="font-sans text-sm mt-1" style={{ color: "rgba(201,168,76,0.5)" }}>
            Salon web sitelerini yönetin
          </p>
        </div>
        <Link href="/admin/venues/new" className="admin-btn admin-btn-primary inline-flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Yeni Salon Ekle
        </Link>
      </div>

      {venues.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <Building2 className="w-16 h-16 mx-auto mb-4" style={{ color: "rgba(201,168,76,0.3)" }} />
          <p className="font-sans text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Henüz salon eklenmemiş</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.12)" }}
            >
              <div className="flex-1">
                <h3 className="font-serif text-xl mb-1" style={{ color: "#E8D5A3" }}>
                  {venue.venueName}
                </h3>
                <p className="font-sans text-sm mb-2" style={{ color: "rgba(201,168,76,0.6)" }}>
                  {venue.tagline}
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(201,168,76,0.4)" }}>
                  <span>{venue.city}</span>
                  <span>•</span>
                  <span>{venue.capacity.min}-{venue.capacity.max} kişi</span>
                  <span>•</span>
                  <span className={venue.isActive ? "text-green-500" : "text-red-500"}>
                    {venue.isActive ? "Aktif" : "Pasif"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/salon/${venue.slug}`}
                  target="_blank"
                  className="admin-btn admin-btn-secondary"
                  title="Önizle"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  href={`/admin/venues/${venue.id}`}
                  className="admin-btn admin-btn-secondary"
                  title="Düzenle"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(venue.id)}
                  className="admin-btn admin-btn-secondary text-red-400 hover:text-red-300"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .admin-btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 18px; border-radius: 10px; font-size: 12px; font-family: sans-serif; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .admin-btn-primary { background: linear-gradient(135deg, #C9A84C, #E8D5A3); color: #1a0f08; font-weight: 500; }
        .admin-btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(201,168,76,0.2); color: rgba(201,168,76,0.8); }
        .admin-btn-secondary:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
