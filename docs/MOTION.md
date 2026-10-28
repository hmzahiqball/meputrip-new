# Motion dan animasi masuk

## Komponen halaman

`src/components/Reveal.tsx` mempertahankan elemen semantik melalui prop `as`, sehingga grid, section, article, dan figure tidak memperoleh wrapper tambahan. `useInViewOnce` memakai IntersectionObserver untuk menjalankan reveal sekali ketika komponen masuk viewport; observer dan listener dibersihkan saat unmount. Tidak ada dependency animasi tambahan.

Durasi dan stagger berada di `src/styles/motion.css`. Heading, kartu katalog/paket, profil, legalitas, dan footer memakai opacity + translateY. Dialog dan preview pesan memakai animasi pendek saat dibuka. Reveal kartu baru tetap bekerja setelah filter berubah; kartu yang sudah terlihat tidak menghilang saat scroll balik.

Gunakan `<Reveal className="...">...</Reveal>` atau `<Reveal as="article">...</Reveal>`. Prop `delay` (milidetik) opsional. Stagger grid dibatasi 240ms. Fokus keyboard menampilkan konten segera. Pada prefers-reduced-motion, konten tetap terlihat tanpa animasi atau transisi. Browser tanpa IntersectionObserver langsung menampilkan konten.

## Peta Indonesia

`src/styles/map-motion.css` menggantikan reveal pulau lama. `IndonesiaMap` memakai hook viewport yang sama, lalu memunculkan pulau dalam urutan geografis tetap dari barat ke timur (tidak bergantung pada urutan baris Sheets). Setiap pulau memiliki jeda 120ms, transisi opacity/translate/scale dan blur singkat; label menyusul. Garis pemindaian dekoratif tidak menangkap pointer. Heading hero mengikuti bagian akhir reveal pulau.

Tombol **Putar ulang animasi** tersedia pada tampilan nasional dan hanya meremount grup SVG kepulauan. Fokus keyboard pada SVG segera menampilkan seluruh kontrol, tanpa menunggu animasi selesai. Pada reduced motion, semua pulau/label/kontrol langsung terlihat dan tombol replay disembunyikan. Durasi pulau lebih singkat pada mobile.

Urutan stylesheet di `main.tsx`: layout dasar → motion komponen → motion peta → drilldown peta. Saat menambahkan animasi, pertahankan override reduced-motion serta jangan memakai animasi untuk mengunci pemilihan wilayah.

## Zoom pulau dan titik lokasi

`map-drilldown.css` menganimasikan transform kamera selama 850ms. `useMapViewport` mengukur kanvas melalui ResizeObserver; viewBox mengikuti ukuran CSS sehingga label lokasi tetap setinggi 44px meskipun geometri diperbesar. Perhitungan kamera dan penempatan label dipisahkan dalam `utils/mapGeometry.ts`.

Titik lokasi muncul setelah jeda 520ms dengan stagger 65ms. Fokus keyboard menampilkannya segera. Memilih pulau memindahkan fokus ke tombol kembali, memilih lokasi memindahkan fokus ke heading katalog, dan kembali ke Indonesia memulihkan fokus ke pulau sebelumnya. Reveal awal tidak diputar ulang saat kembali dari zoom. Reduced motion meniadakan transisi kamera/marker dan memakai scroll instan.
