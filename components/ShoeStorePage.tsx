"use client";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingBag, Star, Truck, RotateCcw, Shield, ChevronRight,
  Menu, X, Search, Heart, ArrowRight, Instagram, Phone, Mail,
  ChevronLeft, Zap,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Yeni Gelenler", href: "#new" },
  { label: "Kadın", href: "#kadin" },
  { label: "Erkek", href: "#erkek" },
  { label: "Çocuk", href: "#cocuk" },
  { label: "İndirim", href: "#indirim" },
];

const HERO_SLIDES = [
  {
    title: "Yeni Sezon",
    subtitle: "2026 Koleksiyonu",
    desc: "Her adımda fark yarat. Premium ayakkabı koleksiyonumuz şimdi mağazamızda.",
    cta: "Koleksiyonu Keşfet",
    badge: "Yeni Sezon",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    accent: "#E8C547",
  },
  {
    title: "Spor & Konfor",
    subtitle: "Running Serisi",
    desc: "Performansını maksimuma çıkar. Hafif, hızlı, dayanıklı.",
    cta: "Spor Modelleri",
    badge: "%30 İndirim",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
    accent: "#60a5fa",
  },
  {
    title: "Klasik Şıklık",
    subtitle: "Premium Deri",
    desc: "Zamansız tasarımlar, üstün deri kalitesi. İş ve özel günler için.",
    cta: "Klasik Modeller",
    badge: "Özel Üretim",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80",
    accent: "#a78bfa",
  },
];

const CATEGORIES = [
  {
    name: "Kadın",
    desc: "240+ model",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    tag: "Yeni Sezon",
  },
  {
    name: "Erkek",
    desc: "180+ model",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    tag: "Bestseller",
  },
  {
    name: "Çocuk",
    desc: "120+ model",
    image: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=600&q=80",
    tag: "Rahat & Sağlıklı",
  },
  {
    name: "Spor",
    desc: "95+ model",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    tag: "Yeni Gelenler",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "AirRun Pro X",
    brand: "Kuruay",
    category: "Spor",
    price: 1299,
    oldPrice: 1799,
    rating: 4.8,
    reviews: 214,
    badge: "İndirim",
    badgeColor: "#f87171",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    colors: ["#e2e8f0", "#1e293b", "#dc2626"],
  },
  {
    id: 2,
    name: "Urban Classic Leather",
    brand: "Kuruay",
    category: "Erkek",
    price: 2450,
    oldPrice: null,
    rating: 4.9,
    reviews: 128,
    badge: "Yeni",
    badgeColor: "#4ade80",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80",
    colors: ["#92400e", "#1e293b", "#f5f5f5"],
  },
  {
    id: 3,
    name: "Velvet Heels",
    brand: "Kuruay",
    category: "Kadın",
    price: 1850,
    oldPrice: 2200,
    rating: 4.7,
    reviews: 89,
    badge: "Popüler",
    badgeColor: "#a78bfa",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
    colors: ["#1e1b4b", "#be185d", "#f5f5f5"],
  },
  {
    id: 4,
    name: "Kids FlexRun",
    brand: "Kuruay",
    category: "Çocuk",
    price: 899,
    oldPrice: null,
    rating: 4.9,
    reviews: 302,
    badge: "Çok Satan",
    badgeColor: "#E8C547",
    image: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=400&q=80",
    colors: ["#14532d", "#1d4ed8", "#dc2626"],
  },
  {
    id: 5,
    name: "Trail Blazer GTX",
    brand: "Kuruay",
    category: "Spor",
    price: 3200,
    oldPrice: 3800,
    rating: 4.8,
    reviews: 156,
    badge: "İndirim",
    badgeColor: "#f87171",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&q=80",
    colors: ["#064e3b", "#1e293b", "#f59e0b"],
  },
  {
    id: 6,
    name: "Monaco Slip-On",
    brand: "Kuruay",
    category: "Kadın",
    price: 1650,
    oldPrice: null,
    rating: 4.6,
    reviews: 73,
    badge: "Yeni",
    badgeColor: "#4ade80",
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400&q=80",
    colors: ["#fde68a", "#f5f5f5", "#1e293b"],
  },
  {
    id: 7,
    name: "Oxford Business",
    brand: "Kuruay",
    category: "Erkek",
    price: 2890,
    oldPrice: 3400,
    rating: 4.9,
    reviews: 201,
    badge: "Premium",
    badgeColor: "#E8C547",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400&q=80",
    colors: ["#1e293b", "#92400e", "#f5f5f5"],
  },
  {
    id: 8,
    name: "Boost Light 3.0",
    brand: "Kuruay",
    category: "Spor",
    price: 1099,
    oldPrice: 1299,
    rating: 4.7,
    reviews: 445,
    badge: "İndirim",
    badgeColor: "#f87171",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80",
    colors: ["#f5f5f5", "#1d4ed8", "#dc2626"],
  },
];

