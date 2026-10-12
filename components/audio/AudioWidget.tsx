'use client';

import React, { useState, useEffect } from 'react';
import { VolumeX, Disc3, Music } from 'lucide-react';
import { weddingAudio } from '@/lib/audio';

interface AudioWidgetProps {
  autoStart?: boolean;
}

export function AudioWidget({ autoStart }: AudioWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(Boolean(autoStart));
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(35);

  useEffect(() => {
    if (autoStart) {
      weddingAudio.play();
    }
  }, [autoStart]);

  const toggleMusic = () => {
    const active = weddingAudio.toggle();
    setIsPlaying(active);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    weddingAudio.setVolume(val / 100);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2">
      {/* Volume slider popover on hover/focus */}
      {showVolumeSlider && (
        <div className="bg-[#29050e]/90 border border-[#cda142]/40 backdrop-blur-md rounded-full px-3 py-1.5 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-right-3 duration-200">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 accent-[#f3cb69] h-1.5 cursor-pointer bg-[#500c1d] rounded-lg"
            title="Volume musik"
          />
          <span className="text-[10px] font-mono text-[#fae5aa] tabular-nums">
            {volume}%
          </span>
        </div>
      )}

      {/* Floating Vinyl Disc Button */}
      <div className="relative">
        <button
          onClick={toggleMusic}
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
          className={`w-12 h-12 rounded-full border-2 border-[#d4af37] bg-[#29050e] shadow-[0_4px_16px_rgba(212,175,55,0.4)] flex items-center justify-center text-[#fae5aa] transition-transform active:scale-95 hover:scale-105 cursor-pointer ${
            isPlaying ? 'ring-2 ring-[#fae5aa]/50' : 'opacity-80'
          }`}
          aria-label={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
        >
          <Disc3
            className={`w-6 h-6 text-[#f3cb69] transition-transform ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          />

          {/* Little center note icon */}
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isPlaying ? (
              <Music className="w-2.5 h-2.5 text-[#fff8e1] animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
          </span>
        </button>

        {/* Floating musical note indicator when playing */}
        {isPlaying && (
          <span className="absolute -top-2 -right-1 text-xs text-[#fae5aa] animate-bounce pointer-events-none select-none">
            ♪
          </span>
        )}
      </div>
    </div>
  );
}
