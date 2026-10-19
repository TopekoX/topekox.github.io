+++
title = 'Dasar SQL JOIN'
date = '2026-09-20T09:00:00+07:00'
description = 'Perbedaan INNER JOIN dan LEFT JOIN dengan contoh tabel penulis dan artikel.'
categories = ['Basis Data']
tags = ['sql']
+++

`INNER JOIN` hanya mengambil baris yang cocok di kedua tabel. `LEFT JOIN` mempertahankan semua baris dari tabel kiri.

```sql
SELECT p.nama, COUNT(a.id) AS jumlah_artikel
FROM penulis p
LEFT JOIN artikel a ON a.penulis_id = p.id
GROUP BY p.nama
ORDER BY jumlah_artikel DESC;
```
