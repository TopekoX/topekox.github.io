+++
title = 'Uji Render Markdown: Gambar, Tabel, dan Kode Panjang'
date = '2026-09-01T09:00:00+07:00'
description = 'Artikel contoh untuk menguji gambar, tabel, daftar, kutipan, dan baris kode yang sangat panjang.'
categories = ['Catatan']
tags = ['markdown', 'uji']
toc = true
image = 'diagram.svg'
imageAlt = 'Diagram contoh berisi lingkaran dan persegi panjang'
imageWidth = 640
imageHeight = 200
+++

Artikel ini sengaja memuat berbagai elemen Markdown.

## Gambar

![Diagram contoh berisi lingkaran dan persegi panjang](diagram.svg)

## Tabel

| Bahasa | Tahun | Catatan |
|---|---|---|
| Python | 1991 | Dinamis, mudah dibaca |
| Go | 2009 | Konkurensi bawaan |
| Hugo | 2013 | Generator situs statis yang sangat cepat dan ditulis dengan bahasa Go |

## Daftar

- Poin pertama
- Poin kedua
  - Poin bersarang
- Poin ketiga

1. Langkah satu
2. Langkah dua
3. Langkah tiga

## Kutipan

> Kesederhanaan adalah syarat utama bagi keindahan.

## Kode dengan baris sangat panjang

```bash
curl --silent --show-error --location --header "Accept: application/json" --header "Authorization: Bearer TOKEN_YANG_SANGAT_PANJANG_SEKALI_UNTUK_MENGUJI_SCROLL_HORIZONTAL" "https://example.org/api/v1/sumber-daya/yang/sangat/panjang?halaman=1&per_halaman=100&urut=tanggal"
```

Kode sebaris seperti `hugo --gc --minify` harus terlihat berbeda dari teks biasa.
