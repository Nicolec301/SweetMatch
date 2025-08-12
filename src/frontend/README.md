# 🎨 Frontend - SweetMatch

Frontend de la aplicación de citas SweetMatch desarrollado en React con arquitectura modular y sistema de estilos organizados.

## 📁 Estructura del Frontend

```
frontend/
├── 📂 images/              # Recursos gráficos y multimedia
├── 📂 pages/               # Páginas y componentes React
├── 📂 services/            # Servicios del frontend
└── 📂 styles/              # Sistema de estilos CSS modular
```

## 🚀 Tecnologías Utilizadas

- **React 18.2.0**: Framework principal
- **React Router DOM**: Navegación y ruteo
- **Google OAuth**: Autenticación con Google
- **CSS Modules**: Estilos modulares y escalables
- **JavaScript ES6+**: Sintaxis moderna

## 📋 Características Principales

### ✨ **Funcionalidades**
- ✅ Autenticación con Google OAuth
- ✅ Registro y login tradicional
- ✅ Perfil de usuario completo
- ✅ Sistema de matches y busqueda
- ✅ Chat en tiempo real
- ✅ Responsive design
- ✅ Interfaz moderna y atractiva

### 🎯 **Arquitectura**
- **Componentes modulares**: Cada componente con su propio CSS
- **Gestión de estado**: SessionManager singleton
- **Servicios centralizados**: API y autenticación
- **Diseño responsive**: Adaptable a todos los dispositivos

## 📂 Descripción de Carpetas

| Carpeta | Descripción |
|---------|-------------|
| **images/** | Iconos, logos, fotos de perfil y recursos multimedia |
| **pages/** | Componentes React de páginas y funcionalidades |
| **services/** | Servicios de autenticación y comunicación |
| **styles/** | Sistema CSS modular con variables y componentes |

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
