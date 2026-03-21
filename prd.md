PRD Technical Frontend — MVP
Product Name

OrderWA — Form Order WhatsApp

Document Type

Frontend Technical PRD

Version

MVP v1

Scope

Frontend only

1. Overview
1.1 Background

OrderWA adalah web app sederhana untuk membantu user membuat format pesan order WhatsApp yang rapi, konsisten, dan siap dikirim. Produk ini ditujukan untuk seller kecil, reseller, dropshipper, dan admin toko yang masih memproses order secara manual melalui WhatsApp.

MVP difokuskan pada pengalaman yang cepat, bersih, dan mudah dipakai. User hanya perlu mengisi form order, menghasilkan pesan yang sudah terformat, lalu menyalin atau langsung membuka WhatsApp dengan isi pesan tersebut.

1.2 Objective

Membangun frontend MVP yang:

cepat digunakan

mobile friendly

clean dan premium secara visual

mudah dikembangkan ke versi paid

mengikuti best practices Next.js App Router dan TypeScript

1.3 Product Goals

Mengurangi proses mengetik order manual

Membantu user membuat format pesan yang rapi

Mempercepat proses copy atau kirim ke WhatsApp

Menyediakan experience sederhana namun terasa premium

2. Product Scope
2.1 In Scope

MVP frontend mencakup:

halaman utama single-page

order form

validasi form

generate formatted WhatsApp message

copy to clipboard

open WhatsApp link

free daily usage limit

watermark pada versi free

toast feedback menggunakan Sonner

animasi halus menggunakan Framer Motion

icon system menggunakan Lucide Icons

penyimpanan usage limit di localStorage

2.2 Out of Scope

Hal berikut tidak termasuk dalam MVP:

backend

authentication

payment integration

database

save history

analytics dashboard

multi-template builder

shareable public form

admin panel

role management

subscription handling

premium purchase flow

3. Target Users
3.1 Primary Users

seller kecil / UMKM

reseller

dropshipper

admin toko yang menerima order via WhatsApp

3.2 Main User Problem

User masih mengetik order secara manual, format order sering berantakan, dan proses copy-paste ke WhatsApp memakan waktu. Dibutuhkan tool yang dapat membuat format order yang konsisten dan siap kirim dengan proses yang lebih cepat.

4. Technical Stack
4.1 Core Stack

Next.js 16 with App Router

TypeScript

Tailwind CSS

4.2 Supporting Libraries

react-hook-form

zod

@hookform/resolvers

sonner

framer-motion

lucide-react

clsx

tailwind-merge

4.3 Rendering Strategy

default ke Server Components

komponen interaktif dibuat sebagai Client Components

business logic dipisahkan dari komponen UI

5. Functional Requirements
5.1 Order Form

User harus dapat mengisi form order dengan field berikut.

Required Fields

customerName

productName

quantity

address

Optional Fields

phoneNumber

note

destinationPhoneNumber

5.2 Form Validation

Validasi dilakukan di frontend menggunakan react-hook-form dan zod.

Validation Rules

customerName: string, trimmed, minimal 2 karakter

productName: string, trimmed, minimal 2 karakter

quantity: number, integer, lebih dari 0

address: string, trimmed, minimal 5 karakter

phoneNumber: optional, jika diisi harus dapat dinormalisasi ke numeric format

note: optional

destinationPhoneNumber: optional, jika diisi harus dapat dinormalisasi untuk wa.me

Expected Behavior

error ditampilkan per field

tombol generate disabled jika form invalid

validasi harus tetap nyaman di mobile

5.3 Generate Order Message

Saat user klik tombol Generate Order, sistem harus menghasilkan text multi-line dengan format default.

Message Rules

awali dengan greeting

urutan field harus konsisten

field optional hanya ditampilkan jika terisi

quantity harus tampil dalam format x pcs

tambahkan watermark pada versi free

hindari line break berlebihan

Example Output
Halo kak, saya mau order:

Nama: Surya
No. HP: 08123456789
Produk: Kaos Hitam
Jumlah: 2 pcs
Alamat: Denpasar
Catatan: Kirim sore

Mohon diproses ya kak. Terima kasih 🙏

(dibuat dengan OrderWA)
5.4 Copy to Clipboard

