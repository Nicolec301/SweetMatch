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
