import { redirect } from "next/navigation";

export default function HomePage() {
  // Geçici olarak admin'e yönlendir - landing page'i test etmek için
  // landing page'i aktif etmek için bu satırı kaldır ve alttaki satırı aç
  redirect("/admin");
  
  // Landing page için:
  // return <LandingPage />;
}
