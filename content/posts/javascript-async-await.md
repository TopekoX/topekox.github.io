+++
title = 'Async dan Await di JavaScript'
date = '2026-09-15T09:00:00+07:00'
description = 'Menulis kode asinkron yang terbaca seperti kode biasa.'
categories = ['Pemrograman']
tags = ['javascript']
+++

`async`/`await` membuat kode berbasis *Promise* lebih mudah dibaca.

```javascript
async function ambilJudul(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.map((p) => p.title);
  } catch (err) {
    console.error('Gagal memuat', err);
    return [];
  }
}
```
