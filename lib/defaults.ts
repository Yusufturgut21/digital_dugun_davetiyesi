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
  { year: "2025", title: "Düğün", desc: "Ve şimdi, en güzel adımı birlikte atıyoruz.", icon: "♡", side: "right" as const, highlight: true },
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
  theme: "cream-gold",
  isActive: true,
};
