# 🎨 SweetMatch Frontend 💖

Frontend moderno para SweetMatch desarrollado en React 18 con arquitectura de componentes, sistema completo de gestión de perfiles, chat en tiempo real, y diseño responsive con CSS modular.

## 🛠️ Tecnologías Principales

- **React 18.2.0** - Framework principal con Hooks
- **React Router DOM** - Navegación SPA
- **Socket.IO Client** - Chat tiempo real
- **Google OAuth** - Autenticación social
- **Multer Integration** - Upload de imágenes
- **CSS Modules** - Estilos modulares
- **SessionManager** - Gestión de estado

## 📁 Estructura del Proyecto

```
src/frontend/
├── 📂 images/              # Assets visuales y multimedia
├── 📂 pages/               # Componentes React y páginas
│   ├── Home.jsx           # Página principal
│   ├── components/        # Componentes reutilizables
│   │   ├── Chat.jsx       # Sistema de chat
│   │   ├── Perfil.jsx     # Gestión perfil completo
│   │   ├── Register.jsx   # Registro simplificado
│   │   └── CompleteProfile.jsx # Completar perfil
├── 📂 services/           # Servicios del frontend
│   ├── googleAuth.js      # Autenticación Google OAuth
│   └── ProfileService.js  # Gestión de perfiles
└── 📂 styles/             # Sistema CSS modular
    ├── config.json        # Variables de diseño
    └── [componente].css   # Estilos por componente
```

## ⭐ Funcionalidades Implementadas

### 🔐 Autenticación Completa
- ✅ Login con Google OAuth (auto-registro)
- ✅ Registro tradicional (sin foto)
- ✅ JWT token management
- ✅ Sesiones persistentes

### 👤 Gestión de Perfiles
- ✅ Perfil completo con bio, intereses, preferencias
- ✅ Upload múltiple de fotos con Multer
- ✅ Edición en línea de información
- ✅ Eliminación de cuenta con confirmación
- ✅ Badge verificado animado

### � Sistema de Chat
- ✅ Chat tiempo real con Socket.IO
- ✅ Lista de conversaciones
- ✅ Mensajes instantáneos
- ✅ Estados de conexión
- ✅ Interfaz responsive

### 🎨 Diseño y UX
- ✅ Diseño responsive mobile-first
- ✅ Gradientes modernos y animaciones
- ✅ Variables CSS centralizadas
- ✅ Componentes reutilizables
- ✅ Feedback visual consistente

## 🔗 Enlaces a Documentación Detallada

- [📸 **Images**](./images/README.md) - Recursos gráficos y multimedia
- [📄 **Pages**](./pages/README.md) - Páginas y componentes React
- [⚙️ **Services**](./services/README.md) - Servicios del frontend
- [🎨 **Styles**](./styles/README.md) - Sistema de estilos CSS

## 🚦 Cómo Empezar

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno** (`.env`):
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=tu_google_client_id
   REACT_APP_API_URL=http://localhost:3001/api
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm start
   ```

## 📱 Páginas Disponibles

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | Home | Página principal con héroe y funcionalidades |
| `/login` | Login | Formulario de inicio de sesión |
| `/register` | Register | Formulario de registro |
| `/complete-profile` | CompleteProfile | Completar perfil después del registro |
| `/busqueda` | Busqueda | Búsqueda de matches |
| `/en-linea` | EnLinea | Usuarios en línea |
| `/chat` | Chat | Sistema de mensajería |
| `/perfil` | Perfil | Perfil del usuario |

## 🎨 Sistema de Estilos

El frontend utiliza un sistema CSS modular organizado en:
- **Variables CSS**: Colores, tipografías y espaciados
- **Componentes**: Estilos reutilizables (botones, cards, forms)
- **Módulos**: Estilos específicos de cada página

---

*Para más detalles sobre cada carpeta, consulta los READMEs específicos de cada sección.*
