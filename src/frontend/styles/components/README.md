# 🧩 Components - Estilos de Componentes Reutilizables

Esta carpeta contiene los estilos CSS de todos los componentes reutilizables de SweetMatch, organizados por funcionalidad y siguiendo metodología BEM.

## 📁 Estructura de Components

```
components/
├── 📄 buttons.css            # Sistema completo de botones
├── 📄 cards.css              # Tarjetas y contenedores de contenido
├── 📄 components.css         # Componentes generales y mixins
├── 📄 footer.css             # Footer del sitio web
├── 📄 forms.css              # Formularios, inputs y validaciones
├── 📄 header.css             # Header y sistema de navegación
├── 📄 hero.css               # Sección hero y banners principales
├── 📄 layout.css             # Sistema de layout y grid
├── 📄 user-menu.css          # Menú desplegable del usuario
└── 📄 utilities.css          # Clases utilitarias y helpers
```

---

## 📋 Documentación por Componente

### 🔘 **buttons.css**
**Descripción**: Sistema completo de botones con variantes y estados.

**Clases principales**:
```css
.btn                    /* Botón base */
.btn-primary           /* Botón principal (rosa) */
.btn-secondary         /* Botón secundario (outline) */
.btn-success           /* Botón de éxito (verde) */
.btn-danger            /* Botón de peligro (rojo) */
.btn-ghost             /* Botón fantasma (transparente) */
.btn-icon              /* Botón solo icono */
.btn-floating          /* Botón flotante (FAB) */

/* Tamaños */
.btn-sm                /* Botón pequeño */
.btn-md                /* Botón mediano (por defecto) */
.btn-lg                /* Botón grande */
.btn-xl                /* Botón extra grande */

/* Estados */
.btn:hover             /* Estado hover */
.btn:active            /* Estado activo */
.btn:disabled          /* Estado deshabilitado */
.btn:loading           /* Estado de carga */
```

**Características**:
- ✅ 7+ variantes de botones diferentes
- ✅ 4 tamaños responsivos
- ✅ Estados interactivos completos
- ✅ Animaciones suaves de transición
- ✅ Soporte para iconos y texto
- ✅ Accesibilidad completa

---

### 🎴 **cards.css**
**Descripción**: Sistema de tarjetas para mostrar contenido organizado.

**Clases principales**:
```css
.card                  /* Tarjeta base */
.card-header           /* Encabezado de tarjeta */
.card-body             /* Cuerpo principal */
.card-footer           /* Pie de tarjeta */

/* Variantes */
.profile-card          /* Tarjeta de perfil de usuario */
.match-card            /* Tarjeta de match con animaciones */
.testimonial-card      /* Tarjeta de testimonio */
.feature-card          /* Tarjeta de característica */
.notification-card     /* Tarjeta de notificación */

/* Efectos */
.card-hover            /* Efecto hover elevado */
.card-clickable        /* Tarjeta interactiva */
.card-selected         /* Estado seleccionado */
```

**Características**:
- ✅ Sistema modular de tarjetas
- ✅ Variantes especializadas por contexto
- ✅ Efectos hover y estados interactivos
- ✅ Responsive design incorporado
- ✅ Sombras y elevaciones CSS

---

### 🏗️ **components.css**
**Descripción**: Componentes generales y patrones reutilizables.

**Contenido**:
```css
/* Contenedores generales */
.container             /* Contenedor principal */
.section               /* Sección de página */
.wrapper               /* Envoltorio genérico */

/* Elementos de UI */
.avatar                /* Avatar circular de usuario */
.badge                 /* Insignia de notificación */
.chip                  /* Etiqueta removible */
.divider               /* Separador visual */
.skeleton              /* Loading skeleton */

/* Patrones de layout */
.flex-center           /* Centrado con flexbox */
.grid-auto             /* Grid automático */
.sticky-top            /* Elemento pegajoso */
```

---

### 🦶 **footer.css**
**Descripción**: Estilos del footer institucional del sitio.

