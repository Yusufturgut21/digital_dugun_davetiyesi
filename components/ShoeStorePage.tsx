"use client";
import { useState } from "react";
import {
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Menu,
  X,
  Phone,
  Instagram,
  Facebook,
  Search,
} from "lucide-react";

const NAV_LINKS = ["Koleksiyon", "Kadın", "Erkek", "Çocuk", "İndirim"];

const CATEGORIES = [
  { name: "Kadın", count: "240+ Model", color: "from-rose-900/40 to-rose-950/40", tag: "Yeni Sezon" },
  { name: "Erkek", count: "180+ Model", color: "from-slate-800/40 to-slate-900/40", tag: "Bestseller" },
  { name: "Çocuk", count: "120+ Model", color: "from-amber-900/40 to-amber-950/40", tag: "Rahat & Sağlıklı" },
  { name: "Spor", count: "95+ Model", color: "from-emerald-900/40 to-emerald-950/40", tag: "Yeni Gelenler" },
];

const PRODUCTS = [
  {
    name: "Air Comfort Pro",
    category: "Kadın · Spor",
    price: "₺1.299",
    oldPrice: "₺1.799",
    rating: 4.8,
    reviews: 214,
    badge: "İndirim",
    color: "#e2e8f0",
  },
  {
    name: "Urban Classic",
    category: "Erkek · Günlük",
    price: "₺2.450",
    oldPrice: null,
    rating: 4.9,
    reviews: 128,
    badge: "Yeni",
    color: "#92400e",
  },
  {
    name: "Velvet Heels",
    category: "Kadın · Topuklu",
    price: "₺1.850",
    oldPrice: "₺2.200",
    rating: 4.7,
    reviews: 89,
    badge: "Popüler",
    color: "#1e1b4b",
  },
  {
    name: "Kids Runner",
    category: "Çocuk · Spor",
    price: "₺899",
    oldPrice: null,
    rating: 4.9,
    reviews: 302,
    badge: "Çok Satan",
    color: "#14532d",
  },
];

const FEATURES = [
  { icon: Truck, title: "Ücretsiz Kargo", desc: "400₺ üzeri tüm siparişlerde" },
  { icon: RotateCcw, title: "30 Gün İade", desc: "Koşulsuz iade garantisi" },
  { icon: Shield, title: "Güvenli Ödeme", desc: "256-bit SSL şifreleme" },
  { icon: Star, title: "Orijinal Ürün", desc: "100% orijinallik garantisi" },
];

const TESTIMONIALS = [
  {
    name: "Zeynep K.",
    text: "Kalitesi ve fiyatıyla gerçekten mükemmel. Hızlı kargo, sağlam paketleme. Kesinlikle tavsiye ederim.",
    stars: 5,
    product: "Air Comfort Pro",
  },
  {
    name: "Burak A.",
    text: "Urban Classic aldım, tam beklediğim gibi çıktı. Hem şık hem çok rahat. Tekrar alacağım.",
    stars: 5,
    product: "Urban Classic",
  },
  {
    name: "Elif M.",
    text: "Çocuğum için Kids Runner aldım, çok memnun kaldık. Ayağını sıkmıyor, nefes alıyor.",
    stars: 4,
    product: "Kids Runner",
  },
];

