# OrderWA

OrderWA adalah aplikasi Next.js untuk membantu seller membuat alur order WhatsApp yang lebih terstruktur: seller menyiapkan konfigurasi form, membagikan link publik, customer mengisi form, lalu sistem membentuk pesan WhatsApp siap kirim.

## 1. Ringkasan Proyek

### Tujuan
- Merapikan alur order berbasis chat WhatsApp.
- Menstandarkan format order dari sisi seller.
- Menyediakan flow publik berbasis link toko (`/konfirmasi-pesanan/[storeSlug]`).

### Status Implementasi Saat Ini
- Sudah ada auth seller (register/login/logout/session cookie).
- Sudah ada seller workspace (dashboard, setup, profil, upgrade page).
- Sudah ada public order form berbasis slug toko.
- Sudah ada generator pesan WhatsApp dari data form + konfigurasi seller.
- Sudah ada fondasi plan `FREE` dan `PRO` (tanpa billing online).

## 2. Fitur yang Sudah Diimplementasikan

### Auth & Session
- Register seller (`POST /api/auth/register`):
  - Membuat `SellerAccount`, `SellerProfile`, dan `SellerOrderConfig` default.
  - Membuat sesi login via cookie `orderwa_seller_session`.
- Login seller (`POST /api/auth/login`).
- Logout seller (`POST /api/auth/logout`).
- Cek sesi aktif (`GET /api/auth/me`).

### Seller Profile
- CRUD profile seller via `/api/seller/profile` (GET/PUT).
- `storeSlug` dipertahankan stabil setelah dibuat pertama kali.
- `destinationPhoneNumber` dipakai sebagai nomor tujuan WhatsApp pada flow publik.

### Seller Setup (Order Builder)
- Pengaturan opening/closing text.
- Toggle built-in fields:
  - phoneNumber, address, note.
- Custom fields minimal:
  - tipe `text` / `textarea`
  - `required`
  - `label`
  - `placeholder`
- Field ordering dengan tombol up/down.
- Autosave konfigurasi ke `/api/seller/order-config`.
- Retry save saat gagal.
- Reuse snapshot setup terakhir dari link terbaru.
- Helper rule-based:
  - Message style (`ringkas`, `formal`, `santai`)
  - Template starter kategori (`food`, `fashion`, `service`, `preorder`)
- Custom dropdown reusable sudah menggantikan dropdown native di setup.

### Seller Link Management
- Generate link publik via `/api/seller/order-links` (POST).
- Status link, cooldown, history via `/api/seller/order-links` (GET).
- Update link (PATCH by id) via `/api/seller/order-links/[id]`.
- Free-plan enforcement:
  - 1 link per 24 jam.
- Link expiry saat ini 24 jam (berdasarkan policy plan).

### Dashboard Seller
- Menampilkan:
  - status link aktif
  - expiry
  - countdown cooldown
  - badge plan
  - riwayat link + copy action

### Public / Customer Flow
- Resolusi konfigurasi publik via `/api/public/order-config/[storeSlug]`.
- Halaman publik customer:
  - `/konfirmasi-pesanan/[storeSlug]`
- Form field render mengikuti konfigurasi seller (termasuk custom field + field order).
- Output pesan WhatsApp mengikuti urutan field dan menambahkan watermark free plan.

### Plan & Gate Foundation
- Plan tersedia di backend config:
  - `FREE`
  - `PRO`
- Feature gates fondasi:
  - `watermarkRemoval`
  - `multipleActiveLinks`
  - `advancedCustomization`
- Halaman UI upgrade ada di `/seller/upgrade` (tanpa alur billing online).

## 3. Keterbatasan Saat Ini (Berdasarkan Kode)

- Belum ada billing/payment gateway.
- Halaman upgrade masih bersifat informasi + CTA manual.
- Plan aktif di UI seller masih ditampilkan statis sebagai `Free Plan` di beberapa area.
- Tidak ada mekanisme role multi-user/team untuk seller.
- Tidak ada external AI API; helper saat ini rule-based.

## 4. Flow Utama Aplikasi

### Flow Seller
1. Seller register/login.
2. Seller melengkapi profil (`/seller/profile`) termasuk nomor WhatsApp tujuan.
3. Seller setup form (`/seller/setup`):
   - opening/closing
   - built-in fields
   - custom fields
   - urutan field
4. Seller generate link publik.
5. Seller monitor status/cooldown/history di dashboard (`/seller`).

### Flow Public/Customer
1. Customer membuka link: `/konfirmasi-pesanan/[storeSlug]`.
2. Sistem memuat snapshot konfigurasi dari link aktif terbaru seller.
3. Customer isi form sesuai konfigurasi.
4. Sistem membentuk pesan WhatsApp.
5. Customer copy / kirim ke WhatsApp seller.

