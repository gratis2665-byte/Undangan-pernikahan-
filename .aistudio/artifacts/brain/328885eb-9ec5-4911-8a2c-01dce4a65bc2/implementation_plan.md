# Rencana Implementasi: Sinkronisasi Data Lintas Browser & Ekspor Vercel

## 1. Analisis Masalah (Root Cause)
1. **Penyimpanan Lokal (LocalStorage Only)**: Saat ini, ketika pengguna mengubah data di panel Admin (nama kedua mempelai, tanggal akad, countdown timer, kisah cinta, foto, rekening), data tersebut hanya tersimpan di memori `localStorage` browser pengedit (admin).
2. **Link Tamu Belum Menyertakan Payload**: Tombol *Salin Link Tamu* saat ini hanya menyalin URL dengan parameter nama penerima saja (`?to=NamaTamu`), tanpa menyertakan paket data undangan. Akibatnya, saat link dibuka di HP tamu, WhatsApp, perangkat lain, atau browser lain, website kembali memuat data default template (*Sulthan & Nabila*).
3. **Tab Publikasi Vercel Belum Tampil di Form**: Menu navigasi *Publikasi Vercel & Tamu* sudah terdaftar di tab atas, namun bagian konten formulirnya belum terpasang di dalam body modal.

---

## 2. Solusi yang Akan Diimplementasikan (Berdasarkan Pilihan Pengguna)

Sesuai jawaban Anda: **Kombinasi Link Berbagi Otomatis + Ekspor File Vercel** serta **Generator Link Tamu Otomatis di Panel Admin**:

### A. Generator Link Berbagi & Link Tamu Otomatis (Otomatis Tampil di Semua Browser)
- **Otomatis Menyertakan Data Undangan (`wd=...`)**: Setiap kali tombol *Salin Link Tamu* atau *Salin Link Berbagi* ditekan, sistem secara cerdas membuat link yang memuat seluruh konfigurasi mempelai, tanggal pernikahan, kisah cinta, dan rekening dalam format terenkripsi URL-aman (`base64url`).
- **Otomatis Menyimpan di Browser Penerima**: Ketika tamu atau siapa pun membuka link tersebut di WhatsApp, Safari, Chrome HP, maupun browser lain:
  1. Halaman web secara otomatis membaca parameter data undangan.
  2. Mengisi seluruh nama mempelai, hitungan mundur, foto, dan kisah cinta secara instan.
  3. Menyimpannya ke browser penerima agar saat mereka membuka kembali tanpa parameter, data tetap tersimpan.
  4. Membersihkan URL secara elegan sehingga tampilan address bar tetap rapi.
- **Generator Link Tamu Cepat**: Menyediakan input nama tamu dengan pilihan preset populer, tombol **Salin Link Tamu (Lengkap dengan Data)**, tombol **Kirim via WhatsApp** dengan draft pesan undangan islami siap kirim, dan tombol **Buka Pratinjau**.

### B. Fitur Ekspor File `wedding-data.ts` untuk Vercel / GitHub (Permanen Tanpa URL Panjang)
- Menyediakan tab khusus **Publikasi Vercel & Ekspor** di panel Admin dengan fitur:
  1. **Salin Kode `lib/wedding-data.ts`**: Tombol 1-klik untuk menyalin seluruh kode TypeScript yang sudah terisi data pengantin asli Anda.
  2. **Unduh File `wedding-data.ts`**: Mengunduh langsung file `.ts` siap pakai.
  3. **Panduan Praktis Vercel**: Instruksi singkat langkah demi langkah mengganti file di repositori GitHub/Vercel agar website yang dideploy langsung menampilkan data Anda secara permanen sebagai data bawaan (default).
  4. **Cadangkan (Export JSON) & Pulihkan (Import JSON)**: Fitur backup data agar Anda dapat memindahkan pengaturan antar perangkat atau menyimpan cadangan sewaktu-waktu.

---

## 3. Rencana Perubahan Berkas (Files to Modify)

1. **`lib/share-link.ts`**:
   - Memastikan encoding dan decoding data undangan mencakup seluruh data (mempelai pria & wanita, tanggal ISO & tampilan, kisah cinta, galeri foto, rekening bank & QRIS).
   - Memastikan generator kode `wedding-data.ts` menghasilkan kode TypeScript yang bersih, valid, dan bebas error.

2. **`components/admin/AdminModal.tsx`**:
   - Memperbarui fungsi `handleCopyGuestLink` agar menyertakan data undangan lengkap secara default.
   - Menambahkan komponen lengkap untuk Tab **Publikasi Vercel & Tamu**:
     - Generator Link Tamu Otomatis + Tombol WhatsApp siap kirim.
     - Pratinjau Link yang akan dibagikan.
     - Tombol Salin Kode TypeScript & Unduh File `wedding-data.ts`.
     - Panduan deploy Vercel/GitHub dalam bahasa Indonesia yang mudah dipahami.
     - Fitur Ekspor & Impor JSON (Backup & Restore).

3. **`app/page.tsx`**:
   - Memastikan penanganan URL parameter `wd` berjalan lancar saat pertama kali dibuka di browser atau perangkat baru, langsung mengaktifkan data kustom dan menyinkronkannya tanpa kedipan layar (hydration safe).

---

## 4. Verifikasi dan Pengujian
- Menjalankan `compile_applet` dan `lint_applet` untuk memastikan tidak ada kesalahan kompilasi atau TypeScript.
- Memverifikasi bahwa link undangan tamu yang disalin membawa seluruh data mempelai dan saat dibuka di browser/tab baru, seluruh data langsung berganti sesuai input Admin.
