# 🎨 Sistema de Temas - Documentación

## Índice
1. [Introducción](#introducción)
2. [Configuración Inicial](#configuración-inicial)
3. [Variables CSS Disponibles](#variables-css-disponibles)
4. [Hook useTheme](#hook-usetheme)
5. [Ejemplos de Componentes](#ejemplos-de-componentes)
6. [Mejores Prácticas](#mejores-prácticas)
7. [Animaciones con Framer Motion](#animaciones-con-framer-motion)

## Introducción

Este sistema de temas utiliza **CSS Variables** y **React Context** para proporcionar una solución robusta y escalable para el manejo de temas en la aplicación. El sistema está optimizado para móviles y soporta modo oscuro (por defecto) y modo claro.

### Características principales:
- ✅ Modo oscuro por defecto
- ✅ Persistencia en localStorage
- ✅ Optimizado para móviles (mobile-first)
- ✅ Variables CSS personalizadas
- ✅ Integración con Framer Motion
- ✅ TypeScript completo

## Configuración Inicial

### 1. Envolver la aplicación con ThemeProvider

```tsx
// App.tsx
import { ThemeProvider } from './common/storage/themeStore';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      {/* Tu aplicación aquí */}
    </ThemeProvider>
  );
}
```

### 2. Importar estilos base

```tsx
// main.tsx
import './index.css'; // Incluye todas las variables CSS
```

## Variables CSS Disponibles

### 🌙 Colores de Fondo
```css
var(--bg-primary)      /* Fondo principal de la app */
var(--bg-secondary)    /* Fondo secundario para secciones */
var(--bg-tertiary)     /* Fondo terciario para elementos */
var(--bg-accent)       /* Fondo de acento para destacar */
```

### 🎭 Colores de Superficie
```css
var(--surface-primary)   /* Superficie principal (cards, modales) */
var(--surface-secondary) /* Superficie secundaria (botones) */
var(--surface-tertiary)  /* Superficie terciaria (inputs) */
```

### ✍️ Colores de Texto
```css
var(--text-primary)   /* Texto principal (títulos, contenido principal) */
var(--text-secondary) /* Texto secundario (subtítulos, descripciones) */
var(--text-tertiary)  /* Texto terciario (placeholders, labels) */
var(--text-accent)    /* Texto de acento (enlaces, destacados) */
```

### 🎨 Colores de Acento
```css
var(--accent-primary)  /* Azul principal para botones primarios */
var(--accent-secondary)/* Azul secundario para hover states */
var(--accent-success)  /* Verde para estados de éxito */
var(--accent-warning)  /* Amarillo para advertencias */
var(--accent-error)    /* Rojo para errores */
```

### 🖼️ Bordes y Sombras
```css
var(--border-primary)   /* Bordes principales */
var(--border-secondary) /* Bordes secundarios */
var(--border-accent)    /* Bordes de acento */

var(--shadow-sm)        /* Sombra pequeña */
var(--shadow-md)        /* Sombra mediana */
var(--shadow-lg)        /* Sombra grande */
```

### 🌈 Gradientes
```css
var(--gradient-primary) /* Gradiente principal de fondo */
var(--gradient-accent)  /* Gradiente de acento para elementos especiales */
```

## Hook useTheme

```tsx
import { useTheme } from './common/storage/themeStore';

function MiComponente() {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();
  
  // theme: 'dark' | 'light'
  // isDark: boolean
  // toggleTheme: () => void
  // setTheme: (theme: 'dark' | 'light') => void
  
  return (
    <div>
      <p>Tema actual: {theme}</p>
      <p>Modo oscuro: {isDark ? 'Sí' : 'No'}</p>
      <button onClick={toggleTheme}>Cambiar tema</button>
    </div>
  );
}
```

## Ejemplos de Componentes

### 1. Botón Básico Temático

```tsx
// atoms/ThemedButton.tsx
import { motion } from 'framer-motion';

interface ThemedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function ThemedButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick 
}: ThemedButtonProps) {
  const variants = {
    primary: `
      bg-[var(--accent-primary)] 
      hover:bg-[var(--accent-secondary)]
      text-white
      border-transparent
    `,
    secondary: `
      bg-[var(--surface-secondary)] 
      hover:bg-[var(--surface-tertiary)]
      text-[var(--text-primary)]
      border-[var(--border-primary)]
    `,
    ghost: `
      bg-transparent 
      hover:bg-[var(--surface-secondary)]
      text-[var(--text-secondary)]
      border-transparent
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg
        border
        font-medium
        transition-colors duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--accent-primary)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--bg-primary)]
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
```

### 2. Card Temática

```tsx
// molecules/ThemedCard.tsx
import { motion } from 'framer-motion';

interface ThemedCardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'sm' | 'md' | 'lg';
}

export function ThemedCard({ 
  children, 
  className = '',
  elevation = 'md'
}: ThemedCardProps) {
  const shadows = {
    sm: 'shadow-[var(--shadow-sm)]',
    md: 'shadow-[var(--shadow-md)]',
    lg: 'shadow-[var(--shadow-lg)]'
  };

  return (
    <motion.div
      className={`
        bg-[var(--surface-primary)]
        border border-[var(--border-primary)]
        rounded-xl
        p-4 sm:p-6
        ${shadows[elevation]}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ 
        y: -2,
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {children}
    </motion.div>
  );
}
```

### 3. Input Temático

```tsx
// atoms/ThemedInput.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ThemedInputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function ThemedInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error
}: ThemedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="
          block text-sm font-medium 
          text-[var(--text-secondary)] 
          mb-1.5
        ">
          {label}
        </label>
      )}
      
      <motion.div
        animate={{ 
          scale: isFocused ? 1.01 : 1,
          borderColor: isFocused ? 'var(--accent-primary)' : error ? 'var(--accent-error)' : 'var(--border-primary)'
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            w-full px-3 py-2.5
            bg-[var(--surface-secondary)]
            border border-[var(--border-primary)]
            rounded-lg
            text-[var(--text-primary)]
            placeholder:text-[var(--text-tertiary)]
            focus:outline-none
            focus:ring-2
            focus:ring-[var(--accent-primary)]
            focus:ring-offset-2
            focus:ring-offset-[var(--bg-primary)]
            transition-colors duration-200
          "
        />
      </motion.div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm text-[var(--accent-error)] mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
```

### 4. Modal Temático

```tsx
// molecules/ThemedModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../storage/themeStore';

interface ThemedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function ThemedModal({ isOpen, onClose, title, children }: ThemedModalProps) {
  const { isDark } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed inset-0 z-40
              bg-black bg-opacity-50
              backdrop-blur-sm
            "
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="
              fixed inset-4 z-50
              sm:inset-8 md:inset-16 lg:inset-32
              bg-[var(--surface-primary)]
              border border-[var(--border-primary)]
              rounded-xl
              shadow-[var(--shadow-lg)]
              overflow-hidden
              flex flex-col
            "
          >
            {/* Header */}
            {title && (
              <div className="
                flex items-center justify-between
                p-4 sm:p-6
                border-b border-[var(--border-primary)]
              ">
                <h2 className="
                  text-lg sm:text-xl font-semibold
                  text-[var(--text-primary)]
                ">
                  {title}
                </h2>
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.1 }}
                  className="
                    p-1 rounded-full
                    text-[var(--text-secondary)]
                    hover:text-[var(--text-primary)]
                    hover:bg-[var(--surface-secondary)]
                    transition-colors duration-200
                  "
                >
                  <X size={20} />
                </motion.button>
              </div>
            )}
            
            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 5. Indicador de Estado (Live)

```tsx
// atoms/StatusIndicator.tsx
import { motion } from 'framer-motion';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'loading';
  text?: string;
  showPulse?: boolean;
}

export function StatusIndicator({ 
  status, 
  text, 
  showPulse = true 
}: StatusIndicatorProps) {
  const statusConfig = {
    online: {
      color: 'var(--accent-success)',
      bgColor: 'bg-green-500',
      text: text || 'En línea'
    },
    offline: {
      color: 'var(--accent-error)',
      bgColor: 'bg-red-500',
      text: text || 'Desconectado'
    },
    loading: {
      color: 'var(--accent-warning)',
      bgColor: 'bg-yellow-500',
      text: text || 'Conectando...'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <motion.div
          className={`w-2 h-2 rounded-full ${config.bgColor}`}
          animate={showPulse && status === 'online' ? {
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {showPulse && status === 'online' && (
          <motion.div
            className={`absolute inset-0 rounded-full ${config.bgColor} opacity-30`}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      <span 
        className="text-sm text-[var(--text-secondary)]"
        style={{ color: config.color }}
      >
        {config.text}
      </span>
    </div>
  );
}
```

## Mejores Prácticas

### ✅ DO (Hazlo)

1. **Siempre usa variables CSS** en lugar de colores hardcodeados:
   ```tsx
   // ✅ Correcto
   className="bg-[var(--surface-primary)] text-[var(--text-primary)]"
   
   // ❌ Incorrecto
   className="bg-gray-900 text-white"
   ```

2. **Usa el hook useTheme** para lógica condicional basada en tema:
   ```tsx
   const { isDark } = useTheme();
   const iconColor = isDark ? '#ffffff' : '#000000';
   ```

3. **Aplica mobile-first** en tus componentes:
   ```tsx
   className="p-4 sm:p-6 md:p-8" // Móvil primero
   ```

4. **Combina con Framer Motion** para animaciones temáticas:
   ```tsx
   <motion.div
     animate={{ backgroundColor: 'var(--surface-primary)' }}
     transition={{ duration: 0.3 }}
   />
   ```

### ❌ DON'T (No hagas)

1. **No uses Tailwind colors directamente** para elementos temáticos:
   ```tsx
   // ❌ Evita esto para elementos que deben cambiar con el tema
   className="bg-gray-900 text-white"
   ```

2. **No olvides focus states** y accesibilidad:
   ```tsx
   // ✅ Siempre incluye focus visible
   className="focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
   ```

3. **No hardcodees animaciones** que dependan del tema:
   ```tsx
   // ❌ Evita valores fijos
   animate={{ backgroundColor: '#1a1a1b' }}
   
   // ✅ Usa variables
   animate={{ backgroundColor: 'var(--surface-primary)' }}
   ```

## Animaciones con Framer Motion

### Transición de Tema Global
```tsx
// Layout animado que responde al cambio de tema
const { theme } = useTheme();

return (
  <motion.div
    key={theme}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="min-h-screen bg-[var(--bg-primary)]"
  >
    {children}
  </motion.div>
);
```

### Hover Effects Temáticos
```tsx
<motion.div
  whileHover={{
    backgroundColor: 'var(--surface-secondary)',
    scale: 1.02
  }}
  transition={{ duration: 0.2 }}
  className="bg-[var(--surface-primary)]"
>
  Contenido
</motion.div>
```

### Animaciones de Aparición
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={itemVariants}
      className="bg-[var(--surface-primary)]"
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## 📱 Soporte Móvil

Todo el sistema está optimizado para móviles con:
- **Touch targets** de mínimo 44px
- **Typography scales** responsivas
- **Spacing** móvil-first
- **Gestures** touch-friendly con Framer Motion

## 🔧 Personalización

Para agregar nuevos colores o variables:

1. **Edita `src/index.css`**:
   ```css
   [data-theme="dark"] {
     --mi-nuevo-color: #ff6b6b;
   }
   
   [data-theme="light"] {
     --mi-nuevo-color: #e03131;
   }
   ```

2. **Úsalo en componentes**:
   ```tsx
   className="bg-[var(--mi-nuevo-color)]"
   ```

¡Ahora puedes crear componentes consistentes y temáticos! 🚀