User dapat menyalin hasil message ke clipboard.

Behavior

tombol Copy aktif jika generated text tersedia

jika copy berhasil, tampilkan toast success

jika gagal, tampilkan toast error

5.5 Open WhatsApp

User dapat membuka WhatsApp dengan message yang sudah terisi.

Behavior

gunakan format URL:

https://wa.me/{phone}?text={encodedText}

nomor tujuan diambil dari destinationPhoneNumber

text harus di-encode menggunakan encodeURIComponent

jika nomor tujuan kosong, tampilkan toast error atau info

tombol Kirim ke WhatsApp hanya aktif jika generated text tersedia

5.6 Free Daily Usage Limit

Versi free harus dibatasi hingga 5 generate per hari.

Storage

Penyimpanan dilakukan di localStorage.

Storage Shape
type UsageLimitState = {
  date: string;
  count: number;
};
Rules

jika tanggal tersimpan berbeda dengan hari ini, reset count ke 0

setiap generate sukses menambah count 1

jika count sudah mencapai limit, proses generate diblok

tampilkan informasi limit tercapai

tombol generate harus disabled saat limit habis

5.7 Watermark

Setiap generated text pada versi free harus menyertakan watermark di bagian bawah.

Watermark Text
(dibuat dengan OrderWA)
5.8 Toast Notifications

Semua feedback ringan menggunakan Sonner.

Minimal Toast Cases

generate success

copy success

copy failure

WhatsApp number belum diisi

daily limit reached

form invalid

Toast Tone

singkat

jelas

tidak berlebihan

tetap terasa clean dan premium

6. UI / UX Requirements
6.1 Visual Direction

UI harus memiliki karakter berikut:

premium

elegan

clean

minimal

modern

tanpa gradient

tanpa dekorasi berlebihan

tanpa visual noise

6.2 Design Principles

whitespace lega

visual hierarchy jelas

border halus

CTA mudah dikenali

layout rapi di mobile dan desktop

semua komponen konsisten

6.3 Color Direction

Gunakan pendekatan warna yang netral dan elegan:

background: white / off-white

primary text: near-black

secondary text: muted gray

accent: dark neutral atau dark violet

border: soft gray

Tidak diperbolehkan menggunakan:

gradient background

warna terlalu ramai

shadow berlebihan

6.4 Typography

Gunakan typography modern dan bersih.

Recommended:

Geist atau Inter

Typography harus:

readable

spacing nyaman

konsisten antar heading, body, dan helper text

7. Motion Guidelines
7.1 Motion Library

Gunakan Framer Motion

7.2 Motion Goal

Animasi harus mendukung experience premium dan modern tanpa terasa berlebihan.

7.3 Allowed Motion Types
Fade In Up

Digunakan untuk:

intro section

form card

result card

Soft Scale

Digunakan untuk:

button hover

button tap

result box saat muncul

Animate Presence

Digunakan untuk:

field error message

usage limit banner

empty state ke result state

7.4 Motion Rules

durasi: 0.2s sampai 0.35s

easing lembut

animasi harus subtle

tidak menggunakan bounce besar

tidak menggunakan motion dekoratif yang tidak perlu

tidak meng-animate seluruh page secara berlebihan

7.5 Areas That Must Not Be Over-Animated

input saat user mengetik

background

icon dekoratif

page transition kompleks

8. Icon Guidelines
8.1 Icon Library

Gunakan Lucide Icons

8.2 Icon Usage

Icon hanya dipakai untuk memperjelas tindakan atau konteks, bukan untuk dekorasi berlebihan.

8.3 Recommended Icons
Branding / Header

MessageSquareText

ClipboardList

Send

Form Fields

User

Phone

Package

Boxes atau Hash

MapPin

NotebookPen atau FileText

Actions

Copy

Send

Check

CircleAlert

8.4 Icon Rules

ukuran icon konsisten

stroke clean

jangan campur icon pack lain

icon dekoratif diberi aria-hidden="true"

icon tidak boleh menggantikan label text

9. Main Page Requirements
9.1 Route

/

9.2 Page Composition

Halaman utama terdiri dari:

Header

Intro / headline singkat

Order form card

Result card

Action buttons

Usage limit info / banner

