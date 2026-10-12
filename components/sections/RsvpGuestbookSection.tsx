'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, MessageSquareQuote, Heart, CalendarCheck } from 'lucide-react';
import { useWishes, Wish } from '@/lib/wishes-store';

interface RsvpGuestbookProps {
  initialGuestName?: string;
}

export function RsvpGuestbookSection({ initialGuestName = '' }: RsvpGuestbookProps) {
  const [name, setName] = useState(initialGuestName);
  const [status, setStatus] = useState('Hadir');
  const [pax, setPax] = useState('2');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Hydration-safe external store for wishes
  const [wishes, addWish] = useWishes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: Wish = {
      id: `w-${Date.now()}`,
      name: name.trim(),
      status,
      pax: status === 'Hadir' ? Number(pax) : 0,
      message: message.trim(),
      timeAgo: 'Baru saja',
    };

    addWish(newWish);
    setIsSubmitted(true);
    setMessage('');
  };

  return (
    <section id="rsvp" className="relative py-24 px-4 bg-gradient-to-b from-[#1f030a] via-[#2a050f] to-[#1a0208] text-center overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#e5c07b] mb-2"
        >
          Konfirmasi Kehadiran &amp; Doa
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl sm:text-4xl font-bold text-[#fff8e7] mb-4"
        >
          RSVP &amp; Buku Tamu
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-stone-300 text-sm max-w-lg mx-auto font-sans font-light mb-12"
        >
          Kehadiran dan untaian doa Anda merupakan kado terindah bagi perjalanan cinta kami.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* ================= RSVP FORM ================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-3xl bg-[#29050f]/90 border border-[#cda142]/40 backdrop-blur-sm shadow-xl"
          >
            <h3 className="font-playfair text-xl font-bold text-white mb-1 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#e5c07b]" />
              Formulir Kehadiran
            </h3>
            <p className="text-xs text-stone-300 font-sans mb-6">
              Silakan isi formulir di bawah ini untuk membantu estimasi kehadiran.
            </p>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-[#3f0817] border border-[#cda142] text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#fae5aa] mx-auto animate-bounce" />
                <h4 className="font-playfair text-lg font-bold text-white">
                  Terima Kasih Banyak!
                </h4>
                <p className="text-xs text-stone-200 font-sans leading-relaxed">
                  Konfirmasi dan doa restu Anda telah berhasil tersimpan dan tampil di buku tamu.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-full text-xs font-cinzel text-[#fae5aa] bg-[#24040c] border border-[#cda142]/40 hover:bg-[#340712] transition mt-2 cursor-pointer"
                >
                  Kirim Ucapan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-cinzel tracking-wider text-[#fae5aa] mb-1.5 uppercase">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Bpk. Budi Santoso"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b0309] border border-[#cda142]/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-[#fae5aa] transition font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-cinzel tracking-wider text-[#fae5aa] mb-1.5 uppercase">
                      Konfirmasi
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1b0309] border border-[#cda142]/30 text-white text-xs focus:outline-none focus:border-[#fae5aa] transition font-sans"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Berhalangan">Berhalangan</option>
                      <option value="Belum Pasti">Belum Pasti</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel tracking-wider text-[#fae5aa] mb-1.5 uppercase">
                      Jumlah Tamu
                    </label>
                    <select
                      value={pax}
                      disabled={status === 'Berhalangan'}
                      onChange={(e) => setPax(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#1b0309] border border-[#cda142]/30 text-white text-xs focus:outline-none focus:border-[#fae5aa] transition font-sans disabled:opacity-40"
                    >
                      <option value="1">1 Orang</option>
                      <option value="2">2 Orang</option>
                      <option value="3">3 Orang</option>
                      <option value="4">4 Orang</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-cinzel tracking-wider text-[#fae5aa] mb-1.5 uppercase">
                    Untaian Doa &amp; Ucapan
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan ucapan selamat dan doa terbaik Anda untuk kedua mempelai..."
                    className="w-full px-4 py-3 rounded-xl bg-[#1b0309] border border-[#cda142]/30 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-[#fae5aa] transition font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-cinzel font-bold tracking-wider text-[#29050d] bg-gradient-to-r from-[#fae5aa] via-[#f3cb69] to-[#d4af37] hover:brightness-105 active:scale-[0.98] transition cursor-pointer shadow-lg"
                >
                  <Send className="w-3.5 h-3.5 text-[#29050d]" />
                  <span>Kirim Konfirmasi &amp; Ucapan</span>
                </button>
              </form>
            )}
          </motion.div>

          {/* ================= GUESTBOOK STREAM ================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col p-6 sm:p-8 rounded-3xl bg-[#29050f]/90 border border-[#cda142]/40 backdrop-blur-sm shadow-xl max-h-[520px]"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#cda142]/20 mb-4">
              <h3 className="font-playfair text-xl font-bold text-white flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-[#e5c07b]" />
                Buku Ucapan ({wishes.length})
              </h3>
              <span className="text-[11px] font-cinzel text-[#fae5aa]">
                Live Guestbook
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
              {wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="p-4 rounded-2xl bg-[#1c0309] border border-[#cda142]/25 text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h5 className="font-playfair font-semibold text-white text-sm truncate max-w-[200px]">
                      {wish.name}
                    </h5>
                    <span
                      className={`text-[10px] font-sans px-2 py-0.5 rounded-full border ${
                        wish.status === 'Hadir'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : 'bg-stone-800 text-stone-300 border-stone-600'
                      }`}
                    >
                      {wish.status === 'Hadir' ? `Hadir (${wish.pax} orang)` : 'Berhalangan'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-200 font-sans leading-relaxed mb-2 font-light">
                    {wish.message}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#fae5aa]/60 font-sans">
                    <span>{wish.timeAgo}</span>
                    <Heart className="w-3 h-3 text-[#d4af37]" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