export default function ShoeStorePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-serif text-2xl font-bold accent-gradient">
            StepStyle
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Sepet (0)
            </button>
          </div>

          <button
            className="md:hidden text-neutral-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-neutral-900 border-t border-white/5 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="text-neutral-300 hover:text-white text-sm">
                {link}
              </a>
            ))}
            <button className="btn-primary text-sm flex items-center gap-2 justify-center mt-2">
              <ShoppingBag className="w-4 h-4" />
              Sepet (0)
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        {/* decorative blobs */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge mb-6">Yeni Sezon 2026</span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-6">
              Her Adımda
              <br />
              <span className="accent-gradient">Tarz & Konfor</span>
            </h1>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-md">
              Kadın, erkek ve çocuk koleksiyonlarımızla her ortam için mükemmel ayakkabıyı keşfet.
              Ücretsiz kargo, kolay iade.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#koleksiyon" className="btn-primary flex items-center gap-2">
                Koleksiyonu Keşfet <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#urunler" className="btn-outline">
                Çok Satanlar
              </a>
            </div>
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/5">
              <div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-neutral-500 text-sm">Mutlu Müşteri</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-neutral-500 text-sm">Model</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-neutral-500 text-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Puan
                </div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative flex justify-center items-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/10 flex items-center justify-center">
              <div className="w-52 h-52 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-amber-400/10 to-transparent flex items-center justify-center">
                <span className="font-serif text-8xl">👟</span>
              </div>
            </div>
            {/* floating badge */}
            <div className="absolute top-8 right-8 bg-neutral-800 border border-white/10 rounded-lg p-3 shadow-xl">
              <div className="text-xs text-neutral-400 mb-1">Bu Hafta</div>
              <div className="text-amber-400 font-bold text-sm">%30 İndirim</div>
            </div>
            <div className="absolute bottom-8 left-4 bg-neutral-800 border border-white/10 rounded-lg p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold">4.9/5.0</span>
              </div>
              <div className="text-xs text-neutral-400 mt-1">2.400+ Değerlendirme</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-y border-white/5 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-neutral-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="koleksiyon" className="section-gap">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="badge mb-4">Kategoriler</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Tüm Koleksiyonlar</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href="#"
                className={`relative card p-6 bg-gradient-to-br ${cat.color} group cursor-pointer`}
              >
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">{cat.tag}</span>
                <h3 className="font-serif text-3xl font-bold mt-2 mb-1 group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-neutral-400 text-sm">{cat.count}</p>
                <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-amber-400 mt-4 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="urunler" className="section-gap pt-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge mb-4">Öne Çıkanlar</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold">Çok Satanlar</h2>
            </div>
            <a href="#" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Tümünü Gör <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <div key={product.name} className="card group">
                {/* Product image placeholder */}
                <div
                  className="relative h-52 rounded-t-lg flex items-center justify-center text-5xl"
                  style={{ backgroundColor: product.color + "22", borderBottom: `1px solid ${product.color}22` }}
                >
                  <span>👟</span>
                  <span className="badge absolute top-3 left-3">{product.badge}</span>
                </div>
                <div className="p-5">
                  <div className="text-xs text-neutral-500 mb-1">{product.category}</div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-600"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-neutral-600 text-sm line-through">{product.oldPrice}</span>
                      )}
                    </div>
                    <button className="w-9 h-9 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 flex items-center justify-center transition-colors">
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-950">
              Bu Haftaya Özel %30 İndirim
            </h2>
            <p className="text-neutral-800 mt-2">Seçili modellerde sınırlı süre. Kaçırma.</p>
          </div>
          <a href="#urunler" className="bg-neutral-950 text-white px-8 py-4 rounded-sm font-semibold hover:bg-neutral-800 transition-colors whitespace-nowrap">
            Hemen Alışveriş Yap
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-gap">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="badge mb-4">Yorumlar</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Müşterilerimiz Ne Diyor?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="font-semibold text-white">{t.name}</span>
                  <span className="text-xs text-neutral-500">{t.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl font-bold accent-gradient mb-4">StepStyle</div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              Her adımda tarz ve konfor. Türkiye'nin önde gelen ayakkabı mağazası.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Koleksiyonlar</h4>
            <ul className="space-y-2">
              {["Kadın", "Erkek", "Çocuk", "Spor", "İndirim"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Destek</h4>
            <ul className="space-y-2">
              {["İletişim", "Kargo Takip", "İade & Değişim", "Beden Rehberi", "SSS"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-6 px-6 text-center text-neutral-600 text-sm">
          © {new Date().getFullYear()} StepStyle. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
