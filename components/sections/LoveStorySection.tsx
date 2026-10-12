'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Heart, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { WeddingData, GalleryItem } from '@/lib/wedding-data';

interface LoveStorySectionProps {
  data: WeddingData;
}

export function LoveStorySection({ data }: LoveStorySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const stories = [
    {
      year: '2020',
      title: 'Awal Pertemuan',
      description: 'Pertama kali kami dipertemukan dalam sebuah seminar kolaborasi arsitektur dan desain di Jakarta. Percakapan singkat yang bermula dari secangkir kopi berlanjut menjadi ikatan yang tak pernah kami duga.',
    },
    {
      year: '2022',
      title: 'Menjalin Kasih',
      description: 'Setelah dua tahun saling mengenal dan bertumbuh dalam iman, kami memutuskan untuk melangkah bersama dengan komitmen saling melengkapi dan mendukung cita-cita masing-masing.',
    },
    {
      year: '2025',
      title: 'Lamaran Romantis',
      description: 'Di bawah hangatnya senja dan disaksikan oleh kedua keluarga besar, Satria melamar Nadia dengan penuh ketulusan. Sebuah jawaban &ldquo;Yes&rdquo; yang memulai babak baru perjalanan kami.',
    },
    {
      year: '2026',
      title: 'Menuju Ikrar Suci',
      description: `Hari yang dinanti telah tiba. Kami bersiap mengikat janji suci dalam ikrar akad nikah di ${data.akad.venue}, mengawali kehidupan rumah tangga dalam ridho dan berkah Ilahi.`,
    },
  ];

  const galleryList: GalleryItem[] = data.gallery || [];

  const handleNextPhoto = () => {
    if (!selectedPhoto || galleryList.length === 0) return;
    const currentIndex = galleryList.findIndex((item) => item.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % galleryList.length;
    setSelectedPhoto(galleryList[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto || galleryList.length === 0) return;
    const currentIndex = galleryList.findIndex((item) => item.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + galleryList.length) % galleryList.length;
    setSelectedPhoto(galleryList[prevIndex]);
  };

  return (
    <section id="galeri" className="relative py-24 px-4 bg-[#1f030a] text-center overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* ================= KISAH CINTA TIMELINE ================= */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#e5c07b] mb-2"
        >
          Perjalanan Kami
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl sm:text-4xl font-bold text-[#fff8e7] mb-12"
        >
          Kisah Cinta
        </motion.h2>

        <div className="relative border-l border-[#cda142]/30 ml-4 md:ml-32 text-left space-y-10 mb-24">
          {stories.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative pl-8 group"
            >
              <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-[#3e0817] border-2 border-[#d4af37] flex items-center justify-center text-[#fae5aa] shadow">
                <div className="w-2 h-2 rounded-full bg-[#fae5aa]" />
              </div>

              <span className="font-cinzel text-xs tracking-widest text-[#e5c07b] font-bold">
                {story.year}
              </span>

              <h3 className="font-playfair text-xl font-bold text-white mt-0.5 mb-2">
                {story.title}
              </h3>

              <p className="text-stone-300 text-sm font-sans leading-relaxed max-w-xl font-light">
                {story.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ================= GALERI FOTO ================= */}
        <div className="pt-8 border-t border-[#cda142]/20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#e5c07b] mb-2"
          >
            Momen Kebersamaan
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl font-bold text-[#fff8e7] mb-10"
          >
            Galeri Memori
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {galleryList.map((photo) => (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPhoto(photo)}
                className="relative rounded-2xl overflow-hidden border border-[#cda142]/30 bg-gradient-to-b from-[#420d1c] via-[#29050f] to-[#140207] cursor-pointer shadow-lg group flex flex-col justify-end p-4 aspect-[4/5]"
              >
                {/* Photo Image or Vector Art */}
                {photo.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.photoUrl}
                    alt={photo.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-75 transition-opacity">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 text-[#e5c07b]" fill="none" stroke="currentColor">
                      <circle cx="50" cy="50" r="42" strokeWidth="1" strokeDasharray="3 3" />
                      <path d="M 50,30 Q 30,10 10,35 Q 10,65 50,85 Q 90,65 90,35 Q 70,10 50,30 Z" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}

                {/* Dark gradient scrim on bottom for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <span className="text-[10px] font-cinzel uppercase tracking-wider text-[#fae5aa] block">
                    {photo.category}
                  </span>
                  <h4 className="font-playfair text-sm sm:text-base font-semibold text-white truncate">
                    {photo.title}
                  </h4>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#2b050f]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-cinzel text-[#fae5aa] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b0207]/80 border border-[#cda142]/50">
                    <Camera className="w-3.5 h-3.5" /> Lihat Detail
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-lg w-full bg-[#24040c] border border-[#cda142]/60 rounded-3xl p-6 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#450d1b] to-[#150207] border border-[#cda142]/30 overflow-hidden flex flex-col items-center justify-center p-4 mb-4 shadow-inner relative">
                {selectedPhoto.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPhoto.photoUrl}
                    alt={selectedPhoto.title}
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <>
                    <Heart className="w-12 h-12 text-[#e5c07b] mb-4 animate-pulse" />
                    <p className="font-playfair italic text-lg sm:text-xl text-stone-100 px-4 leading-relaxed">
                      &ldquo;{selectedPhoto.quote}&rdquo;
                    </p>
                  </>
                )}
              </div>

              <span className="text-xs font-cinzel text-[#fae5aa] tracking-widest uppercase block mb-1">
                {selectedPhoto.category}
              </span>
              <h3 className="font-playfair text-xl font-bold text-white mb-2">
                {selectedPhoto.title}
              </h3>
              {selectedPhoto.photoUrl && (
                <p className="font-playfair italic text-xs text-stone-300 mb-6 px-4">
                  &ldquo;{selectedPhoto.quote}&rdquo;
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#cda142]/20">
                <button
                  onClick={handlePrevPhoto}
                  className="inline-flex items-center gap-1 text-xs font-cinzel text-[#fae5aa] hover:text-white p-2 rounded-lg hover:bg-white/5 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Sebelumnya
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="inline-flex items-center gap-1 text-xs font-cinzel text-[#fae5aa] hover:text-white p-2 rounded-lg hover:bg-white/5 transition cursor-pointer"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
