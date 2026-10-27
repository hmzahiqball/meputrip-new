# Hasil verifikasi prototype

Tanggal: 26 Oktober 2026 (Asia/Jakarta).
Lingkungan: Windows, Node.js 22.20.0, npm 10.9.3.

## Pemeriksaan yang dijalankan

- `npm install`: dependency terpasang, lockfile dibuat.
- `npm test`: **18 tests passed**, satu file test. Parser menangani BOM, kutip, koma, newline; validasi ID/relasi/peta; adapter delapan tabel CSV; respons HTML, HTTP 403, kolom hilang termasuk tabel tanpa baris.
- `npm run build`: **berhasil**, TypeScript strict dan bundling Vite production. Hasil terakhir: JS 468.07 kB (gzip 150.42 kB), CSS 32.72 kB (gzip 7.95 kB).
- `npm audit --audit-level=low`: **0 vulnerabilities** pada pemeriksaan akhir.
- HTTP development dan production preview: **200**.

## Browser QA yang benar-benar dilakukan

Menggunakan browser in-app, termasuk build production pada port 4173:

- Klik path SVG Jawa → dropdown memuat Bandung, Jakarta, Yogyakarta, Semarang, Surabaya, Banyuwangi.
- Pilih Yogyakarta → katalog menjadi 2 destinasi; dialog Candi Prambanan terbuka.
- Delapan path SVG diaktifkan dengan Enter; masing-masing memilih kota dan memperbarui heading katalog: Medan, Yogyakarta, Pangkalan Bun, Manado, Ubud, Labuan Bajo, Ambon, Raja Ampat.
- Space pada path Bali → active state Bali, kota Ubud dan katalog sesuai.
- Dialog detail → inquiry; form demo diisi dengan data contoh → pesan tersusun, nomor WhatsApp belum diatur, tanpa pengiriman.
- Escape menutup dialog.
- Menu mobile dibuka dan link tampil.
- Filter paket Bali → hanya paket Bali pada grid; paket Sumatra tidak ada; dialog detail paket Bali terbuka.
- Viewport yang diperiksa: desktop default, 1440×1080, tablet 768×1024, mobile 390×844. Lebar area konten bisa berkurang 15px karena scrollbar browser.
- DOM mobile, tablet, desktop: tidak ada overflow horizontal pada pemeriksaan.
- Gambar yang telah selesai dimuat pada halaman yang diperiksa: tidak ada naturalWidth 0.
- Console production pada pengujian delapan wilayah: tidak ada error/warning yang tertangkap.
- Screenshot desktop dan mobile disimpan sebagai bukti hasil di folder outputs chat.

Saat pengembangan, browser development sempat kehilangan koneksi setelah restart Vite. Pengujian dilanjutkan pada server preview production yang berhasil diakses. Tidak ada perubahan keamanan/firewall sistem.

## Batas verifikasi

- Google Sheets sungguhan belum dikonfigurasi. Adapter diuji menggunakan respons CSV terkontrol, termasuk jalur error; bukan klaim koneksi ke akun/spreadsheet pengguna.
- WhatsApp sungguhan tidak dihubungi dan pembayaran/pemesanan tidak tersedia.
- Mobile/tablet diuji lewat viewport browser, bukan perangkat fisik.
- Reduced motion diimplementasikan dengan media query dan diperiksa di source; preferensi OS tidak diubah untuk pengujian langsung.
- Loading/error/empty state tersedia; tidak semua variasi konten spreadsheet kosong diuji secara visual.
- Geometri kelompok pulau adalah penyederhanaan wisata berdasarkan Natural Earth; belum ada audit kartografi untuk setiap pulau kecil.

## Verifikasi sebelum publikasi repository — 27 Oktober 2026

- `npm test`: 18 pengujian lulus kembali.
- `npm run build`: TypeScript strict dan Vite production build berhasil; output JS/CSS sesuai hasil verifikasi sebelumnya.
- `git diff --check`: tidak ada masalah whitespace pada perubahan tracked.
- `node_modules`, `dist`, `.env.local`, `.env.production`, dan `*.tsbuildinfo` diabaikan; `.env.example` dilacak.
- Pemeriksaan pola private key dan token umum tidak menemukan credential pada source tracked. Tidak ada perubahan konten/fungsi aplikasi dalam tahap penambahan Git history.
