'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Save,
  RotateCcw,
  Check,
  User,
  Calendar,
  BookOpen,
  CreditCard,
  Settings,
  ShieldCheck,
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  Sparkles,
  RefreshCw,
  Mail,
  Copy,
} from 'lucide-react';
import { WeddingData, GalleryItem, DEFAULT_WEDDING_DATA } from '@/lib/wedding-data';
import { compressImageFile } from '@/lib/image-compress';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeddingData;
  onSave: (newData: WeddingData) => void;
  onReset: () => void;
}

export function AdminModal({ isOpen, onClose, data, onSave, onReset }: AdminModalProps) {
  const [prevData, setPrevData] = useState<WeddingData>(data);
  const [formData, setFormData] = useState<WeddingData>(data);

  // Sync state during render when incoming data changes (recommended React pattern)
  if (prevData !== data) {
    setPrevData(data);
    setFormData(data);
  }

  const [activeTab, setActiveTab] = useState<'mempelai' | 'tamu' | 'galeri' | 'akad' | 'resepsi' | 'ayat' | 'rekening'>('mempelai');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [copiedGuestLink, setCopiedGuestLink] = useState(false);

  // New gallery item state
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('Prewedding');
  const [newGalleryQuote, setNewGalleryQuote] = useState('');
  const [newGalleryPhotoUrl, setNewGalleryPhotoUrl] = useState('');

  const groomFileInputRef = useRef<HTMLInputElement>(null);
  const brideFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle image file upload with automatic client-side canvas compression
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'groom' | 'bride' | 'gallery'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      // Automatically compress and resize to max 720px jpeg (usually ~40-80KB)
      const compressedDataUrl = await compressImageFile(file, 720, 0.75);

      if (type === 'groom') {
        setFormData((prev) => ({
          ...prev,
          groom: { ...prev.groom, photoUrl: compressedDataUrl },
        }));
      } else if (type === 'bride') {
        setFormData((prev) => ({
          ...prev,
          bride: { ...prev.bride, photoUrl: compressedDataUrl },
        }));
      } else if (type === 'gallery') {
        setNewGalleryPhotoUrl(compressedDataUrl);
      }
    } catch (err) {
      console.error('Gagal mengompresi gambar:', err);
      alert('Gagal memproses file foto. Silakan pilih foto lain.');
    } finally {
      setIsCompressing(false);
    }
  };

  // Add new photo to gallery
  const handleAddGalleryPhoto = () => {
    if (!newGalleryTitle.trim()) {
      alert('Silakan masukkan judul foto terlebih dahulu.');
      return;
    }

    const newItem: GalleryItem = {
      id: `g-${Date.now()}`,
      title: newGalleryTitle.trim(),
      category: newGalleryCategory,
      photoUrl: newGalleryPhotoUrl || undefined,
      quote: newGalleryQuote.trim() || 'Momen kebersamaan penuh berkah dan cinta.',
    };

    setFormData((prev) => ({
      ...prev,
      gallery: [newItem, ...(prev.gallery || [])],
    }));

    setNewGalleryTitle('');
    setNewGalleryQuote('');
    setNewGalleryPhotoUrl('');
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = '';
    }
  };

  // Delete photo from gallery
  const handleDeleteGalleryPhoto = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((item) => item.id !== id),
    }));
  };

  const handleCopyGuestLink = () => {
    if (typeof window === 'undefined') return;
    const guestQuery = encodeURIComponent((formData.guestName || 'Bpk. Budi Santoso & Keluarga').trim());
    const fullUrl = `${window.location.origin}${window.location.pathname}?to=${guestQuery}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedGuestLink(true);
    setTimeout(() => setCopiedGuestLink(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const guestCallName = (formData.guestName || '').trim() || 'Bpk. Budi Santoso & Keluarga';

    const groomCallName = (
      formData.groom.name.trim() ||
      formData.groom.fullName.trim().split(' ')[0] ||
      'Mempelai Pria'
    ).trim();

    const brideCallName = (
      formData.bride.name.trim() ||
      formData.bride.fullName.trim().split(' ')[0] ||
      'Mempelai Wanita'
    ).trim();

    const finalData: WeddingData = {
      ...formData,
      guestName: guestCallName,
      groom: {
        ...formData.groom,
        name: groomCallName,
        fullName: formData.groom.fullName.trim() || groomCallName,
      },
      bride: {
        ...formData.bride,
        name: brideCallName,
        fullName: formData.bride.fullName.trim() || brideCallName,
      },
    };

    onSave(finalData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua data ke pengaturan awal?')) {
      onReset();
      setFormData(DEFAULT_WEDDING_DATA);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 800);
    }
  };

  // Compute live monogram and call names for preview
  const previewGroomCall = (formData.groom.name.trim() || formData.groom.fullName.trim().split(' ')[0] || 'Satria').trim();
  const previewBrideCall = (formData.bride.name.trim() || formData.bride.fullName.trim().split(' ')[0] || 'Nadia').trim();
  const previewMonogram = `${previewGroomCall.charAt(0).toUpperCase()} & ${previewBrideCall.charAt(0).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-3xl bg-[#20040c] border border-[#cda142] rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#cda142]/30 bg-[#2d0510]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fae5aa] text-[#29050d] flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playfair text-lg font-bold text-white flex items-center gap-2">
                Panel Pengaturan Undangan (Mode Admin)
              </h3>
              <p className="text-[11px] text-[#fae5aa]/80 font-sans">
                Ubah nama mempelai cover, foto, tanggal, jadwal, ayat, dan galeri secara langsung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#cda142]/20 bg-[#190207] overflow-x-auto p-1.5 gap-1 text-xs font-cinzel">
          {[
            { id: 'mempelai', label: 'Mempelai & Cover', icon: User },
            { id: 'tamu', label: 'Nama Tamu Cover', icon: Mail },
            { id: 'galeri', label: 'Galeri Foto', icon: ImageIcon },
            { id: 'akad', label: 'Akad Nikah', icon: Calendar },
            { id: 'resepsi', label: 'Resepsi', icon: Settings },
            { id: 'ayat', label: 'Ayat Al-Qur’an', icon: BookOpen },
            { id: 'rekening', label: 'Rekening Kado', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#fae5aa] text-[#29050d] font-bold shadow'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6 text-left font-sans text-xs sm:text-sm">
          {/* TAB 1: MEMPELAI & UPLOAD FOTO & NAMA COVER */}
          {activeTab === 'mempelai' && (
            <div className="space-y-6">
              {/* LIVE PREVIEW BANNER DI COVER */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#3d0918] via-[#2b0510] to-[#3d0918] border-2 border-[#d4af37] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#180207] border-2 border-[#fae5aa] flex items-center justify-center shrink-0 shadow-inner">
                    <span className="font-playfair text-xl font-bold text-[#fae5aa]">
                      {previewMonogram}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-cinzel text-[#fae5aa] tracking-widest block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#f3cb69]" />
                      Pratinjau Tampilan di Cover:
                    </span>
                    <h4 className="font-playfair text-lg font-bold text-white">
                      {previewGroomCall} &amp; {previewBrideCall}
                    </h4>
                    <p className="text-[11px] text-[#e5c07b]/80 font-sans truncate max-w-xs">
                      {formData.groom.fullName || previewGroomCall} &amp; {formData.bride.fullName || previewBrideCall}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-right text-[11px] text-stone-300">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-[10px] font-semibold">
                    ✓ Otomatis Sinkron ke Cover &amp; Monogram
                  </span>
                </div>
              </div>

              {/* Mempelai Pria */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                    Data &amp; Foto Mempelai Pria
                  </h4>
                  <span className="text-[10px] text-[#fae5aa]/80">Groom Profile</span>
                </div>

                {/* Upload Foto Mempelai Pria */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#26050e] p-3.5 rounded-xl border border-[#cda142]/25">
                  <div className="w-24 h-28 rounded-[50%] overflow-hidden bg-[#3b0817] border-2 border-[#d4af37] flex items-center justify-center shrink-0 shadow">
                    {formData.groom.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.groom.photoUrl}
                        alt="Foto Pengantin Pria"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-[10px] text-[#fae5aa]">
                        <User className="w-8 h-8 mx-auto mb-1 opacity-70" />
                        <span>Ilustrasi Default</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs font-semibold text-white">Ganti Foto Pengantin Pria</p>
                    <p className="text-[11px] text-stone-300">
                      Pilih foto dari galeri/HP Anda untuk mengganti ilustrasi default di bingkai oval emas.
                    </p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <input
                        type="file"
                        ref={groomFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileChange(e, 'groom')}
                      />
                      <button
                        type="button"
                        disabled={isCompressing}
                        onClick={() => groomFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 transition cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isCompressing ? 'Memproses...' : 'Pilih Foto'}</span>
                      </button>

                      {formData.groom.photoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              groom: { ...prev.groom, photoUrl: '' },
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800 text-xs hover:bg-rose-900 transition cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#fae5aa] mb-1 font-semibold">
                      Nama Panggilan (Tampil di Cover, Monogram &amp; Judul) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.groom.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          groom: { ...formData.groom, name: e.target.value },
                        })
                      }
                      placeholder="Contoh: Satria"
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border-2 border-[#cda142] text-white focus:outline-none focus:border-[#fae5aa] font-medium"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Nama ini langsung tampil di cover utama &amp; monogram
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-stone-300 font-semibold">
                        Nama Lengkap &amp; Gelar
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const firstWord = formData.groom.fullName.trim().split(' ')[0];
                          if (firstWord) {
                            setFormData({
                              ...formData,
                              groom: { ...formData.groom, name: firstWord },
                            });
                          }
                        }}
                        className="text-[10px] text-[#fae5aa] hover:underline flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        Gunakan Nama Depan ke Cover
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.groom.fullName}
                      onChange={(e) => {
                        const val = e.target.value;
                        const firstWord = val.trim().split(' ')[0] || '';
                        setFormData({
                          ...formData,
                          groom: {
                            ...formData.groom,
                            fullName: val,
                            // If name is empty or was using the old first name, sync automatically
                            name: !formData.groom.name || formData.groom.name === 'Satria' ? firstWord : formData.groom.name,
                          },
                        });
                      }}
                      placeholder="Contoh: Satria Pratama, S.T."
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Keterangan Orang Tua</label>
                  <input
                    type="text"
                    value={formData.groom.parents}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        groom: { ...formData.groom, parents: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Instagram (@username)</label>
                  <input
                    type="text"
                    value={formData.groom.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        groom: { ...formData.groom, instagram: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>
              </div>

              {/* Mempelai Wanita */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                    Data &amp; Foto Mempelai Wanita
                  </h4>
                  <span className="text-[10px] text-[#fae5aa]/80">Bride Profile</span>
                </div>

                {/* Upload Foto Mempelai Wanita */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#26050e] p-3.5 rounded-xl border border-[#cda142]/25">
                  <div className="w-24 h-28 rounded-[50%] overflow-hidden bg-[#3b0817] border-2 border-[#d4af37] flex items-center justify-center shrink-0 shadow">
                    {formData.bride.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.bride.photoUrl}
                        alt="Foto Pengantin Wanita"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-[10px] text-[#fae5aa]">
                        <User className="w-8 h-8 mx-auto mb-1 opacity-70" />
                        <span>Ilustrasi Hijab</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs font-semibold text-white">Ganti Foto Pengantin Wanita</p>
                    <p className="text-[11px] text-stone-300">
                      Pilih foto dari galeri/HP Anda untuk mengganti ilustrasi default di bingkai oval emas.
                    </p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <input
                        type="file"
                        ref={brideFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileChange(e, 'bride')}
                      />
                      <button
                        type="button"
                        disabled={isCompressing}
                        onClick={() => brideFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 transition cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isCompressing ? 'Memproses...' : 'Pilih Foto'}</span>
                      </button>

                      {formData.bride.photoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              bride: { ...prev.bride, photoUrl: '' },
                            }))
                          }
                          className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800 text-xs hover:bg-rose-900 transition cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#fae5aa] mb-1 font-semibold">
                      Nama Panggilan (Tampil di Cover, Monogram &amp; Judul) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.bride.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bride: { ...formData.bride, name: e.target.value },
                        })
                      }
                      placeholder="Contoh: Nadia"
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border-2 border-[#cda142] text-white focus:outline-none focus:border-[#fae5aa] font-medium"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Nama ini langsung tampil di cover utama &amp; monogram
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-stone-300 font-semibold">
                        Nama Lengkap &amp; Gelar
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const firstWord = formData.bride.fullName.trim().split(' ')[0];
                          if (firstWord) {
                            setFormData({
                              ...formData,
                              bride: { ...formData.bride, name: firstWord },
                            });
                          }
                        }}
                        className="text-[10px] text-[#fae5aa] hover:underline flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        Gunakan Nama Depan ke Cover
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.bride.fullName}
                      onChange={(e) => {
                        const val = e.target.value;
                        const firstWord = val.trim().split(' ')[0] || '';
                        setFormData({
                          ...formData,
                          bride: {
                            ...formData.bride,
                            fullName: val,
                            // If name is empty or was using default, sync automatically
                            name: !formData.bride.name || formData.bride.name === 'Nadia' ? firstWord : formData.bride.name,
                          },
                        });
                      }}
                      placeholder="Contoh: Nadia Angela, S.Ds."
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Keterangan Orang Tua</label>
                  <input
                    type="text"
                    value={formData.bride.parents}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bride: { ...formData.bride, parents: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Instagram (@username)</label>
                  <input
                    type="text"
                    value={formData.bride.instagram}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bride: { ...formData.bride, instagram: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>
              </div>

              {/* Tanggal Display Cover */}
              <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30">
                <label className="block text-[11px] text-stone-300 mb-1 font-semibold">
                  Tanggal Display di Cover (Format Estetik)
                </label>
                <input
                  type="text"
                  value={formData.eventDateDisplay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eventDateDisplay: e.target.value,
                    })
                  }
                  placeholder="24 . 10 . 2026"
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>

              {/* EDIT NAMA TAMU UNDANGAN DI COVER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border-2 border-[#cda142]/50 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#fae5aa]" />
                    Nama Tamu Undangan di Cover (Kepada Yth.)
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    Langsung Berubah di Cover
                  </span>
                </div>

                <p className="text-[11px] text-stone-300">
                  Ubah nama tamu penerima yang tertera di kartu undangan cover utama. Nama ini akan langsung berganti di cover begitu disimpan.
                </p>

                <div>
                  <label className="block text-[11px] text-[#fae5aa] mb-1 font-semibold">
                    Nama Tamu / Penerima Undangan di Cover *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guestName: e.target.value,
                      })
                    }
                    placeholder="Contoh: Bpk. Budi Santoso &amp; Keluarga"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#29050f] border-2 border-[#cda142] text-white text-sm focus:outline-none focus:border-[#fae5aa] font-medium"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Nama ini langsung tampil di kartu &quot;Kepada Yth. Bapak/Ibu/Saudara/i&quot; pada cover undangan.
                  </span>
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1.5 font-sans">
                    Pilihan Cepat / Format Nama Populer:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Bpk. Budi Santoso & Keluarga',
                      'Bpk. H. Ahmad & Ibu Siti',
                      'Keluarga Besar Bpk. Rahmat',
                      'Sahabat & Rekan Kerja',
                      'Tamu Undangan Terhormat',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormData({ ...formData, guestName: preset })}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#2a0610] hover:bg-[#3d0a19] text-[#fae5aa] border border-[#cda142]/30 transition cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pratinjau Kartu Tamu di Cover */}
                <div className="bg-[#24040c] border border-[#cda142]/50 rounded-2xl p-4 text-center shadow-inner">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-cinzel text-[#e5c07b]/90 mb-1">
                    Pratinjau Kartu di Cover: Kepada Yth. Bapak/Ibu/Saudara/i:
                  </p>
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-white tracking-wide py-0.5 truncate">
                    {formData.guestName || 'Tamu Undangan Terhormat'}
                  </h3>
                  <p className="text-[9px] text-[#f8e3a1]/60 italic font-sans mt-0.5">
                    *Mohon maaf apabila ada kesalahan penulisan nama/gelar
                  </p>
                </div>

                {/* Tombol Salin Link Khusus Tamu Ini */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyGuestLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b0817] border border-[#cda142]/50 text-[#fae5aa] hover:bg-[#4d0c1e] text-xs font-semibold transition cursor-pointer"
                  >
                    {copiedGuestLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Tautan Khusus Tamu Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link Undangan untuk Tamu Ini (WhatsApp)</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-stone-400 italic">
                    Bisa langsung dibagikan ke WhatsApp tamu
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEDICATED NAMA TAMU COVER */}
          {activeTab === 'tamu' && (
            <div className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border-2 border-[#cda142]/50 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#fae5aa]" />
                    Atur Nama Tamu Undangan di Cover
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    Cover &amp; Kartu Penerima
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Ketik nama tamu di bawah ini. Ketika Anda menekan tombol <b>Simpan Perubahan</b>, nama tamu di cover akan langsung berubah seketika, dan tautan undangan khusus tamu ini siap dibagikan.
                </p>

                <div>
                  <label className="block text-xs text-[#fae5aa] mb-1.5 font-semibold">
                    Nama Tamu / Penerima Undangan (Kepada Yth. Bapak/Ibu/Saudara/i) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guestName: e.target.value,
                      })
                    }
                    placeholder="Contoh: Bpk. Budi Santoso &amp; Keluarga"
                    className="w-full px-4 py-3 rounded-xl bg-[#29050f] border-2 border-[#cda142] text-white text-base focus:outline-none focus:border-[#fae5aa] font-medium"
                  />
                </div>

                {/* Pilihan Cepat */}
                <div>
                  <span className="text-[11px] text-stone-400 block mb-1.5 font-sans font-medium">
                    Pilihan Cepat Contoh Format:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Bpk. Budi Santoso & Keluarga',
                      'Bpk. H. Ahmad & Ibu Siti',
                      'Keluarga Besar Bpk. Rahmat',
                      'Sahabat & Rekan Kerja',
                      'Teman-teman Alumni',
                      'Tamu Undangan Terhormat',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFormData({ ...formData, guestName: preset })}
                        className="text-xs px-3 py-1.5 rounded-xl bg-[#2a0610] hover:bg-[#3d0a19] text-[#fae5aa] border border-[#cda142]/30 transition cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pratinjau Tampilan Persis Seperti di Cover */}
                <div className="bg-[#24040c]/90 border border-[#cda142]/60 rounded-2xl p-5 text-center shadow-inner">
                  <p className="text-[11px] tracking-[0.2em] uppercase font-cinzel text-[#e5c07b] mb-1">
                    Kepada Yth. Bapak/Ibu/Saudara/i:
                  </p>
                  <h2 className="font-playfair text-xl sm:text-2xl font-bold text-white tracking-wide py-1 truncate">
                    {formData.guestName || 'Tamu Undangan Terhormat'}
                  </h2>
                  <p className="text-[10px] text-[#f8e3a1]/70 italic font-sans mt-0.5">
                    *Mohon maaf apabila ada kesalahan penulisan nama/gelar
                  </p>
                </div>

                {/* Salin Tautan WhatsApp */}
                <div className="p-3.5 rounded-xl bg-[#28050e] border border-[#cda142]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Bagikan Link Khusus Tamu Ini</p>
                    <p className="text-[11px] text-stone-300">
                      Tamu yang membuka link ini akan otomatis melihat namanya di cover.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyGuestLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 transition cursor-pointer shadow whitespace-nowrap"
                  >
                    {copiedGuestLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Tautan Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link Tamu</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GALERI FOTO & UPLOAD FOTO */}
          {activeTab === 'galeri' && (
            <div className="space-y-6">
              {/* Form Tambah Foto Galeri */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#fae5aa]" />
                  Tambah Foto Baru ke Galeri
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Judul / Momen Foto</label>
                    <input
                      type="text"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      placeholder="Contoh: Senyuman di Bawah Senja"
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Kategori</label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    >
                      <option value="Prewedding">Prewedding</option>
                      <option value="Portret">Portret</option>
                      <option value="Kenangan">Kenangan</option>
                      <option value="Istimewa">Istimewa</option>
                      <option value="Detail">Detail</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Kata Mutiara / Caption Romantis</label>
                  <input
                    type="text"
                    value={newGalleryQuote}
                    onChange={(e) => setNewGalleryQuote(e.target.value)}
                    placeholder="Contoh: Bersamamu adalah anugerah terindah dari Allah..."
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>

                {/* Upload File Foto Galeri */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileChange(e, 'gallery')}
                  />
                  <button
                    type="button"
                    disabled={isCompressing}
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#390614] border border-[#cda142]/40 text-[#fae5aa] hover:bg-[#4d0c1e] text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isCompressing ? 'Mengompresi...' : newGalleryPhotoUrl ? 'Ganti File Foto' : 'Unggah File Foto'}</span>
                  </button>

                  {newGalleryPhotoUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#cda142]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={newGalleryPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddGalleryPhoto}
                    className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fae5aa] text-[#29050d] font-cinzel font-bold text-xs hover:brightness-105 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambahkan ke Galeri</span>
                  </button>
                </div>
              </div>

              {/* Daftar Foto Galeri Saat Ini */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                    Daftar Foto Galeri ({formData.gallery?.length || 0})
                  </h4>
                  <span className="text-[10px] text-stone-400">Klik ikon tempat sampah untuk menghapus</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {(formData.gallery || []).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#170207] border border-[#cda142]/20"
                    >
                      <div className="w-14 h-14 rounded-lg bg-[#300611] border border-[#cda142]/40 overflow-hidden flex items-center justify-center shrink-0">
                        {item.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.photoUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[#fae5aa]/60" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase font-cinzel text-[#fae5aa] tracking-wider block">
                          {item.category}
                        </span>
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-stone-300 truncate italic">&ldquo;{item.quote}&rdquo;</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryPhoto(item.id)}
                        className="p-1.5 rounded-lg text-rose-300 hover:bg-rose-950/60 transition cursor-pointer"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AKAD NIKAH */}
          {activeTab === 'akad' && (
            <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                Jadwal &amp; Lokasi Akad Nikah
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={formData.akad.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        akad: { ...formData.akad, date: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={formData.akad.time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        akad: { ...formData.akad, time: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Nama Tempat / Masjid</label>
                <input
                  type="text"
                  value={formData.akad.venue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      akad: { ...formData.akad, venue: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.akad.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      akad: { ...formData.akad, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Tautan Google Maps</label>
                <input
                  type="text"
                  value={formData.akad.mapsUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      akad: { ...formData.akad, mapsUrl: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
            </div>
          )}

          {/* TAB 4: RESEPSI */}
          {activeTab === 'resepsi' && (
            <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                Jadwal &amp; Lokasi Resepsi Pernikahan
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Tanggal</label>
                  <input
                    type="text"
                    value={formData.resepsi.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resepsi: { ...formData.resepsi, date: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-300 mb-1">Waktu</label>
                  <input
                    type="text"
                    value={formData.resepsi.time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        resepsi: { ...formData.resepsi, time: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Nama Tempat / Ballroom</label>
                <input
                  type="text"
                  value={formData.resepsi.venue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resepsi: { ...formData.resepsi, venue: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.resepsi.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resepsi: { ...formData.resepsi, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Tautan Google Maps</label>
                <input
                  type="text"
                  value={formData.resepsi.mapsUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resepsi: { ...formData.resepsi, mapsUrl: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: AYAT & TERJEMAHAN */}
          {activeTab === 'ayat' && (
            <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                Ayat Suci Al-Qur’an
              </h4>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Nama Surah &amp; Ayat</label>
                <input
                  type="text"
                  value={formData.verse.surah}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verse: { ...formData.verse, surah: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Teks Bahasa Arab</label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={formData.verse.arabic}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verse: { ...formData.verse, arabic: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-[#fae5aa] text-base leading-loose focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 mb-1">Terjemahan Bahasa Indonesia</label>
                <textarea
                  rows={3}
                  value={formData.verse.translation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      verse: { ...formData.verse, translation: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
            </div>
          )}

          {/* TAB 6: REKENING & KADO */}
          {activeTab === 'rekening' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                  Rekening Bank 1
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Nama Bank</label>
                    <input
                      type="text"
                      value={formData.bankAccounts.bank1.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccounts: {
                            ...formData.bankAccounts,
                            bank1: { ...formData.bankAccounts.bank1, name: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      value={formData.bankAccounts.bank1.number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccounts: {
                            ...formData.bankAccounts,
                            bank1: { ...formData.bankAccounts.bank1, number: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Atas Nama</label>
                    <input
                      type="text"
                      value={formData.bankAccounts.bank1.holder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccounts: {
                            ...formData.bankAccounts,
                            bank1: { ...formData.bankAccounts.bank1, holder: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                  Rekening Bank 2
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Nama Bank</label>
                    <input
                      type="text"
                      value={formData.bankAccounts.bank2.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccounts: {
                            ...formData.bankAccounts,
                            bank2: { ...formData.bankAccounts.bank2, name: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Nomor Rekening</label>
                    <input
                      type="text"
                      value={formData.bankAccounts.bank2.number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccounts: {
                            ...formData.bankAccounts,
                            bank2: { ...formData.bankAccounts.bank2, number: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Atas Nama</label>
                    <input
                      type="text"
                      value={formData.bankAccounts.bank2.holder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bankAccounts: {
                            ...formData.bankAccounts,
                            bank2: { ...formData.bankAccounts.bank2, holder: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-2">
                <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                  Alamat Pengiriman Kado Fisik
                </h4>
                <textarea
                  rows={2}
                  value={formData.bankAccounts.giftAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bankAccounts: {
                        ...formData.bankAccounts,
                        giftAddress: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white focus:outline-none focus:border-[#fae5aa]"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#cda142]/30">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-cinzel text-rose-300 bg-rose-950/40 border border-rose-800 hover:bg-rose-900/50 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-cinzel text-stone-300 bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isCompressing}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold text-[#29050d] bg-gradient-to-r from-[#fae5aa] via-[#f3cb69] to-[#d4af37] hover:brightness-105 active:scale-95 transition shadow-lg cursor-pointer disabled:opacity-50"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-800" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
