# 🎨 Sistema de Estilos - SweetMatch

Sistema de estilos CSS modular y escalable para SweetMatch, organizado con metodología de componentes y arquitectura mantenible.

## 📁 Estructura del Sistema de Estilos

```
styles/
├── 📄 config.json              # Configuración del sistema de estilos
├── 📄 main.css                 # Archivo principal que importa todos los estilos
├── 📄 styles.css               # Estilos globales y utilidades generales
├── 📂 base/                    # Variables y configuraciones base
│   └── variables.css           # Variables CSS (colores, tipografías, espaciados)
├── 📂 components/              # Estilos de componentes reutilizables
│   ├── buttons.css             # Estilos de botones
│   ├── cards.css               # Tarjetas y contenedores
│   ├── components.css          # Componentes generales
│   ├── footer.css              # Footer del sitio
│   ├── forms.css               # Formularios y inputs
│   ├── header.css              # Header y navegación
│   ├── hero.css                # Sección hero/banner
│   ├── layout.css              # Layout y estructura
│   ├── user-menu.css           # Menú de usuario
│   └── utilities.css           # Clases utilitarias
└── 📂 modules/                 # Estilos específicos de módulos/páginas
    ├── 📂 crearCuenta/         # Módulo de registro
    ├── 📂 features/            # Módulo de características
    ├── 📂 home/                # Módulo de página principal
    ├── 📂 login/               # Módulo de login
    ├── 📂 matches/             # Módulo de matches
    └── 📂 testimonials/        # Módulo de testimoniales
```

## ⚙️ Configuración del Sistema

### **config.json**
Archivo de configuración que define la estructura y organización del sistema CSS:

```json
{
  "name": "SweetMatch CSS Modules Configuration",
  "version": "1.0.0",
  "description": "Configuración de la arquitectura CSS modular para SweetMatch",
  "structure": {
    "main": "main.css",
    "base": { "variables": "base/variables.css" },
    "components": [...],
    "modules": {...}
  }
}
```

## 📄 Archivos Principales

### **main.css**
**Descripción**: Archivo principal que importa todo el sistema de estilos
**Función**: 
- Imports organizados por categorías
- Orden de carga optimizado
- Punto de entrada único para toda la aplicación

**Estructura de imports**:
```css
/* Base - Variables y configuraciones fundamentales */
@import './base/variables.css';

/* Componentes reutilizables */
@import './components/buttons.css';
@import './components/hero.css';
/* ... más componentes */

/* Módulos específicos de páginas */
@import './modules/home/steps.css';
/* ... más módulos */
```

### **styles.css**
**Descripción**: Estilos globales y utilidades generales
**Contenido**:
- Reset CSS básico
- Clases utilitarias globales
- Estilos base del body y html
- Configuraciones generales de la aplicación

## 🎨 Metodología CSS

### **Arquitectura ITCSS (Inverted Triangle CSS)**
1. **Settings** → Variables y configuraciones
2. **Tools** → Mixins y funciones (futuro)
3. **Generic** → Reset y normalize
4. **Elements** → Estilos base de elementos HTML
5. **Objects** → Patrones de diseño reutilizables
6. **Components** → Componentes específicos de UI
7. **Utilities** → Clases utilitarias y helpers

