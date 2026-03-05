---
inclusion: auto
---

# Standar Dokumentasi Proyek

## Struktur Folder Dokumentasi

```
docs/
├── tasks/              # Dokumentasi penyelesaian task (completed only)
├── guides/             # Panduan teknis
│   ├── setup/          # Setup dan instalasi
│   ├── development/    # Panduan development
│   └── deployment/     # Panduan deployment
├── api/                # Dokumentasi API (jika ada)
├── architecture/       # Dokumentasi arsitektur sistem
├── decisions/          # Architecture Decision Records (ADR)
└── troubleshooting/    # Panduan troubleshooting
```

## Dokumentasi Tasks

### Lokasi
Semua dokumentasi task disimpan di `docs/tasks/` - hanya untuk task yang sudah selesai

### Format Nama File
`YYYY-MM-DD-task-name.md`

### Template Task Documentation

```markdown
# [Nama Task]

**Status**: Completed
**Tanggal Mulai**: YYYY-MM-DD
**Tanggal Selesai**: YYYY-MM-DD
**Assignee**: [Nama]

## Deskripsi
[Deskripsi singkat task]

## Tujuan
- [Tujuan 1]
- [Tujuan 2]

## Langkah Pengerjaan
1. [Langkah 1]
2. [Langkah 2]

## Perubahan yang Dilakukan
### File yang Diubah
- `path/to/file.ts` - [Deskripsi perubahan]

### File yang Ditambahkan
- `path/to/new-file.ts` - [Deskripsi file]

## Testing
- [x] Unit tests
- [x] Integration tests
- [x] Manual testing

## Hasil
[Screenshot atau deskripsi hasil jika diperlukan]

## Catatan
[Catatan penting, learning, atau hal yang perlu diperhatikan untuk task serupa]

## Related Issues/Tasks
- [Link ke task lain jika ada]
```

## Dokumentasi Guides

### Lokasi
Semua panduan teknis disimpan di `docs/guides/`

### Jenis Guides

#### Setup Guides (`docs/guides/setup/`)
- Environment setup
- Dependencies installation
- Configuration
- Database setup (jika ada)

#### Development Guides (`docs/guides/development/`)
- Coding standards
- Component development
- State management
- Testing practices
- Debugging tips

#### Deployment Guides (`docs/guides/deployment/`)
- Build process
- Deployment steps
- Environment variables
- CI/CD pipeline

### Template Guide Documentation

```markdown
# [Judul Guide]

**Kategori**: Setup / Development / Deployment
**Last Updated**: YYYY-MM-DD

## Overview
[Penjelasan singkat tentang guide ini]

## Prerequisites
- [Requirement 1]
- [Requirement 2]

## Langkah-langkah

### 1. [Langkah Pertama]
[Penjelasan detail]

\`\`\`bash
# Command jika diperlukan
npm install
\`\`\`

### 2. [Langkah Kedua]
[Penjelasan detail]

## Troubleshooting
### Issue: [Nama Issue]
**Solusi**: [Cara mengatasi]

## Best Practices
- [Best practice 1]
- [Best practice 2]

## References
- [Link ke dokumentasi eksternal]
```

## Dokumentasi API

### Lokasi
`docs/api/` - Dokumentasi endpoints dan data structures

### Format
```markdown
# API Documentation

## Endpoints

### GET /api/endpoint
**Deskripsi**: [Deskripsi endpoint]

**Parameters**:
- `param1` (string, required) - [Deskripsi]

**Response**:
\`\`\`json
{
  "data": []
}
\`\`\`

**Error Codes**:
- 400: Bad Request
- 404: Not Found
```

## Dokumentasi Arsitektur

### Lokasi
`docs/architecture/` - Dokumentasi high-level architecture

### Konten
- System overview
- Component diagram
- Data flow
- Technology stack
- Design patterns

### Format
```markdown
# Architecture Overview

## System Components
[Diagram atau deskripsi komponen]

## Data Flow
[Penjelasan alur data]

## Technology Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Charts: Recharts
- Maps: Leaflet

## Design Decisions
[Keputusan arsitektur penting]
```

