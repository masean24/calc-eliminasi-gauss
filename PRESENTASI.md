# 📐 GaussElim — Kalkulator Eliminasi Gauss Interaktif
### Tugas Mata Kuliah Metode Numerik

---

## 🎯 Slide 1 — Judul & Identitas

**Nama Project:** GaussElim — Web App Kalkulator Eliminasi Gauss
**Mata Kuliah:** Metode Numerik
**Teknologi:** HTML5 · CSS3 · JavaScript (Vanilla)
**Platform:** Web Browser (tanpa instalasi)

---

## 📌 Slide 2 — Latar Belakang

- Eliminasi Gauss adalah metode numerik paling fundamental untuk menyelesaikan **Sistem Persamaan Linear (SPL)**
- Proses manual untuk sistem 5×5 atau 6×6 sangat rawan **kesalahan aritmatika**
- Dibutuhkan tools yang menyelesaikan SPL secara otomatis **sekaligus memperlihatkan langkah-langkahnya**
- Program berbasis web dipilih agar dapat diakses dari **perangkat apapun** tanpa instalasi

---

## 🔢 Slide 3 — Apa itu Eliminasi Gauss?

**Definisi:**
Metode Eliminasi Gauss adalah teknik aljabar untuk menyelesaikan sistem `Ax = b` dengan mengubah matriks augmented `[A|b]` menjadi bentuk **segitiga atas (upper triangular)**, lalu diselesaikan dengan **substitusi mundur (back substitution)**.

**Dua Fase Utama:**

| Fase | Nama | Deskripsi |
|------|------|-----------|
| 1 | **Eliminasi Maju** | Mengubah matriks ke bentuk segitiga atas |
| 2 | **Substitusi Mundur** | Menghitung nilai variabel dari bawah ke atas |

**Formula Eliminasi:**
```
R_i <- R_i - (a[i][k] / a[k][k]) * R_k
```
di mana `m = a[i][k] / a[k][k]` disebut **pengali (multiplier)**.

---

## ⚙️ Slide 4 — Fitur Utama Aplikasi

| No | Fitur | Keterangan |
|----|-------|------------|
| 1 | **Grid Matriks Dinamis** | Ukuran dapat dipilih dari 2×2 hingga 6×6 |
| 2 | **Partial Pivoting** | Otomatis menukar baris untuk stabilitas numerik |
| 3 | **Validasi Input** | Mengecek angka kosong atau format tidak valid sebelum perhitungan |
| 4 | **Navigasi Keyboard** | Arrow key, Tab, Enter untuk navigasi antar sel |
| 5 | **Acak Nilai** | Generate angka acak untuk percobaan cepat |
| 6 | **Visualisasi Langkah** | Setiap langkah eliminasi dan substitusi ditampilkan |
| 7 | **Deteksi Singular** | Program mendeteksi jika SPL tidak punya solusi unik |
| 8 | **Responsive Design** | Tampilan menyesuaikan layar desktop maupun mobile |

---

## 🔄 Slide 5 — Alur Kerja Algoritma

```
INPUT
  -> Baca matriks augmented [A|b] (N x N+1)
       |
       v
ELIMINASI MAJU (Forward Elimination)
  -> Untuk k = 0 hingga N-1:
       |- [Partial Pivoting] Cari baris i >= k dengan |a[i][k]| terbesar
       |- Tukar baris k dengan baris i (jika berbeda)
       -> Untuk setiap baris i > k:
            |- Hitung pengali: m = a[i][k] / a[k][k]
            -> Update: R_i <- R_i - m * R_k
       |
       v
CEK SINGULAR
  -> Jika |a[k][k]| < 1e-9 => "Tidak ada solusi unik"
       |
       v
SUBSTITUSI MUNDUR (Back Substitution)
  -> Untuk i = N-1 hingga 0:
       -> X[i] = (b[i] - SUM a[i][j]*X[j]) / a[i][i]
       |
       v
OUTPUT
  -> Tampilkan nilai x1, x2, ..., xN
```

---

## 🛡️ Slide 6 — Partial Pivoting

**Masalah tanpa pivoting:**
Jika elemen pivot `a[k][k] = 0`, terjadi pembagian dengan nol => error.
Bahkan jika kecil (misal `0.0001`), bisa terjadi **galat pembulatan besar**.

