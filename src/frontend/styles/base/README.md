# 🎯 Base - Variables y Configuraciones Fundamentales

Esta carpeta contiene las variables CSS fundamentales y configuraciones base que sustentan todo el sistema de diseño de SweetMatch.

## 📁 Estructura de Base

```
base/
└── 📄 variables.css          # Variables CSS globales del sistema
```

## 🎨 Variables CSS - Sistema de Diseño

### **variables.css**
**Descripción**: Define todas las variables CSS que forman la base del sistema de diseño visual de SweetMatch.

## 🎨 Paleta de Colores

### **Colores Principales**:
```css
:root {
  /* Branding principal */
  --primary-color: #ff6b9d;        /* Rosa principal de SweetMatch */
  --primary-light: #ff8fa3;        /* Rosa claro */
  --primary-dark: #e91e63;         /* Rosa oscuro */
  
  /* Colores secundarios */
  --secondary-color: #ff8a9b;      /* Rosa suave */
  --secondary-light: #ffb3c1;      /* Rosa muy claro */
  --secondary-dark: #d81b60;       /* Rosa intenso */
  
  /* Colores de acento */
  --accent-color: #4CAF50;         /* Verde para éxito/matches */
  --accent-light: #81C784;         /* Verde claro */
  --accent-dark: #388E3C;          /* Verde oscuro */
}
```

### **Estados de la Aplicación**:
```css
:root {
  /* Estados de feedback */
  --success-color: #4CAF50;        /* Verde - éxito */
  --warning-color: #FFA726;        /* Naranja - advertencia */
  --error-color: #F44336;          /* Rojo - error */
  --info-color: #2196F3;           /* Azul - información */
  
  /* Estados hover y focus */
  --hover-overlay: rgba(0,0,0,0.1);
  --focus-outline: #2196F3;
  --active-state: #e91e63;
}
```

### **Escala de Grises**:
```css
:root {
  /* Textos */
  --text-primary: #212121;         /* Texto principal */
  --text-secondary: #757575;       /* Texto secundario */
  --text-disabled: #BDBDBD;        /* Texto deshabilitado */
  --text-hint: #9E9E9E;           /* Texto de ayuda */
  
  /* Fondos */
  --background-primary: #FFFFFF;    /* Fondo principal */
  --background-secondary: #FAFAFA;  /* Fondo secundario */
  --surface: #FFFFFF;              /* Superficie de cards */
  --overlay: rgba(0,0,0,0.5);      /* Overlay oscuro */
}
```

## 📝 Tipografía

### **Familias de Fuentes**:
```css
:root {
  /* Fuentes principales */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-secondary: 'Poppins', sans-serif;
  --font-accent: 'Dancing Script', cursive;
  
  /* Pesos de fuente */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### **Escala Tipográfica**:
```css
:root {
  /* Tamaños de fuente */
  --font-xs: 0.75rem;      /* 12px */
  --font-sm: 0.875rem;     /* 14px */
  --font-base: 1rem;       /* 16px */
  --font-lg: 1.125rem;     /* 18px */
  --font-xl: 1.25rem;      /* 20px */
  --font-2xl: 1.5rem;      /* 24px */
  --font-3xl: 1.875rem;    /* 30px */
  --font-4xl: 2.25rem;     /* 36px */
  --font-5xl: 3rem;        /* 48px */
  
  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

## 📏 Sistema de Espaciado

### **Escala de Espacios**:
```css
:root {
  /* Espaciado base */
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
}
```

### **Contenedores y Layout**:
```css
:root {
  /* Anchos máximos */
  --max-width-xs: 20rem;    /* 320px */
  --max-width-sm: 24rem;    /* 384px */
  --max-width-md: 28rem;    /* 448px */
  --max-width-lg: 32rem;    /* 512px */
  --max-width-xl: 36rem;    /* 576px */
  --max-width-2xl: 42rem;   /* 672px */
  --max-width-container: 1200px;
  
  /* Alturas */
  --header-height: 64px;
  --footer-height: 200px;
}
```

## 📱 Breakpoints Responsive

### **Puntos de Ruptura**:
```css
:root {
  /* Mobile first breakpoints */
  --breakpoint-sm: 640px;    /* Small devices */
  --breakpoint-md: 768px;    /* Medium devices */
  --breakpoint-lg: 1024px;   /* Large devices */
  --breakpoint-xl: 1280px;   /* Extra large devices */
  --breakpoint-2xl: 1536px;  /* 2X large devices */
}
```

## ✨ Efectos y Animaciones

### **Sombras**:
```css
:root {
  /* Sistema de sombras */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-base: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
  --shadow-2xl: 0 25px 50px rgba(0,0,0,0.25);
  --shadow-inner: inset 0 2px 4px rgba(0,0,0,0.06);
}
```

### **Transiciones**:
```css
:root {
  /* Duraciones de animación */
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  
  /* Curvas de animación */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### **Border Radius**:
```css
:root {
  /* Radios de borde */
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-base: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-full: 9999px;    /* Círculo completo */
}
```

## 🎨 Gradientes Especiales

```css
:root {
  /* Gradientes temáticos */
  --gradient-primary: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  --gradient-success: linear-gradient(135deg, var(--success-color) 0%, #66BB6A 100%);
  --gradient-sunset: linear-gradient(135deg, #ff6b9d 0%, #ffa726 100%);
  --gradient-ocean: linear-gradient(135deg, #2196F3 0%, #21CBF3 100%);
  
  /* Gradientes de overlay */
  --gradient-overlay-dark: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%);
  --gradient-overlay-light: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, transparent 100%);
}
```

## 🔧 Uso de Variables

### **En componentes CSS**:
```css
.button-primary {
  background-color: var(--primary-color);
  color: var(--background-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: var(--font-medium);
  transition: all var(--duration-normal) var(--ease-out);
}

.button-primary:hover {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-md);
}
```

### **Responsive con variables**:
```css
.container {
  max-width: var(--max-width-container);
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-8);
  }
}
```

## 🎯 Beneficios del Sistema

### **Consistencia Visual**:
- Colores unificados en toda la aplicación
- Espaciado coherente y predecible
- Tipografía armoniosa y legible

### **Mantenibilidad**:
- Cambios globales desde un solo archivo
- Fácil actualización de temas
- Escalabilidad del sistema de diseño

### **Performance**:
- Variables nativas CSS (sin preprocesadores)
- Reutilización eficiente de valores
- Menor repetición de código

---

*Este sistema de variables proporciona la base sólida sobre la cual se construye toda la experiencia visual de SweetMatch, garantizando coherencia, escalabilidad y mantenibilidad.*
