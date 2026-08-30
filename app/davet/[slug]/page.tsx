"use client";
import { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "next/navigation";
import { getInvitationBySlug } from "@/lib/store";
import { WeddingInvitation } from "@/lib/types";
import EnvelopeOpening from "@/components/EnvelopeOpening";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingPetals from "@/components/FloatingPetals";
import HeroSection from "@/components/HeroSection";
import MusicPlayer from "@/components/MusicPlayer";
import Link from "next/link";
import SimpleElegantHero from "@/components/themes/SimpleElegantHero";
import IslamicQuoteSection from "@/components/themes/IslamicQuoteSection";

const StorySection = lazy(() => import("@/components/StorySection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));
const WeddingGallerySection = lazy(() => import("@/components/WeddingGallerySection"));
const DetailsSection = lazy(() => import("@/components/DetailsSection"));
const MapSection = lazy(() => import("@/components/MapSection"));
const ProgramSection = lazy(() => import("@/components/ProgramSection"));
const RSVPSection = lazy(() => import("@/components/RSVPSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const SocialSection = lazy(() => import("@/components/SocialSection"));
const Footer = lazy(() => import("@/components/Footer"));

function SectionSkeleton() {
  return (
    <div className="section-gap flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} />
    </div>
  );
}

export default function DavetPage() {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<WeddingInvitation | null | undefined>(undefined);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getInvitationBySlug(slug).then(inv => {
      setInvitation(inv ?? null);
      if (inv) {
        // Sekme başlığını güncelle
        document.title = `${inv.groomName} & ${inv.brideName} | Düğün Davetiyesi`;
        const hasHash = typeof window !== "undefined" && window.location.hash.length > 1;
        if (hasHash) {
          setShowEnvelope(false);
          setMainVisible(true);
        }
      }
    });
  }, [slug]);

  // Hash ile gelinirse, içerik render olduktan sonra ilgili bölüme scroll et
  useEffect(() => {
    if (!mainVisible) return;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash && hash.length > 1) {
      const id = hash.replace("#", "");
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempts < 10) {
          setTimeout(() => tryScroll(attempts + 1), 200);
        }
      };
      setTimeout(() => tryScroll(), 300);
    }
  }, [mainVisible]);

  const handleEnvelopeComplete = () => {
    setShowEnvelope(false);
    setTimeout(() => setMainVisible(true), 100);
  };

  // Loading
  if (invitation === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a06" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  // Not found or inactive
  if (!invitation || !invitation.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6"
        style={{ background: "radial-gradient(ellipse at center, #2a1f14, #0d0805)" }}>
        <div>
          <p className="text-5xl mb-6">💌</p>
          <h1 className="font-serif text-3xl font-light mb-3" style={{ color: "#E8D5A3" }}>
            Davetiye Bulunamadı
          </h1>
          <p className="font-sans text-sm" style={{ color: "rgba(201,168,76,0.5)" }}>
            Bu davetiye mevcut değil veya henüz aktif değil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showEnvelope && (
        <EnvelopeOpening
          onComplete={handleEnvelopeComplete}
          invitation={invitation}
        />
      )}
      {mainVisible && (
        <main>
          <ScrollProgress />
          <FloatingPetals />
          <MusicPlayer invitation={invitation} />

          {/* Theme-based Hero */}
          {invitation.theme === "simple-elegant" ? (
            <SimpleElegantHero invitation={invitation} />
          ) : (
            <HeroSection invitation={invitation} />
          )}

          {/* Islamic Quote for Simple Elegant theme */}
          {invitation.theme === "simple-elegant" && invitation.showIslamicQuote !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <IslamicQuoteSection invitation={invitation} />
            </Suspense>
          )}

          {invitation.showStorySection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <StorySection invitation={invitation} />
            </Suspense>
          )}
          {invitation.showWeddingGallerySection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <WeddingGallerySection />
            </Suspense>
          )}
          {invitation.showGallerySection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <GallerySection invitation={invitation} />
            </Suspense>
          )}
          {invitation.showDetailsSection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <DetailsSection invitation={invitation} />
            </Suspense>
          )}
          {invitation.showMapSection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <MapSection invitation={invitation} />
            </Suspense>
          )}
          {invitation.showProgramSection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <ProgramSection invitation={invitation} />
            </Suspense>
          )}
          {invitation.showRSVPSection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <RSVPSection invitation={invitation} />
            </Suspense>
          )}
          {invitation.showFAQSection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <FAQSection invitation={invitation} />
            </Suspense>
          )}
          {invitation.showSocialSection !== false && (
            <Suspense fallback={<SectionSkeleton />}>
              <SocialSection
                hashtag={invitation.socialHashtag}
                groomName={invitation.groomName}
                brideName={invitation.brideName}
              />
            </Suspense>
          )}
          <Suspense fallback={<div />}>
            <Footer invitation={invitation} />
          </Suspense>
        </main>
      )}
    </>
  );
}
