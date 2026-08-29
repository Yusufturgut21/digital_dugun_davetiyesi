import { CreateInvitationInput } from "./types";

export const DEFAULT_INVITATION_TEXT =
  "Bu mutlu günümüzde sizleri de aramızda görmekten büyük mutluluk duyarız.";

export const PRESET_INVITATION_TEXTS = [
  "Bu mutlu günümüzde sizleri de aramızda görmekten büyük mutluluk duyarız.",
  "Düğün törenimize teşrif etmenizi saygıyla rica ederiz.",
  "Hayatımızın en güzel gününde sizleri yanımızda görmek en büyük mutluluğumuz olacaktır.",
  "İki gönlün bir olduğu bu özel günde siz değerli misafirlerimizi aramızda görmek isteriz.",
];

export const DEFAULT_STORY_ITEMS = [
  { year: "2022", title: "İlk Tanışma", desc: "Ortak bir arkadaşın davetinde gözlerimiz ilk kez buluştu.", icon: "✦", side: "left" as const },
  { year: "2023", title: "Söz", desc: "Ailelerimizin huzurunda söz verdik.", icon: "❋", side: "right" as const },
  { year: "2024", title: "Nişan", desc: "Nişan törenimizde halkalarımızı taktık.", icon: "◈", side: "left" as const },
  { year: "2026", title: "Düğün", desc: "Ve şimdi, en güzel adımı birlikte atıyoruz.", icon: "♡", side: "right" as const, highlight: true },
];

export const DEFAULT_FAQ_ITEMS = [
  { q: "Çocuklar davetli mi?", a: "Düğünümüz yetişkinlere özel bir kutlama olarak planlanmıştır. Küçük misafirlerimizin olmamasını rica ediyoruz." },
  { q: "Otopark mevcut mu?", a: "Mekan bünyesinde kapalı otopark bulunmaktadır. Ücretsiz olarak hizmet vermektedir." },
  { q: "Konaklama önerisi var mı?", a: "Mekanın çevresinde birçok butik otel mevcuttur. Özel fiyatlar için bizimle iletişime geçebilirsiniz." },
  { q: "Düğün programı ne zaman başlıyor?", a: "Kapılar 30 dk önce açılacak, tören belirtilen saatte başlayacaktır." },
];

export const DEFAULT_PROGRAM_ITEMS = [
  { time: "14:30", title: "Kapı Açılışı", desc: "Konukların karşılanması ve yerleşimi", icon: "◇" },
  { time: "15:00", title: "Nikah Töreni", desc: "Resmi nikah ve yüzük takma", icon: "♡" },
  { time: "16:30", title: "Kokteyl & Fotoğraf", desc: "Kadeh kaldırma ve anı fotoğrafları", icon: "◈" },
  { time: "18:00", title: "Akşam Yemeği", desc: "Özel menü ile birlikte sofra zevki", icon: "✦" },
  { time: "20:00", title: "Düğün Pastası", desc: "İlk dilim kesme ve kutlama", icon: "❋" },
  { time: "20:30", title: "Müzik & Eğlence", desc: "Canlı müzik ve dans keyfi", icon: "◇" },
];

export const EMPTY_INVITATION: Omit<CreateInvitationInput, "brideName" | "groomName"> = {
  brideSurname: "",
  groomSurname: "",
  conjunction: "&",
  weddingDate: "",
  weddingTime: "15:00",
  venueName: "",
  address: "",
  city: "",
  district: "",
  mapUrl: "",
  invitationText: DEFAULT_INVITATION_TEXT,
  showBesmele: true,
  showAyet: true,
  showHadis: false,
  duaText: "",
  religiousSource: "",
  sealType: "gold-wax",
  sealMonogram: "",
  invitationDesign: "classic",
  coverImage: "",
  galleryImages: [],
  soundEnabled: true,
  soundVolume: 50,
  storyItems: DEFAULT_STORY_ITEMS,
  faqItems: DEFAULT_FAQ_ITEMS,
  programItems: DEFAULT_PROGRAM_ITEMS,
  theme: "cream-gold",
  isActive: true,
};
