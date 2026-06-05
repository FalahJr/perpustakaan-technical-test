# Library Management Dashboard

**Technical Test — Frontend Developer**

Admin dashboard untuk manajemen perpustakaan, dibangun dengan React + TypeScript bergaya SaaS modern
(terinspirasi Linear / Stripe / Vercel Dashboard). Dokumen ini fokus pada **proyek frontend**
(folder [`frontend/`](./frontend)).

🔗 **Repository:** https://github.com/FalahJr/perpustakaan-technical-test

---

## Daftar Isi

- [Ringkasan Proyek](#ringkasan-proyek)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Pendekatan Implementasi](#pendekatan-implementasi)
- [Struktur Halaman & Routing](#struktur-halaman--routing)
- [Struktur Folder](#struktur-folder)
- [Autentikasi & Keamanan](#autentikasi--keamanan)
- [Screenshots](#screenshots)
- [Cara Menjalankan](#cara-menjalankan)
- [Status Fitur](#status-fitur)

---

## Ringkasan Proyek

Aplikasi ini adalah sebuah **Library Management Dashboard** yang mengonsumsi REST API
(Bearer JWT) untuk mengelola data master dan transaksi perpustakaan: kategori (jenis buku),
penulis, penerbit, peminjaman, dan denda.

Fokus penilaian bukan pada banyaknya halaman CRUD, melainkan pada **kualitas frontend**:
arsitektur yang rapi, komponen yang dapat dipakai ulang, integrasi API yang bersih,
validasi form, manajemen state, serta UX yang responsif dan profesional.

---

## Teknologi yang Digunakan

Versi diambil langsung dari [`frontend/package.json`](./frontend/package.json).

### Core
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| React | 19 | UI library (functional components + hooks) |
| TypeScript | 5.8 | Type safety (strict mode) |
| Vite | 6 | Dev server & bundler |
| React Router DOM | 6 | Routing & route protection |

### Data & Form
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| TanStack Query | 5 | Server state, caching, mutations, invalidation |
| Axios | 1.11 | HTTP client + interceptor auth |
| React Hook Form | 7 | Form terkontrol & performant |
| Zod | 4 | Skema validasi (via `@hookform/resolvers`) |

### Styling & UI
| Teknologi | Kegunaan |
|-----------|----------|
| Tailwind CSS | 3.4 | Styling utility-first |
| Lucide React | Ikon |
| clsx + tailwind-merge | Helper `cn()` untuk menggabungkan className |

### Tooling
- ESLint + typescript-eslint
- vite-plugin-pwa (PWA: manifest & service worker)

---

## Pendekatan Implementasi

- **Feature-based architecture.** Setiap domain berada di `src/features/<fitur>/` dengan sub-folder
  konsisten: `api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `types/`. Hal ini menjaga
  *separation of concerns* dan memudahkan skalabilitas.
- **Pemisahan logika dari UI.** Komponen halaman tidak melakukan fetch langsung. Pengambilan data
  dibungkus dalam custom hooks (mis. `useCategoriesQuery`, `useCategoryMutations`) di atas
  **TanStack Query** — lengkap dengan *query keys*, *mutations*, dan *cache invalidation*.
- **Form aman & tervalidasi.** Semua form menggunakan **React Hook Form + Zod** (skema di
  `features/*/schemas/`), sehingga validasi konsisten (field wajib, email, numerik, tanggal) dan
  tidak ada *uncontrolled form*.
- **Lapisan API terpusat.** Instance Axios tunggal (`src/api/axios.ts`) dengan interceptor untuk
  menyisipkan token `Bearer` dan menangani auto-logout pada respons `401`.
- **Komponen reusable.** Pustaka UI internal di `src/components/ui/` dipakai lintas fitur untuk
  konsistensi tampilan.
- **TypeScript strict** di seluruh kode, tanpa `any`, dengan tipe data per fitur.
- **Desain SaaS modern & responsif.** Layout sidebar + header + konten; sidebar *collapsible* di
  desktop dan *drawer* di mobile, tabel & form yang adaptif untuk mobile/tablet/desktop.

---

## Struktur Halaman & Routing

Definisi rute ada di [`src/routes/AppRouter.tsx`](./frontend/src/routes/AppRouter.tsx).

| Path | Halaman | Akses | Layout |
|------|---------|-------|--------|
| `/login` | Login | Publik | `PublicLayout` |
| `/` | Dashboard (statistik + recent records) | Terproteksi | `AppLayout` |
| `/categories` | Categories — CRUD jenis buku | Terproteksi | `AppLayout` |
| `/authors` | Authors — CRUD penulis | Terproteksi | `AppLayout` |
| `/publishers` | Publishers — CRUD penerbit | Terproteksi | `AppLayout` |
| `/borrowings` | Borrowings — CRUD peminjaman | Terproteksi | `AppLayout` |
| `/fines` | Fines — CRUD denda | Terproteksi | `AppLayout` |
| `*` | Redirect ke `/` | — | — |

Rute terproteksi dibungkus `ProtectedRoute`; pengguna yang belum login otomatis diarahkan ke `/login`.

**Dashboard** mengagregasi 5 sumber data (categories, authors, publishers, borrowings, fines)
menggunakan `useQueries` ([`useDashboardData.ts`](./frontend/src/features/dashboard/hooks/useDashboardData.ts))
untuk menampilkan **StatCard** dan daftar **Recent Records** dari data API nyata (tanpa angka hardcoded).

---

## Struktur Folder

```
frontend/src/
├── api/                 # Axios instance + interceptor, QueryClient
├── assets/
├── components/ui/       # Komponen reusable (lihat di bawah)
├── features/
│   ├── auth/            # login, auth-context, auth-storage
│   ├── dashboard/
│   ├── categories/
│   ├── authors/
│   ├── publishers/
│   ├── borrowings/
│   └── fines/           # tiap fitur: api/ components/ hooks/ pages/ schemas/ types/
├── layouts/             # AppLayout, AppHeader, AppSidebar, PublicLayout
├── routes/              # AppRouter, ProtectedRoute
├── hooks/
├── utils/               # cn()
├── App.tsx
└── main.tsx
```

**Komponen reusable** (`src/components/ui/`):
`Button`, `Input`, `Textarea`, `Select`, `Modal`, `ConfirmDialog`, `DataTable`, `SearchInput`,
`Pagination`, `EmptyState`, `ErrorState`, `SkeletonLoader`.

---

## Autentikasi & Keamanan

- **Login** via `POST /login`, token JWT disimpan di `localStorage`
  (key `library_dashboard_auth_session`, lihat [`auth-storage.ts`](./frontend/src/features/auth/auth-storage.ts)).
- **Session persistence** melalui `AuthProvider` + `useAuth`
  ([`auth-context.tsx`](./frontend/src/features/auth/auth-context.tsx)), sinkron antar-tab via event `storage`.
- **Route protection** — `ProtectedRoute` mengarahkan pengguna tak terautentikasi ke `/login`.
- **Interceptor Axios** menyisipkan header `Authorization: Bearer <token>` di setiap request, dan
  melakukan **auto-logout** (clear session + redirect) ketika menerima `401`.
- **Logout** menghapus session dan membersihkan cache TanStack Query.

---

## Screenshots

> _Screenshot menyusul._ Letakkan gambar UI di folder `docs/screenshots/` lalu referensikan di sini.

```markdown
![Login](docs/screenshots/login.png)
![Dashboard](docs/screenshots/dashboard.png)
![Categories CRUD](docs/screenshots/categories.png)
```

| Halaman | Preview |
|---------|---------|
| Login | _menyusul_ |
| Dashboard | _menyusul_ |
| Salah satu modul CRUD | _menyusul_ |

---

## Cara Menjalankan

### Prasyarat
- **Node.js** 18+ dan npm
- **Backend API** berjalan di `http://localhost:8001` (endpoint base `…/api/v1`)

### Langkah
```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Siapkan environment variable
cp .env.example .env
# pastikan VITE_API_BASE_URL=http://localhost:8001/api/v1

# 4. Jalankan dev server
npm run dev
```

Buka browser ke alamat yang ditampilkan Vite (default `http://localhost:5173`), lalu login untuk
mengakses dashboard.

### Perintah lain
| Perintah | Fungsi |
|----------|--------|
| `npm run build` | Build produksi (`tsc -b && vite build`) |
| `npm run preview` | Pratinjau hasil build |
| `npm run typecheck` | Pengecekan tipe TypeScript |
| `npm run lint` | Menjalankan ESLint |

---

## Status Fitur

**Priority 1 (Wajib)**
- ✅ Authentication — Login, JWT storage, route protection, logout
- ✅ Dashboard — statistik & recent records dari data API nyata
- ✅ Categories — Full CRUD
- ✅ Authors — Full CRUD
- ✅ Publishers — Full CRUD

**Priority 2 (Direkomendasikan)**
- ✅ Borrowings — List, Create, Edit, Delete

**Priority 3 (Bonus)**
- ✅ Fines — List, Create, Edit, Delete
- 🚧 Public Books — belum diimplementasikan (opsional / phase berikutnya)
- ⚙️ PWA — manifest & service worker tersedia via `vite-plugin-pwa`
