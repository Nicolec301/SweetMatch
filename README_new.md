# SweetMatch - Aplicación de Citas

Una aplicación moderna de citas desarrollada con React y PostgreSQL.

## 🚀 Configuración del Proyecto

### Prerrequisitos

- Node.js (versión 16 o superior)
- PostgreSQL (versión 12 o superior)
- npm o yarn

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd SweetMatch
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   - Copia el archivo `.env.example` a `.env`
   - Modifica las variables según tu configuración:
   ```env
   # Configuración de la base de datos PostgreSQL
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sweetmatch
   DB_USER=postgres
   DB_PASSWORD=tu_password_aqui
   
   # Configuración del servidor
   PORT=3001
   NODE_ENV=development
   
   # URL del API para el frontend
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. **Configura PostgreSQL**
   - Asegúrate de tener PostgreSQL instalado y ejecutándose
   - Crea un usuario y contraseña si no los tienes
   - El script creará automáticamente la base de datos `sweetmatch`

5. **Inicializa la base de datos**
   ```bash
   npm run init-db
   ```

### Uso

#### Desarrollo (Frontend y Backend juntos)
```bash
npm run dev
```

#### Solo Frontend
```bash
npm start
```

#### Solo Backend
```bash
npm run server
```

### URLs de la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 🗄️ Base de Datos

La aplicación utiliza PostgreSQL con las siguientes tablas principales:

- `users` - Información de usuarios
- `user_photos` - Fotos de perfil
- `interest` - Lista de intereses disponibles
- `user_interest` - Relación usuario-intereses
- `matches` - Matches entre usuarios
- `conversations` - Conversaciones
- `messages` - Mensajes

### Datos de prueba

El script de inicialización incluye usuarios y datos de ejemplo para testing.

## 🔧 Funcionalidades

### Implementadas
- ✅ Registro de usuarios con formulario multipaso
- ✅ Sistema de login tradicional
- ✅ Conexión con base de datos PostgreSQL
- ✅ Gestión de intereses de usuario
- ✅ Estructura de base de datos completa

### Pendientes
- 🔲 Login con Google OAuth
- 🔲 Sistema de matches
- 🔲 Chat en tiempo real
- 🔲 Subida de fotos
- 🔲 Algoritmo de recomendaciones

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
