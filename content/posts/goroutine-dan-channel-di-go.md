+++
title = 'Goroutine dan Channel di Go'
date = '2026-10-06T09:00:00+07:00'
description = 'Pengantar konkurensi di Go dengan goroutine dan channel.'
categories = ['Pemrograman']
tags = ['go', 'konkurensi']
+++

Go membuat konkurensi terasa ringan. Goroutine dijalankan dengan kata kunci `go`, dan channel dipakai untuk bertukar data.

```go
package main

import "fmt"

func main() {
	hasil := make(chan int)
	go func() {
		jumlah := 0
		for i := 1; i <= 10; i++ {
			jumlah += i
		}
		hasil <- jumlah
	}()
	fmt.Println(<-hasil)
}
```
