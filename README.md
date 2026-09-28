# CYCLEA — *From Waste to Clean*

Prototype website **CYCLEA**, platform digital ekonomi sirkular untuk mengatasi permasalahan
minyak jelantah rumah tangga. Website ini dibuat dengan pendekatan **vibe coding**:
ide, struktur, fitur, dan desain diterjemahkan langsung menjadi kode oleh AI.

---

## 🚀 Cara Menjalankan

Tidak perlu build tools atau server khusus — cukup buka file-nya:

```text
index.html
```

Dua cara:

1. **Langsung** — klik dua kali `index.html` di File Explorer.
2. **Dengan local server** (opsional, agar persis seperti production):

   ```bash
   python -m http.server 8765
   # lalu buka http://localhost:8765
   ```

---

## 📁 Struktur File

| File | Fungsi |
|---|---|
| `index.html` | Seluruh konten halaman: navbar, hero, masalah, cara kerja, fitur, produk, dampak, FAQ, CTA, footer |
| `register.html` | Halaman pendaftaran akun — wizard 3 langkah (buat akun → profil → verifikasi OTP) |
| `login.html` | Halaman masuk akun dengan verifikasi ke data pendaftaran |
| `styles.css` | Design system & seluruh styling (hijau–putih), responsif untuk desktop/tablet/mobile |
| `auth.css` | Styling khusus halaman daftar & masuk (split card, form, wizard, OTP) |
| `script.js` | Interaksi halaman utama: menu mobile, navigasi aktif, animasi angka, estimasi setoran, grafik, FAQ, modal produk |
| `auth.js` | Interaksi halaman daftar & masuk: validasi form, langkah wizard, OTP, toggle kata sandi, simpan/cek akun (localStorage) |

---

## 🎨 Dasar Desain

Mengikuti referensi visual yang diberikan:

- **Palet warna**: hijau tua (`#06341f`, `#0f5f34`), hijau segar (`#1a9150`), aksen lime
  (`#a3e635`), dasar putih & mint sangat muda (`#f3faf5`) — bersih, modern, ramah lingkungan.
- **Navbar pill mengambang** dengan sudut membulat penuh, tombol pencarian, dan CTA
  *Setor Minyak* seperti pada referensi.
- **Hero gradien hijau gelap** dengan badge `Ekonomi Sirkular • Rumah Tangga`,
  judul besar *From Waste to **Clean***, tombol lime `Ajukan Setoran`, serta ilustrasi SVG
  (botol minyak → sabun → daun) yang dibuat murni dengan kode tanpa file gambar.
- **Bar estimasi setoran** (bentuk pil putih) meniru elemen search bar pada referensi.
- **Tipografi**: Plus Jakarta Sans (Google Fonts), fallback sistem jika offline.
- **Kartu bersudut membulat**, bayangan lembut, ilustrasi emoji + SVG, tanpa file aset eksternal
  selain font.

---

## 🧩 Struktur Fitur (sesuai mind map)

| Fase | Fitur | Sub-fitur yang ditampilkan di website |
|---|---|---|
| 1 | Peta Titik Pengumpulan | Cari titik terdekat, detail titik, rute & jarak, jam operasional |
| 1 | Setor Minyak Jelantah | Form ajukan setoran, estimasi berat & harga, pilih titik & jadwal |
| 2 | Riwayat & Saldo | Saldo & poin, riwayat setoran, status pencairan, bukti setoran |
| 2 | Alamat Rumah Saya | Tambah alamat, pilih alamat utama, edit & hapus, penanda peta |
| 2 | Katalog Produk Daur Ulang | Daftar produk, detail & manfaat, harga & cara beli, ulasan |
| 3 | Dampak & Statistik | Total terkumpul, dampak lingkungan, kontribusi saya, partisipasi wilayah |
| 3 | Panduan, FAQ & Kontak | Cara kerja CYCLEA, sejarah & visi misi, tanya jawab |
| 4 | Akun & Menu Profil | Daftar akun, masuk & keluar, atur profil, notifikasi |

Setiap kartu fitur diberi label **Fase 1–4** sesuai peta perencanaan.

---

## ⚙️ Fitur Interaktif

