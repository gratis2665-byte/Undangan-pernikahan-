'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Copy, Check, QrCode, MapPin, X, CreditCard } from 'lucide-react';
import { WeddingData } from '@/lib/wedding-data';

interface DigitalGiftSectionProps {
  data: WeddingData;
}

export function DigitalGiftSection({ data }: DigitalGiftSectionProps) {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => {
      setCopiedAccount(null);
    }, 2500);
  };

  const { bank1, bank2, giftAddress } = data.bankAccounts;

  return (
    <section id="kado" className="relative py-24 px-4 bg-[#1a0208] text-center overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-12 h-12 mx-auto rounded-full bg-[#460a19] border border-[#d4af37] flex items-center justify-center text-[#fae5aa] mb-4 shadow-lg"
        >
          <Gift className="w-6 h-6 text-[#fae5aa]" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#e5c07b] mb-2"
        >
          Tanda Kasih
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl sm:text-4xl font-bold text-[#fff8e7] mb-4"
        >
          Amplop Digital &amp; Kado
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-stone-300 text-sm max-w-lg mx-auto font-sans font-light mb-12"
        >
          Doa restu Anda adalah karunia yang paling berharga bagi kami. Namun apabila Anda berkehendak memberikan tanda kasih, kami menyediakan amplop digital di bawah ini.
        </motion.p>

        {/* Bank Account Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-10">
          {/* Bank 1 Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#2f0612] via-[#24040c] to-[#160207] border border-[#cda142]/40 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-cinzel font-bold text-base tracking-widest text-[#fae5aa]">
                {bank1.name}
              </span>
              <CreditCard className="w-5 h-5 text-[#cda142]" />
            </div>

            <p className="text-[11px] font-sans text-stone-400 uppercase tracking-wider mb-1">
              Nomor Rekening
            </p>
            <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-widest mb-1 tabular-nums">
              {bank1.number}
            </p>
            <p className="text-xs text-[#fae5aa] font-playfair font-medium mb-6">
              a.n. {bank1.holder}
            </p>

            <button
              onClick={() => handleCopy(bank1.number, 'bank1')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold tracking-wider text-[#fae5aa] bg-[#3a0816] hover:bg-[#4d0c1e] border border-[#cda142]/40 transition cursor-pointer"
            >
              {copiedAccount === 'bank1' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin No. Rekening</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Bank 2 Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#2f0612] via-[#24040c] to-[#160207] border border-[#cda142]/40 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-cinzel font-bold text-base tracking-widest text-[#fae5aa]">
                {bank2.name}
              </span>
              <CreditCard className="w-5 h-5 text-[#cda142]" />
            </div>

            <p className="text-[11px] font-sans text-stone-400 uppercase tracking-wider mb-1">
              Nomor Rekening
            </p>
            <p className="font-mono text-xl sm:text-2xl font-bold text-white tracking-widest mb-1 tabular-nums">
              {bank2.number}
            </p>
            <p className="text-xs text-[#fae5aa] font-playfair font-medium mb-6">
              a.n. {bank2.holder}
            </p>

            <button
              onClick={() => handleCopy(bank2.number, 'bank2')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-cinzel font-semibold tracking-wider text-[#fae5aa] bg-[#3a0816] hover:bg-[#4d0c1e] border border-[#cda142]/40 transition cursor-pointer"
            >
              {copiedAccount === 'bank2' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin No. Rekening</span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* QRIS & Physical Gift Address Action strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowQrisModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-cinzel font-semibold tracking-wider text-[#fae5aa] bg-[#310611] border border-[#cda142]/50 hover:bg-[#480a1a] transition shadow cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-[#e5c07b]" />
            <span>Tampilkan QRIS Barcode</span>
          </button>

          <button
            onClick={() => handleCopy(giftAddress, 'address')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-cinzel font-semibold tracking-wider text-[#fae5aa] bg-[#310611] border border-[#cda142]/50 hover:bg-[#480a1a] transition shadow cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#e5c07b]" />
            <span>
              {copiedAccount === 'address' ? 'Alamat Kado Berhasil Disalin!' : 'Kirim Kado Fisik (Salin Alamat)'}
            </span>
          </button>
        </div>
      </div>

      {/* QRIS MODAL */}
      <AnimatePresence>
        {showQrisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowQrisModal(false)}
          >
            <div
              className="relative max-w-sm w-full bg-[#24040c] border border-[#cda142] rounded-3xl p-6 shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQrisModal(false)}
                className="absolute top-4 right-4 text-stone-300 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-cinzel text-base font-bold text-[#fae5aa] mb-1">
                QRIS Pembayaran Digital
              </h4>
              <p className="text-xs text-stone-300 font-sans mb-6">
                {data.groom.name} &amp; {data.bride.name} Wedding Gift
              </p>

              {/* High-fidelity Vector QRIS Preview */}
              <div className="w-56 h-56 mx-auto bg-white p-4 rounded-2xl shadow-inner flex flex-col items-center justify-center mb-4">
                <svg viewBox="0 0 160 160" className="w-full h-full text-slate-900" fill="currentColor">
                  <rect x="10" y="10" width="40" height="40" fill="#000" />
                  <rect x="18" y="18" width="24" height="24" fill="#fff" />
                  <rect x="24" y="24" width="12" height="12" fill="#000" />

                  <rect x="110" y="10" width="40" height="40" fill="#000" />
                  <rect x="118" y="18" width="24" height="24" fill="#fff" />
                  <rect x="124" y="24" width="12" height="12" fill="#000" />

                  <rect x="10" y="110" width="40" height="40" fill="#000" />
                  <rect x="18" y="118" width="24" height="24" fill="#fff" />
                  <rect x="24" y="124" width="12" height="12" fill="#000" />

                  <rect x="60" y="20" width="12" height="12" />
                  <rect x="80" y="15" width="12" height="12" />
                  <rect x="65" y="45" width="12" height="12" />
                  <rect x="85" y="45" width="12" height="12" />
                  
                  <rect x="60" y="60" width="40" height="40" fill="#901432" rx="6" />
                  <text x="80" y="86" fill="#fff" fontSize="18" fontFamily="serif" textAnchor="middle" fontWeight="bold">SN</text>

                  <rect x="115" y="65" width="12" height="12" />
                  <rect x="135" y="85" width="12" height="12" />
                  <rect x="20" y="70" width="12" height="12" />
                  <rect x="35" y="85" width="12" height="12" />

                  <rect x="60" y="115" width="12" height="12" />
                  <rect x="85" y="125" width="12" height="12" />
                  <rect x="110" y="115" width="12" height="12" />
                  <rect x="130" y="135" width="12" height="12" />
                </svg>
              </div>

              <p className="text-[11px] text-stone-300 font-sans">
                Scan dengan GoPay, OVO, Dana, BCA Mobile, atau aplikasi bank apa pun.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
