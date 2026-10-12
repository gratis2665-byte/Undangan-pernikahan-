'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function WeddingContent() {
  const searchParams = useSearchParams();
  const guestParam = searchParams.get('to');
  const guestName = guestParam || 'Bpk. Budi Santoso & Keluarga';

  const [isOpen, setIsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Hydration-safe external store for wedding data
  const [weddingData, setWeddingData, resetWeddingData] = useWeddingData();

  // Handle invitation opening
  const handleOpenInvitation = () => {
    weddingAudio.playChime();
    setTimeout(() => {
      weddingAudio.play();
    }, 450);

    setIsOpen(true);

    setTimeout(() => {
      const target = document.getElementById('ayat');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <div className="relative min-h-screen bg-[#140207] text-stone-100 selection:bg-[#c59b27]/30 selection:text-[#f8e7b9]">
      {/* Floating Audio Controller */}
      <AudioWidget autoStart={false} />

      {/* Secret Admin Modal (Unlocked by tapping couple photo or cover monogram 6 times) */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          data={weddingData}
          onSave={setWeddingData}
          onReset={resetWeddingData}
        />
      )}

      {/* ============================================================== */}
      {/* 1. COVER SECTION (Islamic Royal Mosque & Smooth Swaying Ornaments) */}
      {/* ============================================================== */}
      <div
        className={`relative w-full ${
          isOpen ? 'h-[90vh] md:h-screen' : 'h-screen'
        } overflow-hidden transition-all duration-700`}
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
      </div>

      {/* ============================================================== */}
      {/* 2. INVITATION MAIN CONTENT (Revealed when opened) */}
      {/* ============================================================== */}
      {isOpen && (
        <main className="relative z-20 animate-in fade-in duration-700">
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
          <ClosingSection data={weddingData} />
        </main>
      )}
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
