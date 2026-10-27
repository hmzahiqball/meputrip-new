# Motion dan animasi masuk

## Komponen halaman

`src/components/Reveal.tsx` mempertahankan elemen semantik melalui prop `as`, sehingga grid, section, article, dan figure tidak memperoleh wrapper tambahan. `useInViewOnce` memakai IntersectionObserver untuk menjalankan reveal sekali ketika komponen masuk viewport; observer dan listener dibersihkan saat unmount. Tidak ada dependency animasi tambahan.

Durasi dan stagger berada di `src/styles/motion.css`. Heading, kartu katalog/paket, profil, legalitas, dan footer memakai opacity + translateY. Dialog dan preview pesan memakai animasi pendek saat dibuka. Reveal kartu baru tetap bekerja setelah filter berubah; kartu yang sudah terlihat tidak menghilang saat scroll balik.

Gunakan `<Reveal className="...">...</Reveal>` atau `<Reveal as="article">...</Reveal>`. Prop `delay` (milidetik) opsional. Stagger grid dibatasi 240ms. Fokus keyboard menampilkan konten segera. Pada prefers-reduced-motion, konten tetap terlihat tanpa animasi atau transisi. Browser tanpa IntersectionObserver langsung menampilkan konten.

## Peta Indonesia

`src/styles/map-motion.css` menggantikan reveal pulau lama. `IndonesiaMap` memakai hook viewport yang sama, lalu memunculkan pulau dalam urutan geografis tetap dari barat ke timur (tidak bergantung pada urutan baris Sheets). Setiap pulau memiliki jeda 120ms, transisi opacity/translate/scale dan blur singkat; label menyusul. Garis pemindaian dekoratif tidak menangkap pointer. Heading hero mengikuti bagian akhir reveal pulau.

Tombol **Putar ulang animasi** hanya meremount grup SVG kepulauan, sehingga pilihan pulau, kota, dan katalog tidak direset. Fokus keyboard pada SVG segera menampilkan seluruh kontrol, tanpa menunggu animasi selesai. Pada reduced motion, semua pulau/label/kontrol langsung terlihat dan tombol replay disembunyikan. Durasi pulau lebih singkat pada mobile.

Urutan stylesheet di `main.tsx`: layout dasar → motion komponen → motion peta. Saat menambahkan animasi, pertahankan override reduced-motion serta jangan memakai animasi untuk mengunci pemilihan wilayah.
