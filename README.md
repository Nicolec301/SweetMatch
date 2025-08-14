# SweetMatch 💖 - App de Citas Completa

SweetMatch es una aplicación moderna de citas desarrollada con React, Node.js y PostgreSQL. Incluye autenticación con Google OAuth, sistema completo de perfiles con upload de imágenes, matches, chat en tiempo real y diseño responsive.

## ✨ Características Principales

- � **Autenticación completa**: Google OAuth + JWT
- 👤 **Perfiles ricos**: Bio, fotos múltiples, intereses
- 💘 **Sistema de matches**: Like/Dislike inteligente  
- 💬 **Chat tiempo real**: Socket.IO + mensajería
- 📱 **Responsive**: Mobile-first design
- 🖼️ **Upload imágenes**: Multer + almacenamiento optimizado
- 🎨 **UI moderna**: Gradientes, animaciones, badges
- 🔒 **Seguridad**: JWT, validaciones, sanitización

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.2** - Framework UI con Hooks
- **React Router** - Navegación SPA
- **Socket.IO Client** - Real-time communication
- **CSS Modules** - Estilos modulares
- **Google OAuth** - Autenticación social

### Backend  
- **Node.js + Express** - Servidor web
- **PostgreSQL** - Base de datos relacional
- **Socket.IO** - WebSocket real-time
- **JWT** - Autenticación stateless
- **Multer** - Upload de archivos
- **bcryptjs** - Hash passwords

## 🚀 Instalación Rápida

### Prerrequisitos
- Node.js 16+ 
- PostgreSQL 12+
- npm/yarn

### Setup Completo
1. **Clonar repositorio**
   ```bash
   git clone <tu-repositorio>
   cd SweetMatch
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear archivo `.env`:
   ```env
   # Base de datos
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sweetmatch
   DB_USER=postgres
   DB_PASSWORD=tu_password
   
   # JWT
   JWT_SECRET=tu_jwt_secret_super_seguro
   
   # Google OAuth  
   GOOGLE_CLIENT_ID=tu_google_client_id
   GOOGLE_CLIENT_SECRET=tu_google_client_secret
   
   # Servidor
   PORT=3001
   NODE_ENV=development
   
   # Frontend
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Configurar base de datos**
   ```bash
   # Crear base de datos
   createdb sweetmatch
   
   # Ejecutar migraciones
   psql -d sweetmatch -f src/backend/postgres/sweetmatch_database_complete.sql
   ```

5. **Iniciar aplicación**
   ```bash
   # Desarrollo completo (Frontend + Backend)
   npm run dev
   
   # Solo frontend
   npm start
   
   # Solo backend
   npm run server
   ```

## 📱 Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- **Google OAuth**: Login automático con registro
- **JWT Tokens**: Autenticación segura sin sesiones
- **Middleware**: Protección de rutas sensibles

### 👤 Gestión de Perfiles
- **Perfil Completo**: Bio, edad, ubicación, intereses
- **Upload Múltiple**: Sistema Multer para fotos
- **Edición en Línea**: Actualización dinámica de datos
- **Validaciones**: Frontend y backend robustas

### 💘 Sistema de Matches
- **Algoritmo Inteligente**: Basado en preferencias
- **Like/Dislike**: Interacción intuitiva
- **Matches Mutuos**: Detección automática
- **Historial**: Tracking de interacciones

### 💬 Chat en Tiempo Real
- **Socket.IO**: Mensajería instantánea
- **Lista Conversaciones**: UI organizada
- **Estados**: Online/offline, writing
- **Persistencia**: Mensajes almacenados

### 🎨 UI/UX Moderna
- **Responsive Design**: Mobile-first approach
- **CSS Variables**: Sistema de colores consistente
- **Animaciones**: Micro-interacciones suaves
- **Gradientes**: Estética visual atractiva

## 📁 Estructura del Proyecto

```
SweetMatch/
├── 📄 package.json              # Dependencias del proyecto
├── 📄 README.md                 # Documentación principal
├── 📂 public/                   # Assets estáticos
│   └── images/                  # Fotos demo usuarios
├── 📂 src/
│   ├── 📄 App.js               # Componente raíz React
│   ├── 📂 backend/             # Servidor Node.js
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── models/             # Modelos de datos
│   │   ├── routes/             # Rutas API
│   │   ├── services/           # Servicios centralizados
│   │   ├── middleware/         # Middleware personalizado
│   │   └── postgres/           # Scripts de BD
│   └── 📂 frontend/            # Aplicación React
│       ├── pages/              # Componentes principales
│       ├── services/           # Servicios frontend
│       └── styles/             # CSS modular
└── 📂 logs/                    # Logs de aplicación
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api  
- **Health Check**: http://localhost:3001/api/health
- **Socket.IO**: http://localhost:3001

## � Base de Datos PostgreSQL

### Esquema Principal
```sql
users              # Perfiles de usuarios
user_photos         # Sistema de fotos múltiples  
interests           # Lista de intereses
user_interests      # Relación usuario-intereses
matches            # Sistema de likes/matches
conversations      # Conversaciones de chat
messages           # Mensajes en tiempo real
```

### Características
- **Relaciones**: Foreign keys bien definidas
- **Índices**: Optimizados para queries frecuentes
- **Constraints**: Validaciones a nivel BD
- **Triggers**: Actualizaciones automáticas

## 🚦 Estado del Proyecto

### ✅ Funcionalidades Completadas
- ✅ **Autenticación JWT + Google OAuth**
- ✅ **Sistema completo de perfiles**
- ✅ **Upload múltiple de imágenes con Multer**
- ✅ **Chat en tiempo real con Socket.IO**
- ✅ **Sistema de matches like/dislike**
- ✅ **Diseño responsive moderno**
- ✅ **Gestión de sesiones avanzada**
- ✅ **Validaciones frontend/backend**
- ✅ **CSS con gradientes y animaciones**
- ✅ **Eliminación de cuenta segura**

### 🔄 Mejoras Continuas
- 🔲 **Algoritmo ML para recommendations**
- 🔲 **Push notifications**
- 🔲 **Tests unitarios e integración**
- 🔲 **Deploy en producción**
- 🔲 **Analytics y métricas**

## �️ Scripts NPM Disponibles

```bash
# Desarrollo completo
npm run dev           # Frontend + Backend simultáneo

