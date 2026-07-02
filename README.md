# GaussElim - Kalkulator Eliminasi Gauss

## Anggota Kelompok

| No | Nama | NIM |
| --- | --- | --- |
| 1 | Nama Anggota 1 | NIM Anggota 1 |
| 2 | Nama Anggota 2 | NIM Anggota 2 |
| 3 | Nama Anggota 3 | NIM Anggota 3 |
| 4 | Nama Anggota 4 | NIM Anggota 4 |

## Deskripsi

GaussElim adalah aplikasi web interaktif untuk menyelesaikan Sistem Persamaan Linear (SPL) menggunakan metode Eliminasi Gauss. Aplikasi ini menampilkan hasil akhir variabel sekaligus langkah-langkah eliminasi baris dan substitusi mundur agar proses perhitungan lebih mudah dipahami.

Project ini dibuat untuk tugas Mata Kuliah Metode Numerik.

## Fitur

- Input matriks augmented dengan ukuran 2x2 sampai 6x6.
- Penyelesaian SPL menggunakan Eliminasi Gauss.
- Pivoting parsial untuk memilih pivot yang lebih stabil.
- Visualisasi langkah eliminasi dan substitusi mundur.
- Validasi input agar nilai kosong atau format tidak valid tidak ikut dihitung.
- Deteksi sistem yang tidak memiliki solusi atau tidak memiliki solusi tunggal.
- Tombol acak nilai untuk mencoba contoh matriks dengan cepat.
- Tampilan responsif untuk desktop dan mobile.

## Teknologi

- HTML5
- CSS3
- JavaScript Vanilla

## Cara Menjalankan

### Cara 1: Buka langsung di browser

Klik dua kali file `index.html`, atau buka file tersebut melalui browser.

### Cara 2: Menggunakan server lokal

Jalankan perintah berikut di folder project:

```bash
python -m http.server 8765
```

Lalu buka:

```text
http://127.0.0.1:8765
```

## Cara Menggunakan

1. Pilih ukuran matriks yang ingin dihitung.
2. Masukkan koefisien setiap variabel dan nilai konstanta pada kolom `b`.
3. Klik tombol `Selesaikan!`.
4. Lihat hasil akhir variabel dan proses penyelesaian langkah demi langkah.

## Ringkasan Algoritma

Metode Eliminasi Gauss menyelesaikan SPL dengan mengubah matriks augmented `[A|b]` menjadi bentuk segitiga atas, lalu mencari nilai variabel menggunakan substitusi mundur.

Tahapan utama:

1. Membaca input matriks augmented.
2. Melakukan pivoting parsial untuk memilih baris pivot terbaik.
3. Mengeliminasi elemen di bawah pivot agar menjadi nol.
4. Mengecek apakah sistem memiliki solusi unik.
5. Menghitung nilai variabel dari baris terakhir ke baris pertama.
6. Menampilkan hasil dan langkah penyelesaian.

Rumus eliminasi baris:

```text
R_i = R_i - m * R_k
```

dengan:

```text
m = a[i][k] / a[k][k]
```

## Struktur File

```text
metnum/
|-- index.html       # Struktur halaman aplikasi
|-- style.css        # Styling dan layout aplikasi
|-- app.js           # Logika input, eliminasi Gauss, dan render hasil
|-- favicon.svg      # Ikon tab browser aplikasi
|-- PRESENTASI.md    # Materi presentasi project
|-- slides.html      # File slide presentasi
`-- README.md        # Dokumentasi project
```

## Contoh SPL

```text
2x1 + x2 = 5
x1 - x2 = 1
```

Hasil:

```text
x1 = 2
x2 = 1
```

## Catatan

Aplikasi ini berfokus pada sistem persamaan linear yang memiliki solusi tunggal. Jika sistem tidak konsisten atau memiliki solusi tak hingga, aplikasi akan menampilkan pesan bahwa solusi tidak tersedia atau tidak tunggal.
