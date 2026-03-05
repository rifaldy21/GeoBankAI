---
inclusion: auto
---

# Standar Pengembangan Proyek

## Tech Stack
- React 19 dengan TypeScript
- Vite sebagai build tool
- Tailwind CSS v4 untuk styling
- Recharts untuk visualisasi data
- Leaflet/React-Leaflet untuk peta
- Lucide React untuk ikon
- Motion untuk animasi

## Struktur Proyek
```
src/
├── components/     # Komponen React reusable
├── lib/           # Utility functions
├── mockData.ts    # Data dummy untuk development
├── types.ts       # TypeScript type definitions
└── main.tsx       # Entry point aplikasi

docs/
├── tasks/         # Dokumentasi penyelesaian task (completed only)
├── guides/        # Panduan teknis
│   ├── setup/
│   ├── development/
│   └── deployment/
├── api/           # Dokumentasi API
├── architecture/  # Dokumentasi arsitektur
├── decisions/     # Architecture Decision Records
└── troubleshooting/ # Panduan troubleshooting
```

## Konvensi Kode

### TypeScript
- Selalu gunakan TypeScript untuk semua file baru
- Definisikan types di `src/types.ts` untuk types yang digunakan di banyak tempat
- Gunakan interface untuk object shapes, type untuk unions/intersections
- Hindari `any`, gunakan `unknown` jika type tidak diketahui

### React Components
- Gunakan functional components dengan hooks
- Satu komponen per file
- Nama file menggunakan PascalCase (contoh: `StatCard.tsx`)
- Export default untuk komponen utama
- Gunakan named exports untuk utility functions

### Styling
- Gunakan Tailwind CSS utility classes
- Gunakan `clsx` atau `tailwind-merge` untuk conditional classes
- Hindari inline styles kecuali untuk dynamic values
- Konsisten dengan spacing: gunakan scale Tailwind (4, 8, 16, dll)

### State Management
- Gunakan React hooks (useState, useEffect, dll)
- Prop drilling untuk data sederhana
- Context API jika diperlukan untuk state global

### Data & API
- Mock data disimpan di `src/mockData.ts`
- Gunakan types yang didefinisikan di `src/types.ts`
- Format tanggal menggunakan `date-fns`

## Best Practices

### Performance
- Lazy load komponen besar jika diperlukan
- Memoize expensive calculations dengan `useMemo`
- Gunakan `React.memo` untuk komponen yang sering re-render

### Accessibility
- Gunakan semantic HTML
- Tambahkan aria-labels untuk interactive elements
- Pastikan keyboard navigation bekerja
- Gunakan proper heading hierarchy

### Code Quality
- Jalankan `npm run lint` sebelum commit
- Hindari console.log di production code
- Tulis kode yang self-documenting
- Tambahkan comments untuk logic yang kompleks

## Commands
- `npm run dev` - Start development server (port 3002)
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
- `npm run lint` - Type checking dengan TypeScript
- `npm run clean` - Hapus folder dist

## Environment Variables
- `GEMINI_API_KEY` - API key untuk Google Gemini (required)
- Simpan di `.env.local` (tidak di-commit ke git)

## Git Workflow
- Commit messages dalam Bahasa Indonesia atau Inggris (konsisten)
- Gunakan conventional commits jika memungkinkan
- Test sebelum push


## Dokumentasi
- Semua dokumentasi disimpan di folder `docs/`
- Task documentation di `docs/tasks/` (hanya task yang sudah selesai)
- Technical guides di `docs/guides/` (setup, development, deployment)
- Troubleshooting guides di `docs/troubleshooting/`
- Architecture decisions di `docs/decisions/` (ADR format)
- Lihat `documentation-standards.md` untuk detail lengkap
