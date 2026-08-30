"use client";
import { motion } from "framer-motion";
import { WeddingInvitation } from "@/lib/types";

interface Props {
  invitation: WeddingInvitation;
}

export default function IslamicQuoteSection({ invitation }: Props) {
  const { showIslamicQuote, islamicQuoteArabic, islamicQuoteTurkish, islamicQuoteSource } = invitation;

  if (!showIslamicQuote || !islamicQuoteArabic) return null;

  return (
    <section className="section-gap relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #FAF8F5 0%, #F5F3EE 50%, #FAF8F5 100%)" }} />

      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L30 10 L20 20 L10 10 Z' fill='%234A5D3F'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Decorative card with Islamic geometric border */}
          <div 
            className="relative rounded-2xl p-8 sm:p-12"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(245,243,238,0.9))",
              border: "1px solid rgba(74,93,63,0.15)",
              boxShadow: "0 8px 32px rgba(74,93,63,0.08)"
            }}
          >
            {/* Corner ornaments */}
            <svg className="absolute top-4 left-4 w-8 h-8 opacity-20" viewBox="0 0 32 32" fill="none">
              <path d="M0 0 L16 0 L16 1 L1 1 L1 16 L0 16 Z" fill="#4A5D3F"/>
              <path d="M4 4 L12 4 L12 5 L5 5 L5 12 L4 12 Z" fill="#4A5D3F"/>
            </svg>
            <svg className="absolute top-4 right-4 w-8 h-8 opacity-20" viewBox="0 0 32 32" fill="none">
              <path d="M32 0 L16 0 L16 1 L31 1 L31 16 L32 16 Z" fill="#4A5D3F"/>
              <path d="M28 4 L20 4 L20 5 L27 5 L27 12 L28 12 Z" fill="#4A5D3F"/>
            </svg>
            <svg className="absolute bottom-4 left-4 w-8 h-8 opacity-20" viewBox="0 0 32 32" fill="none">
              <path d="M0 32 L16 32 L16 31 L1 31 L1 16 L0 16 Z" fill="#4A5D3F"/>
              <path d="M4 28 L12 28 L12 27 L5 27 L5 20 L4 20 Z" fill="#4A5D3F"/>
            </svg>
            <svg className="absolute bottom-4 right-4 w-8 h-8 opacity-20" viewBox="0 0 32 32" fill="none">
              <path d="M32 32 L16 32 L16 31 L31 31 L31 16 L32 16 Z" fill="#4A5D3F"/>
              <path d="M28 28 L20 28 L20 27 L27 27 L27 20 L28 20 Z" fill="#4A5D3F"/>
            </svg>

            {/* Top decorative element */}
            <div className="flex justify-center mb-6">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                <circle cx="30" cy="10" r="3" fill="#9A7B2F" opacity="0.4"/>
                <circle cx="15" cy="10" r="2" fill="#9A7B2F" opacity="0.3"/>
                <circle cx="45" cy="10" r="2" fill="#9A7B2F" opacity="0.3"/>
                <line x1="0" y1="10" x2="10" y2="10" stroke="#9A7B2F" strokeWidth="1" opacity="0.3"/>
                <line x1="50" y1="10" x2="60" y2="10" stroke="#9A7B2F" strokeWidth="1" opacity="0.3"/>
              </svg>
            </div>

            {/* Arabic Text */}
            <p
              className="font-serif text-xl sm:text-2xl md:text-3xl text-center leading-relaxed mb-6"
              style={{
                color: "#2C3E2F",
                direction: "rtl",
                fontFamily: "'Amiri', 'Scheherazade New', serif",
                fontWeight: 400,
                letterSpacing: "0.02em"
              }}
            >
              {islamicQuoteArabic}
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 my-6">
              <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, #9A7B2F)" }} />
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2" fill="#9A7B2F" opacity="0.5"/>
              </svg>
              <div className="h-px w-12" style={{ background: "linear-gradient(90deg, #9A7B2F, transparent)" }} />
            </div>

            {/* Turkish Translation */}
            <p
              className="font-sans text-base sm:text-lg text-center leading-relaxed mb-4"
              style={{ color: "#5C6F5D", fontWeight: 300 }}
            >
              {islamicQuoteTurkish}
            </p>

            {/* Source */}
            {islamicQuoteSource && (
              <p
                className="font-sans text-xs sm:text-sm text-center tracking-wider uppercase"
                style={{ color: "#9A7B2F", opacity: 0.7 }}
              >
                {islamicQuoteSource}
              </p>
            )}

            {/* Bottom decorative element */}
            <div className="flex justify-center mt-6">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                <circle cx="30" cy="10" r="3" fill="#9A7B2F" opacity="0.4"/>
                <circle cx="15" cy="10" r="2" fill="#9A7B2F" opacity="0.3"/>
                <circle cx="45" cy="10" r="2" fill="#9A7B2F" opacity="0.3"/>
                <line x1="0" y1="10" x2="10" y2="10" stroke="#9A7B2F" strokeWidth="1" opacity="0.3"/>
                <line x1="50" y1="10" x2="60" y2="10" stroke="#9A7B2F" strokeWidth="1" opacity="0.3"/>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