**Estructura**:
```css
.main-footer           /* Footer principal */
.footer-content        /* Contenido del footer */
.footer-section        /* Sección del footer */
.footer-links          /* Enlaces del footer */
.footer-social         /* Redes sociales */
.footer-bottom         /* Parte inferior copyright */

/* Responsive */
.footer-mobile         /* Adaptación móvil */
.footer-desktop        /* Vista desktop */
```

**Características**:
- ✅ Layout responsive multisección
- ✅ Integración con redes sociales
- ✅ Links organizados por categorías
- ✅ Copyright y políticas legales

---

### 📝 **forms.css**
**Descripción**: Sistema completo de formularios y validaciones.

**Componentes de formulario**:
```css
/* Estructura */
.form                  /* Formulario base */
.form-group            /* Grupo de campo */
.form-row              /* Fila de campos */
.form-col              /* Columna de campo */

/* Inputs */
.form-input            /* Input base estilizado */
.form-textarea         /* Área de texto */
.form-select           /* Select dropdown */
.form-checkbox         /* Checkbox personalizado */
.form-radio            /* Radio button */
.form-file             /* Input de archivo */

/* Estados */
.form-input:focus      /* Estado focus */
.form-input.error      /* Estado de error */
.form-input.success    /* Estado de éxito */
.form-input:disabled   /* Estado deshabilitado */

/* Validación */
.form-error            /* Mensaje de error */
.form-success          /* Mensaje de éxito */
.form-help             /* Texto de ayuda */
.form-required         /* Indicador requerido */
```

**Características**:
- ✅ Inputs completamente personalizados
- ✅ Sistema de validación visual
- ✅ Estados interactivos fluidos
- ✅ Accesibilidad y semántica
- ✅ Responsive design adaptable

---

### 🧭 **header.css**
**Descripción**: Header responsive con navegación principal.

**Estructura del header**:
```css
.main-header           /* Header principal */
.header-container      /* Contenedor interno */
.logo                  /* Área del logo */
.main-nav              /* Navegación principal */
.nav-list              /* Lista de navegación */
.nav-item              /* Item de navegación */
.nav-link              /* Enlaces de navegación */

/* Estados */
.nav-link.active       /* Link activo */
.nav-link:hover        /* Estado hover */

/* Responsive */
.mobile-menu-toggle    /* Botón menú móvil */
.nav-open              /* Navegación abierta */
.mobile-overlay        /* Overlay móvil */

/* User section */
.user-section          /* Sección usuario */
.auth-buttons          /* Botones login/register */
```

**Características**:
- ✅ Navegación responsive completa
- ✅ Menú hamburguesa para móviles
- ✅ Estados de navegación activos
- ✅ Integración con autenticación
- ✅ Sticky header opcional

---

### 🌟 **hero.css**
**Descripción**: Sección hero impactante para la página principal.

**Elementos del hero**:
```css
.hero                  /* Sección hero principal */
.hero-content          /* Contenido del hero */
.hero-title            /* Título principal */
.hero-subtitle         /* Subtítulo descriptivo */
.hero-cta              /* Call-to-action buttons */
.hero-image            /* Imagen de hero */
.hero-background       /* Fondo del hero */

/* Variantes */
.hero-full             /* Hero pantalla completa */
.hero-minimal          /* Hero minimalista */
.hero-with-video       /* Hero con video background */

/* Animaciones */
.hero-fade-in          /* Animación fade in */
.hero-slide-up         /* Animación slide up */
```

**Características**:
- ✅ Diseño impactante y atractivo
- ✅ Múltiples variantes de layout
- ✅ Animaciones de entrada suaves
- ✅ Soporte para video background
- ✅ CTA optimizado para conversión

---

### 📐 **layout.css**
**Descripción**: Sistema de layout y grid responsivo.

**Sistema de grid**:
```css
/* Grid system */
.grid                  /* Contenedor grid */
.grid-cols-1           /* 1 columna */
.grid-cols-2           /* 2 columnas */
.grid-cols-3           /* 3 columnas */
.grid-cols-4           /* 4 columnas */
.grid-cols-12          /* Grid 12 columnas */

/* Responsive grid */
.sm:grid-cols-2        /* 2 columnas en small */
.md:grid-cols-3        /* 3 columnas en medium */
.lg:grid-cols-4        /* 4 columnas en large */

/* Flexbox utilities */
.flex                  /* Display flex */
.flex-col              /* Dirección columna */
.flex-wrap             /* Wrap activado */
.justify-center        /* Justify center */
.items-center          /* Items center */
.space-between         /* Space between */

/* Spacing */
.gap-1 ... .gap-12     /* Gaps del grid */
.p-1 ... .p-12         /* Padding */
.m-1 ... .m-12         /* Margin */
```

