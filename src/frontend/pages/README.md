# 📄 Pages - Componentes y Páginas React

Esta carpeta contiene todos los componentes React, páginas principales y la estructura de la interfaz de usuario de SweetMatch.

## 📁 Estructura de Pages

```
pages/
├── 📄 Home.jsx                    # Página principal de SweetMatch
├── 📄 Footer.js                   # Componente Footer global
├── 📄 Header.js                   # Componente Header global
└── 📂 components/                 # Componentes específicos de páginas
    ├── 📂 Busqueda/              # Módulo de búsqueda de matches
    ├── 📂 Chat/                  # Sistema de mensajería
    ├── 📂 CompleteProfile/       # Completar perfil de usuario
    ├── 📂 EnLinea/               # Usuarios conectados
    ├── 📂 Login/                 # Formulario de inicio de sesión
    ├── 📂 Perfil/                # Perfil de usuario
    ├── 📂 Register/              # Formulario de registro
    └── 📂 UserMenu/              # Menú desplegable del usuario
```

## 🏠 Página Principal

### **Home.jsx**
**Descripción**: Landing page principal de SweetMatch
**Características**:
- Hero section atractivo
- Secciones de funcionalidades
- Call-to-action para registro
- Testimoniales de usuarios
- Información sobre la aplicación

## 🧭 Componentes Globales

### **Header.js**
**Funcionalidades**:
- Navegación principal
- Logo de SweetMatch
- Menú de usuario (cuando está logueado)
- Botones de login/registro
- Navegación responsive para móviles

### **Footer.js**
**Contenido**:
- Links institucionales
- Redes sociales
- Información de contacto
- Copyright y políticas

## 📂 Módulos de Componentes

### **🔍 Busqueda/**
**Archivo**: `Busqueda.jsx`, `Busqueda.css`
**Funcionalidad**:
- Búsqueda de usuarios compatibles
- Filtros por edad, ubicación, intereses
- Tarjetas de perfiles con fotos
- Sistema de "like" y "pass"
- Paginación de resultados

### **💬 Chat/**
**Archivo**: `Chat.jsx`, `Chat.css`
**Funcionalidad**:
- Lista de conversaciones activas
- Interfaz de mensajería en tiempo real
- Envío de mensajes y archivos
- Indicadores de estado (enviado/visto)
- Notificaciones de mensajes nuevos

### **📝 CompleteProfile/**
**Archivo**: `CompleteProfile.jsx`, `CompleteProfile.css`
**Funcionalidad**:
- Formulario para completar perfil después del registro
- Subida de fotos de perfil
- Selección de intereses
- Información personal y preferencias
- Validación de campos requeridos

### **🟢 EnLinea/**
**Archivo**: `EnLinea.jsx`, `EnLinea.css`
**Funcionalidad**:
- Lista de usuarios conectados
- Estado en tiempo real
- Posibilidad de iniciar conversación
- Filtros de usuarios activos

### **🔐 Login/**
**Archivo**: `Login.jsx`
**Funcionalidad**:
- Formulario de inicio de sesión tradicional
- Integración con Google OAuth
- Validación de credenciales
- Redirección después del login
- Recuperación de contraseña

### **👤 Perfil/**
**Archivo**: `Perfil.jsx`, `Perfil.css`
**Funcionalidad**:
- Visualización del perfil del usuario
- Edición de información personal
- Gestión de fotos de perfil
- Configuración de preferencias
- Historial de matches

### **📋 Register/**
**Archivo**: `Register.jsx`, `Register.css`
**Funcionalidad**:
- Formulario de registro de nuevos usuarios
- Validación de datos en tiempo real
- Integración con Google OAuth
- Términos y condiciones
- Redirección a completar perfil

### **⚙️ UserMenu/**
**Archivo**: `UserMenu.jsx`, `UserMenu.css`
**Funcionalidad**:
- Menú desplegable del usuario logueado
- Avatar con foto de perfil o iniciales
- Acceso rápido a perfil y configuraciones
- Opción de cerrar sesión
- Indicador de estado en línea

## 🔧 Tecnologías y Patrones

### **React Hooks Utilizados**
- `useState`: Gestión de estado local
- `useEffect`: Efectos secundarios y ciclo de vida
- `useLocation`: Información de ruta actual
- `useNavigate`: Navegación programática

### **Patrones de Diseño**
- **Componentes funcionales**: Todos los componentes usan hooks
- **Props drilling**: Paso de datos entre componentes
- **State management**: SessionManager para estado global
- **CSS Modules**: Estilos encapsulados por componente

### **Integración con Backend**
- **ApiService**: Comunicación con el backend
- **SessionManager**: Gestión de sesiones de usuario
- **Socket.io**: Comunicación en tiempo real para chat
- **Google OAuth**: Autenticación externa

## 📱 Responsive Design

Todos los componentes están diseñados para ser responsivos:
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación a diferentes tamaños de pantalla
- **Touch Friendly**: Elementos táctiles optimizados
- **Performance**: Carga optimizada en dispositivos móviles

## 🗂️ Estructura de Archivos por Componente

Cada módulo sigue la siguiente estructura:
```
ComponentName/
├── ComponentName.jsx          # Lógica del componente React
├── ComponentName.css          # Estilos específicos del componente
└── (opcional) subcomponents/  # Componentes hijos si es necesario
```

## 🔗 Navegación y Rutas

Las páginas están configuradas en `App.js` con React Router:
```javascript
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/complete-profile" element={<CompleteProfile />} />
<Route path="/busqueda" element={<Busqueda />} />
<Route path="/en-linea" element={<EnLinea />} />
<Route path="/chat" element={<Chat />} />
<Route path="/perfil" element={<Perfil />} />
```

## 🎯 Estados de Autenticación

Los componentes manejan diferentes estados:
- **No autenticado**: Mostrar login/registro
- **Autenticado**: Mostrar funcionalidades completas
- **Perfil incompleto**: Redireccionar a completar perfil
- **Loading**: Estados de carga durante peticiones

---

*Cada componente tiene su propia documentación detallada en sus respectivas carpetas.*