- **Estimasi setoran** — geser slider berat (1–20 kg), pilih titik pengumpulan, dan lihat
  estimasi rupiah (`Rp 4.500/kg`) + poin CYCLEA secara langsung.
- **Animasi penghitung angka** — statistik (12.840 liter, 76 titik, 2.150 keluarga, dll.)
  berjalan saat masuk layar.
- **Grafik batang interaktif** — jumlah minyak terkumpul per bulan, tumbuh saat di-scroll.
- **FAQ accordion** — hanya satu pertanyaan terbuka dalam satu waktu.
- **Modal detail produk** — tombol *Lihat Detail* membuka kartu detail (kegunaan, harga,
  ukuran, kandungan, cara beli).
- **Navigasi mengikuti scroll** — menu aktif menyesuaikan section yang sedang terlihat.
- **Menu burger** untuk tablet & mobile.
- **Reveal on scroll** — section muncul halus saat di-scroll.

---

## 🔐 Halaman Daftar & Masuk

Layout **split card** sesuai referensi: panel kiri berupa gradient hijau berisi logo, badge,
headline besar, dan kartu langkah; panel kanan berisi form.

**`register.html` — wizard 3 langkah** (kartu langkah di panel kiri ikut menyala mengikuti proses):

1. **Buat akun** — nomor telepon `+62`, nama lengkap, username (validasi + centang tersedia),
   kata sandi dengan indikator aturan (min 12, maks 20, huruf besar/kecil, angka & simbol).
2. **Atur profil** — email, kota/kabupaten (dropdown), alamat lengkap untuk titik jemput.
3. **Verifikasi** — input OTP 6 digit (auto-focus, dukung paste) + penghitung kirim ulang 60 detik.

Berhasil → tampil halaman sukses, data akun disimpan ke `localStorage` (`cyclea_account`).

**`login.html`** — email/username + kata sandi, "Ingat saya" (mengingat identifier),
"lupa kata sandi", tombol mata tampil/sembunyi, serta tombol Google. Kredensial dicek ke data
pendaftaran yang tersimpan; pesan error berbeda untuk *akun belum terdaftar*, *identitas salah*,
dan *kata sandi salah*.

**Modal detail statistik** — ketiga kartu statistik di panel kiri (12.840 liter · 76 titik ·
2.150 keluarga) kini berbentuk tombol yang bisa diklik: memunculkan panah `→`, efek *hover*,
dan dialog berisi deskripsi, 4 baris rincian, catatan perhitungan, serta tombol
*Lihat Laporan Dampak* yang mengarah ke `index.html#dampak`. Dialog dapat ditutup lewat
tombol ✕, klik area luar, atau tombol **Esc**, dan fokus kembali ke kartu yang diklik.

Keduanya terhubung dua arah: `Masuk → Daftar` dan `Daftar → Masuk`, plus tautan
**Masuk** pada navbar dan **Daftar Akun / Masuk** pada footer halaman utama.

---

## 📱 Responsif

| Lebar | Tata letak |
|---|---|
| ≥ 1180px | Navigasi penuh, 4 kolom fitur, 4 langkah alur, hero 2 kolom |
| 900–1180px | Ikon pencarian disembunyikan, fitur 2 kolom, estimasi 2 kolom |
| ≤ 900px | Menu burger, hero menumpuk, sebagian besar grid menjadi 1–2 kolom |
| ≤ 640px | Semua grid 1 kolom, grafik menampilkan 6 bulan pertama |

---

## ♿ Kualitas

Hasil audit Lighthouse:

- **Accessibility: 100**
- **Best Practices: 100**
- **SEO: 100**

Struktur heading berurutan, landmark `<main>`, label aksesibel untuk tombol ikon,
kontras teks terpenuhi, dan seluruh konten tetap terbaca tanpa JavaScript.

---

## 🔮 Pengembangan Lanjutan (di luar prototype ini)

- Peta titik pengumpulan berbasis lokasi nyata (Leaflet / Google Maps API).
- Autentikasi pengguna, penyimpanan saldo & poin, dan pencairan uang.
- Panel admin untuk agen: menerima setoran, memverifikasi berat, dan mencetak bukti.
- Pemesanan produk & integrasi pembayaran.
- Dasbor statistik dampak secara real time.