### **Nomenclatura BEM**
```css
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

**Ejemplo**:
```css
.user-menu {}                    /* Block */
.user-menu__avatar {}            /* Element */
.user-menu--open {}              /* Modifier */
.user-menu__avatar--active {}    /* Element + Modifier */
```

## 🎯 Categorías de Estilos

### **📂 Base/**
**Variables fundamentales del sistema**:
- Colores principales y secundarios
- Tipografías y tamaños de fuente
- Espaciados y márgenes
- Breakpoints para responsive design
- Transiciones y animaciones base

### **📂 Components/**
**Componentes reutilizables**:

| Archivo | Descripción |
|---------|-------------|
| `buttons.css` | Botones primarios, secundarios, iconos |
| `cards.css` | Tarjetas de contenido, perfiles |
| `forms.css` | Inputs, formularios, validaciones |
| `header.css` | Navegación, header responsive |
| `hero.css` | Sección hero, banners llamativos |
| `layout.css` | Grid, contenedores, estructuras |
| `user-menu.css` | Menú desplegable del usuario |
| `utilities.css` | Clases helper y utilitarias |

### **📂 Modules/**
**Estilos específicos por página**:

#### **🏠 home/**
- `index.css` - Estilos principales del home
- `steps.css` - Sección de "Cómo funciona"
- `utilities.css` - Utilidades específicas del home
- `welcome.css` - Sección de bienvenida

#### **✨ features/**
- `index.css` - Estructura del módulo
- `features.css` - Características y funcionalidades

#### **💕 matches/**
- `index.css` - Layout de matches
- `matches.css` - Tarjetas y animaciones de matches

#### **💬 testimonials/**
- `index.css` - Estructura de testimoniales
- `testimonials.css` - Estilos de reseñas y testimonios

#### **🔐 Auth Modules**
- `login/formulario.css` - Formulario de login
- `crearCuenta/formularioCrear.css` - Formulario de registro

## 🎨 Sistema de Colores

### **Paleta Principal** (definida en variables.css):
```css
:root {
  --primary-color: #ff6b9d;      /* Rosa principal */
  --secondary-color: #ff8a9b;    /* Rosa claro */
  --accent-color: #4CAF50;       /* Verde para éxito */
  --text-primary: #333333;       /* Texto principal */
  --text-secondary: #666666;     /* Texto secundario */
  --background: #ffffff;         /* Fondo principal */
  --surface: #f8f9fa;           /* Superficie */
}
```

### **Estados**:
```css
--success: #4CAF50;
--warning: #FFA726;
--error: #F44336;
--info: #2196F3;
```

## 📱 Responsive Design

### **Breakpoints**:
```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--large: 1440px;
```

### **Estrategia Mobile-First**:
```css
/* Mobile por defecto */
.component {}

/* Tablet y superior */
@media (min-width: 768px) {
  .component {}
}

/* Desktop y superior */
@media (min-width: 1024px) {
  .component {}
}
```

## 🧩 Componentes Destacados

### **Sistema de Botones**:
- `.btn-primary` - Botón principal (rosa)
- `.btn-secondary` - Botón secundario (outline)
- `.btn-success` - Botón de éxito (verde)
- `.btn-icon` - Botones solo con icono
- `.btn-floating` - Botones flotantes

### **Sistema de Cards**:
- `.card` - Tarjeta base
- `.profile-card` - Tarjetas de perfil
- `.match-card` - Tarjetas de matches con animaciones
- `.testimonial-card` - Tarjetas de testimonios

### **Sistema de Forms**:
- `.form-group` - Grupos de campos
- `.form-input` - Inputs estilizados
- `.form-error` - Estados de error
- `.form-success` - Estados de éxito

## 🚀 Optimizaciones

### **Performance**:
- CSS crítico inlined
- Imports organizados por prioridad
- Clases utilitarias para reducir CSS duplicado
- Variables CSS para theming dinámico

### **Mantenibilidad**:
- Un archivo por componente
- Nomenclatura consistente
- Documentación en comentarios
- Organización lógica de propiedades

## 📋 Guías de Uso

### **Para añadir nuevos estilos**:
1. **Componente nuevo** → Crear archivo en `/components/`
2. **Página específica** → Crear en `/modules/pagina/`
3. **Variable nueva** → Añadir a `/base/variables.css`
4. **Import** → Agregar al `main.css`

### **Convenciones**:
- Usar variables CSS para valores reutilizables
- Seguir metodología BEM para nomenclatura
- Mobile-first para responsive
- Comentar secciones complejas
- Un archivo por componente lógico

---

*Este sistema de estilos proporciona una base sólida y escalable para el crecimiento continuo de SweetMatch, manteniendo la consistencia visual y la facilidad de mantenimiento.*
