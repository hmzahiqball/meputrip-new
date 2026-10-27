# Integrasi Google Sheets sebagai CMS

## Metode yang dipilih

Prototype memakai tab Google Sheets yang **dipublikasikan secara eksplisit sebagai CSV**, sehingga frontend tidak membutuhkan API key. Ini sesuai untuk katalog yang memang boleh dilihat publik. Izin spreadsheet biasa dan Publish to web adalah hal terpisah; adapter tidak mengasumsikan keduanya sudah diatur. Tidak ada koneksi Sheets aktif dalam hasil prototype ini.

Untuk konten privat atau workflow tulis, gunakan backend/proxy tipis yang menyimpan credential di server, atau autentikasi pengguna yang dirancang khusus. Jangan memasukkan service account JSON, private key, access token permanen, atau secret API key ke `VITE_` maupun source frontend. Semua VITE_ masuk bundle publik.

## Menyiapkan spreadsheet

1. Buat spreadsheet baru berisi delapan tab sesuai template `docs/sheets/*.csv`.
2. Impor setiap CSV ke tab bernama sama; gunakan baris pertama sebagai header, jangan mengubah kapitalisasi kolom.
3. Pertahankan ID dan relasi. Hapus hanya data yang memang tidak dibutuhkan. `company` dan `contact` harus tepat satu baris. Tabel lain boleh header saja untuk empty state.
4. Dari Google Sheets pilih File → Share → Publish to web, pilih tab dan format CSV. Nama menu dapat berbeda menurut bahasa/akun; organisasi mungkin menonaktifkan publikasi.
5. Salin published ID (bagian `/d/e/2PACX-.../pub`) serta gid setiap tab. Bukan spreadsheet ID biasa pada `/d/<id>/edit`.
6. Salin `.env.example` menjadi `.env.local`. Set `VITE_DATA_SOURCE=sheets`, `VITE_SHEETS_PUBLISHED_ID`, dan seluruh `VITE_SHEETS_*_GID`. gid `0` valid. Restart Vite setelah perubahan env, build ulang untuk production.
7. Periksa URL CSV dapat diakses tanpa login melalui browser baru. Jika tidak, perbaiki izin publikasi; jangan memasukkan credential privat di frontend.

Endpoint dibentuk oleh adapter:

```text
https://docs.google.com/spreadsheets/d/e/{publishedId}/pub?gid={gid}&single=true&output=csv
```

Perubahan publikasi Google dapat memerlukan waktu untuk muncul. Adapter melakukan fetch delapan tab saat halaman dimuat; belum ada realtime subscription atau cache persisten. Browser harus memiliki akses internet dan endpoint harus mengizinkan akses dari origin frontend.

## Skema

| Tab          | Kolom                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------- |
| regions      | id, name, tagline, description                                                                 |
| cities       | id, regionId, name                                                                             |
| destinations | id, cityId, regionId, name, description, category, image, imageAlt                             |
| packages     | id, regionId, cityId, name, duration, price, type, departure, availability, image, description |
| testimonials | id, name, quote, trip, rating, isDemo                                                          |
| company      | name, story, vision, mission                                                                   |
| legal        | id, title, status, url                                                                         |
| contact      | whatsapp, email, phone, address, instagram, hours                                              |

`regions.id` harus salah satu dari delapan ID yang tersedia di peta. `cityId` dan `regionId` pada destinasi/paket harus cocok. `type` hanya `open` atau `private`. `rating` bilangan bulat 1–5 dan `isDemo` teks `true`/`false`. Pertahankan `true` untuk contoh ulasan; jangan mengubahnya menjadi ulasan sungguhan tanpa sumber pelanggan nyata.

Gambar: gunakan URL HTTPS yang boleh dipublikasikan atau `/images/nama.jpg` untuk aset build lokal. Template menggunakan aset lokal yang sudah disertakan. `legal.url` boleh kosong dan tautan ditampilkan hanya untuk HTTPS. `contact.instagram` gunakan URL HTTPS Instagram, bukan @handle. Kontak opsional boleh kosong; URL WhatsApp hanya dibuat setelah nomor publik valid diisi.

## Error dan fallback

Adapter menolak konfigurasi kosong, respons non-2xx, halaman HTML/login, CSV malformed, header hilang, ID duplikat, wilayah asing, serta relasi kota yang tidak konsisten. Tabel dengan header tanpa baris menghasilkan array kosong. UI menampilkan loading, error dengan retry, atau empty state sesuai hasil.

Tidak ada fallback otomatis ke mock dalam mode Sheets. Untuk kembali ke demo secara sadar, ubah `VITE_DATA_SOURCE=mock` dan restart/build ulang. Jangan mengisi data privat pada spreadsheet yang dipublikasikan.

Referensi resmi: [Google — memublikasikan file](https://support.google.com/docs/answer/183965), [Sheets API authorization](https://developers.google.com/workspace/sheets/api/guides/authorizing).
