+++
title = 'Loop dan Kondisi di Bash'
date = '2026-10-09T09:00:00+07:00'
description = 'Pola for, while, dan if yang paling sering dipakai saat menulis skrip shell.'
categories = ['Linux']
tags = ['bash', 'shell']
+++

Beberapa pola yang hampir selalu dipakai saat menulis skrip.

```bash
#!/usr/bin/env bash
set -euo pipefail

for berkas in *.log; do
    if [[ -s "$berkas" ]]; then
        echo "Memproses $berkas"
        gzip "$berkas"
    fi
done
```

Tanda kutip di sekitar variabel mencegah masalah pada nama berkas yang mengandung spasi.
