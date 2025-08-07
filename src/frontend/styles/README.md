# Estructura de Estilos CSS - SweetMatch

Este documento describe la nueva arquitectura modular de CSS para el proyecto SweetMatch.

## 📁 Estructura de Directorios

```
src/frontend/styles/
├── main.css                     # Archivo principal que importa todos los módulos
├── base/                        # Configuraciones base
│   └── variables.css           # Variables CSS globales
├── components/                  # Componentes reutilizables
│   ├── buttons.css            # Estilos de botones
│   ├── cards.css              # Estilos de tarjetas
│   ├── forms.css              # Estilos de formularios
│   ├── header.css             # Estilos del header
│   ├── footer.css             # Estilos del footer
│   ├── hero.css               # Estilos de secciones hero
│   ├── layout.css             # Estilos de layout general
│   ├── user-menu.css          # Estilos del menú de usuario
│   └── utilities.css          # Utilidades generales
└── modules/                   # Módulos específicos por funcionalidad
    ├── home/                  # Módulos específicos de la página Home
    │   ├── index.css          # Índice del módulo Home
    │   ├── steps.css          # Sección "Cómo funciona"
    │   └── utilities.css      # Utilidades específicas de Home
    ├── features/              # Módulo de características
    │   ├── index.css          # Índice del módulo Features
    │   └── features.css       # Estilos de la sección características
    ├── matches/               # Módulo de matches/perfiles
    │   ├── index.css          # Índice del módulo Matches
    │   └── matches.css        # Estilos de perfiles y matches
    ├── testimonials/          # Módulo de testimoniales
    │   ├── index.css          # Índice del módulo Testimonials
    │   └── testimonials.css   # Estilos de experiencias y testimonios
    ├── login/                 # Módulo de login
    │   └── formulario.css     # Estilos del formulario de login
    └── crearCuenta/          # Módulo de registro
        └── formularioCrear.css # Estilos del formulario de registro
```

## 🎯 Principios de la Arquitectura

### 1. **Separación por Responsabilidad**
- **Base**: Variables, reset, configuraciones globales
- **Components**: Elementos reutilizables en toda la aplicación  
- **Modules**: Funcionalidades específicas de páginas o secciones

### 2. **Nomenclatura BEM-like**
```css
/* Bloque */
.match-card { }

/* Elemento */
.match-card__image { }
.match-card__content { }

/* Modificador */
.match-card--featured { }
.match-card--online { }
```

### 3. **Variables CSS**
Todas las variables están centralizadas en `base/variables.css`:
```css
:root {
  --primary: #ff4778;
  --secondary: #ff6b9d;
  --text-dark: #2c3e50;
  --bg-light: #f8f9fa;
  /* ... más variables */
}
```

### 4. **Responsive Design**
Cada módulo incluye sus propias media queries:
```css
/* Móvil primero */
.feature-container {
  grid-template-columns: 1fr;
}

/* Tablet y desktop */
@media (min-width: 768px) {
  .feature-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 🚀 Cómo Usar

### Importación Principal
El archivo `main.css` ya importa todos los módulos necesarios:

```javascript
// En App.js
import './frontend/styles/main.css';
```

### Agregar Nuevos Módulos

1. **Crear directorio del módulo**:
   ```
   src/frontend/styles/modules/nuevoModulo/
   ```

2. **Crear archivos CSS**:
   ```
   nuevoModulo/
   ├── index.css      # Índice del módulo
   ├── estilos.css    # Estilos principales
   └── components.css # Componentes específicos
   ```

3. **Importar en main.css**:
   ```css
   @import './modules/nuevoModulo/index.css';
   ```

### Agregar Nuevos Componentes

1. **Crear archivo en components/**:
   ```
   src/frontend/styles/components/nuevoComponente.css
   ```

2. **Importar en main.css**:
   ```css
   @import './components/nuevoComponente.css';
   ```

## 📦 Módulos Disponibles

### 🏠 **Home Module**
- **steps.css**: Estilos para la sección "Cómo funciona"
- **utilities.css**: Utilidades específicas de la página home

### ⭐ **Features Module**  
- **features.css**: Estilos para la sección "Por qué elegir SweetMatch"

### 💕 **Matches Module**
- **matches.css**: Estilos para perfiles destacados y tarjetas de usuario

### 💬 **Testimonials Module**
- **testimonials.css**: Estilos para experiencias y testimonios de usuarios

### 🔐 **Auth Modules**
- **login/formulario.css**: Estilos del formulario de inicio de sesión
- **crearCuenta/formularioCrear.css**: Estilos del formulario de registro

## 🎨 Clases Utilitarias

### Espaciado
```css
.spacing-small    /* margin: 1rem 0 */
.spacing-medium   /* margin: 2rem 0 */
.spacing-large    /* margin: 3rem 0 */
.spacing-xl       /* margin: 4rem 0 */
```

### Efectos Visuales
```css
.glassmorphism    /* Efecto cristal */
.gradient-bg      /* Fondo degradado */
.shadow-soft      /* Sombra suave */
.shadow-strong    /* Sombra pronunciada */
```

### Animaciones
```css
.fade-in          /* Animación de aparición */
.slide-up         /* Deslizar hacia arriba */
.bounce-in        /* Animación rebote */
.hover-lift       /* Efecto hover elevación */
```

### Layout
```css
.flex-center      /* Centrar con flexbox */
.flex-between     /* Distribuir con flexbox */
.grid-2           /* Grid de 2 columnas */
.grid-3           /* Grid de 3 columnas */
.text-center      /* Texto centrado */
```

## 🔧 Mantenimiento

### Agregar Variables
Editar `base/variables.css`:
```css
:root {
  --nueva-variable: valor;
}
```

### Optimización
- Usar variables CSS para valores repetidos
- Agrupar media queries al final de cada archivo
- Mantener especificidad baja
- Comentar código complejo

### Testing
Probar en diferentes dispositivos:
- Móvil: 320px - 767px  
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🚨 Reglas de Desarrollo

1. **No usar `!important`** a menos que sea absolutamente necesario
2. **Usar variables CSS** para valores recurrentes  
3. **Mantener especificidad baja** (máximo 2-3 niveles)
4. **Incluir comentarios** en código complejo
5. **Probar responsive design** en todos los breakpoints
6. **Validar CSS** antes de hacer commit

---

*Documentación actualizada: 6 de agosto de 2025*