**Solusi — Partial Pivoting:**
1. Pada setiap kolom pivot ke-`k`, cari baris dengan nilai **|a[i][k]| terbesar**
2. Tukar baris tersebut ke posisi pivot
3. Lanjutkan eliminasi dengan elemen pivot lebih besar => **hasil lebih stabil**

**Contoh:**
```
Sebelum pivoting:      Setelah pivoting:
[ 0.001   2 | 4 ]  =>  [ 4   -1 | 10 ]
[ 4      -1 | 10]      [ 0.001 2 |  4 ]
```

---

## 💻 Slide 7 — Teknologi yang Digunakan

| Teknologi | Fungsi |
|-----------|--------|
| **HTML5** | Struktur halaman, form input matriks, tabel augmented |
| **CSS3** | Desain glassmorphism, animasi, layout responsive (Grid & Flexbox) |
| **JavaScript ES6+** | Logika algoritma, DOM manipulation, event handling |
| **Google Fonts** | Tipografi: Plus Jakarta Sans + JetBrains Mono |
| **http-server** | Server lokal untuk development |

**Tidak menggunakan framework apapun** — murni Vanilla JS.

---

## 📂 Slide 8 — Struktur File Project

```
metnum/
├── index.html       # Struktur halaman & komponen UI
├── style.css        # Desain tema gelap glassmorphism
├── app.js           # Logika algoritma & interaktivitas
└── PRESENTASI.md    # Dokumen presentasi ini
```

**Penjelasan singkat:**
- `index.html` — layout grid matriks, panel kontrol, dan area output
- `style.css` — CSS variables, dark theme, responsive breakpoints (480px, 640px, 1024px), animasi glassmorphism
- `app.js` — `initMatrixGrid()`, `solveGauss()`, `renderResults()`, validasi input, dan navigasi keyboard

---

## 📊 Slide 9 — Contoh Kasus (Manual vs Program)

**Contoh SPL 3×3:**
```
2x1 +  1x2 - 1x3 =  8
-3x1 - 1x2 + 2x3 = -11
-2x1 + 1x2 + 2x3 = -3
```
**Solusi:** `x1 = 2, x2 = 3, x3 = -1`

**Langkah eliminasi maju (k=0, pivot a[0][0]=2):**
```
m21 = -3/2 = -1.5  =>  R2 <- R2 - (-1.5)*R1  =>  [0, 0.5, 0.5 | -1]
m31 = -2/2 = -1.0  =>  R3 <- R3 - (-1.0)*R1  =>  [0,   2,   1 |  5]
```
*Lanjutkan hingga matriks segitiga atas, lalu back substitution...*

---

## 🎨 Slide 10 — Desain UI/UX

**Prinsip desain yang diterapkan:**

- 🌑 **Dark Theme** — Background `#0b0f19` mengurangi kelelahan mata
- 🪟 **Glassmorphism** — Panel semi-transparan `backdrop-filter: blur(20px)`
- ✨ **Animasi Halus** — Transisi `cubic-bezier`, efek glow pada sel aktif
- 📱 **Fully Responsive** — Breakpoint di 480px, 640px, dan 1024px
- ⌨️ **Keyboard-First** — Navigasi Arrow Keys, Tab, Enter
- 📌 **Sticky Left Panel** — Panel input tetap terlihat saat scroll hasil di kanan

---

## ✅ Slide 11 — Kesimpulan

1. **Berhasil mengimplementasikan** Eliminasi Gauss dengan Partial Pivoting secara akurat
2. **Visualisasi langkah-langkah** membantu memahami proses eliminasi secara intuitif
3. **Antarmuka interaktif** dengan validasi input & navigasi keyboard meningkatkan UX
4. **Deteksi kasus khusus** — matriks singular terdeteksi dan dilaporkan ke pengguna
5. Program mampu menyelesaikan SPL hingga **ukuran 6×6** dengan presisi 4 desimal

**Potensi pengembangan:**
- Tambah metode Gauss-Jordan (eliminasi penuh)
- Tambah LU Decomposition
- Export hasil ke PDF

---

## 📎 Referensi

- Chapra, S.C. & Canale, R.P. — *Numerical Methods for Engineers*, 7th Edition
- Burden, R.L. & Faires, J.D. — *Numerical Analysis*, 10th Edition
- MDN Web Docs — JavaScript DOM Manipulation
- CSS Tricks — Glassmorphism Design Pattern

---
*Dibuat untuk keperluan presentasi tugas Metode Numerik*
