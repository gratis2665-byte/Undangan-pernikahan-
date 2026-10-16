# Rencana Implementasi: Sinkronisasi Otomatis Judul Tab Browser dengan Nama Mempelai

## 1. Kebutuhan Pengguna
Pengguna mengonfirmasi:
- Nama mempelai akan diubah sendiri oleh pengguna melalui panel Admin.
- Judul label tab browser harus **selalu otomatis sinkron dan berubah seketika** mengikuti nama kedua mempelai yang disimpan melalui panel Admin dengan format:
  `The Wedding of [Nama Pria] & [Nama Wanita]`.

---

## 2. Rincian Perubahan yang Akan Dilakukan

### A. Sinkronisasi di `lib/storage.ts`
1. **Fungsi `updateBrowserTabTitle(data: WeddingData)`**:
   - Helper otomatis yang menyusun judul: `The Wedding of ${groomName} & ${brideName}` berdasarkan panggilan nama mempelai (atau kata pertama dari nama lengkap jika belum ada nama panggilan).
2. **Saat Data Dimuat (`initFromStorage`)**:
   - Jika ada data pengantin kustom yang tersimpan di `localStorage`, tab browser langsung otomatis berganti judulnya seketika saat halaman web dibuka.
3. **Saat Data Disimpan (`saveWeddingData`)**:
   - Setiap kali tombol **Simpan Perubahan** di panel Admin ditekan, judul tab browser langsung diubah secara instan ke nama kedua mempelai yang baru.
4. **Saat Reset (`resetWeddingData`)**:
   - Judul tab browser kembali ke default jika pengguna menekan reset.

### B. Sinkronisasi Reaktif di `app/page.tsx`
- Menjaga efek reaktif `useEffect` di halaman utama agar mendengarkan setiap perubahan nama mempelai (`weddingData.groom.name`, `weddingData.groom.fullName`, `weddingData.bride.name`, `weddingData.bride.fullName`) dan langsung memperbarui `document.title`.

---

## 3. Rencana Pengujian & Verifikasi
- Menguji pengubahan nama mempelai pada menu Admin (misalnya mengubah nama mempelai pria & wanita) dan memverifikasi bahwa judul label tab browser langsung berganti menjadi `The Wedding of [Nama Baru 1] & [Nama Baru 2]`.
- Me-refresh browser untuk memastikan judul tab tetap persisten dengan nama baru.
- Menjalankan `compile_applet` dan `lint_applet` untuk menjamin tidak ada regresi atau error.
