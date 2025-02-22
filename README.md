# 📚 Library Loan Management System

Library Loan Management System adalah aplikasi berbasis web yang memungkinkan pengguna untuk mengelola peminjaman dan pengembalian buku di perpustakaan secara efisien.

## 🚀 Fitur Utama
- **Manajemen Buku**: Tambah, edit, hapus, dan cari buku.
- **Peminjaman Buku**: Mahasiswa dapat meminjam buku dengan informasi jatuh tempo.
- **Pengembalian Buku**: Admin dapat mengonfirmasi pengembalian buku.
- **Dashboard Statistik**: Menampilkan total buku, buku tersedia, buku dipinjam, total peminjaman, dan buku yang melewati jatuh tempo.
- **Ekspor Data**: Mendukung ekspor data buku ke **Excel** dan **PDF**.
- **Notifikasi Toast**: Memberikan feedback interaktif saat melakukan tindakan CRUD.
- **Desain Responsif**: Menggunakan Bootstrap untuk tampilan yang modern dan fleksibel.

---
## 🛠 Teknologi yang Digunakan
- **Frontend**: HTML, CSS, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MySQL (MariaDB)
- **Template Engine**: EJS
- **Package Pendukung**:
  - `dotenv` - Untuk konfigurasi environment
  - `mysql2` - Untuk koneksi ke database
  - `express` - Framework backend
  - `pdfkit` - Untuk ekspor PDF
  - `exceljs` - Untuk ekspor Excel
  - `nodemon` - Untuk restart server aplikasi otomatis jika ada perubahan pada backend

---
## ⚙️ Instalasi dan Konfigurasi
### 1️⃣ Clone Repository
```sh
git clone https://github.com/username/library-loan-sederhana.git
cd library-loan-sederhana
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Konfigurasi Database
1. Buat database **library_db** di MySQL.
2. Sesuaikan `.env` file:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=library_db
DB_PORT=3306 (sesuaikan port dixampp)
```
3. Jalankan migrasi database (jika ada).

### 4️⃣ Jalankan Aplikasi
```sh
nodemon app.js
```
Aplikasi berjalan di `http://localhost:3000`

---
## 📌 Penggunaan
### 🔹 Akses Halaman
| Halaman        | URL               | Deskripsi                        |
|---------------|-----------------|--------------------------------|
| Dashboard     | `/`             | Statistik ringkasan            |
| Daftar Buku  | `/books`        | Lihat, cari, dan kelola buku   |
| Peminjaman   | `/loans`        | Kelola peminjaman & pengembalian buku |
| Ekspor Data  | `/export/excel` & `/export/pdf` | Ekspor data buku |

### 🔹 API Endpoint (Opsional)
| Method | Endpoint          | Deskripsi |
|--------|------------------|-----------|
| GET    | `/api/books`     | Ambil daftar buku |
| POST   | `/api/books/add` | Tambah buku baru |
| POST   | `/api/loans/borrow` | Pinjam buku |
| POST   | `/api/loans/return/:id` | Kembalikan buku |

---
## 🏗 Struktur Direktori
```sh
library-loan/
│── views/         # Template EJS
│── public/        # Static files (CSS, JS, Images)
│── routes/        # Route handlers
│── config/        # Konfigurasi database
│── app.js         # Entry point aplikasi
│── package.json   # Dependencies
```

---
## 🤝 Kontribusi
Jika ingin berkontribusi, silakan **fork** repository ini dan buat pull request. Terima kasih! 🙌

---
## 📜 Lisensi
Proyek ini menggunakan lisensi **MIT**.


