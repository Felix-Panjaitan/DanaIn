# DANAin - Platform Crowdfunding Inovatif

DANAin adalah platform crowdfunding yang menghubungkan startup dan pengelola proyek inovatif dengan investor potensial. Platform ini memungkinkan pengusaha untuk mendapatkan pendanaan dan investor untuk mendukung proyek-proyek menjanjikan.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Panduan Instalasi](#panduan-instalasi)
- [Penggunaan Aplikasi](#penggunaan-aplikasi)
- [API Endpoints](#api-endpoints)
- [Model Database](#model-database)
- [Kontributor](#kontributor)
- [Lisensi](#lisensi)

## 🌟 Fitur Utama

### Untuk Pengelola Proyek (Startup)

- Pengajuan proyek pendanaan
- Dashboard untuk monitoring proyek
- Manajemen proyek (update status, tambah informasi)
- Komunikasi dengan investor
- Notifikasi real-time

### Untuk Investor

- Pencarian dan penjelajahan proyek
- Detail lengkap proyek
- Sistem investasi yang aman
- Portofolio investasi
- Wishlist proyek favorit
- Notifikasi investasi

### Umum

- Sistem autentikasi dan otorisasi
- Profil pengguna yang dapat disesuaikan
- Notifikasi sistem
- Desain responsif untuk semua perangkat

## 🛠 Teknologi yang Digunakan

### Frontend
- HTML5, CSS3, JavaScript
- TailwindCSS untuk styling
- Font Awesome untuk ikon

### Backend
- Node.js + NestJS framework
- TypeScript
- JWT untuk autentikasi
- MongoDB (dengan Mongoose) untuk database NoSQL
- PostgreSQL (dengan TypeORM) sebagai alternatif database relasional

## 📁 Struktur Proyek

```
DANAin/
├── backend/                     # Backend NestJS
│   ├── src/
│   │   ├── auth/                # Modul autentikasi
│   │   ├── users/               # Manajemen pengguna
│   │   ├── projects/            # Manajemen proyek
│   │   ├── investments/         # Manajemen investasi
│   │   ├── notifications/       # Sistem notifikasi
│   │   ├── wishlists/           # Wishlist proyek
│   │   └── main.ts              # Entry point aplikasi
│   ├── .env                     # Variabel lingkungan
│   ├── package.json             # Dependensi backend
│   └── tsconfig.json            # Konfigurasi TypeScript
├── frontend/                    # Frontend assets
│   ├── src/
│   │   └── assets/
│   │       └── css/             # File CSS tambahan
│   └── utils/                   # Utilitas frontend
├── css/                         # File CSS global
├── js/                          # JavaScript global
├── *.html                       # Halaman HTML aplikasi
└── README.md                    # Dokumentasi proyek
```

## 🚀 Panduan Instalasi

### Prasyarat

- Node.js (v14 atau lebih baru)
- NPM atau Yarn
- MongoDB atau PostgreSQL

### Langkah Instalasi

1. Clone repositori ini:

```bash
git clone https://github.com/username/DANAin.git
cd DANAin
```

2. Instalasi dependensi backend:

```bash
cd backend
npm install
```

3. Konfigurasi environment variables:

Salin file `.env.example` ke `.env` dan sesuaikan dengan konfigurasi lokal Anda:

```bash
cp .env.example .env
# Edit file .env sesuai kebutuhan
```

4. Jalankan backend:

```bash
npm run start:dev
```

5. Buka aplikasi frontend:

Buka file `index.html` di browser Anda atau gunakan server lokal seperti Live Server di VSCode.

## 📱 Penggunaan Aplikasi

### Mendaftar dan Masuk

1. Buka `auth.html` atau klik "Daftar" di navbar
2. Daftar sebagai Investor atau Pengelola Proyek
3. Masuk dengan kredensial Anda

### Untuk Pengelola Proyek

1. Buat proyek baru melalui `buat-proyek.html`
2. Kelola proyek di dashboard startup
3. Pantau perkembangan pendanaan
4. Tambahkan update proyek

### Untuk Investor

1. Jelajahi proyek di `daftar-proyek.html`
2. Lihat detail proyek di `detail-proyek.html`
3. Investasikan dana ke proyek pilihan
4. Simpan proyek favorit ke wishlist
5. Pantau portofolio di dashboard investor

## 📡 API Endpoints

### Autentikasi

- `POST /api/auth/register` - Mendaftarkan pengguna baru
- `POST /api/auth/login` - Masuk ke sistem
- `GET /api/auth/me` - Mendapatkan data pengguna saat ini

### Proyek

- `GET /api/projects` - Mendapatkan daftar proyek
- `GET /api/projects/:id` - Mendapatkan detail proyek
- `POST /api/projects` - Membuat proyek baru
- `PUT /api/projects/:id` - Memperbarui proyek
- `DELETE /api/projects/:id` - Menghapus proyek

### Investasi

- `GET /api/investments` - Mendapatkan investasi pengguna
- `POST /api/investments` - Melakukan investasi baru
- `GET /api/investments/:id` - Mendapatkan detail investasi

### Notifikasi

- `GET /api/notifications` - Mendapatkan notifikasi pengguna
- `PUT /api/notifications/:id/read` - Menandai notifikasi sebagai dibaca
- `PUT /api/notifications/read-all` - Menandai semua notifikasi sebagai dibaca

## 💾 Model Database

### User

```typescript
{
  id: string;            // ID unik
  name: string;          // Nama lengkap
  username: string;      // Username unik
  email: string;         // Email unik
  password: string;      // Password terenkripsi
  role: UserRole;        // 'startup' | 'investor' | 'admin'
  avatarUrl: string;     // URL avatar
  bio: string;           // Biografi singkat
  website: string;       // Website pribadi/bisnis
  location: string;      // Lokasi
  isActive: boolean;     // Status akun
}
```

### Project

```typescript
{
  id: string;            // ID unik
  name: string;          // Nama proyek
  tagline: string;       // Tagline singkat
  description: string;   // Deskripsi lengkap
  fundingTarget: number; // Target pendanaan
  amountRaised: number;  // Dana terkumpul
  durationInDays: number;// Durasi kampanye (hari)
  endDate: Date;         // Tanggal berakhir
  imageUrl: string;      // URL gambar utama
  videoUrl: string;      // URL video pitch (opsional)
  category: string;      // Kategori proyek
  location: string;      // Lokasi proyek
  status: ProjectStatus; // Status proyek
  ownerId: string;       // ID pengelola proyek
  updates: any[];        // Update proyek
}
```

### Investment

```typescript
{
  id: string;            // ID unik
  amount: number;        // Jumlah investasi
  status: string;        // Status investasi
  investorId: string;    // ID investor
  projectId: string;     // ID proyek
  createdAt: Date;       // Tanggal investasi
}
```


## 📄 Lisensi

Copyright © 2023 DANAin. Semua Hak Cipta Dilindungi.

---

Dibuat dengan ❤️ oleh Tim DANAin
```

## Implementasi Teknis Detail

### Sistem Autentikasi

DANAin menggunakan JWT (JSON Web Tokens) untuk autentikasi yang aman:

1. Token diberikan saat login dan pendaftaran
2. Guards NestJS untuk melindungi endpoint berdasarkan peran
3. Strategi Passport untuk autentikasi lokal dan JWT

### Alur Proyek

1. **Pengajuan Proyek**: Startup mengajukan proyek baru (status: DRAFT)
2. **Review Proyek**: Admin mereview dan menyetujui/menolak proyek (status: PENDING_APPROVAL)
3. **Proyek Aktif**: Proyek disetujui dan siap menerima investasi (status: ACTIVE)
4. **Pendanaan**: Investor memberikan dana ke proyek
5. **Proyek Terdanai**: Target pendanaan tercapai (status: FUNDED)
6. **Penyelesaian**: Proyek selesai dan dana dicairkan (status: COMPLETED)

### Relasi Database

- User-Project: One-to-Many (satu pengguna bisa memiliki banyak proyek)
- User-Investment: One-to-Many (satu pengguna bisa melakukan banyak investasi)
- Project-Investment: One-to-Many (satu proyek bisa memiliki banyak investasi)
- User-Wishlist: One-to-Many (satu pengguna bisa menyimpan banyak proyek)

### Keamanan

- Password dienkripsi dengan bcrypt
- Validasi input dengan class-validator
- Perlindungan terhadap XSS dan CSRF
- Rate limiting untuk mencegah brute force

### Deployment

Aplikasi ini dapat di-deploy menggunakan:

- Backend: Heroku, AWS, DigitalOcean
- Frontend: Netlify, Vercel, GitHub Pages
- Database: MongoDB Atlas, AWS RDS (PostgreSQL)
