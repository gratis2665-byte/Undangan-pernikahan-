'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, Volume2 } from 'lucide-react';

import { WeddingData, DEFAULT_WEDDING_DATA } from '@/lib/wedding-data';

interface BaroqueMedallionProps {
  guestName: string;
  onOpenInvitation: () => void;
  data?: WeddingData;
  onOpenAdmin?: () => void;
}

export function BaroqueMedallion({
  guestName,
  onOpenInvitation,
  data = DEFAULT_WEDDING_DATA,
  onOpenAdmin,
}: BaroqueMedallionProps) {
  // Toggle between Monogram and Wedding Title
  const [displayMode, setDisplayMode] = useState<'monogram' | 'title'>('monogram');

  // Secret 6-tap admin trigger on the central monogram
  const [tapCount, setTapCount] = useState(0);
  const [showTapHint, setShowTapHint] = useState(false);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const groomName = (data.groom?.name || data.groom?.fullName?.split(' ')[0] || 'Satria').trim();
  const brideName = (data.bride?.name || data.bride?.fullName?.split(' ')[0] || 'Nadia').trim();
  const groomInitial = (groomName || 'S').charAt(0).toUpperCase();
  const brideInitial = (brideName || 'N').charAt(0).toUpperCase();

  useEffect(() => {
    // Automatically transition from Monogram to Wedding Title after 4 seconds, then cycle every 6 seconds
    const timer = setInterval(() => {
      setDisplayMode((prev) => (prev === 'monogram' ? 'title' : 'monogram'));
    }, 7500);
    return () => clearInterval(timer);
  }, []);

  const handleMonogramTap = () => {
    // Toggle display mode
    setDisplayMode((prev) => (prev === 'monogram' ? 'title' : 'monogram'));

    // Check secret 6-tap
    if (onOpenAdmin) {
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
        tapTimerRef.current = setTimeout(() => {
          setTapCount(0);
          setShowTapHint(false);
        }, 3000);
      }
    }
  };

  return (
    <div className="relative z-30 flex flex-col items-center justify-center max-w-sm sm:max-w-md w-full mx-auto px-4">
      {/* Secret tap feedback toast on cover */}
      {showTapHint && (
        <div className="fixed top-8 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div className="bg-[#2a050f]/95 border border-[#fae5aa] text-[#fae5aa] text-xs font-cinzel px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-[#f3cb69]" />
            <span>Mode Rahasia: Ketuk {6 - tapCount}x lagi untuk membuka Panel Admin</span>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* THE ORNATE GOLDEN ISLAMIC ROYAL OVAL FRAME / CARTOUCHE */}
      {/* ============================================================== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full aspect-[4/5] max-h-[460px] flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] animate-medallion-float"
      >
        {/* SVG Islamic Royal Gold Frame Graphic */}
        <svg
          viewBox="0 0 400 500"
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fae5aa" />
              <stop offset="35%" stopColor="#cda142" />
              <stop offset="70%" stopColor="#966d1f" />
              <stop offset="100%" stopColor="#fae5aa" />
            </linearGradient>

            <linearGradient id="goldHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8c6418" />
              <stop offset="50%" stopColor="#fff3cd" />
              <stop offset="100%" stopColor="#cda142" />
            </linearGradient>

            <radialGradient id="frameInnerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="60%" stopColor="#540f21" stopOpacity="0.95" />
              <stop offset="90%" stopColor="#350613" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#1a0208" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Deep Burgundy Oval Center Fill */}
          <ellipse cx="200" cy="260" rx="145" ry="185" fill="url(#frameInnerGlow)" />

          {/* Subtle interior gold arabesque lace ring */}
          <ellipse
            cx="200"
            cy="260"
            rx="136"
            ry="175"
            stroke="url(#goldRim)"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.75"
          />

          {/* Heavy Royal Filigree Oval Ring */}
          <ellipse
            cx="200"
            cy="260"
            rx="148"
            ry="188"
            stroke="url(#goldRim)"
            strokeWidth="5"
          />

          {/* Secondary Concentric Gold Border */}
          <ellipse
            cx="200"
            cy="260"
            rx="155"
            ry="195"
            stroke="url(#goldHighlight)"
            strokeWidth="1.8"
            opacity="0.8"
          />

          {/* ================= ISLAMIC DOME & CRESCENT MOON CREST ON TOP ================= */}
          <g transform="translate(150, 25)">
            {/* Base Arabesque arch band */}
            <path d="M 15,60 Q 50,48 85,60 L 80,68 Q 50,56 20,68 Z" fill="url(#goldRim)" stroke="#784f11" strokeWidth="1" />
            {/* Jewels on band */}
            <circle cx="30" cy="62" r="2.5" fill="#10b981" />
            <circle cx="50" cy="58" r="3.5" fill="#ffffff" />
            <circle cx="70" cy="62" r="2.5" fill="#10b981" />

            {/* Islamic Onion Arch Spires & Arabesque Teardrop Motif */}
            <path
              d="M 22,60 C 15,35 40,25 50,8 C 60,25 85,35 78,60 Z"
              fill="url(#goldHighlight)"
              stroke="#784f11"
              strokeWidth="1.5"
            />
            {/* Inner filigree carved petal */}
            <path
              d="M 32,54 C 30,38 45,30 50,18 C 55,30 70,38 68,54 Z"
              fill="#3a0916"
              stroke="#fae5aa"
              strokeWidth="1"
            />

            {/* Islamic Crescent Moon (Hilal) & Star on Top */}
            <g transform="translate(50, 4)">
              <circle cx="0" cy="0" r="3.5" fill="#fffbeb" />
              <path
                d="M 0,-14 A 10 10 0 1 1 -5 4 A 7 7 0 1 0 0 -14 Z"
                fill="#fae5aa"
                stroke="#cda142"
                strokeWidth="1"
              />
              <circle cx="-1" cy="-5" r="1.8" fill="#fff" />
            </g>
          </g>

          {/* ================= ARABESQUE LEAF SCROLLS (LEFT & RIGHT) ================= */}
          {/* Left Arabesque Flank */}
          <g transform="translate(10, 210)">
            <path
              d="M 45,0 C 20,-30 0,-10 15,20 C 30,45 10,70 35,90 C 45,100 50,60 48,50 C 40,40 30,20 45,0 Z"
              fill="url(#goldRim)"
              stroke="#68420b"
              strokeWidth="1.5"
            />
            <circle cx="24" cy="35" r="4" fill="#fae5aa" />
          </g>

          {/* Right Arabesque Flank */}
          <g transform="translate(390, 210) scale(-1, 1)">
            <path
              d="M 45,0 C 20,-30 0,-10 15,20 C 30,45 10,70 35,90 C 45,100 50,60 48,50 C 40,40 30,20 45,0 Z"
              fill="url(#goldRim)"
              stroke="#68420b"
              strokeWidth="1.5"
            />
            <circle cx="24" cy="35" r="4" fill="#fae5aa" />
          </g>

          {/* Bottom Islamic Moroccan Arch Finial */}
          <g transform="translate(165, 435)">
            <path
              d="M 10,10 Q 35,35 60,10 Q 45,40 35,45 Q 25,40 10,10 Z"
              fill="url(#goldRim)"
              stroke="#784f11"
              strokeWidth="1"
            />
            <circle cx="35" cy="22" r="4.5" fill="#fffbeb" />
          </g>
        </svg>

        {/* ============================================================== */}
        {/* CONTENT INSIDE THE ISLAMIC ROYAL OVAL FRAME */}
        {/* ============================================================== */}
        <div
          className="relative z-10 w-[74%] h-[74%] mt-8 flex flex-col items-center justify-center text-center p-3 cursor-pointer select-none"
          onClick={handleMonogramTap}
          title="Sentuh untuk ganti tampilan (atau ketuk 6x untuk buka Admin)"
        >
          <AnimatePresence mode="wait">
            {displayMode === 'monogram' ? (
              <motion.div
                key="monogram"
                initial={{ opacity: 0, scale: 0.94, filter: 'blur(3px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(3px)' }}
                transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                className="flex flex-col items-center justify-center will-change-transform"
              >
                {/* Crescent Moon & Islamic Crest Mini Icon */}
                <div className="text-[#f6df98] mb-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <svg width="36" height="26" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 20,4 A 10 10 0 1 1 15 22 A 7 7 0 1 0 20 4 Z"
                      fill="url(#goldRim)"
                      stroke="#805615"
                      strokeWidth="1"
                    />
                    <circle cx="18" cy="13" r="2.2" fill="#fff" />
                  </svg>
                </div>

                {/* Monogram - Dynamic Initial from Groom & Bride Name */}
                <div className="relative py-1 px-4">
                  <span className="font-playfair text-6xl sm:text-7xl font-bold tracking-tight bg-gradient-to-b from-[#fff6d6] via-[#e5c07b] to-[#996b1b] bg-clip-text text-transparent filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                    {groomInitial}<span className="text-4xl sm:text-5xl -mx-1 text-[#f8e3a1] font-light">&amp;</span>{brideInitial}
                  </span>
                  <div className="w-16 h-0.5 mx-auto mt-2 bg-gradient-to-r from-transparent via-[#e5c07b] to-transparent" />
                </div>

                {/* Couple Names on Cover */}
                <p suppressHydrationWarning className="text-[12px] sm:text-sm text-[#fae5aa] tracking-[0.2em] uppercase font-cinzel mt-2 font-bold filter drop-shadow">
                  {groomName} &amp; {brideName}
                </p>

                <p className="text-[9px] text-[#e2b775]/80 mt-1 font-sans">
                  Sentuh untuk membuka nama lengkap
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="title"
                initial={{ opacity: 0, scale: 0.94, filter: 'blur(3px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(3px)' }}
                transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                className="flex flex-col items-center justify-center will-change-transform"
              >
                <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#fae5aa]/90 mb-1">
                  Walimatul Ursy
                </span>

                <h1 suppressHydrationWarning className="font-script text-4xl sm:text-5xl text-[#fff8e1] leading-tight filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] py-0.5 truncate max-w-[240px]">
                  {groomName}
                </h1>
                
                <span className="font-cinzel text-xs text-[#fae5aa] tracking-widest my-0.5">
                  &amp;
                </span>

                <h1 suppressHydrationWarning className="font-script text-4xl sm:text-5xl text-[#fff8e1] leading-tight filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)] py-0.5 truncate max-w-[240px]">
                  {brideName}
                </h1>

                <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-1.5" />

                <p suppressHydrationWarning className="font-cinzel text-[11px] tracking-widest text-[#fae5aa]/90 font-semibold">
                  {data.eventDateDisplay}
                </p>

                <p className="text-[9px] text-[#e2b775]/80 mt-1 font-sans">
                  Sentuh untuk kembali ke monogram
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ============================================================== */}
      {/* PERSONALIZED GUEST RECIPIENT CARD & "BUKA UNDANGAN" BUTTON */}
      {/* ============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full mt-4 flex flex-col items-center text-center"
      >
        <div className="bg-[#24040c]/85 border border-[#cda142]/40 backdrop-blur-md rounded-2xl px-6 py-4 shadow-[0_10px_25px_rgba(0,0,0,0.7)] w-full">
          <p className="text-[11px] tracking-[0.2em] uppercase font-cinzel text-[#e5c07b]/90 mb-1">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          
          <h2 suppressHydrationWarning className="font-playfair text-xl sm:text-2xl font-bold text-white tracking-wide py-0.5 truncate max-w-full">
            {guestName || data?.guestName || 'Tamu Undangan Terhormat'}
          </h2>

          <p className="text-[10px] text-[#f8e3a1]/70 italic mt-0.5 font-sans">
            *Mohon maaf apabila ada kesalahan penulisan nama/gelar
          </p>

          {/* BUKA UNDANGAN CTA BUTTON with Shimmer & Glow */}
          <div className="mt-4 flex flex-col items-center">
            <button
              onClick={onOpenInvitation}
              className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full text-sm font-cinzel font-bold tracking-wider text-[#29050d] bg-gradient-to-r from-[#fae5aa] via-[#f3cb69] to-[#d4af37] shadow-[0_4px_20px_rgba(212,175,55,0.45)] hover:shadow-[0_6px_28px_rgba(250,229,170,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <Mail className="w-4 h-4 text-[#29050d] transition-transform group-hover:-translate-y-0.5" />
              <span>Buka Undangan</span>
              <Sparkles className="w-3.5 h-3.5 text-[#29050d] animate-pulse" />
            </button>
            
            <p className="text-[10px] text-[#fae5aa]/65 mt-2 flex items-center gap-1 font-sans">
              <Volume2 className="w-3 h-3 text-[#d4af37]" />
              Putar musik instrumen romantis saat dibuka
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