# Componentes individuales  
npm start            # Solo React frontend
npm run server       # Solo Node.js backend

# Base de datos
npm run init-db      # Inicializar BD con datos demo

# Utilidades
npm test             # Tests (cuando estén implementados)
npm run build        # Build de producción
```

## 📁 Estructura del Proyecto

```
SweetMatch/
├── public/                     # Archivos públicos
├── src/
│   ├── backend/               # Backend Express
│   │   ├── config/           # Configuraciones
│   │   ├── controllers/      # Controladores
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Rutas de API
│   │   ├── services/        # Servicios
│   │   └── postgres/        # Scripts de base de datos
│   ├── frontend/            # Frontend React
│   │   ├── pages/          # Páginas y componentes
│   │   ├── images/         # Imágenes
│   │   └── styles/         # Estilos CSS
│   └── services/           # Servicios compartidos
├── init-db.js             # Script de inicialización de BD
└── package.json           # Dependencias y scripts
```

## 🐛 Solución de Problemas

### Error de conexión a base de datos
1. Verifica que PostgreSQL esté ejecutándose
2. Confirma las credenciales en el archivo `.env`
3. Asegúrate de que la base de datos `sweetmatch` existe

### Error de puertos ocupados
- Frontend: Cambia el puerto en el archivo `.env` de Create React App
- Backend: Cambia la variable `PORT` en `.env`

### Error de módulos no encontrados
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 API Endpoints

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear nuevo usuario
- `POST /api/auth/login` - Login tradicional
- `POST /api/auth/google` - Login con Google

### Salud
- `GET /api/health` - Health check del servidor

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.
=======
## 🔧 Desarrollo y Debugging

### Logs del Sistema
Los logs se almacenan en:
- `logs/app.log` - Logs generales de aplicación
- `logs/debug.log` - Información de debugging
- Consola del navegador - Errores frontend

### Testing Local
```bash
# Verificar conexión BD
psql -U postgres -d sweetmatch -c "SELECT COUNT(*) FROM users;"

# Test backend API
curl http://localhost:3001/api/health

# Verificar uploads
ls -la public/uploads/users/
```

### Debugging Common Issues
1. **Error de conexión BD**: Verificar PostgreSQL ejecutándose
2. **CORS errors**: Revisar configuración en `config/cors.js`
3. **Upload errors**: Verificar permisos carpeta `public/uploads/`
4. **Socket.IO issues**: Verificar puerto 3001 disponible

## 🚀 Despliegue en Producción

### Preparación
```bash
# Build de producción
npm run build

# Variables de entorno production
NODE_ENV=production
PORT=3001
DB_URL=postgresql://user:pass@host:port/database
```

### Platforms Soportadas
- **Heroku**: Configuración incluida
- **AWS**: Compatible con EC2, ECS
- **DigitalOcean**: Droplets con Node.js
- **Vercel/Netlify**: Frontend estático

## 🤝 Contribución

### Guía para Contributors
1. Fork del repositorio
2. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

### Estándares de Código
- **ESLint**: Configuración estándar
- **Prettier**: Formateo automático
- **Conventional Commits**: Formato de mensajes
- **Component naming**: PascalCase para React components

## 📞 Soporte y Contacto

- **Issues**: Reportar bugs en GitHub Issues
- **Discussions**: Preguntas en GitHub Discussions
- **Documentation**: Wiki del proyecto para detalles técnicos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**SweetMatch** - Conectando corazones con tecnología moderna 💖

*Desarrollado con amor usando React, Node.js y PostgreSQL*

Documentación de Create React App: Ver documentación

Documentación de React: Aprender React

Temas Específicos

Las siguientes secciones de la documentación pueden ser de gran utilidad:

División de Código (Code Splitting)

Análisis del Tamaño del Paquete (Bundle Size)

Crear una Aplicación Web Progresiva (PWA)

Configuración Avanzada

Despliegue (Deployment)

Solución de problemas: npm run build falla al minificar
>>>>>>> d2d884efc6f49e7fd85be9bf5f1746a4aa6f670c
