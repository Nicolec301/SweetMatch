# Sistema de Chat SweetMatch - JavaScript

Este sistema de chat implementado en JavaScript reemplaza la funcionalidad PHP original y proporciona una experiencia de usuario más fluida y moderna.

## Archivos Principales

### 1. `js/chat-manager.js`
Clase principal que maneja toda la funcionalidad del chat:
- Carga y manejo de conversaciones
- Envío y recepción de mensajes
- Gestión de la interfaz de usuario
- Manejo de notificaciones

### 2. `js/chat-utils.js`
Utilidades y funciones auxiliares:
- Formateo de fechas y horas
- Manejo de archivos e imágenes
- Validación de mensajes
- Funciones de almacenamiento local

### 3. `js/chat-config.js`
Configuración del sistema:
- Parámetros de mensajes
- Configuración de archivos
- Temas y colores
- Endpoints de API

### 4. `js/data/conversaciones.json`
Datos de conversaciones en formato JSON:
- Información de contactos
- Mensajes e historial
- Estados de lectura

## Funcionalidades Principales

### Envío de Mensajes
- Envío con Enter (Shift+Enter para nueva línea)
- Validación de contenido
- Notificaciones de confirmación
- Respuestas automáticas simuladas

### Gestión de Conversaciones
- Cambio entre conversaciones
- Búsqueda de contactos
- Lista de mensajes recientes
- Estados de lectura

### Características Adicionales
- Selector de emojis
- Envío de imágenes (simulado)
- Indicador de escritura
- Notificaciones en tiempo real
- Scroll automático

## Uso

### Inicialización
El sistema se inicializa automáticamente cuando el DOM está listo:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});
```

### Configuración
Puedes modificar la configuración a través de `ChatConfig`:

```javascript
// Cambiar el tiempo de auto-ocultado de notificaciones
ChatConfig.set('notifications.autoHide', 3000);

// Habilitar modo debug
ChatConfig.set('development.debugMode', true);
```

### Eventos Personalizados
El sistema emite eventos personalizados que puedes escuchar:

```javascript
// Escuchar cuando se envía un mensaje
document.addEventListener('messagesSent', (e) => {
    console.log('Mensaje enviado:', e.detail);
});

// Escuchar cambios de conversación
document.addEventListener('conversationChanged', (e) => {
    console.log('Nueva conversación:', e.detail.conversationId);
});
```

## Estructura de Datos

### Mensaje
```javascript
{
    id: "unique_id",
    contenido: "Texto del mensaje",
    hora: "14:30",
    remitente: true, // true = usuario actual, false = contacto
    emisor: "Nombre del emisor",
    leido: true,
    tipo: "texto" // texto, imagen, enlace
}
```

### Conversación
```javascript
{
    nombre: "Nombre del contacto",
    imagen: "ruta/a/imagen.jpg",
    vista_previa: "Último mensaje...",
    tiempo_indicador: "2h",
    ultima_actividad: "En línea",
    mensajes: [array_de_mensajes]
}
```

## Personalización

### Temas
Puedes modificar los colores en `ChatConfig.themes`:

```javascript
ChatConfig.themes.light.primary = '#your-color';
```

### Emojis
Agregar nuevos emojis en `ChatConfig.emojis.categories`:

```javascript
ChatConfig.emojis.categories.custom = ['🚀', '⭐', '🎯'];
```

### Sonidos
Personalizar sonidos de notificación en `ChatUtils.playNotificationSound()`.

## Integración con Backend

Para conectar con un backend real, modifica los endpoints en `ChatConfig.endpoints`:

```javascript
ChatConfig.endpoints = {
    conversations: '/api/conversations',
    sendMessage: '/api/messages',
    uploadFile: '/api/upload',
    markAsRead: '/api/read'
};
```

## Responsive Design

El sistema está optimizado para dispositivos móviles con:
- Diseño adaptativo
- Gestos táctiles
- Teclado virtual compatible
- Modales optimizados

## Rendimiento

- Carga lazy de conversaciones
- Paginación de mensajes
- Compresión de imágenes
- Caché local con localStorage

## Seguridad

- Sanitización de contenido
- Validación de archivos
- Límites de tamaño
- Escape de HTML

## Compatibilidad

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Dispositivos móviles iOS/Android

## Desarrollo

Para contribuir al desarrollo:

1. Mantén el código modular
2. Usa JSDoc para documentación
3. Sigue los estándares ES6+
4. Prueba en múltiples navegadores
5. Optimiza para rendimiento

## Debugging

Habilita el modo debug:

```javascript
ChatConfig.set('development.debugMode', true);
```

Esto proporcionará logs detallados en la consola del navegador.