## Architecture Decision Records (ADR)

### Lokasi
`docs/decisions/` - Record keputusan arsitektur penting

### Format Nama File
`NNNN-title-of-decision.md` (contoh: `0001-use-typescript.md`)

### Template ADR
```markdown
# [Nomor]. [Judul Keputusan]

**Status**: Proposed / Accepted / Deprecated / Superseded
**Date**: YYYY-MM-DD
**Deciders**: [Nama orang yang memutuskan]

## Context
[Konteks dan masalah yang dihadapi]

## Decision
[Keputusan yang diambil]

## Consequences
### Positive
- [Konsekuensi positif]

### Negative
- [Konsekuensi negatif]

## Alternatives Considered
- [Alternatif 1] - [Alasan tidak dipilih]
- [Alternatif 2] - [Alasan tidak dipilih]
```

## Dokumentasi Troubleshooting

### Lokasi
`docs/troubleshooting/` - Panduan mengatasi masalah umum

### Format
```markdown
# Troubleshooting Guide

## [Kategori Masalah]

### Problem: [Deskripsi masalah]
**Symptoms**:
- [Gejala 1]
- [Gejala 2]

**Cause**: [Penyebab masalah]

**Solution**:
1. [Langkah solusi 1]
2. [Langkah solusi 2]

**Prevention**: [Cara mencegah masalah ini]
```

## Konvensi Penulisan

### Bahasa
- Gunakan Bahasa Indonesia untuk dokumentasi internal
- Gunakan Bahasa Inggris untuk dokumentasi yang mungkin dibagikan ke publik
- Konsisten dalam satu dokumen

### Format
- Gunakan Markdown untuk semua dokumentasi
- Heading hierarchy yang proper (H1 untuk title, H2 untuk sections, dll)
- Code blocks dengan syntax highlighting
- Screenshots di folder `docs/assets/images/`

### Naming Convention
- Lowercase dengan dash separator
- Descriptive names
- Include dates untuk task documentation
- Contoh: `2026-03-05-add-new-chart-component.md`

## Maintenance

### Update Documentation
- Update dokumentasi saat ada perubahan signifikan
- Tambahkan "Last Updated" date di guide documentation
- Archive dokumentasi yang sudah tidak relevan

### Review
- Review dokumentasi secara berkala
- Pastikan link masih valid
- Update screenshots jika UI berubah

## Tools & Automation

### Recommended Tools
- Markdown editor dengan preview
- Diagram tools: Mermaid, Draw.io
- Screenshot tools dengan annotation

### Auto-generation
- Generate API docs dari code comments (jika menggunakan JSDoc)
- Generate component docs dari PropTypes/TypeScript interfaces

## Best Practices

1. **Write as You Code**: Dokumentasikan sambil coding, bukan setelahnya
2. **Keep It Simple**: Dokumentasi yang simple lebih baik dari yang kompleks tapi tidak dibaca
3. **Use Examples**: Sertakan contoh code dan use cases
4. **Visual Aids**: Gunakan diagram dan screenshots jika membantu
5. **Link Related Docs**: Cross-reference ke dokumentasi terkait
6. **Version Control**: Commit dokumentasi bersama dengan code changes
7. **Audience Awareness**: Sesuaikan level detail dengan target audience

## Migration dari Dokumentasi Lama

Dokumentasi yang sudah ada di root folder:
- `DASHBOARD_LAYOUT_IMPROVEMENTS.md` → `docs/tasks/`
- `DUMMY_DATA_AND_MAP_UPDATE.md` → `docs/tasks/`
- `MAP_TROUBLESHOOTING.md` → `docs/troubleshooting/`
- `NEW_CHARTS_DOCUMENTATION.md` → `docs/guides/development/`
- `UI_IMPROVEMENTS.md` → `docs/tasks/`

Pindahkan secara bertahap untuk menjaga history dan references.
