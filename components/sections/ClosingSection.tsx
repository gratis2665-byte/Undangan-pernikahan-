'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { WeddingData, DEFAULT_WEDDING_DATA } from '@/lib/wedding-data';

interface ClosingSectionProps {
  data?: WeddingData;
  onOpenAdmin?: () => void;
}

export function ClosingSection({ data = DEFAULT_WEDDING_DATA, onOpenAdmin }: ClosingSectionProps) {
  const monogram = `${data.groom.name.charAt(0)}${data.bride.name.charAt(0)}`;
  const [tapCount, setTapCount] = React.useState(0);

  const handleMonogramTap = () => {
    if (!onOpenAdmin) return;
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 6) {
      setTapCount(0);
      onOpenAdmin();
    }
  };

  return (
    <footer className="relative py-20 px-4 bg-[#140207] text-center border-t border-[#cda142]/20 overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onClick={handleMonogramTap}
          title="Monogram Royal"
          className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#350714] border border-[#d4af37] shadow-xl cursor-pointer select-none active:scale-95 transition-transform"
        >
          <span className="font-playfair font-bold text-2xl text-[#fae5aa]">
            {monogram}
          </span>
        </motion.div>

        <p className="font-playfair text-lg text-[#fae5aa] font-semibold mb-2">
          Wassalamu’alaikum Warahmatullahi Wabarakatuh
        </p>

        <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white mb-4">
          Ungkapan Terima Kasih
        </h3>

        <p className="text-stone-300 text-sm font-sans leading-relaxed max-w-lg mx-auto font-light mb-6">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila 
          Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kedua mempelai.
        </p>

        <p className="text-xs text-[#fae5aa] font-playfair italic mb-6">
          Jazakumullah Khairan Katsiran
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-[#fae5aa]/70 font-cinzel">
          <span>{data.groom.name}</span>
          <Heart className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
          <span>{data.bride.name}</span>
        </div>

        <p className="text-[11px] text-stone-500 font-sans mt-8">
          The Royal Islamic Wedding &bull; {data.groom.name} &amp; {data.bride.name} &bull; {data.eventDateDisplay}
        </p>
      </div>
    </footer>
  );
}
