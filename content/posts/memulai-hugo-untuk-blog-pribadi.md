+++
title = 'Memulai Hugo untuk Blog Pribadi'
date = '2026-10-18T09:00:00+07:00'
description = 'Langkah singkat membuat situs statis dengan Hugo, dari instalasi sampai menjalankan server lokal.'
categories = ['Catatan']
tags = ['hugo', 'blog']
toc = true
+++

Hugo adalah generator situs statis yang cepat. Cukup satu berkas biner untuk membangun seluruh situs dari berkas Markdown.

## Membuat situs

Buat situs baru lalu jalankan server lokal:

```bash
hugo new site blog-saya
cd blog-saya
hugo server -D
```

Opsi `-D` ikut menampilkan konten yang masih berstatus draf.

## Menulis artikel

Setiap artikel adalah berkas Markdown dengan *front matter* di bagian atas. Judul, tanggal, dan kategori ditulis di sana.

```toml
+++
title = 'Artikel Pertama'
date = '2026-10-18'
draft = false
+++
```

Setelah itu, `hugo --minify` menghasilkan folder `public/` yang siap diunggah.
