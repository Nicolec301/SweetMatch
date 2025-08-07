<<<<<<< HEAD
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
   PORT=3002
   NODE_ENV=development
   
   # URL del API para el frontend
   REACT_APP_API_URL=http://localhost:3002/api
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
- **Backend API**: http://localhost:3002/api
- **Health Check**: http://localhost:3002/api/health

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
=======
Primeros Pasos con este Proyecto React

Este proyecto fue inicializado con Create React App, una herramienta que facilita la creación de aplicaciones web modernas con React.

A continuación, encontrarás una guía para instalar las dependencias y ejecutar el proyecto en tu máquina local.

⚙️ Instalación

Antes de empezar, asegúrate de tener Node.js y npm instalados.

Para poder ejecutar la aplicación, el primer paso es instalar todas las dependencias del proyecto. Abre una terminal en el directorio raíz del proyecto y ejecuta el siguiente comando:

npm install


Este comando leerá el archivo package.json y descargará todas las librerías necesarias en la carpeta node_modules.

🚀 Scripts Disponibles

Una vez completada la instalación, puedes usar los siguientes scripts desde tu terminal:

npm start

Ejecuta la aplicación en modo de desarrollo. Abre http://localhost:3000 para verla en tu navegador.

La página se recargará automáticamente cada vez que guardes cambios en un archivo. También podrás ver cualquier error de código directamente en la consola.

npm test

Lanza el corredor de pruebas en modo interactivo. Es la herramienta ideal para verificar que tus componentes funcionan como se espera.

npm run build

Compila y empaqueta la aplicación para producción en la carpeta build. Este proceso optimiza el código para que tu aplicación sea lo más rápida y ligera posible.

La compilación final está minificada y los nombres de los archivos incluyen un hash para una gestión eficiente del caché. ¡Tu aplicación está lista para ser desplegada!

npm run eject

⚠️ Nota: Esta es una operación irreversible. Una vez que ejecutas eject, no hay vuelta atrás.

Si necesitas un control total sobre la configuración del proyecto (como Webpack, Babel, ESLint, etc.), puedes usar eject. Este comando elimina la capa de abstracción de create-react-app y copia todas las configuraciones y dependencias directamente en tu proyecto.

No es necesario usar eject en la mayoría de los casos, pero es una opción disponible para personalizaciones avanzadas.

📚 Aprende Más

Para profundizar en el funcionamiento de estas herramientas, puedes consultar la documentación oficial:

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
