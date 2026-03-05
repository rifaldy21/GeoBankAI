---
inclusion: fileMatch
fileMatchPattern: "src/components/**/*.tsx"
---

# Pola Komponen React

## Template Komponen Baru

```tsx
import { FC } from 'react';

interface ComponentNameProps {
  // Props definition
}

const ComponentName: FC<ComponentNameProps> = ({ /* props */ }) => {
  // Component logic
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

## Pola yang Digunakan di Proyek

### Chart Components
- Gunakan Recharts untuk semua visualisasi data
- Responsive dengan `ResponsiveContainer`
- Warna konsisten dengan theme (blue-500, green-500, dll)
- Tooltip untuk interaktivitas

### Card Components
- Wrapper dengan `bg-white rounded-lg shadow p-6`
- Header dengan title dan optional subtitle
- Content area yang fleksibel
- Consistent padding dan spacing

### Map Components
- Gunakan Leaflet untuk peta interaktif
- Lazy load map tiles
- Handle loading states
- Proper cleanup di useEffect

### Filter/Form Components
- Controlled components dengan state
- Clear visual feedback untuk selections
- Accessible form elements
- Validation jika diperlukan

## Props Patterns

### Optional Props dengan Default Values
```tsx
interface Props {
  title?: string;
  showIcon?: boolean;
}

const Component: FC<Props> = ({ 
  title = 'Default Title',
  showIcon = true 
}) => {
  // ...
};
```

### Children Props
```tsx
interface Props {
  children: React.ReactNode;
}
```

### Event Handlers
```tsx
interface Props {
  onClick?: () => void;
  onSubmit?: (data: FormData) => void;
}
```

## Styling Patterns

### Conditional Classes
```tsx
import { clsx } from 'clsx';

<div className={clsx(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)} />
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
```

### Interactive States
```tsx
<button className="hover:bg-blue-600 active:scale-95 transition-all" />
```

## Hooks Usage

### useState
```tsx
const [data, setData] = useState<DataType[]>([]);
```

### useEffect
```tsx
useEffect(() => {
  // Side effect
  
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

### Custom Hooks (jika diperlukan)
```tsx
// src/hooks/useCustomHook.ts
export const useCustomHook = () => {
  // Hook logic
  return { /* return values */ };
};
```

## Error Handling
- Gunakan error boundaries untuk komponen yang mungkin error
- Fallback UI untuk loading dan error states
- Console.error untuk debugging (hapus di production)

## Testing Considerations
- Komponen harus mudah di-test
- Pisahkan business logic dari UI logic
- Mock external dependencies (API calls, dll)
