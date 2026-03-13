# reseller.drwskincare

Landing page program reseller DRW Skincare. Dibangun dengan **Next.js + TypeScript + TailwindCSS**, siap di-deploy ke **Vercel**.

## Struktur Proyek

```
reseller.drwskincare/
├── app/
│   ├── globals.css          # Global CSS (Tailwind base)
│   ├── layout.tsx           # Root layout (GTM, Meta Pixel, TikTok Pixel)
│   └── page.tsx             # Entry point halaman utama
├── components/
│   └── LandingResellerDRW.tsx  # Komponen utama landing page
├── public/
│   ├── favicon.ico
│   ├── images/
│   │   └── hero.webp        # PLACEHOLDER: Ganti dengan gambar hero reseller
│   └── showcase/
│       └── 1-10.png         # PLACEHOLDER: Ganti dengan foto reseller/produk
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Cara Kustomisasi

### 1. Konten & Copy
Buka `components/LandingResellerDRW.tsx` dan cari semua komentar `// PLACEHOLDER:` untuk mengetahui bagian yang perlu diganti:
- **Nama brand** di Navbar
- **Headline & sub-headline** Hero
- **Trust badges** (Brand X tahun, dll)
- **Poin masalah & solusi**
- **Benefit cards** (6 kartu)
- **Showcase** (gambar reseller/produk)
- **Testimoni**
- **Detail paket** (nama, harga, benefit list)
- **Support points**
- **FAQ** (pertanyaan & jawaban)
- **Teks form** dan CTA
- **Footer** (nama brand, tagline)
- **WhatsApp popup** (nama & pesan)

### 2. Gambar
Ganti file di folder `public/`:
- `public/images/hero.webp` → Gambar hero reseller
- `public/showcase/1.png` s/d `10.png` → Foto produk atau reseller sukses
- `public/favicon.ico` → Logo DRW Skincare

### 3. Nomor WhatsApp
Buat file `.env.local` di root proyek:
```env
NEXT_PUBLIC_WA_NUMBER=628XXXXXXXXXX
```

### 4. Tracking Pixels
Edit `app/layout.tsx` dan ganti placeholder ID:
- `GTM-XXXXXXX` → Google Tag Manager ID
- `XXXXXXXXXXXXXXXXX` (Meta Pixel) → Facebook Pixel ID
- `XXXXXXXXXXXXXXXXX` (TikTok Pixel) → TikTok Pixel ID

### 5. Warna Tema
Tema saat ini menggunakan **rose/pink** dari Tailwind. Untuk mengganti warna:
- Cari `rose-600`, `rose-700`, `rose-50` di `LandingResellerDRW.tsx`
- Ganti dengan warna Tailwind yang diinginkan (misal: `amber`, `purple`, `emerald`)

## Development

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev

# Build untuk production
npm run build
```

## Deploy ke Vercel

1. Push repo ini ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variable `NEXT_PUBLIC_WA_NUMBER` di Vercel dashboard
4. Deploy otomatis setiap push ke branch `main`

## Template Berdasarkan

Struktur dan arsitektur didasarkan pada `drw-beautycenter-landing` (repo kemitraan Beauty Center DRW Skincare).