Footer kecil

9.3 Layout Behavior
Mobile

single column

form di atas

result di bawah

Desktop

dua kolom

form di kiri

result di kanan

spacing luas dan clean

10. UX Flow
10.1 Happy Path

user membuka halaman

user mengisi form

user klik Generate Order

result text muncul

toast success tampil

user klik Copy atau Kirim ke WhatsApp

10.2 Error Path

required field kosong → tampil field error

daily limit habis → tombol generate disabled + banner info

destination phone kosong saat klik WA → toast error

clipboard gagal → toast error

10.3 Empty State

Saat belum ada generated text, result box harus menampilkan placeholder seperti:

Hasil format order akan muncul di sini.

11. Component Requirements
11.1 UI Primitives

Buat reusable UI primitives untuk:

Button

Input

Textarea

Label

Card

11.2 Shared Components

Buat reusable shared components untuk:

AppHeader

AppFooter

SectionContainer

11.3 Order Feature Components

Minimal komponen feature order:

order-form

order-form-fields

order-result

order-actions

usage-limit-banner

12. Feature Architecture
12.1 Feature-Based Structure

Gunakan struktur berbasis feature agar domain order tetap modular dan scalable.

12.2 Folder Structure
src/
  app/
    (marketing)/
      page.tsx
    globals.css
    layout.tsx

  components/
    ui/
      button.tsx
      input.tsx
      textarea.tsx
      label.tsx
      card.tsx
    shared/
      app-header.tsx
      app-footer.tsx
      section-container.tsx
    motion/
      fade-in.tsx
      stagger-container.tsx

  features/
    order/
      components/
        order-form.tsx
        order-form-fields.tsx
        order-result.tsx
        order-actions.tsx
        usage-limit-banner.tsx
      hooks/
        use-order-form.ts
        use-usage-limit.ts
      lib/
        format-order-message.ts
        get-whatsapp-link.ts
        normalize-phone-number.ts
        usage-limit-storage.ts
      schemas/
        order-form.schema.ts
      types/
        order-form.types.ts
      constants/
        order.constants.ts

  providers/
    sonner-provider.tsx

  lib/
    motion.ts
    utils.ts
13. Folder Responsibilities
app/

Berisi route, layout, dan global CSS.

components/ui/

Reusable primitive components yang bebas dari domain logic.

components/shared/

Komponen lintas fitur yang bukan primitive.

components/motion/

Reusable wrapper motion sederhana bila dibutuhkan.

features/order/components/

Komponen UI khusus domain order.

features/order/hooks/

Custom hooks untuk state dan behavior domain order.

features/order/lib/

Pure business logic dan utilities khusus feature order.

features/order/schemas/

Schema validasi zod.

features/order/types/

Type domain-specific.

features/order/constants/

Semua constant feature order.

providers/

Provider global seperti Sonner.

lib/

Helper general dan motion preset global.

14. TypeScript Requirements
14.1 General Rules

hindari any

gunakan inferred types dari zod bila memungkinkan

pisahkan UI props dari domain types bila dibutuhkan

gunakan nama yang eksplisit

14.2 Naming Convention

Gunakan nama seperti:

formatOrderMessage

getWhatsAppLink

normalizePhoneNumber

useUsageLimit

Hindari:

helpers.ts

misc.ts

temp.ts

14.3 Suggested Type
export type OrderFormValues = {
  customerName: string;
  phoneNumber?: string;
  productName: string;
  quantity: number;
  address: string;
  note?: string;
  destinationPhoneNumber?: string;
};
15. Validation Schema Requirements
15.1 Schema

Schema harus dibuat menggunakan zod.

15.2 Required Rules

trim string input

quantity menggunakan coercion ke number

validasi angka positif

optional phone values tetap dinormalisasi sebelum dipakai untuk WhatsApp

15.3 Error Presentation

tampilkan error dekat field terkait

gunakan pesan yang ringkas

field error dapat menggunakan AnimatePresence

16. Business Logic Requirements
16.1 Message Formatter

Buat pure function:

formatOrderMessage(values, options)

Responsibility

susun output message

tampilkan hanya field yang ada

tambahkan watermark berdasarkan options

hasil akhir harus berupa string final yang siap dipakai

