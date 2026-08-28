"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { WeddingInvitation } from "@/lib/types";
import { DEFAULT_STORY_ITEMS } from "@/lib/defaults";

interface Props { invitation?: WeddingInvitation; }

type StoryItem = typeof DEFAULT_STORY_ITEMS[0];

const story = DEFAULT_STORY_ITEMS;

function TimelineItem({ item, i }: { item: StoryItem; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={`relative flex ${item.side === "right" ? "flex-row-reverse" : "flex-row"} items-center gap-6 sm:gap-12 mb-12 sm:mb-16`}
      initial={{ opacity: 0, x: item.side === "left" ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Content card */}
      <div className={`flex-1 ${item.side === "right" ? "text-right" : "text-left"}`}>
        <div
          className="inline-block p-6 sm:p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1"
          style={{
            background: item.highlight
              ? "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(232,213,163,0.08))"
              : "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            border: item.highlight
              ? "1px solid rgba(201,168,76,0.4)"
              : "1px solid rgba(201,168,76,0.15)",
            boxShadow: item.highlight
              ? "0 8px 40px rgba(201,168,76,0.15)"
              : "0 4px 20px rgba(0,0,0,0.05)",
            maxWidth: 340,
          }}
        >
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "#C9A84C" }}
          >
            {item.year}
          </p>
          <h3
            className="font-serif text-xl sm:text-2xl font-light mb-2"
            style={{ color: "#3d3530" }}
          >
            {item.title}
          </h3>
          <p className="font-sans font-light text-sm leading-relaxed" style={{ color: "#6b5f58" }}>
            {item.desc}
          </p>
        </div>
      </div>

      {/* Center node */}
      <div className="relative flex flex-col items-center flex-shrink-0 z-10">
        <motion.div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg"
          style={{
            background: item.highlight
              ? "linear-gradient(135deg, #C9A84C, #E8D5A3)"
              : "rgba(255,255,255,0.8)",
            border: `2px solid ${item.highlight ? "#C9A84C" : "rgba(201,168,76,0.4)"}`,
            boxShadow: item.highlight
              ? "0 0 30px rgba(201,168,76,0.4)"
              : "0 4px 15px rgba(0,0,0,0.08)",
            color: item.highlight ? "#1a0f08" : "#C9A84C",
          }}
          whileInView={{ scale: [0.5, 1.1, 1] }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
        >
          {item.icon}
        </motion.div>
      </div>

      {/* Empty side */}
      <div className="flex-1" />
    </motion.div>
  );
}

export default function StorySection({ invitation }: Props) {
  const items = (invitation?.storyItems?.length ? invitation.storyItems : story) as StoryItem[];
  return (
    <section id="story" className="section-gap relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FAF6F0 0%, #F5EDD8 50%, #FAF6F0 100%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="font-sans text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "#C9A84C" }}
          >
            Bizim
          </p>
          <h2
            className="font-serif text-4xl sm:text-5xl font-light"
            style={{ color: "#3d3530" }}
          >
            Hikayemiz
          </h2>
          <div className="gold-divider mt-6" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical gold line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px]"
            style={{
              background:
                "linear-gradient(180deg, transparent, rgba(201,168,76,0.4) 10%, rgba(201,168,76,0.4) 90%, transparent)",
            }}
          />

          {items.map((item, i) => (
            <TimelineItem key={item.title} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