**Características**:
- ✅ Grid system flexible 12 columnas
- ✅ Flexbox utilities completas
- ✅ Responsive breakpoints
- ✅ Sistema de espaciado consistente
- ✅ Utilities first approach

---

### 👤 **user-menu.css**
**Descripción**: Menú desplegable del usuario autenticado.

**Componentes del menú**:
```css
.user-menu             /* Contenedor del menú */
.user-avatar           /* Avatar clickeable */
.avatar-image          /* Imagen de avatar */
.avatar-placeholder    /* Placeholder con iniciales */
.user-status           /* Indicador de estado */

/* Dropdown */
.user-dropdown         /* Menú desplegable */
.user-info             /* Info del usuario */
.menu-items            /* Lista de opciones */
.menu-item             /* Item del menú */
.menu-divider          /* Separador del menú */
.menu-overlay          /* Overlay para cerrar */

/* Estados */
.menu-item:hover       /* Hover del item */
.menu-item.active      /* Item activo */
.logout-item           /* Botón logout especial */
```

**Características**:
- ✅ Avatar circular con foto o iniciales
- ✅ Dropdown animado y suave
- ✅ Indicador de estado en línea
- ✅ Cierre automático con overlay
- ✅ Opciones de navegación rápida

---

### 🛠️ **utilities.css**
**Descripción**: Clases utilitarias y helpers para uso general.

**Categorías de utilidades**:
```css
/* Display */
.block, .inline, .flex, .grid, .hidden

/* Position */
.relative, .absolute, .fixed, .sticky

/* Sizing */
.w-full, .h-full, .w-1/2, .h-screen

/* Colors */
.text-primary, .bg-primary, .border-primary

/* Typography */
.text-xs, .text-lg, .font-bold, .text-center

/* Spacing */
.p-4, .m-2, .px-6, .py-3

/* Borders */
.border, .rounded, .shadow

/* Interactions */
.cursor-pointer, .select-none, .pointer-events-none

/* Responsive prefixes */
.sm:*, .md:*, .lg:*, .xl:*
```

**Características**:
- ✅ +100 clases utilitarias
- ✅ Sistema responsive completo
- ✅ Convenciones Tailwind-inspired
- ✅ Optimización para performance
- ✅ Purge CSS compatible

---

## 🎨 Metodología y Convenciones

### **Nomenclatura BEM**:
```css
.component {}                    /* Block */
.component__element {}           /* Element */
.component--modifier {}          /* Modifier */
.component__element--modifier {} /* Element + Modifier */
```

### **Organización de Propiedades**:
```css
.component {
  /* Layout */
  display: flex;
  position: relative;
  
  /* Sizing */
  width: 100%;
  height: auto;
  
  /* Spacing */
  padding: var(--space-4);
  margin: 0;
  
  /* Typography */
  font-size: var(--font-base);
  font-weight: var(--font-medium);
  
  /* Visual */
  background-color: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  
  /* Interaction */
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}
```

### **Variables CSS**:
- Uso consistente de custom properties
- Valores derivados del sistema base
- Mantenimiento centralizado
- Theming dinámico posible

---

## 🚀 Performance y Optimización

### **Estrategias**:
- ✅ CSS crítico inline
- ✅ Componentes modulares cargables
- ✅ Purge CSS para eliminar código no usado
- ✅ Variables nativas (sin preprocesadores)
- ✅ Optimización de selectores

### **Bundle Sizes**:
- Componentes individuales: ~2-5KB cada uno
- Total del sistema: ~45KB comprimido
- Critical CSS: ~12KB inline
- Lazy loaded: Componentes no críticos

---

*Este sistema de componentes proporciona los bloques de construcción fundamentales para crear interfaces consistentes, escalables y mantenibles en SweetMatch.*
