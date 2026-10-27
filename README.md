# Meputrip — Indonesia travel prototype

Frontend React + Vite + TypeScript + Tailwind CSS + Lucide React. Proyek lokal, tanpa backend, tanpa API key untuk mode default.

## Menjalankan

Node.js 22.20+ direkomendasikan (versi yang dipakai saat verifikasi), npm 10+.

```powershell
cd C:\Users\PUTRA\Documents\Putra\Project\Meputrip
npm ci
npm run dev
```

Buka URL Local yang dicetak terminal (default http://127.0.0.1:5173). `npm ci` tidak diperlukan ulang jika `node_modules` sudah tersedia. Jangan membuka index.html langsung sebagai file.

```powershell
npm test
npm run build
npm run preview
```

Preview production default http://127.0.0.1:4173. `dist/` adalah hasil build statis dan dapat ditempatkan pada static hosting. Tidak ada server aplikasi, pemesanan, atau pembayaran. `package-lock.json` menyimpan versi dependency yang teruji.

## Alur utama

1. Tunggu reveal pulau, atau langsung klik/tap peta. Heading muncul setelah jeda singkat tanpa memblokir kontrol.
2. Pilih satu dari delapan wilayah melalui SVG atau tombol wilayah. Wilayah aktif berwarna merah; nama selalu tersedia sebagai label/tombol.
3. Dropdown menampilkan kota wilayah tersebut. Pilih kota, lalu gunakan tombol panah untuk berpindah ke katalog.
4. Katalog dan kategori berubah tanpa reload. Ganti pulau untuk mengganti konteks dan mereset kota/kategori.
5. Buka detail destinasi/paket, atau susun konsultasi melalui formulir custom trip.

Peta memiliki keyboard Enter/Space, fokus terlihat, dan tombol pendamping 44px untuk tap pulau kecil. Dropdown memakai elemen select native. Dialog native mendukung Escape dan menahan fokus selama terbuka. CSS menghormati prefers-reduced-motion. Tata letak disesuaikan pada 1100, 760, dan 440px.

## Struktur

```text
Meputrip/
├── public/images/                 # Foto ilustrasi lokal
├── src/
│   ├── components/                # Header, peta SVG, card, dialog, inquiry
│   ├── config/site.ts             # Konfigurasi publik dari VITE_ env
│   ├── data/mock.ts               # Seluruh data contoh, relasi ID
│   ├── data/mapPaths.json         # Geometri SVG lokal per wilayah
│   ├── hooks/useTravelData.ts     # Load, error, retry, abort
│   ├── sections/                  # Explorer dan konten perusahaan
│   ├── services/                  # Repository, parser CSV, validasi, tests
│   ├── types/travel.ts            # Kontrak tipe TravelData
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── docs/sheets/                   # 8 template CSV siap impor
├── docs/GOOGLE_SHEETS.md
├── docs/ASSET_SOURCES.md
├── scripts/                       # Generator peta & template
├── .env.example
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

## Arsitektur dan perubahan konten

`TravelRepository.load(signal)` mengembalikan satu kontrak `TravelData`. `mockRepository` dan `sheetsRepository` dipilih melalui konfigurasi, sedangkan komponen hanya menerima data bertipe. Tidak ada fetching langsung di card atau peta. State pulau/kota/kategori berada pada Explorer; filter paket berdiri sendiri. Anchor digunakan untuk section satu halaman sehingga React Router belum diperlukan. CSS animation menggantikan kebutuhan library animasi tambahan.

Edit `src/data/mock.ts` untuk konten prototype. ID wilayah tetap: `sumatra`, `jawa`, `kalimantan`, `sulawesi`, `bali`, `nusa-tenggara`, `maluku`, `papua`. Pertahankan relasi `regionId` dan `cityId`. Foto dapat diganti di `public/images/`; data mendukung HTTPS image URL atau `/images/`.

Ganti kontak kosong dengan data perusahaan yang benar. Set `VITE_WHATSAPP_NUMBER` di `.env.local` (lihat `.env.example`), tanpa tanda +. Jika belum diatur, CTA hanya menyusun pesan demo dan menyediakan salin pesan. Form tidak menyimpan data atau mengirim pesan otomatis.

Google Sheets **belum terhubung**. Lihat [panduan Google Sheets](docs/GOOGLE_SHEETS.md). Mode Sheets tidak diam-diam fallback ke mock: kegagalan menampilkan error dan retry, sehingga status sumber data tetap jelas.

## Geometri peta

Path SVG berasal dari Natural Earth 1:10m, bukan gambar referensi. Generator mengambil fitur Indonesia, melakukan proyeksi equirectangular ke viewBox 1040×420, mengurangi titik kecil, dan mengelompokkan poligon melalui bounding box geografis. Ini peta eksplorasi wisata, bukan peta batas administratif atau navigasi. Kalimantan/Papua menampilkan bagian Indonesia. Pulau kecil dikelompokkan, dengan kontrol wilayah pendamping pada mobile. Generator memerlukan internet hanya jika dijalankan ulang; aplikasi memakai JSON yang sudah disimpan.

```powershell
node scripts/generate-map.mjs
node scripts/export-sheet-templates.mjs
```

Periksa siluet dan pengelompokan setelah mengganti dataset. Sumber serta lisensi: [ASSET_SOURCES.md](docs/ASSET_SOURCES.md).

## Sudah berfungsi

- Delapan wilayah SVG terpisah; hover, label, active state, reveal bertahap, reduced motion.
- 24 kota, 28 destinasi, 8 contoh paket; pemilihan pulau → kota → katalog; kategori dan filter paket.
- Detail destinasi dan paket, daftar open trip, custom inquiry dengan preview pesan.
- Navigasi desktop/mobile; profil, visi/misi, nilai layanan, legalitas, testimoni, kontak/footer.
- Repository mock dan adapter publikasi CSV Google Sheets; validasi ID, relasi, tipe, URL gambar; loading/error/empty/retry.

## Masih placeholder / batas prototype

- Logo/identitas visual sementara, draft profil dan janji layanan.
- Harga, tanggal keberangkatan, ketersediaan, fasilitas, kontak, alamat, jam operasional, dokumen legal.
- Testimoni diberi label dummy; foto diberi label ilustrasi dan bisa berbeda dari destinasi spesifik.
- Tidak ada pemesanan, pembayaran, admin dashboard, atau data pengguna tersimpan.
- Data Sheets publik dapat dibaca siapa pun. Konten privat membutuhkan proxy/backend berautentikasi di tahap lanjutan.
- State pilihan disimpan selama halaman aktif; reload kembali ke tampilan awal.

## Verifikasi

Lihat `docs/VERIFICATION.md` untuk hasil nyata dan batas pemeriksaan. Test memeriksa parser CSV, integritas relasi, ID peta, dan placeholder. Build menjalankan TypeScript strict lalu Vite production bundling.

## Repository dan alur maintenance

Repository: https://github.com/hmzahiqball/meputrip-new

Untuk checkout baru:

```powershell
git clone https://github.com/hmzahiqball/meputrip-new.git
cd meputrip-new
npm ci
npm run dev
```

History awal dipisahkan berdasarkan tanggung jawab: setup React/Vite, model data dan adapter Sheets, explorer peta dan katalog, fitur travel dan company profile, lalu dokumentasi dan template CMS.

Untuk perubahan berikutnya, buat branch dari `main`, kelompokkan perubahan terkait dalam commit terpisah (`feat`, `fix`, `docs`, atau `chore`), lalu jalankan `npm test` dan `npm run build` sebelum push. Jangan commit `node_modules`, `dist`, `.env*` selain `.env.example`, atau credential privat. `.gitattributes` menormalkan source text menjadi LF agar diff lintas Windows/Linux tetap bersih.

Panduan animasi komponen, urutan reveal peta, tombol replay, dan reduced motion: [docs/MOTION.md](docs/MOTION.md).
