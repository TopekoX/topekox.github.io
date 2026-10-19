+++
title = 'Memahami Pengurutan Tumpukan (Heap Sort)'
date = '2026-09-10T09:00:00+07:00'
description = 'Heap sort membangun heap maksimum lalu menukar elemen teratas dengan elemen terakhir berulang kali.'
categories = ['Algoritma']
tags = ['algoritma', 'pengurutan']
math = true
+++

Kunci heap sort adalah membangun *max-heap*, lalu menukar elemen teratas dengan elemen terakhir dan memperbaiki heap untuk sisa elemen.

```python
def heapify(a, n, i):
    terbesar, kiri, kanan = i, 2 * i + 1, 2 * i + 2
    if kiri < n and a[kiri] > a[terbesar]:
        terbesar = kiri
    if kanan < n and a[kanan] > a[terbesar]:
        terbesar = kanan
    if terbesar != i:
        a[i], a[terbesar] = a[terbesar], a[i]
        heapify(a, n, terbesar)

def heap_sort(a):
    n = len(a)
    for i in range(n // 2 - 1, -1, -1):
        heapify(a, n, i)
    for i in range(n - 1, 0, -1):
        a[0], a[i] = a[i], a[0]
        heapify(a, i, 0)
```

Kompleksitas waktunya \(O(n \log n)\) pada semua kasus.
