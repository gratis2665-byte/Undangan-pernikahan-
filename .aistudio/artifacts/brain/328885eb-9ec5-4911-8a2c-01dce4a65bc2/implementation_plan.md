# Rencana Implementasi: Perbaikan Judul Label Tab Browser

## 1. Analisis Masalah
Berdasarkan tangkapan layar yang dilampirkan pengguna (`IMG_2100.jpeg`), judul pada tab browser saat ini menampilkan teks panjang:
`The Royal Isla...` (terpotong dari judul awal `The Royal Islamic Wedding of Satria & Nadia`).
Pengguna menginginkan agar label browser lebih ringkas dan sesuai dengan nama web undangan pernikahan, dengan format:
`The Wedding of [Nama Pria] & [Nama Wanita]` (Contoh bawaan: `The Wedding of Satria & Nadia`).

---

## 2. Rincian Perubahan yang Akan Dilakukan

### A. Perbarui Metadata di `app/layout.tsx`
- Mengubah `title` utama dari `The Royal Islamic Wedding of Satria & Nadia` menjadi format ringkas:
  `The Wedding of Satria & Nadia`.
- Menyesuaikan `openGraph.title` dan `twitter.title` agar seragam saat dibagikan di media sosial atau WhatsApp.

### B. Sinkronisasi Dinamis di `app/page.tsx`
- Menambahkan efek ringan agar ketika halaman dimuat di browser pengguna, `document.title` secara otomatis menggunakan format:
  `The Wedding of ${groomName} & ${brideName}`.
- Hal ini memastikan label tab browser selalu rapi, pas di layar HP/browser tanpa terpotong berlebihan, dan langsung mengikuti nama mempelai.

---

## 3. Rencana Pengujian & Verifikasi
- Memeriksa berkas `app/layout.tsx` dan memastikan judul berformat `The Wedding of Satria & Nadia`.
- Menjalankan `compile_applet` dan `lint_applet` untuk memverifikasi aplikasi berhasil dikompilasi tanpa kesalahan.