const TESTIMONIALS = [
  {
    name: "Zeynep K.",
    role: "Müşteri",
    text: "AirRun Pro X aldım, inanılmaz rahat. Hızlı kargo, sağlam paketleme. Kesinlikle tavsiye ederim.",
    stars: 5,
    product: "AirRun Pro X",
    avatar: "Z",
  },
  {
    name: "Burak A.",
    role: "Müşteri",
    text: "Urban Classic'i aldım, tam beklediğim gibi çıktı. Hem şık hem çok rahat. Tekrar alacağım.",
    stars: 5,
    product: "Urban Classic",
    avatar: "B",
  },
  {
    name: "Elif M.",
    role: "Müşteri",
    text: "Çocuğum için Kids FlexRun aldım, çok memnun kaldık. Ayağını sıkmıyor, nefes alıyor.",
    stars: 5,
    product: "Kids FlexRun",
    avatar: "E",
  },
];

const BRANDS = ["Nike", "Adidas", "New Balance", "Puma", "Reebok", "Converse", "Vans", "Skechers"];

const FEATURES = [
  { icon: Truck, title: "Ücretsiz Kargo", desc: "400₺ üzeri siparişlerde" },
  { icon: RotateCcw, title: "30 Gün İade", desc: "Koşulsuz iade garantisi" },
  { icon: Shield, title: "Orijinal Ürün", desc: "100% orijinallik garantisi" },
  { icon: Zap, title: "Hızlı Teslimat", desc: "1-2 iş günü kargo" },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ShoeStorePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance hero
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goSlide = (i: number) => {
    setHeroSlide(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
  };

  const toggleWishlist = (id: number) =>
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);

  const filteredProducts =
    activeCategory === "Tümü"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const slide = HERO_SLIDES[heroSlide];

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans">

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-neutral-950/95 backdrop-blur-md border-b border-white/5 shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#E8C547,#f5e070)" }}>
              <ShoppingBag className="w-4 h-4 text-neutral-950" />
            </div>
            <span className="font-serif text-xl font-bold">
              <span style={{ color: "#E8C547" }}>Kuruay</span>
              <span className="text-white/80 font-light ml-1 text-base">Mağaza</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-neutral-400 hover:text-white transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartCount((c) => c + 0)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "#E8C547", color: "#0f0f0f" }}
            >
              <ShoppingBag className="w-4 h-4" />
              Sepet
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <button className="lg:hidden text-neutral-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-neutral-900 border-t border-white/5 px-6 py-5 space-y-4">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="block text-neutral-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/5 flex gap-3">
              <button className="flex-1 py-2.5 rounded-lg border border-neutral-700 text-sm text-neutral-400 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Ara
              </button>
              <button className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2" style={{ background: "#E8C547", color: "#0f0f0f" }}>
                <ShoppingBag className="w-4 h-4" /> Sepet
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO SLIDER ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0 transition-all duration-1000">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt="hero"
            className="w-full h-full object-cover opacity-25 scale-105 transition-all duration-1000"
            style={{ filter: "blur(2px)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        </div>

        {/* Animated accent blob */}
        <div
          className="absolute right-0 top-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 transition-colors duration-1000 pointer-events-none"
          style={{ background: slide.accent }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
              style={{ background: slide.accent + "20", color: slide.accent, border: `1px solid ${slide.accent}40` }}
            >
              <Zap className="w-3 h-3" />
              {slide.badge}
            </div>

            <h1 className="font-serif font-bold leading-tight mb-3" style={{ fontSize: "clamp(3rem,8vw,5.5rem)" }}>
              {slide.title}
            </h1>
            <p className="text-2xl font-light mb-4" style={{ color: slide.accent }}>
              {slide.subtitle}
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10 max-w-lg">
              {slide.desc}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="group flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: "#E8C547", color: "#0f0f0f" }}
              >
                {slide.cta}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#categories"
                className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm border border-white/10 text-white hover:border-white/30 transition-all"
              >
                Kategoriler
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/5">
              <div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-neutral-500 text-xs mt-0.5">Mutlu Müşteri</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-neutral-500 text-xs mt-0.5">Model Çeşidi</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <div>
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <div className="text-neutral-500 text-xs mt-0.5">Ortalama Puan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero product image */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div
                className="w-80 h-80 rounded-full flex items-center justify-center transition-colors duration-1000"
                style={{ background: `radial-gradient(circle, ${slide.accent}15 0%, transparent 70%)`, border: `1px solid ${slide.accent}20` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt="featured shoe"
                  className="w-64 h-64 object-cover rounded-full shadow-2xl transition-all duration-700"
                  style={{ boxShadow: `0 0 80px ${slide.accent}30` }}
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -right-4 bg-neutral-800/90 backdrop-blur rounded-xl p-4 border border-white/10 shadow-xl">
                <div className="text-xs text-neutral-400 mb-1">Bu Hafta</div>
                <div className="font-bold text-lg" style={{ color: "#E8C547" }}>%30 İndirim</div>
                <div className="text-xs text-neutral-500">Seçili modellerde</div>
              </div>
              <div className="absolute -top-4 -left-4 bg-neutral-800/90 backdrop-blur rounded-xl p-3 border border-white/10 shadow-xl flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <div>
                  <div className="text-sm font-bold text-white">4.9 / 5</div>
                  <div className="text-xs text-neutral-500">2.4K yorum</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
          <button onClick={() => goSlide((heroSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goSlide(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === heroSlide ? 24 : 8,
                  height: 8,
                  background: i === heroSlide ? "#E8C547" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
          <button onClick={() => goSlide((heroSlide + 1) % HERO_SLIDES.length)} className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="border-y border-white/5 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
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

      {/* ── CATEGORIES ── */}
      <section id="categories" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Kategoriler</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Koleksiyonlar</h2>
            </div>
            <a href="#products" className="hidden md:flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors">
              Tüm Ürünler <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
                style={{ aspectRatio: "3/4" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 transition-colors duration-300" />

                {/* Tag */}
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 backdrop-blur-sm border border-amber-400/20">
                  {cat.tag}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-2xl font-bold text-white mb-1">{cat.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300">{cat.desc}</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-amber-400 transition-colors duration-300 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white group-hover:text-neutral-950" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Öne Çıkanlar</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Çok Satanlar</h2>
            </div>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {["Tümü", "Kadın", "Erkek", "Çocuk", "Spor"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: activeCategory === cat ? "#E8C547" : "rgba(255,255,255,0.05)",
                    color: activeCategory === cat ? "#0f0f0f" : "rgba(255,255,255,0.5)",
                    border: `1px solid ${activeCategory === cat ? "transparent" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Badge */}
                  <span
                    className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: product.badgeColor + "25", color: product.badgeColor, border: `1px solid ${product.badgeColor}40` }}
                  >
                    {product.badge}
                  </span>

                  {/* Wishlist */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-neutral-900/80 backdrop-blur flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Heart
                      className="w-4 h-4 transition-colors"
                      style={{ color: wishlist.includes(product.id) ? "#f87171" : "rgba(255,255,255,0.5)", fill: wishlist.includes(product.id) ? "#f87171" : "none" }}
                    />
                  </button>

                  {/* Quick add */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={() => setCartCount((c) => c + 1)}
                      className="w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-opacity"
                      style={{ background: "#E8C547", color: "#0f0f0f" }}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Sepete Ekle
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="text-xs text-neutral-500 mb-1">{product.brand} · {product.category}</div>
                  <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Stars */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3"
                          style={{
                            fill: i < Math.floor(product.rating) ? "#fbbf24" : "none",
                            color: i < Math.floor(product.rating) ? "#fbbf24" : "#404040",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">({product.reviews})</span>
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-1.5 mb-3">
                    {product.colors.map((c) => (
                      <div key={c} className="w-3.5 h-3.5 rounded-full border border-white/10 cursor-pointer hover:scale-125 transition-transform" style={{ background: c }} />
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-white">{product.price.toLocaleString("tr-TR")} ₺</span>
                      {product.oldPrice && (
                        <span className="text-xs text-neutral-600 line-through">{product.oldPrice.toLocaleString("tr-TR")} ₺</span>
                      )}
                    </div>
                    {product.oldPrice && (
                      <span className="text-xs font-bold text-red-400">
                        -%{Math.round((1 - product.price / product.oldPrice) * 100)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm border border-white/10 text-white hover:border-amber-400/40 hover:text-amber-400 transition-all"
            >
              Tüm Ürünleri Gör
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section className="mx-6 mb-24 rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1556906781-9a414e2a9c86?w=1200&q=80" alt="promo" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-block bg-amber-400/20 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Sınırlı Süre
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-3">
              Bu Haftaya Özel<br />
              <span style={{ color: "#E8C547" }}>%30 İndirim</span>
            </h2>
            <p className="text-neutral-300 max-w-md">
              Seçili tüm spor modellerinde geçerli. Kampanya 7 Aralık'ta sona eriyor.
            </p>
          </div>
          <a
            href="#products"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: "#E8C547", color: "#0f0f0f" }}
          >
            Hemen Alışveriş Yap
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-neutral-600 mb-8">
            Stokta Bulunan Markalar
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {BRANDS.map((brand) => (
              <span key={brand} className="text-neutral-600 font-bold text-lg hover:text-neutral-300 transition-colors cursor-pointer">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="pb-24 px-6 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto py-24">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Yorumlar</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Müşterilerimiz Ne Diyor?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-7 flex flex-col gap-5 transition-all hover:-translate-y-1 duration-300"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-neutral-500">{t.role}</div>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-600">{t.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="px-6 pb-24">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center"
          style={{ background: "linear-gradient(135deg, #1a1a1a, #111)", border: "1px solid rgba(232,197,71,0.15)" }}
        >
          <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "rgba(232,197,71,0.1)" }}>
            <Mail className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mb-3">Fırsatları Kaçırma</h2>
          <p className="text-neutral-400 mb-8">
            Yeni koleksiyonlar ve özel indirimlerden ilk sen haberdar ol.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresin"
              className="flex-1 px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-600 text-sm outline-none focus:border-amber-500 transition-colors"
            />
            <button
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 whitespace-nowrap"
              style={{ background: "#E8C547", color: "#0f0f0f" }}
            >
              Abone Ol
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#E8C547,#f5e070)" }}>
                <ShoppingBag className="w-4 h-4 text-neutral-950" />
              </div>
              <span className="font-serif text-xl font-bold">
                <span style={{ color: "#E8C547" }}>Kuruay</span>
                <span className="text-white/60 font-light ml-1">Mağaza</span>
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mb-6">
              Her adımda tarz ve konfor. Türkiye'nin önde gelen premium ayakkabı mağazası.
            </p>
            <div className="flex gap-3">
              {[Instagram, Phone, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Koleksiyonlar</h4>
            <ul className="space-y-2.5">
              {["Kadın", "Erkek", "Çocuk", "Spor", "Klasik", "İndirim"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Destek</h4>
            <ul className="space-y-2.5">
              {["İletişim", "Kargo Takip", "İade & Değişim", "Beden Rehberi", "SSS", "Hakkımızda"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-500 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 py-6 px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-neutral-600">
          <span>© {new Date().getFullYear()} Kuruay Mağaza. Tüm hakları saklıdır.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-neutral-400 transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">Kullanım Koşulları</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
