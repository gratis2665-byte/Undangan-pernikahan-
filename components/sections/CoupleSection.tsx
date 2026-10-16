'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Instagram, Sparkles, User } from 'lucide-react';
import { WeddingData } from '@/lib/wedding-data';

interface CoupleSectionProps {
  data: WeddingData;
  onOpenAdmin: () => void;
}

export function CoupleSection({ data, onOpenAdmin }: CoupleSectionProps) {
  const [tapCount, setTapCount] = useState(0);
  const [showTapHint, setShowTapHint] = useState(false);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSecretTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (nextCount >= 6) {
      setTapCount(0);
      setShowTapHint(false);
      onOpenAdmin();
    } else {
      if (nextCount >= 3) {
        setShowTapHint(true);
      }
      // Reset tap counter after 3 seconds of inactivity
      tapTimerRef.current = setTimeout(() => {
        setTapCount(0);
        setShowTapHint(false);
      }, 3000);
    }
  };

  return (
    <section id="mempelai" className="relative py-24 px-4 bg-[#1a0208] text-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#610d22]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Secret tap feedback toast */}
      {showTapHint && (
        <div className="fixed top-8 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div className="bg-[#2a050f]/95 border border-[#fae5aa] text-[#fae5aa] text-xs font-cinzel px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-[#f3cb69]" />
            <span>Mode Rahasia: Ketuk {6 - tapCount}x lagi untuk membuka Panel Admin</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#e5c07b] mb-2"
        >
          Sang Mempelai
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl sm:text-4xl font-bold text-[#fff8e7] mb-4"
        >
          {data.groom.name} &amp; {data.bride.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-stone-300 text-sm max-w-lg mx-auto font-sans font-light mb-16"
        >
          Dua insan yang disatukan dalam ikatan suci pernikahan untuk membangun keluarga yang sakinah, mawaddah, warahmah.
        </motion.p>

        {/* Groom & Bride Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* ================= GROOM CARD ================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center p-6 rounded-3xl bg-[#29050f]/80 border border-[#cda142]/30 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          >
            {/* Gilded Islamic Oval Frame around Groom portrait with 6-tap handler */}
            <div
              onClick={handleSecretTap}
              className="relative w-44 h-56 mb-6 flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
              title="Ketuk foto 6x untuk membuka Mode Admin"
            >
              <svg viewBox="0 0 180 220" className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <ellipse cx="90" cy="110" rx="80" ry="100" fill="none" stroke="#d4af37" strokeWidth="4" />
                <ellipse cx="90" cy="110" rx="72" ry="92" fill="none" stroke="#fae5aa" strokeWidth="1.5" strokeDasharray="3 3" />
                <g transform="translate(90, 10)">
                  <path d="M 0,-6 A 5 5 0 1 1 -2 2 A 3.5 3.5 0 1 0 0 -6 Z" fill="#fae5aa" />
                </g>
                <circle cx="90" cy="210" r="4" fill="#fae5aa" />
              </svg>

              {/* Groom Portrait: Custom Uploaded Photo or Default Islamic Vector */}
              <div className="w-[140px] h-[180px] rounded-[50%] overflow-hidden bg-gradient-to-b from-[#4a1421] to-[#1e040a] flex items-center justify-center shadow-inner relative">
                {data.groom.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.groom.photoUrl}
                    alt={data.groom.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 140 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <radialGradient id="groomBg" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#6e1a2f" />
                      <stop offset="100%" stopColor="#25050e" />
                    </radialGradient>
                    <rect width="140" height="180" fill="url(#groomBg)" />

                    <g transform="translate(0, 10)">
                      <path d="M 15,170 Q 25,110 70,110 Q 115,110 125,170 Z" fill="#141414" />
                      <path d="M 52,112 Q 70,122 88,112" stroke="#d4af37" strokeWidth="2.5" fill="none" />
                      <polygon points="56,114 84,114 70,145" fill="#fff" />
                      <polygon points="62,114 78,114 75,120 78,126 62,126 65,120" fill="#202020" stroke="#cda142" strokeWidth="0.5" />
                      <circle cx="70" cy="120" r="2" fill="#cda142" />
                      <rect x="62" y="95" width="16" height="20" fill="#d49b78" />
                      <ellipse cx="70" cy="72" rx="22" ry="26" fill="#d49b78" />
                      <path d="M 46,70 C 46,45 60,42 70,42 C 82,42 94,48 94,66 C 92,60 84,52 70,52 C 58,52 48,58 46,70 Z" fill="#1c140d" />
                      <ellipse cx="62" cy="70" rx="2" ry="1.5" fill="#3a2318" />
                      <ellipse cx="78" cy="70" rx="2" ry="1.5" fill="#3a2318" />
                      <path d="M 64,83 Q 70,87 76,83" stroke="#8d4a36" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </g>
                  </svg>
                )}
              </div>
            </div>

            <h3 suppressHydrationWarning className="font-playfair text-2xl font-bold text-[#fae5aa] mb-1">
              {data.groom.fullName}
            </h3>

            <p className="text-xs text-[#e5c07b] font-cinzel tracking-widest uppercase mb-3">
              {data.groom.title}
            </p>

            <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4 max-w-xs">
              {data.groom.parents}
            </p>

            <a
              href={`https://instagram.com/${data.groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans text-[#fae5aa] bg-[#3d0917] hover:bg-[#520d20] border border-[#cda142]/40 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{data.groom.instagram}</span>
            </a>
          </motion.div>

          {/* ================= BRIDE CARD ================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center p-6 rounded-3xl bg-[#29050f]/80 border border-[#cda142]/30 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          >
            {/* Gilded Islamic Oval Frame around Bride portrait with 6-tap handler */}
            <div
              onClick={handleSecretTap}
              className="relative w-44 h-56 mb-6 flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
              title="Ketuk foto 6x untuk membuka Mode Admin"
            >
              <svg viewBox="0 0 180 220" className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <ellipse cx="90" cy="110" rx="80" ry="100" fill="none" stroke="#d4af37" strokeWidth="4" />
                <ellipse cx="90" cy="110" rx="72" ry="92" fill="none" stroke="#fae5aa" strokeWidth="1.5" strokeDasharray="3 3" />
                <g transform="translate(90, 10)">
                  <path d="M 0,-6 A 5 5 0 1 1 -2 2 A 3.5 3.5 0 1 0 0 -6 Z" fill="#fae5aa" />
                </g>
                <circle cx="90" cy="210" r="4" fill="#fae5aa" />
              </svg>

              {/* Bride Portrait: Custom Uploaded Photo or Default Islamic Hijab Vector */}
              <div className="w-[140px] h-[180px] rounded-[50%] overflow-hidden bg-gradient-to-b from-[#4a1421] to-[#1e040a] flex items-center justify-center shadow-inner relative">
                {data.bride.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.bride.photoUrl}
                    alt={data.bride.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 140 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <radialGradient id="brideBg" cx="50%" cy="40%" r="55%">
                      <stop offset="0%" stopColor="#6e1a2f" />
                      <stop offset="100%" stopColor="#25050e" />
                    </radialGradient>
                    <rect width="140" height="180" fill="url(#brideBg)" />

                    <g transform="translate(0, 10)">
                      <path d="M 25,65 Q 70,30 115,65 L 125,170 Q 70,165 15,170 Z" fill="#ffffff" fillOpacity="0.18" />
                      <path d="M 20,170 Q 30,125 70,125 Q 110,125 120,170 Z" fill="#fcf9f2" />

                      <path
                        d="M 38,76 C 38,40 50,34 70,34 C 90,34 102,40 102,76 C 102,112 92,126 70,126 C 48,126 38,112 38,76 Z"
                        fill="#faf5ea"
                        stroke="#e5c07b"
                        strokeWidth="1.2"
                      />

                      <path d="M 54,48 Q 70,40 86,48" stroke="#d4af37" strokeWidth="2.2" fill="none" />
                      <circle cx="70" cy="42" r="2.8" fill="#fff" />
                      <circle cx="62" cy="45" r="2" fill="#d4af37" />
                      <circle cx="78" cy="45" r="2" fill="#d4af37" />

                      <ellipse cx="70" cy="80" rx="18" ry="21" fill="#f5c2b0" />

                      <ellipse cx="64" cy="78" rx="2" ry="1.5" fill="#4a251a" />
                      <ellipse cx="76" cy="78" rx="2" ry="1.5" fill="#4a251a" />
                      <path d="M 65,90 Q 70,93 75,90" stroke="#be185d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                      <circle cx="60" cy="83" r="3.5" fill="#f43f5e" fillOpacity="0.25" />
                      <circle cx="80" cy="83" r="3.5" fill="#f43f5e" fillOpacity="0.25" />
                    </g>
                  </svg>
                )}
              </div>
            </div>

            <h3 suppressHydrationWarning className="font-playfair text-2xl font-bold text-[#fae5aa] mb-1">
              {data.bride.fullName}
            </h3>

            <p className="text-xs text-[#e5c07b] font-cinzel tracking-widest uppercase mb-3">
              {data.bride.title}
            </p>

            <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4 max-w-xs">
              {data.bride.parents}
            </p>

            <a
              href={`https://instagram.com/${data.bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans text-[#fae5aa] bg-[#3d0917] hover:bg-[#520d20] border border-[#cda142]/40 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{data.bride.instagram}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
