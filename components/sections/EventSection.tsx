'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ExternalLink, CalendarPlus, Sparkles } from 'lucide-react';
import { WeddingData, parseWeddingTimestamp } from '@/lib/wedding-data';

interface EventSectionProps {
  data: WeddingData;
}

export function EventSection({ data }: EventSectionProps) {
  // Dynamically resolve target timestamp whenever data (date/time/weddingDateIso) changes
  const targetDate = parseWeddingTimestamp(data);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
        setIsPast(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsPast(true);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const createGoogleCalendarLink = () => {
    const title = encodeURIComponent(`${data.akad.title} & ${data.resepsi.title} ${data.groom.name} & ${data.bride.name}`);
    const details = encodeURIComponent(
      `Pernikahan Islami ${data.groom.fullName} & ${data.bride.fullName}.\n${data.akad.title}: ${data.akad.venue} (${data.akad.time})\n${data.resepsi.title}: ${data.resepsi.venue} (${data.resepsi.time})`
    );
    const location = encodeURIComponent(`${data.akad.venue}, ${data.akad.address}`);
    try {
      const dStart = new Date(targetDate);
      const dEnd = new Date(targetDate + 4 * 60 * 60 * 1000);
      const formatCalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const dates = `${formatCalDate(dStart)}/${formatCalDate(dEnd)}`;
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    } catch {
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    }
  };

  return (
    <section id="acara" className="relative py-24 px-4 bg-gradient-to-b from-[#1a0208] via-[#2d050f] to-[#1a0208] text-center overflow-hidden">
      <div className="absolute top-0 inset-x-0 flex items-center justify-center">
        <div className="w-56 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#e5c07b] mb-2"
        >
          Save The Date
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl sm:text-4xl font-bold text-[#fff8e7] mb-4"
        >
          Waktu &amp; Lokasi Acara
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-stone-300 text-sm max-w-lg mx-auto font-sans font-light mb-12"
        >
          Insya Allah, rangkaian acara pernikahan kami akan diselenggarakan pada waktu dan tempat berikut:
        </motion.p>

        {/* COUNTDOWN TIMER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-16 p-4 rounded-2xl bg-[#390614]/80 border border-[#cda142]/40 backdrop-blur-md shadow-xl"
        >
          <p className="text-xs uppercase font-cinzel tracking-widest text-[#fae5aa] mb-3 font-semibold">
            {isPast ? 'Momen Bahagia Telah Tiba' : 'Menghitung Hari Bahagia'}
          </p>

          {isPast && (
            <div className="mb-3 py-1.5 px-3 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-cinzel font-semibold inline-flex items-center gap-1.5 shadow">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hari Bahagia Telah Tiba! Alhamdulillah</span>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Hari', val: timeLeft.days },
              { label: 'Jam', val: timeLeft.hours },
              { label: 'Menit', val: timeLeft.minutes },
              { label: 'Detik', val: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl bg-[#20030a] border border-[#cda142]/20"
              >
                <span suppressHydrationWarning className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fae5aa] tabular-nums">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-stone-300 font-sans tracking-wide mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#cda142]/20">
            <a
              href={createGoogleCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-cinzel font-semibold tracking-wider text-[#29050d] bg-gradient-to-r from-[#fae5aa] to-[#d4af37] hover:brightness-110 transition shadow-md"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Simpan ke Google Calendar</span>
            </a>
          </div>
        </motion.div>

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Akad Nikah */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#29050f]/90 border border-[#cda142]/40 backdrop-blur-sm shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
              <div className="absolute transform rotate-45 bg-gradient-to-r from-[#cda142] to-[#fae5aa] text-[#29050d] font-cinzel font-bold text-[9px] py-1 right-[-35px] top-[18px] w-[120px] text-center shadow-md">
                AKAD
              </div>
            </div>

            <div>
              <div className="w-10 h-10 rounded-full bg-[#460a19] border border-[#d4af37] flex items-center justify-center text-[#fae5aa] mb-4">
                <Calendar className="w-5 h-5" />
              </div>

              <span className="text-[11px] font-cinzel tracking-widest uppercase text-[#e5c07b]">
                Ijab Qabul
              </span>

              <h3 className="font-playfair text-2xl font-bold text-[#fff8e7] mt-1 mb-4">
                {data.akad.title}
              </h3>

              <div className="space-y-3 text-sm text-stone-200 font-sans">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#e5c07b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">{data.akad.date}</strong>
                    <span className="text-stone-300 text-xs">{data.akad.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#e5c07b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">{data.akad.venue}</strong>
                    <span className="text-stone-300 text-xs leading-relaxed block">
                      {data.akad.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#cda142]/20">
              <a
                href={data.akad.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold tracking-wider text-[#fae5aa] bg-[#3e0817] hover:bg-[#520d20] border border-[#cda142]/40 transition shadow"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Petunjuk Lokasi (Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#e5c07b]" />
              </a>
            </div>
          </motion.div>

          {/* Resepsi Pernikahan */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#29050f]/90 border border-[#cda142]/40 backdrop-blur-sm shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
              <div className="absolute transform rotate-45 bg-gradient-to-r from-[#cda142] to-[#fae5aa] text-[#29050d] font-cinzel font-bold text-[9px] py-1 right-[-35px] top-[18px] w-[120px] text-center shadow-md">
                WALIMAH
              </div>
            </div>

            <div>
              <div className="w-10 h-10 rounded-full bg-[#460a19] border border-[#d4af37] flex items-center justify-center text-[#fae5aa] mb-4">
                <Clock className="w-5 h-5" />
              </div>

              <span className="text-[11px] font-cinzel tracking-widest uppercase text-[#e5c07b]">
                Walimatul &apos;Ursy
              </span>

              <h3 className="font-playfair text-2xl font-bold text-[#fff8e7] mt-1 mb-4">
                {data.resepsi.title}
              </h3>

              <div className="space-y-3 text-sm text-stone-200 font-sans">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#e5c07b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">{data.resepsi.date}</strong>
                    <span className="text-stone-300 text-xs">{data.resepsi.time}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#e5c07b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">{data.resepsi.venue}</strong>
                    <span className="text-stone-300 text-xs leading-relaxed block">
                      {data.resepsi.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#cda142]/20">
              <a
                href={data.resepsi.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold tracking-wider text-[#fae5aa] bg-[#3e0817] hover:bg-[#520d20] border border-[#cda142]/40 transition shadow"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Petunjuk Lokasi (Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#e5c07b]" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
