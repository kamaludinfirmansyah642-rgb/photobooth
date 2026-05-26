# Web Photobooth

Aplikasi photobooth berbasis web dengan React dan Tailwind CSS.

## Fitur

- Kamera live dengan WebRTC
- Countdown 3 detik sebelum mengambil foto
- Preview foto dengan filter CSS
- Riwayat sesi foto (localStorage/SQLite)
- Overlay frame PNG
- Integrasi API AI (boilerplate)

## Teknologi

- React 18
- Vite
- Tailwind CSS
- Prisma (SQLite)

## Instalasi

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Buat database SQLite
npx prisma db push
```

## Menjalankan

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

## Struktur File

```
src/
├── components/    # Komponen React
│   ├── Camera.tsx
│   ├── Countdown.tsx
│   ├── Controls.tsx
│   ├── Header.tsx
│   ├── PhotoPreview.tsx
│   └── SessionHistory.tsx
├── hooks/        # Custom hooks
│   ├── useCamera.ts
│   └── usePhotoCapture.ts
├── utils/        # Utility functions
│   ├── aiApi.ts           # AI API boilerplate
│   ├── filters.ts         # CSS filters
│   └── imageProcessor.ts  # Frame overlay
├── lib/         # Database client
│   └── db.ts
├── App.tsx
└── main.tsx
```

## API AI

Boilerplate untuk integrasi AI tersedia di `src/utils/aiApi.ts`:

```typescript
import { cartoonizeImage, enhanceImage } from './utils/aiApi'

// Contoh penggunaan
const result = await enhanceImage(imageDataUrl)
if (result.success) {
  console.log(result.dataUrl)
}
```

## Frame Overlay

Tempatkan file PNG frame di `public/frames/` dan gunakan fungsi dari `src/utils/imageProcessor.ts`.