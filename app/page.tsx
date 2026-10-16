'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { MosqueArtwork } from '@/components/cover/MosqueArtwork';
import { SwayingDecorations } from '@/components/cover/SwayingDecorations';
import { BaroqueMedallion } from '@/components/cover/BaroqueMedallion';
import { AudioWidget } from '@/components/audio/AudioWidget';
import { VerseSection } from '@/components/sections/VerseSection';
import { CoupleSection } from '@/components/sections/CoupleSection';
import { EventSection } from '@/components/sections/EventSection';
import { LoveStorySection } from '@/components/sections/LoveStorySection';
import { RsvpGuestbookSection } from '@/components/sections/RsvpGuestbookSection';
import { DigitalGiftSection } from '@/components/sections/DigitalGiftSection';
import { ClosingSection } from '@/components/sections/ClosingSection';
import { AdminModal } from '@/components/admin/AdminModal';
import { useWeddingData } from '@/lib/storage';
import { weddingAudio } from '@/lib/audio';
import { DEFAULT_WEDDING_DATA, WeddingData } from '@/lib/wedding-data';
import { decodeWeddingDataPayload } from '@/lib/share-link';
import { applyDecodedUrlData } from '@/lib/storage';

function WeddingContent() {
  const searchParams = useSearchParams();
  const guestParam = searchParams.get('to');

  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Automatically decode and apply wedding data if present in URL (?wd=... or #wd=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      const wdParam = url.searchParams.get('wd');
      let hashWd = '';
      if (window.location.hash.startsWith('#wd=')) {
        hashWd = window.location.hash.substring(4);
      }
      const rawPayload = wdParam || hashWd;
      if (rawPayload) {
        const decoded = decodeWeddingDataPayload(rawPayload);
        if (decoded) {
          applyDecodedUrlData(decoded);
          // Clean URL parameter cleanly without reloading
          if (wdParam) {
            url.searchParams.delete('wd');
            window.history.replaceState({}, '', url.toString());
          } else if (hashWd) {
            window.history.replaceState({}, '', window.location.pathname + window.location.search);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to parse wedding payload from URL:', err);
    }
  }, []);

  // Hydration-safe external store for wedding data
  const [weddingData, setWeddingData, resetWeddingData] = useWeddingData();

  // Dynamic guest name: resolves URL query param (?to=...) or weddingData guestName
  const guestName = (guestParam || weddingData.guestName || 'Bpk. Budi Santoso & Keluarga').trim();

  const groomCall = (weddingData.groom?.name || weddingData.groom?.fullName?.split(' ')[0] || 'Satria').trim();
  const brideCall = (weddingData.bride?.name || weddingData.bride?.fullName?.split(' ')[0] || 'Nadia').trim();

  // Dynamic browser tab title sync
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `The Wedding of ${groomCall} & ${brideCall}`;
    }
  }, [groomCall, brideCall]);

  // Lock scroll while on cover screen so the guest stays focused on the royal envelope
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSaveWeddingData = (newData: WeddingData) => {
    setWeddingData(newData);
    if (typeof window !== 'undefined' && newData.guestName) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('to', newData.guestName);
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore
      }
    }
  };

  // Handle invitation opening
  const handleOpenInvitation = () => {
    weddingAudio.playChime();
    setTimeout(() => {
      weddingAudio.play();
    }, 450);

    setIsOpen(true);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#140207] text-stone-100 selection:bg-[#c59b27]/30 selection:text-[#f8e7b9]">
      {/* Floating Audio Controller */}
      <AudioWidget autoStart={false} />

      {/* Secret Admin Modal (Unlocked by tapping couple photo, cover monogram, or closing monogram 6 times) */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          data={weddingData}
          onSave={handleSaveWeddingData}
          onReset={resetWeddingData}
        />
      )}

      {/* ============================================================== */}
      {/* 1. COVER SECTION (Layar Pembuka & Amplop Kerajaan) */}
      {/* Muncul sebagai layar penuh awal. Saat dibuka, tirai terangkat ke atas */}
      {/* dan unmount sepenuhnya sehingga saat halaman digulir ke atas, cover TIDAK muncul lagi. */}
      {/* ============================================================== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="royal-invitation-cover"
            initial={{ opacity: 1, y: 0 }}
            exit={{
              y: '-100%',
              opacity: 0,
              transition: {
                duration: 1.05,
                ease: [0.32, 0.72, 0, 1],
              },
            }}
            className="fixed inset-0 z-50 w-full h-[100dvh] overflow-hidden bg-[#140207] select-none"
          >
            {/* Islamic Mosque Artwork Illustration (Clean 60fps rendering) */}
            <div className="absolute inset-0 w-full h-full">
              <MosqueArtwork />
            </div>

            {/* Smooth Swaying Ornaments (Fanous, Reeds, Flowers, Butterflies, Parasols) */}
            <SwayingDecorations />

            {/* Central Islamic Royal Oval Frame with Monogram & Recipient Card */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <BaroqueMedallion
                guestName={guestName}
                onOpenInvitation={handleOpenInvitation}
                data={weddingData}
                onOpenAdmin={() => setIsAdminOpen(true)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 2. INVITATION MAIN CONTENT */}
      {/* Selalu berada di bagian atas konten sehingga ketika tirai terbuka, */}
      {/* isi undangan langsung terlihat dari awal (Ayat Al-Qur'an) */}
      {/* ============================================================== */}
      <main className="relative z-10 w-full min-h-screen">
        {/* Holy Scripture Verse (QS. Ar-Rum: 21) */}
        <VerseSection data={weddingData} />

        {/* The Couple (With Secret 6-Tap Admin Mode Trigger) */}
        <CoupleSection
          data={weddingData}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Events & Schedules (Akad Nikah di Masjid & Resepsi) */}
        <EventSection data={weddingData} />

        {/* Love Story & Gallery (Dynamic from Admin) */}
        <LoveStorySection data={weddingData} />

        {/* RSVP & Guestbook */}
        <RsvpGuestbookSection initialGuestName={guestName} />

        {/* Digital Gift & Amplop */}
        <DigitalGiftSection data={weddingData} />

        {/* Closing Blessing */}
        <ClosingSection
          data={weddingData}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1f030a] flex items-center justify-center text-[#fae5aa] font-cinzel text-sm">
          Memuat Undangan Kerajaan...
        </div>
      }
    >
      <WeddingContent />
    </Suspense>
  );
}
