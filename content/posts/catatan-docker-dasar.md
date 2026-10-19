+++
title = 'Catatan Docker Dasar'
date = '2026-09-05T09:00:00+07:00'
description = 'Perintah Docker yang sering dipakai: build, run, logs, dan membersihkan sumber daya.'
categories = ['Linux']
tags = ['docker']
+++

Beberapa perintah yang sering dipakai:

```bash
docker build -t aplikasi-saya .
docker run -d --name web -p 8080:80 aplikasi-saya
docker logs -f web
docker system prune
```
