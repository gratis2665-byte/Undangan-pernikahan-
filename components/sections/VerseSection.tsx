'use client';

import React from 'react';
import { motion } from 'motion/react';
import { WeddingData } from '@/lib/wedding-data';

interface VerseSectionProps {
  data: WeddingData;
}

export function VerseSection({ data }: VerseSectionProps) {
  return (
    <section id="ayat" className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-[#1f030a] via-[#2c0612] to-[#1a0208] text-center">
      {/* Decorative hairline gold top separator */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-center">
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Basmalah Arabic Calligraphy Emblem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center mb-6"
        >
          <div className="w-12 h-12 rounded-full bg-[#3e0817] border border-[#d4af37] flex items-center justify-center text-[#fae5aa] shadow-lg mb-4">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 20,6 A 12 12 0 1 1 14 28 A 9 9 0 1 0 20 6 Z"
                fill="#fae5aa"
              />
              <polygon points="26,14 27.5,18 31.5,18.5 28.5,21.5 29.5,25.5 26,23.5 22.5,25.5 23.5,21.5 20.5,18.5 24.5,18" fill="#fff" />
            </svg>
          </div>

          <p className="font-serif text-2xl sm:text-3xl text-[#fae5aa] tracking-widest leading-loose select-none filter drop-shadow">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </motion.div>

        {/* Section Heading & Salam */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-playfair text-base sm:text-lg text-[#fff8e7] font-semibold mb-2"
        >
          Assalamu’alaikum Warahmatullahi Wabarakatuh
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-sans font-light mb-8"
        >
          Maha Suci Allah SWT yang telah menciptakan makhluk-Nya berpasang-pasangan. 
          Dengan memohon rahmat dan ridho-Nya, kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami:
        </motion.p>

        {/* Quran Verse Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-6 sm:p-8 rounded-3xl bg-[#29050f]/80 border border-[#cda142]/35 backdrop-blur-sm shadow-xl"
        >
          <p className="font-serif text-lg sm:text-xl text-[#fae5aa] leading-loose dir-rtl mb-4" dir="rtl">
            {data.verse.arabic}
          </p>

          <blockquote className="font-playfair italic text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl mx-auto px-2">
            &ldquo;{data.verse.translation}&rdquo;
          </blockquote>

          <p className="font-cinzel text-xs tracking-widest text-[#e5c07b] mt-4 font-semibold uppercase">
            — {data.verse.surah} —
          </p>
        </motion.div>

        {/* Ornamental Arabesque Divider */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]" />
          <span className="text-[#e5c07b] text-xs">۞</span>
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]" />
        </div>
      </div>
    </section>
  );
}
