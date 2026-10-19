+++
title = 'Flexbox dan Grid pada CSS'
date = '2026-10-03T09:00:00+07:00'
description = 'Kapan memakai Flexbox dan kapan memakai Grid untuk tata letak halaman.'
categories = ['Web']
tags = ['css', 'html']
+++

Flexbox cocok untuk satu dimensi (baris atau kolom). Grid cocok untuk dua dimensi.

```html
<div class="halaman">
  <aside>Sidebar</aside>
  <main>Konten</main>
</div>
```

```css
.halaman {
  display: grid;
  grid-template-columns: 256px 1fr;
  gap: 12px;
}
```
