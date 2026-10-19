+++
title = 'Menulis Konfigurasi YAML yang Rapi'
date = '2026-09-28T09:00:00+07:00'
description = 'Tips agar berkas YAML mudah dibaca dan tidak rawan salah indentasi.'
categories = ['Catatan']
tags = ['yaml']
+++

YAML sensitif terhadap indentasi, jadi gunakan dua spasi secara konsisten dan hindari tab.

```yaml
layanan:
  web:
    image: nginx:stable
    ports:
      - "8080:80"
    environment:
      MODE: produksi
```