## 5. Stack Teknis

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Zod
- React Hook Form
- Prisma ORM
- PostgreSQL
- Vitest (testing)
- Sonner (toast)
- Framer Motion (animasi)

## 6. Struktur Folder (Ringkas)

```txt
src/
  app/
    (marketing)/page.tsx
    auth/(login|register)/page.tsx
    seller/(layout|page|setup|profile|upgrade)/
    konfirmasi-pesanan/[storeSlug]/page.tsx
    api/
      auth/
      seller/
      public/
  components/
    shared/
    ui/
    motion/
  features/
    auth/
    seller-order-builder/
    seller-dashboard/
    seller-profile/
    customer-order-form/
    shared-order/
  server/
    auth/
    config/
    db/
    repositories/
    services/
    security/
    http/
prisma/
  schema.prisma
  migrations/
```

## 7. Instalasi

Prasyarat:
- Node.js `>= 20.9.0` (sesuai `package.json`).
- PostgreSQL aktif.

Langkah:
```bash
npm install
```

## 8. Local Setup

### 8.1 Environment
Berdasarkan kode dan `.env` saat ini, env minimal yang dipakai:
- `DATABASE_URL`

Contoh:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
```

### 8.2 Prisma + Database
Jalankan migrasi dan generate client:
```bash
npx prisma migrate dev
npx prisma generate
```

Catatan:
- Kode repository `seller-order-config` saat ini memiliki guard `ADD COLUMN IF NOT EXISTS` untuk `customFields` dan `fieldOrder` pada table `seller_order_configs` sebagai fallback kompatibilitas skema.
- Tetap direkomendasikan menjalankan migrasi resmi agar skema konsisten.

### 8.3 Menjalankan Aplikasi
```bash
npm run dev
```

Akses default:
- Marketing: `http://localhost:3000/`
- Seller dashboard: `http://localhost:3000/seller`

## 9. Scripts

Scripts yang tersedia di `package.json`:
- `npm run dev` → menjalankan Next dev server
- `npm run build` → build production
- `npm run start` → start production server
- `npm run lint` → lint Next.js
- `npm run test` → menjalankan Vitest

Catatan:
- Tidak ada script Prisma khusus di `package.json` saat ini, gunakan `npx prisma ...` langsung.

## 10. Daftar Route/Page

### Page Routes
- `/` → landing/marketing
- `/auth/login`
- `/auth/register`
- `/seller`
- `/seller/setup`
- `/seller/profile`
- `/seller/upgrade`
- `/konfirmasi-pesanan/[storeSlug]`
- `/order` (halaman legacy notice bahwa route customer pindah ke slug)

### API Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/seller/profile`
- `PUT /api/seller/profile`
- `GET /api/seller/order-config`
- `PUT /api/seller/order-config`
- `GET /api/seller/order-links`
- `POST /api/seller/order-links`
- `PATCH /api/seller/order-links/[id]`
- `GET /api/public/order-config/[storeSlug]`

## 11. Troubleshooting

### 1) `INTERNAL_ERROR` saat save setup
- Cek `DATABASE_URL` valid dan database reachable.
- Pastikan migrasi sudah dijalankan: `npx prisma migrate dev`.
- Cek table `seller_order_configs` memiliki kolom `customFields` dan `fieldOrder`.

### 2) Tidak bisa login / sesi sering hilang
- Pastikan cookie tidak diblok browser.
- Di production, cookie `secure` aktif (bergantung `NODE_ENV`).

### 3) Link publik dianggap tidak valid
- Pastikan seller sudah generate link.
- Cek status link: aktif dan belum kedaluwarsa.
- Cek `storeSlug` benar.

### 4) Error Prisma schema/client
- Jalankan ulang:
```bash
npx prisma generate
```

## 12. Catatan Pengembangan

- Validasi request API menggunakan Zod di tiap route.
- Error handling memakai `HttpError` + response wrapper terpusat (`ok`, `toErrorResponse`).
- Rate limiting aktif di endpoint penting (`auth`, `seller profile`, `order config`, `order links`, `public config`).
- Autosave seller setup berjalan per perubahan state; status save tersedia (`saving/saved/error`).
- Fitur semi-AI saat ini masih rule-based (message style + template starter), belum ada integrasi AI eksternal.

## 13. Hal yang Belum Jelas dari Kode (Disampaikan Apa Adanya)

- Tidak ada dokumentasi resmi endpoint/kontrak API selain implementasi route saat ini.
- Tidak ada konfigurasi observability eksternal (sink log/trace) yang terlihat di repo ini.
- Tidak ada mekanisme deployment/environment production yang terdokumentasi di repo ini.
