# Lokalisasi Multi-Bahasa (Bahasa Indonesia & English)

## Fitur

Aplikasi sekarang mendukung 2 bahasa:
- 🇮🇩 Bahasa Indonesia (default)
- 🇬🇧 English

Pengguna dapat mengganti bahasa melalui language switcher di header (sebelah kiri user profile).

## Perubahan yang Dilakukan

### File yang Dibuat

1. **`src/locales/id.ts`**
   - File terjemahan Bahasa Indonesia
   - Berisi semua teks yang digunakan di aplikasi
   - Terstruktur berdasarkan modul/fitur

2. **`src/locales/en.ts`**
   - File terjemahan Bahasa Inggris
   - Struktur sama dengan file Bahasa Indonesia
   - Semua key sama, hanya value yang berbeda

3. **`src/contexts/LanguageContext.tsx`**
   - Context untuk menyimpan bahasa yang dipilih
   - Menyimpan pilihan bahasa di localStorage
   - Menyediakan fungsi untuk mengganti bahasa

4. **`src/hooks/useTranslation.ts`**
   - Hook untuk mengakses terjemahan
   - Mengembalikan terjemahan berdasarkan bahasa yang dipilih
   - Helper function untuk nested translations

### File yang Diubah

1. **`src/main.tsx`**
   - Wrap aplikasi dengan `<LanguageProvider>`
   - Memastikan context tersedia di seluruh aplikasi

2. **`src/components/Header.tsx`**
   - Menambahkan language switcher dropdown
   - Icon globe dengan bendera negara
   - Dropdown menampilkan 2 pilihan bahasa
   - Menyimpan pilihan ke localStorage

3. **`src/components/Sidebar.tsx`**
   - Menggunakan `useLanguage()` hook
   - Helper function `getLabel()` untuk mendapatkan label berdasarkan locale
   - Semua menu label menggunakan `getLabel(menu)` atau `getLabel(submenu)`

4. **`src/config/menuConfig.ts`**
   - Menambahkan `labelId` dan `labelEn` untuk setiap menu item
   - Menghapus `label` tunggal, diganti dengan 2 properti
   - Interface `MenuItem` dan `SubMenuItem` diupdate

5. **`src/pages/DashboardPage.tsx`**
   - Menggunakan `useTranslation()` hook
   - Semua teks menggunakan `t.dashboard.xxx`
   - KPI labels, section titles, loading states

## Cara Menggunakan

### Di Component

```typescript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t, locale, setLocale } = useTranslation();
  
  return (
    <div>
      <h1>{t.dashboard.title}</h1>
      <p>{t.dashboard.subtitle}</p>
      
      {/* Mengganti bahasa */}
      <button onClick={() => setLocale('en')}>English</button>
      <button onClick={() => setLocale('id')}>Indonesia</button>
    </div>
  );
};
```

### Untuk Menu Items

```typescript
import { useLanguage } from '../contexts/LanguageContext';

const { locale } = useLanguage();

// Helper function
const getLabel = (item: MenuItem | SubMenuItem): string => {
  return locale === 'id' ? item.labelId : item.labelEn;
};

// Usage
<span>{getLabel(menu)}</span>
```

## Struktur Terjemahan

Terjemahan diorganisir berdasarkan modul:

```typescript
// Bahasa Indonesia
t.common.loading          // "Memuat"
t.dashboard.title         // "Dashboard"
t.campaign.title          // "Campaign & Activation"

// English
t.common.loading          // "Loading"
t.dashboard.title         // "Dashboard"
t.campaign.title          // "Campaign & Activation"
```

## Language Switcher

Language switcher terletak di header, sebelah kiri user profile dropdown:

- Icon: Globe (🌐)
- Menampilkan bendera negara saat ini
- Dropdown dengan 2 pilihan:
  - 🇮🇩 Bahasa Indonesia
  - 🇬🇧 English
- Pilihan yang aktif ditandai dengan checkmark
- Pilihan disimpan di localStorage
- Otomatis reload terjemahan saat bahasa diganti

## Menambah Terjemahan Baru

### 1. Tambahkan ke file locale

Edit `src/locales/id.ts` dan `src/locales/en.ts`:

```typescript
// id.ts
export const id = {
  // ... existing translations
  
  myNewModule: {
    title: 'Judul Baru',
    subtitle: 'Subjudul Baru',
    button: 'Tombol',
  },
};

// en.ts
export const en = {
  // ... existing translations
  
  myNewModule: {
    title: 'New Title',
    subtitle: 'New Subtitle',
    button: 'Button',
  },
};
```

### 2. Gunakan di component

```typescript
const { t } = useTranslation();
console.log(t.myNewModule.title); 
// ID: "Judul Baru"
// EN: "New Title"
```

## Menambah Bahasa Baru

Untuk menambah bahasa baru (misalnya Mandarin):

1. Buat file `src/locales/zh.ts` dengan struktur yang sama
2. Update `src/contexts/LanguageContext.tsx`:
   ```typescript
   import { zh } from '../locales/zh';
   
   type Locale = 'id' | 'en' | 'zh';
   
   const translations: Record<Locale, Translations> = {
     id,
     en,
     zh,
   };
   ```
3. Update language options di Header:
   ```typescript
   const languages = [
     { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
     { code: 'en', name: 'English', flag: '🇬🇧' },
     { code: 'zh', name: '中文', flag: '🇨🇳' },
   ];
   ```
4. Update menu config dengan `labelZh`

## Status Implementasi

### ✅ Selesai
- Language Context & Provider
- Language Switcher di Header
- Menu sidebar (multi-bahasa)
- Dashboard page (judul, KPI, map section)
- Translation infrastructure
- localStorage persistence

### 🔄 Dalam Progress
- Campaign page
- Territorial Intelligence pages
- Market Intelligence pages
- Performance pages
- Data Management pages
- Error pages
- Filter components

## Testing

Setelah perubahan, test:

1. **Language Switcher:**
   - Klik icon globe di header
   - Pilih "English" - semua teks berubah ke English
   - Pilih "Bahasa Indonesia" - semua teks berubah ke Indonesia
   - Refresh browser - bahasa tetap sesuai pilihan terakhir

2. **Menu Sidebar:**
   - Bahasa Indonesia: "Kinerja", "Estimasi TAM", "Kinerja RM", dll
   - English: "Performance", "TAM Estimation", "RM Performance", dll

3. **Dashboard:**
   - KPI cards berubah bahasa
   - Section titles berubah bahasa
   - Loading states berubah bahasa

4. **localStorage:**
   - Buka DevTools > Application > Local Storage
   - Cek key `locale` - value `id` atau `en`

---

**Last Updated:** 2026-03-06
**Status:** Multi-Language Support Implemented ✅
**Languages:** 🇮🇩 Bahasa Indonesia | 🇬🇧 English
