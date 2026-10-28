# Sumber aset

## Peta

- Natural Earth, skala 1:10m Admin 0 countries.
- Sumber: https://www.naturalearthdata.com/
- GeoJSON mirror repository pembuat: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson
- Lisensi: public domain, https://www.naturalearthdata.com/about/terms-of-use/
- Diolah lokal menjadi SVG: proyeksi equirectangular, pengurangan vertex, pengelompokan pulau. Untuk eksplorasi wisata, bukan batas hukum/navigasi.
- Gambar Gemini dari user dipakai hanya sebagai referensi komposisi, siluet terang, dan reveal; tidak disalin ke aset website.

## Foto ilustrasi

Foto dari Unsplash disimpan lokal. Gambar tidak dimaksudkan untuk membuktikan dokumentasi tempat/paket tertentu. Periksa kembali foto dan hak penggunaan sebelum memakai merek/perusahaan secara komersial. Lisensi: https://unsplash.com/license

| Aset lokal         | Sumber                                                       |
| ------------------ | ------------------------------------------------------------ |
| bali.jpg           | https://images.unsplash.com/photo-1537996194471-e657df975ab4 |
| bromo.jpg          | https://images.unsplash.com/photo-1589308078059-be1415eab4c3 |
| bajo.jpg, raja.jpg | https://images.unsplash.com/photo-1516690561799-46d8f74f9abf |
| forest.jpg         | https://images.unsplash.com/photo-1448375240586-882707db888b |
| temple.jpg         | https://images.unsplash.com/photo-1555400038-63f5ba517a47    |

URL foto lengkap dan ukuran unduhan tersedia di scripts/download-images.mjs. Nama file adalah peran ilustrasi, bukan verifikasi lokasi foto. Ikon: Lucide React (ISC). Font memakai system sans-serif dan Georgia, tanpa request font eksternal.

## Koordinat kota, kabupaten, dan kawasan

Data pada `src/data/cityLocations.json` diadaptasi dari ekstrak Indonesia GeoNames, diunduh 28 Oktober 2026 dari https://download.geonames.org/export/dump/ID.zip. Kolom `geonameId` mempertahankan ID sumber untuk audit. Tautan tiap catatan: `https://www.geonames.org/{geonameId}`.

Sumber/penjelasan: https://www.geonames.org/export/ dan https://download.geonames.org/export/dump/readme.txt. Lisensi **Creative Commons Attribution 4.0** (https://creativecommons.org/licenses/by/4.0/). Kredit juga tampil di bawah peta aplikasi.

Perubahan: memilih 24 lokasi katalog, memetakan ke ID internal, menambahkan jenis tampilan (`kota`, `kabupaten`, `kawasan`), lalu memproyeksikan koordinat dengan proyeksi yang sama dengan siluet Natural Earth. Titik merupakan lokasi representatif/centroid, bukan batas administratif dan bukan koordinat setiap objek wisata. Lombok, Toraja, Ubud, dan beberapa tempat lain tetap diberi label kawasan; tidak semuanya merupakan kota otonom atau kabupaten. Data tidak mencakup seluruh kota/kabupaten Indonesia.
