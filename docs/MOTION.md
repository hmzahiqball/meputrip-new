# Motion dan animasi masuk

## Komponen halaman

`src/components/Reveal.tsx` mempertahankan elemen semantik melalui prop `as`, sehingga grid, section, article, dan figure tidak memperoleh wrapper tambahan. `useInViewOnce` memakai IntersectionObserver untuk menjalankan reveal sekali ketika komponen masuk viewport; observer dan listener dibersihkan saat unmount. Tidak ada dependency animasi tambahan.

Durasi dan stagger berada di `src/styles/motion.css`. Heading, kartu katalog/paket, profil, legalitas, dan footer memakai opacity + translateY. Dialog dan preview pesan memakai animasi pendek saat dibuka. Reveal kartu baru tetap bekerja setelah filter berubah; kartu yang sudah terlihat tidak menghilang saat scroll balik.

Gunakan `<Reveal className="...">...</Reveal>` atau `<Reveal as="article">...</Reveal>`. Prop `delay` (milidetik) opsional. Stagger grid dibatasi 240ms. Fokus keyboard menampilkan konten segera. Pada prefers-reduced-motion, konten tetap terlihat tanpa animasi atau transisi. Browser tanpa IntersectionObserver langsung menampilkan konten.
