"use client";
import { useEffect, useRef, useCallback } from "react";

interface OceanCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

/*
  Gerçekçi okyanus simülasyonu:
  - 6 bağımsız dalga katmanı (her biri farklı hız, genlik, frekans)
  - Pseudo-random Perlin-benzeri gürültü ile organik hareket
  - Güneş yansıması (specular highlight) — ekranın üst sağından gelir
  - Köpük/foam çizgileri dalga tepelerinde
  - Su yüzeyi renk gradyanı: derinlik → sığ
  - Işık parıltısı (sparkle) noktaları
  - requestAnimationFrame tabanlı, 60 FPS hedefli
  - Mobilde otomatik çözünürlük düşürme (devicePixelRatio sınırlaması)
*/

export default function OceanCanvas({ className, style }: OceanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const t = timeRef.current;

    ctx.clearRect(0, 0, W, H);

    // ── Pseudo-noise helper (cheap, no library) ───────────────
    // Combines multiple sine waves at different frequencies → organic look
    const noise = (x: number, t2: number, seed: number) =>
      Math.sin(x * 0.008 + t2 * 0.4 + seed) * 0.45 +
      Math.sin(x * 0.021 + t2 * 0.27 + seed * 2.1) * 0.25 +
      Math.sin(x * 0.047 + t2 * 0.19 + seed * 3.7) * 0.15 +
      Math.sin(x * 0.003 + t2 * 0.11 + seed * 0.9) * 0.15;

    // ── Wave layer definitions ────────────────────────────────
    const layers = [
      // [speed, ampFactor, yBase(0-1), alphaTop, alphaBot, r,g,b, foamAlpha]
      { speed: 0.18, amp: 28, yBase: 0.55, aTop: 0.18, aBot: 0.55, r: 10, g: 60, b: 100, foam: 0.12, seed: 0 },
      { speed: 0.14, amp: 22, yBase: 0.62, aTop: 0.22, aBot: 0.65, r: 13, g: 75, b: 120, foam: 0.16, seed: 1.7 },
      { speed: 0.10, amp: 18, yBase: 0.69, aTop: 0.28, aBot: 0.72, r: 15, g: 95, b: 140, foam: 0.20, seed: 3.2 },
      { speed: 0.08, amp: 14, yBase: 0.76, aTop: 0.38, aBot: 0.82, r: 20, g: 115, b: 160, foam: 0.28, seed: 5.1 },
      { speed: 0.06, amp: 10, yBase: 0.82, aTop: 0.50, aBot: 0.88, r: 28, g: 140, b: 185, foam: 0.35, seed: 7.3 },
      { speed: 0.04, amp: 7,  yBase: 0.88, aTop: 0.65, aBot: 0.95, r: 40, g: 165, b: 210, foam: 0.45, seed: 9.8 },
    ];

    // ── Draw each wave layer ──────────────────────────────────
    layers.forEach((layer) => {
      const baseY = layer.yBase * H;
      const spd = layer.speed;
      const amp = layer.amp * (H / 700); // scale with canvas height

      // Build wave path
      ctx.beginPath();
      ctx.moveTo(0, H);

      const steps = Math.min(W, 320); // adaptive resolution
      const stepW = W / steps;

      for (let i = 0; i <= steps; i++) {
        const x = i * stepW;
        const n = noise(x, t * spd, layer.seed);
        const y = baseY + n * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();

      // Vertical gradient for this layer
      const grad = ctx.createLinearGradient(0, baseY - amp, 0, H);
      grad.addColorStop(0, `rgba(${layer.r},${layer.g},${layer.b},${layer.aTop})`);
      grad.addColorStop(1, `rgba(${layer.r},${layer.g},${layer.b},${layer.aBot})`);
      ctx.fillStyle = grad;
      ctx.fill();

      // ── Foam line at wave crest ───────────────────────────
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = i * stepW;
        const n = noise(x, t * spd, layer.seed);
        const y = baseY + n * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(220,245,255,${layer.foam})`;
      ctx.lineWidth = 1.2 + (1 - layer.yBase) * 3;
      ctx.shadowColor = `rgba(200,240,255,${layer.foam * 0.6})`;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // ── Sun reflection (diagonal shimmer across water) ────────
    const sunX = W * 0.72;
    const sunY = H * 0.48;
    const reflectGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, W * 0.55);
    reflectGrad.addColorStop(0,  "rgba(255,250,220,0.14)");
    reflectGrad.addColorStop(0.3,"rgba(200,240,255,0.07)");
    reflectGrad.addColorStop(1,  "rgba(200,240,255,0)");
    ctx.save();
    ctx.scale(1, 0.35); // flatten vertically → elliptical water reflection
    ctx.fillStyle = reflectGrad;
    ctx.fillRect(0, (sunY / 0.35) - H * 0.5, W, H * 2);
    ctx.restore();

    // ── Sparkle points on water surface ──────────────────────
    const sparkCount = Math.floor(W / 80);
    for (let s = 0; s < sparkCount; s++) {
      // each sparkle oscillates in and out
      const alpha = (Math.sin(t * 1.1 + s * 2.3) * 0.5 + 0.5) *
                    (Math.sin(t * 0.7 + s * 1.7) * 0.5 + 0.5);
      if (alpha < 0.15) continue;

      const sx = (s / sparkCount) * W + Math.sin(t * 0.3 + s) * 30;
      const waveFrac = 0.58 + (s % 6) * 0.05;
      const sy = waveFrac * H + Math.sin(t * 0.14 * layers[2].speed + s * 0.9) * layers[2].amp * (H / 700);

      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
      sg.addColorStop(0, `rgba(255,252,230,${alpha * 0.9})`);
      sg.addColorStop(1, "rgba(255,252,230,0)");
      ctx.beginPath();
      ctx.arc(sx, sy, 6, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
    }

    // ── Shallow water at very bottom ─────────────────────────
    const shallowGrad = ctx.createLinearGradient(0, H * 0.9, 0, H);
    shallowGrad.addColorStop(0, "rgba(100,200,230,0)");
    shallowGrad.addColorStop(1, "rgba(120,215,240,0.18)");
    ctx.fillStyle = shallowGrad;
    ctx.fillRect(0, H * 0.9, W, H * 0.1);

    timeRef.current += 0.016; // ~60fps time step
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", ...style }}
      aria-hidden="true"
    />
  );
}
