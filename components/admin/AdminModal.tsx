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
  QrCode,
  Heart,
  ArrowUp,
  ArrowDown,
  Clock,
  Globe,
  Download,
  Send,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import {
  WeddingData,
  GalleryItem,
  StoryItem,
  DEFAULT_WEDDING_DATA,
  DEFAULT_STORIES,
  parseWeddingTimestamp,
} from '@/lib/wedding-data';
import { compressImageFile } from '@/lib/image-compress';
import {
  encodeWeddingDataPayload,
  generateWeddingDataTsCode,
} from '@/lib/share-link';
import { normalizeData } from '@/lib/storage';

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

  const [activeTab, setActiveTab] = useState<
    'mempelai' | 'tamu' | 'galeri' | 'kisah' | 'akad' | 'resepsi' | 'ayat' | 'rekening' | 'publikasi'
  >('mempelai');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [copiedGuestLink, setCopiedGuestLink] = useState(false);
  const [copiedFullShareUrl, setCopiedFullShareUrl] = useState(false);
  const [copiedTsCode, setCopiedTsCode] = useState(false);
  const [copiedJsonBackup, setCopiedJsonBackup] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonRestoreMsg, setJsonRestoreMsg] = useState('');
  const [guestForShareTab, setGuestForShareTab] = useState(data.guestName || 'Bpk. Budi Santoso & Keluarga');

  // New gallery item state
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState('Prewedding');
  const [newGalleryQuote, setNewGalleryQuote] = useState('');
  const [newGalleryPhotoUrl, setNewGalleryPhotoUrl] = useState('');

  // New story item state
  const [newStoryYear, setNewStoryYear] = useState('');
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryDesc, setNewStoryDesc] = useState('');

  // Safe timer reference for live countdown preview in admin panel
  const [currentNow, setCurrentNow] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentNow(Date.now());
    }, 0);
    const interval = setInterval(() => {
      setCurrentNow(Date.now());
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const groomFileInputRef = useRef<HTMLInputElement>(null);
  const brideFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const qrisFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle image file upload with automatic client-side canvas compression
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'groom' | 'bride' | 'gallery' | 'qris'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      // For QRIS, use slightly higher quality 0.85 and 640px to ensure crisp barcode scanning
      const maxDim = type === 'qris' ? 640 : 720;
      const quality = type === 'qris' ? 0.85 : 0.75;
      const compressedDataUrl = await compressImageFile(file, maxDim, quality);

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
      } else if (type === 'qris') {
        setFormData((prev) => ({
          ...prev,
          bankAccounts: {
            ...prev.bankAccounts,
            qrisUrl: compressedDataUrl,
          },
        }));
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

  // Story handlers
  const handleAddStory = () => {
    if (!newStoryYear.trim() || !newStoryTitle.trim()) return;
    const item: StoryItem = {
      id: `story-${Date.now()}`,
      year: newStoryYear.trim(),
      title: newStoryTitle.trim(),
      description: newStoryDesc.trim() || 'Kisah perjalanan cinta penuh makna dan kebahagiaan.',
    };
    setFormData((prev) => ({
      ...prev,
      stories: [...(prev.stories || []), item],
    }));
    setNewStoryYear('');
    setNewStoryTitle('');
    setNewStoryDesc('');
  };

  const handleDeleteStory = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      stories: (prev.stories || []).filter((s) => s.id !== id),
    }));
  };

  const handleMoveStory = (index: number, direction: 'up' | 'down') => {
    const list = [...(formData.stories || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setFormData((prev) => ({ ...prev, stories: list }));
  };

  const handleUpdateStory = (id: string, field: 'year' | 'title' | 'description', val: string) => {
    setFormData((prev) => ({
      ...prev,
      stories: (prev.stories || []).map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    }));
  };

  const handleResetStories = () => {
    setFormData((prev) => ({
      ...prev,
      stories: DEFAULT_STORIES,
    }));
  };

  // Synchronize date-time selection with Indonesian texts and countdown
  const handleDateTimeChange = (isoValue: string) => {
    if (!isoValue) return;
    const d = new Date(isoValue);
    if (isNaN(d.getTime())) return;

    const daysIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthsIndo = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    const dayName = daysIndo[d.getDay()];
    const dateNum = d.getDate();
    const monthName = monthsIndo[d.getMonth()];
    const yearNum = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');

    const formattedAkadDate = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
    const formattedCoverDate = `${String(dateNum).padStart(2, '0')} . ${String(d.getMonth() + 1).padStart(2, '0')} . ${yearNum}`;
    const formattedTime = `Pukul ${hours}.${mins} WIB`;

    setFormData((prev) => ({
      ...prev,
      weddingDateIso: isoValue,
      eventDateDisplay: formattedCoverDate,
      akad: {
        ...prev.akad,
        date: formattedAkadDate,
        time: prev.akad.time ? prev.akad.time.replace(/Pukul\s*\d{1,2}[.:]\d{2}/i, `Pukul ${hours}.${mins}`) : formattedTime,
      },
      resepsi: {
        ...prev.resepsi,
        date: formattedAkadDate,
      },
    }));
  };

  const getFullShareUrl = (targetGuestName?: string) => {
    if (typeof window === 'undefined') return '';
    const guest = (targetGuestName || formData.guestName || 'Bpk. Budi Santoso & Keluarga').trim();
    const payload = encodeWeddingDataPayload(formData);
    const origin = window.location.origin;
    const path = window.location.pathname;
    return `${origin}${path}?to=${encodeURIComponent(guest)}&wd=${payload}`;
  };

  const handleCopyGuestLink = (targetGuestName?: string) => {
    if (typeof window === 'undefined') return;
    const url = getFullShareUrl(targetGuestName || formData.guestName);
    navigator.clipboard.writeText(url);
    setCopiedGuestLink(true);
    setTimeout(() => setCopiedGuestLink(false), 2500);
  };

  const handleCopySimpleLink = (targetGuestName?: string) => {
    if (typeof window === 'undefined') return;
    const guestQuery = encodeURIComponent((targetGuestName || formData.guestName || 'Bpk. Budi Santoso & Keluarga').trim());
    const fullUrl = `${window.location.origin}${window.location.pathname}?to=${guestQuery}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedGuestLink(true);
    setTimeout(() => setCopiedGuestLink(false), 2500);
  };

  const handleOpenPreviewInNewTab = (targetGuestName?: string) => {
    if (typeof window === 'undefined') return;
    const url = getFullShareUrl(targetGuestName || formData.guestName);
    window.open(url, '_blank');
  };

  const handleCopyFullShareUrl = (targetGuestName?: string) => {
    if (typeof window === 'undefined') return;
    const url = getFullShareUrl(targetGuestName);
    navigator.clipboard.writeText(url);
    setCopiedFullShareUrl(true);
    setTimeout(() => setCopiedFullShareUrl(false), 2500);
  };

  const handleShareWhatsApp = (targetGuestName?: string) => {
    if (typeof window === 'undefined') return;
    const guest = (targetGuestName || formData.guestName || 'Bpk. Budi Santoso & Keluarga').trim();
    const url = getFullShareUrl(targetGuestName);
    const groomName = (formData.groom.name || formData.groom.fullName.split(' ')[0] || 'Satria').trim();
    const brideName = (formData.bride.name || formData.bride.fullName.split(' ')[0] || 'Nadia').trim();
    const dateStr = formData.akad.date || formData.eventDateDisplay || '24 Oktober 2026';

    const text = `Assalamu’alaikum Warahmatullahi Wabarakatuh.\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${guest}* untuk menghadiri acara pernikahan kami:\n\n👰 *${brideName} & ${groomName}* 🤵\n📅 ${dateStr}\n\nUntuk informasi jadwal acara dan lokasi lengkap, silakan buka tautan undangan digital kami di bawah ini:\n${url}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.\n\nWassalamu’alaikum Warahmatullahi Wabarakatuh.`;

    const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waLink, '_blank');
  };

  const handleCopyTsCode = () => {
    if (typeof window === 'undefined') return;
    const code = generateWeddingDataTsCode(formData);
    navigator.clipboard.writeText(code);
    setCopiedTsCode(true);
    setTimeout(() => setCopiedTsCode(false), 2500);
  };

  const handleDownloadTsFile = () => {
    if (typeof window === 'undefined') return;
    const code = generateWeddingDataTsCode(formData);
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-data.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJsonBackup = () => {
    if (typeof window === 'undefined') return;
    const jsonStr = JSON.stringify(formData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJsonBackup(true);
    setTimeout(() => setCopiedJsonBackup(false), 2500);
  };

  const handleRestoreJson = () => {
    if (!jsonInput.trim()) {
      setJsonRestoreMsg('Silakan tempel teks JSON terlebih dahulu.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput.trim());
      if (parsed && typeof parsed === 'object') {
        const normalized = normalizeData(parsed);
        setFormData(normalized);
        setJsonRestoreMsg('✓ Data berhasil diterapkan ke formulir! Klik "Simpan Perubahan" di bawah untuk menyimpan.');
      } else {
        setJsonRestoreMsg('Format data JSON tidak sesuai.');
      }
    } catch {
      setJsonRestoreMsg('Format JSON tidak valid. Pastikan Anda menempelkan kode JSON yang lengkap.');
    }
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
            { id: 'kisah', label: 'Kisah Cinta', icon: Heart },
            { id: 'akad', label: 'Akad & Countdown', icon: Calendar },
            { id: 'resepsi', label: 'Resepsi', icon: Settings },
            { id: 'ayat', label: 'Ayat Al-Qur’an', icon: BookOpen },
            { id: 'rekening', label: 'Rekening & QRIS', icon: QrCode },
            { id: 'publikasi', label: 'Publikasi Vercel & Tamu', icon: Globe },
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

              {/* Tanggal Display Cover & Kalender */}
              <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-stone-300 font-semibold">
                    Tanggal Pernikahan &amp; Countdown Timer
                  </label>
                  <span className="text-[10px] text-[#fae5aa] bg-[#3a0816] px-2 py-0.5 rounded border border-[#cda142]/30">
                    Otomatis Sinkron
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">
                      Pilih Tanggal &amp; Jam (Countdown Otomatis)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.weddingDateIso || '2026-10-24T08:00'}
                      onChange={(e) => handleDateTimeChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/40 text-white text-xs focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-1">
                      Teks Estetik Tanggal di Cover
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
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/40 text-white text-xs focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                </div>
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
                    onClick={() => handleCopyGuestLink(formData.guestName)}
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
                        <span>Salin Link Undangan Lengkap untuk Tamu Ini</span>
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
                      Tautan otomatis memuat nama tamu dan data pengantin lengkap sehingga langsung tampil di browser tamu.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyGuestLink(formData.guestName)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 transition cursor-pointer shadow whitespace-nowrap"
                    >
                      {copiedGuestLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Link Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Link Tamu Lengkap</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(formData.guestName)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-cinzel text-xs font-bold transition shadow whitespace-nowrap cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenPreviewInNewTab(formData.guestName)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#380715] hover:bg-[#4d0c1e] text-[#fae5aa] border border-[#cda142]/40 text-xs font-semibold transition cursor-pointer"
                      title="Buka pratinjau di tab baru"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Uji Tab Baru</span>
                    </button>
                  </div>
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

          {/* TAB: KISAH CINTA TIMELINE */}
          {activeTab === 'kisah' && (
            <div className="space-y-6">
              {/* HEADER INFO */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border-2 border-[#cda142]/50 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                    Atur Perjalanan Kisah Cinta (Timeline)
                  </h4>
                  <button
                    type="button"
                    onClick={handleResetStories}
                    className="text-[10px] text-stone-300 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset ke Template Bawaan
                  </button>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Tambahkan, ubah tahun, judul momen, dan isi cerita perjalanan cinta Anda. Perubahan akan langsung tampil di timeline section <b>Kisah Cinta</b> di website!
                </p>
              </div>

              {/* FORM TAMBAH BABAK CERITA BARU */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#20040b] border border-[#cda142]/40 shadow-lg space-y-4">
                <h5 className="font-cinzel text-xs font-bold text-[#fae5aa] flex items-center gap-1.5 uppercase tracking-wider">
                  <Plus className="w-4 h-4 text-[#fae5aa]" />
                  Tambah Momen / Babak Kisah Baru
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1 font-semibold">
                      Tahun / Periode *
                    </label>
                    <input
                      type="text"
                      value={newStoryYear}
                      onChange={(e) => setNewStoryYear(e.target.value)}
                      placeholder="Contoh: 2020 / Agustus 2023"
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/40 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-stone-300 mb-1 font-semibold">
                      Judul Momen Kisah *
                    </label>
                    <input
                      type="text"
                      value={newStoryTitle}
                      onChange={(e) => setNewStoryTitle(e.target.value)}
                      placeholder="Contoh: Pertama Kali Bertemu / Hari Lamaran"
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/40 text-white focus:outline-none focus:border-[#fae5aa]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-stone-300 mb-1 font-semibold">
                    Isi Cerita &amp; Kenangan Manis
                  </label>
                  <textarea
                    rows={3}
                    value={newStoryDesc}
                    onChange={(e) => setNewStoryDesc(e.target.value)}
                    placeholder="Tuliskan cerita bagaimana momen ini terjadi, kesan mendalam, atau doa untuk langkah ke depan..."
                    className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/40 text-white focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddStory}
                  disabled={!newStoryYear.trim() || !newStoryTitle.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 transition cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambahkan ke Timeline Kisah Cinta</span>
                </button>
              </div>

              {/* DAFTAR CERITA AKTIF (BISA DIEDIT LANGSUNG & DIURUTKAN) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
                    Daftar Momen Timeline ({formData.stories?.length || 0} Babak)
                  </h5>
                  <span className="text-[10px] text-stone-400">
                    Bisa diurutkan ke atas/bawah &amp; diedit langsung
                  </span>
                </div>

                {(!formData.stories || formData.stories.length === 0) ? (
                  <div className="p-8 text-center rounded-2xl bg-[#170207] border border-dashed border-[#cda142]/30 text-stone-400">
                    Belum ada cerita. Klik &quot;Reset ke Template Bawaan&quot; atau tambahkan babak baru di atas.
                  </div>
                ) : (
                  formData.stories.map((story, index) => (
                    <div
                      key={story.id}
                      className="p-4 rounded-2xl bg-[#1a0208] border border-[#cda142]/30 space-y-3 shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-[#cda142]/15 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#3d0918] border border-[#d4af37] text-[#fae5aa] flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-[#fae5aa]">
                            Babak #{index + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveStory(index, 'up')}
                            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 disabled:opacity-30 transition cursor-pointer"
                            title="Pindah ke atas"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === (formData.stories?.length || 1) - 1}
                            onClick={() => handleMoveStory(index, 'down')}
                            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 disabled:opacity-30 transition cursor-pointer"
                            title="Pindah ke bawah"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStory(story.id)}
                            className="p-1 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/50 transition cursor-pointer ml-1"
                            title="Hapus cerita ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                        <div>
                          <label className="block text-[10px] text-stone-400 mb-1">Tahun / Periode</label>
                          <input
                            type="text"
                            value={story.year}
                            onChange={(e) => handleUpdateStory(story.id, 'year', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white font-cinzel text-xs focus:outline-none focus:border-[#fae5aa]"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-stone-400 mb-1">Judul Momen</label>
                          <input
                            type="text"
                            value={story.title}
                            onChange={(e) => handleUpdateStory(story.id, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white font-semibold text-xs focus:outline-none focus:border-[#fae5aa]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] text-stone-400 mb-1">Isi Cerita</label>
                        <textarea
                          rows={2}
                          value={story.description}
                          onChange={(e) => handleUpdateStory(story.id, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white text-xs leading-relaxed focus:outline-none focus:border-[#fae5aa]"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: AKAD & COUNTDOWN */}
          {activeTab === 'akad' && (
            <div className="space-y-6">
              {/* SECTION: PENGATURAN TANGGAL & COUNTDOWN TIMER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border-2 border-[#cda142]/50 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#fae5aa]" />
                    Atur Tanggal Pernikahan &amp; Hitungan Mundur (Countdown)
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    Otomatis Berubah
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Pilih tanggal &amp; jam pernikahan menggunakan kalender di bawah. Begitu Anda memilih tanggal baru, <b>Hitungan Mundur (Menghitung Hari Bahagia)</b> di website akan langsung menghitung mundur ke tanggal tersebut secara otomatis!
                </p>

                {/* Live Countdown Info Box */}
                {(() => {
                  const ts = parseWeddingTimestamp(formData);
                  const effectiveNow = currentNow > 0 ? currentNow : ts;
                  const diff = ts - effectiveNow;
                  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
                  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                  const isPastTime = diff <= 0;

                  return (
                    <div className="p-3.5 rounded-xl bg-[#24040c] border border-[#cda142]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                      <div>
                        <span className="text-[10px] uppercase font-cinzel text-[#fae5aa] tracking-widest block font-bold">
                          Pratinjau Status Countdown Saat Ini:
                        </span>
                        <p className="text-sm font-cinzel font-bold text-white mt-0.5">
                          {isPastTime
                            ? '🎉 Acara Sedang / Telah Berlangsung (Alhamdulillah)'
                            : `${d} Hari, ${h} Jam, ${m} Menit Menuju Acara`}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-[#fae5aa]/80 block font-sans">
                          Target Waktu Hitungan Mundur:
                        </span>
                        <span className="text-xs font-mono text-stone-300 font-semibold">
                          {new Date(ts).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Date & Time Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-[#fae5aa] mb-1 font-semibold">
                      Pilih Tanggal &amp; Jam Acara (Kalender &amp; Jam) *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.weddingDateIso || '2026-10-24T08:00'}
                      onChange={(e) => handleDateTimeChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#29050f] border-2 border-[#cda142] text-white text-sm focus:outline-none focus:border-[#fae5aa] font-medium"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Memilih tanggal ini akan otomatis mengupdate countdown timer dan teks di akad &amp; cover.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1 font-semibold">
                      Pilihan Tanggal Cepat (Presets):
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: '24 Okt 2026', iso: '2026-10-24T08:00' },
                        { label: '15 Nov 2026', iso: '2026-11-15T09:00' },
                        { label: '12 Des 2026', iso: '2026-12-12T08:30' },
                        { label: '10 Jan 2027', iso: '2027-01-10T08:00' },
                      ].map((preset) => (
                        <button
                          key={preset.iso}
                          type="button"
                          onClick={() => handleDateTimeChange(preset.iso)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#2a0610] hover:bg-[#3d0a19] text-[#fae5aa] border border-[#cda142]/30 text-xs font-cinzel transition cursor-pointer truncate"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: DETAIL JADWAL & LOKASI AKAD */}
              <div className="p-4 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-3">
                <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider">
                  Teks Jadwal &amp; Lokasi Akad Nikah
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-stone-300 mb-1">Teks Tanggal Akad</label>
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
                    <label className="block text-[11px] text-stone-300 mb-1">Waktu Akad</label>
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

          {/* TAB 6: REKENING & QRIS */}
          {activeTab === 'rekening' && (
            <div className="space-y-5">
              {/* SECTION: UPLOAD & KELOLA QRIS */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border-2 border-[#d4af37] space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#fae5aa]" />
                    QRIS Barcode Pembayaran Digital
                  </h4>
                  {formData.bankAccounts.qrisUrl ? (
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700">
                      ✓ QRIS Kustom Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#fae5aa]/80 bg-[#300611] px-2.5 py-0.5 rounded-full border border-[#cda142]/30">
                      QRIS Bawaan (Default)
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Unggah foto atau screenshot QRIS Anda (BCA, Mandiri, BRI, BSI, GoPay, OVO, Dana, ShopeePay, atau QRIS All Payment apa pun). QRIS di popup amplop digital web akan <b>langsung berubah</b> seketika setelah disimpan!
                </p>

                {/* Upload & Preview Box */}
                <div className="flex flex-col sm:flex-row items-center gap-5 bg-[#25050f] p-4 rounded-xl border border-[#cda142]/30">
                  {/* Visual Preview */}
                  <div className="w-44 h-44 bg-white p-2.5 rounded-2xl border-2 border-[#d4af37] shadow-inner flex flex-col items-center justify-center shrink-0 overflow-hidden relative">
                    {formData.bankAccounts.qrisUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.bankAccounts.qrisUrl}
                        alt="Pratinjau QRIS"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-800">
                        <svg viewBox="0 0 160 160" className="w-28 h-28 text-slate-900" fill="currentColor">
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
                        <span className="text-[10px] text-stone-500 font-sans font-medium mt-1">
                          Barcode Standar
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Controls */}
                  <div className="flex-1 space-y-3 text-center sm:text-left">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {formData.bankAccounts.qrisUrl ? 'QRIS Kustom Terpasang' : 'Belum Ada QRIS Kustom'}
                      </p>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        {formData.bankAccounts.qrisUrl
                          ? 'Gambar QRIS ini akan tampil saat tamu menekan tombol "Tampilkan QRIS Barcode" di bagian amplop digital.'
                          : 'Saat ini menggunakan barcode contoh. Unggah gambar QRIS asli Anda agar tamu dapat langsung scan.'}
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={qrisFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, 'qris')}
                    />

                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        disabled={isCompressing}
                        onClick={() => qrisFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 transition cursor-pointer disabled:opacity-50 shadow"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isCompressing ? 'Mengompresi...' : formData.bankAccounts.qrisUrl ? 'Ganti Gambar QRIS' : 'Unggah Foto QRIS'}</span>
                      </button>

                      {formData.bankAccounts.qrisUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              bankAccounts: {
                                ...prev.bankAccounts,
                                qrisUrl: '',
                              },
                            }))
                          }
                          className="px-3 py-2 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800 text-xs hover:bg-rose-900 transition cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Kembalikan ke Default</span>
                        </button>
                      )}
                    </div>

                    <div className="text-[10px] text-stone-400 bg-[#1c030b] p-2 rounded-lg border border-[#cda142]/20">
                      💡 <b>Tips:</b> Gambar QRIS otomatis dikompresi agar ukuran tetap ringan dan barcode tetap tajam serta mudah discan oleh semua aplikasi perbankan &amp; e-wallet.
                    </div>
                  </div>
                </div>
              </div>

              {/* REKENING BANK 1 */}
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

          {/* TAB 9: PUBLIKASI VERCEL & GENERATOR LINK TAMU OTOMATIS */}
          {activeTab === 'publikasi' && (
            <div className="space-y-6">
              {/* PENJELASAN UTAMA CARA KERJA VERCEL & LINTAS BROWSER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#3d0918] via-[#24040c] to-[#3d0918] border-2 border-[#d4af37] shadow-xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#fae5aa] text-[#29050d] flex items-center justify-center shrink-0 shadow">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      Publikasi Vercel &amp; Tautan Undangan
                    </h4>
                    <p className="text-[11px] text-[#fae5aa]/80">
                      Cara agar perubahan nama mempelai, countdown, dan isi web tampil otomatis di browser atau perangkat lain
                    </p>
                  </div>
                </div>

                <div className="text-xs text-stone-200 leading-relaxed bg-[#180207]/80 p-3 rounded-xl border border-[#cda142]/30 space-y-2">
                  <p>
                    Website undangan pernikahan ini berjalan secara statis dan independen tanpa database server eksternal. Agar hasil editan Anda dapat dibuka oleh orang lain di HP / WhatsApp / browser apa pun, Anda dapat menggunakan <b>2 pilihan metode</b>:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-[#2b0510] border border-[#d4af37]/40">
                      <p className="font-bold text-[#fae5aa] mb-1 flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5 text-[#f3cb69]" />
                        Metode 1: Link Tamu Otomatis (Instan)
                      </p>
                      <p className="text-stone-300 text-[10.5px]">
                        Gunakan generator di bawah untuk membuat link khusus tamu. Link otomatis membawa seluruh data Anda, sehingga ketika dibuka di WhatsApp / browser mana pun langsung menampilkan data Anda seketika!
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#2b0510] border border-[#d4af37]/40">
                      <p className="font-bold text-[#fae5aa] mb-1 flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-[#f3cb69]" />
                        Metode 2: Ekspor File Vercel (Permanen)
                      </p>
                      <p className="text-stone-300 text-[10.5px]">
                        Cukup salin atau unduh file <code className="text-[#fae5aa] bg-black/40 px-1 rounded">wedding-data.ts</code>, lalu replace di GitHub / Vercel proyek Anda. Seluruh pengunjung default langsung melihat data Anda secara permanen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BAGIAN 1: GENERATOR LINK TAMU OTOMATIS (WHATSAPP READY) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border-2 border-[#cda142]/50 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#fae5aa]" />
                    Generator Link Tamu (Otomatis Lengkap dengan Data Pengantin)
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                    Rekomendasi
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-[#fae5aa] mb-1.5 font-semibold">
                    Ketik Nama Tamu Penerima Undangan:
                  </label>
                  <input
                    type="text"
                    value={guestForShareTab}
                    onChange={(e) => setGuestForShareTab(e.target.value)}
                    placeholder="Contoh: Bpk. Budi Santoso &amp; Keluarga"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#29050f] border border-[#cda142]/40 text-white text-sm focus:outline-none focus:border-[#fae5aa]"
                  />
                </div>

                {/* Preset Pilihan Cepat */}
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">Pilihan Cepat Nama Tamu:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Bpk. Budi Santoso & Keluarga',
                      'Keluarga Besar Bpk. Rahmat',
                      'Bpk. H. Ahmad & Ibu Siti',
                      'Sahabat & Rekan Kerja',
                      'Teman-teman Alumni',
                      'Tamu Undangan Terhormat',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setGuestForShareTab(preset)}
                        className="text-[10.5px] px-2.5 py-1 rounded-lg bg-[#28050e] hover:bg-[#3d0918] text-[#fae5aa] border border-[#cda142]/30 transition cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pratinjau Tautan */}
                <div className="p-3 rounded-xl bg-[#1f030a] border border-[#cda142]/20 text-[11px] space-y-1.5">
                  <span className="text-stone-400 font-sans block">Pratinjau URL yang Dibuat:</span>
                  <div className="p-2 rounded-lg bg-[#140207] border border-white/5 font-mono text-[10px] text-stone-300 break-all select-all">
                    {typeof window !== 'undefined' ? getFullShareUrl(guestForShareTab) : ''}
                  </div>
                </div>

                {/* Tombol Aksi Link Tamu */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyGuestLink(guestForShareTab)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 active:scale-95 transition shadow cursor-pointer"
                  >
                    {copiedGuestLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>Link Tamu Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Link Tamu Lengkap</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(guestForShareTab)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-cinzel text-xs font-bold active:scale-95 transition shadow cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim via WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenPreviewInNewTab(guestForShareTab)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#380715] hover:bg-[#4d0c1e] text-[#fae5aa] border border-[#cda142]/40 text-xs font-semibold transition cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Uji di Tab Baru</span>
                  </button>
                </div>
              </div>

              {/* BAGIAN 2: EKSPOR FILE UNTUK VERCEL / GITHUB (PERMANEN) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border border-[#cda142]/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#fae5aa]" />
                    Ekspor Kode &amp; File untuk Vercel / GitHub
                  </h4>
                  <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                    Permanen Selamanya
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  Gunakan opsi ini jika Anda ingin alamat website utama (misal: <code className="text-[#fae5aa] bg-black/40 px-1 rounded">undangan-anda.vercel.app</code>) selamanya menampilkan nama dan data pengantin Anda tanpa memerlukan link parameter.
                </p>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyTsCode}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 active:scale-95 transition shadow cursor-pointer"
                  >
                    {copiedTsCode ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-800" />
                        <span>Kode Berhasil Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Kode wedding-data.ts</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTsFile}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#380715] hover:bg-[#4d0c1e] text-[#fae5aa] border border-[#cda142]/40 font-cinzel text-xs font-bold transition shadow cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh File wedding-data.ts</span>
                  </button>
                </div>

                {/* 3 Langkah Mudah Vercel */}
                <div className="p-3.5 rounded-xl bg-[#24040c] border border-[#cda142]/30 space-y-2 text-xs">
                  <p className="font-bold text-[#fae5aa] flex items-center gap-1.5 text-xs font-cinzel">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    3 Langkah Memperbarui di Vercel:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-stone-300 text-[11px] leading-relaxed">
                    <li>Klik <b>Salin Kode</b> atau <b>Unduh File</b> di atas.</li>
                    <li>Buka repositori GitHub proyek undangan Anda, lalu buka file <code className="text-[#fae5aa] bg-black/40 px-1 rounded">lib/wedding-data.ts</code>.</li>
                    <li>Ganti seluruh isi file tersebut dengan kode baru ini lalu simpan (commit). Vercel akan otomatis melakukan deploy ulang dalam hitungan detik dan website Anda langsung permanen!</li>
                  </ol>
                </div>
              </div>

              {/* BAGIAN 3: CADANGAN & PULIHKAN PENGATURAN (JSON BACKUP / RESTORE) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170207] border border-[#cda142]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-[#cda142]/20 pb-2">
                  <h4 className="font-cinzel text-xs font-bold text-[#fae5aa] uppercase tracking-wider flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#fae5aa]" />
                    Cadangan Data &amp; Pemulihan (JSON Backup)
                  </h4>
                  <span className="text-[10px] text-stone-400">Pindah Antar Perangkat</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-300">
                      Simpan cadangan pengaturan Anda ke clipboard untuk disimpan di catatan HP atau dipindahkan ke komputer lain:
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyJsonBackup}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2a0610] hover:bg-[#3d0918] text-[#fae5aa] border border-[#cda142]/40 text-xs font-semibold transition cursor-pointer shrink-0 ml-2"
                    >
                      {copiedJsonBackup ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin JSON Cadangan</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1">
                      Pulihkan Data dari Cadangan JSON (Tempel di sini):
                    </label>
                    <textarea
                      rows={3}
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='Tempel teks JSON di sini (contoh: {"groom": {...}, "bride": {...}})'
                      className="w-full px-3 py-2 rounded-xl bg-[#29050f] border border-[#cda142]/30 text-white font-mono text-[10.5px] focus:outline-none focus:border-[#fae5aa]"
                    />
                    {jsonRestoreMsg && (
                      <p className={`text-[11px] mt-1 ${jsonRestoreMsg.startsWith('✓') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {jsonRestoreMsg}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleRestoreJson}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fae5aa] text-[#29050d] font-cinzel text-xs font-bold hover:brightness-105 transition cursor-pointer shadow"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Terapkan Data dari JSON</span>
                    </button>
                  </div>
                </div>
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
