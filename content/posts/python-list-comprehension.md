+++
title = 'List Comprehension di Python'
date = '2026-10-15T09:00:00+07:00'
description = 'Cara ringkas membuat list baru dari list lain, lengkap dengan kondisi dan contoh nyata.'
categories = ['Pemrograman']
tags = ['python']

[codePreview]
  lang = 'python'
  code = '''kuadrat = [x ** 2 for x in range(10) if x % 2 == 0]
print(kuadrat)  # [0, 4, 16, 36, 64]'''
+++

*List comprehension* adalah sintaks Python untuk membangun list dalam satu baris.

Bentuk dasarnya adalah `[ekspresi for item in iterabel if kondisi]`.

```python {linenos=true}
kata = ["hugo", "python", "go", "bash"]
panjang = {k: len(k) for k in kata}
pendek = [k for k in kata if len(k) <= 4]

print(panjang)
print(pendek)
```

Gunakan secukupnya. Jika ekspresi mulai sulit dibaca, perulangan biasa lebih jelas.