16.2 WhatsApp Link Builder

Buat pure function:

getWhatsAppLink(phoneNumber, message)

Responsibility

normalize phone number

encode message

return full wa.me URL

return null jika nomor invalid

16.3 Phone Normalizer

Buat pure function:

normalizePhoneNumber(value)

Responsibility

hapus spasi

hapus simbol yang tidak perlu

hasilkan digit-only format yang aman dipakai

16.4 Usage Limit Storage

Pisahkan logic localStorage ke utility terpisah.

Responsibility

baca state dari storage

reset jika tanggal berubah

increment usage

handle parse error gracefully

17. Local Storage Requirements
17.1 Usage Limit Key
export const USAGE_LIMIT_STORAGE_KEY = "orderwa-usage-limit";
17.2 Daily Limit Constant
export const FREE_DAILY_GENERATE_LIMIT = 5;
17.3 Constraints

localStorage hanya diakses di client

akses harus dibungkus utility aman

parse failure tidak boleh membuat app crash

18. Sonner Integration
18.1 Provider

Buat provider global untuk Sonner dan mount di app/layout.tsx.

18.2 Suggested Provider File

providers/sonner-provider.tsx

18.3 Toast Copy Guidelines

Gunakan copy yang singkat dan jelas.

Example Toasts

Order berhasil dibuat

Teks berhasil disalin

Gagal menyalin teks

Nomor WhatsApp tujuan belum diisi

Batas harian free sudah tercapai

19. Motion Architecture
19.1 Global Motion Presets

Buat preset motion global di:

lib/motion.ts

Suggested Presets

fadeIn

fadeInUp

scaleIn

19.2 Motion Wrapper Components

Optional reusable wrappers:

FadeIn

StaggerContainer

Gunakan hanya jika membantu menjaga code tetap bersih.

20. Accessibility Requirements

semua input harus memiliki label

tombol harus bisa diakses via keyboard

focus state harus terlihat

icon tidak boleh menjadi satu-satunya representasi informasi

placeholder bukan pengganti label

contrast text harus cukup jelas

21. Non-Functional Requirements
21.1 Performance

interaksi harus terasa instan

UI tidak boleh terasa berat

hindari client component berlebihan

21.2 Responsiveness

mobile-first

desktop tetap luas dan clean

21.3 Maintainability

code modular

domain logic dipisah

mudah dikembangkan untuk paid features

21.4 Scalability Readiness

Struktur harus memudahkan penambahan:

multiple templates

remove watermark

unlimited usage

premium feature flag

history saving

22. MVP Completion Criteria

MVP frontend dianggap selesai jika seluruh poin berikut terpenuhi:

halaman utama tersedia dan responsive

form order berjalan dengan validasi

formatted message dapat di-generate

generated text dapat di-copy

WhatsApp link dapat dibuka dengan encoded text

Sonner toast berjalan

free daily usage limit berjalan via localStorage

watermark muncul di free message

Framer Motion dipakai secara subtle dan konsisten

Lucide icons dipakai secara konsisten

UI terasa clean, premium, elegan

codebase modular, type-safe, dan mengikuti App Router best practices

23. Implementation Notes
23.1 Recommended Build Order

setup Next.js 16 + TypeScript + Tailwind

setup folder structure

setup Sonner provider

setup schema dan types

build UI primitives

build order form

build message formatter

build result panel

build copy action

build WhatsApp action

implement usage limit

add motion and polish UI

final responsive refinement

23.2 Engineering Principles

keep MVP small

jangan overengineering

jangan tambahkan feature di luar scope

prioritaskan speed, clarity, dan usability

24. Recommended Dependencies
next
react
react-dom
typescript
tailwindcss
react-hook-form
zod
@hookform/resolvers
sonner
framer-motion
lucide-react
clsx
tailwind-merge
25. Final Notes for Execution

Frontend MVP harus terasa seperti produk modern yang ringan, cepat, dan rapi. Fokus utama bukan pada kompleksitas fitur, tetapi pada kualitas eksekusi, konsistensi UI, dan pengalaman penggunaan yang efisien.

Semua implementasi harus menjaga:

clean architecture ringan

type safety

good component boundaries

premium minimal visual direction

subtle motion only