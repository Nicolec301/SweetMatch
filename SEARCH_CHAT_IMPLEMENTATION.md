# Implementación de Búsqueda y Chat - SweetMatch

## Funcionalidades Implementadas

### 1. Módulo de Búsqueda (Busqueda.jsx)

#### Funcionalidades:
- **Búsqueda de perfiles**: Conecta con la base de datos PostgreSQL para obtener usuarios reales
- **Filtros avanzados**: 
  - Edad (rango min-max)
  - Distancia (simulada por ahora)
  - Género (simulado por ahora)
  - Intereses (desde base de datos)
  - Estado en línea (simulado)
- **Interacciones**:
  - ✕ Pasar perfil
  - 💖 Dar like (crea match en BD)
  - 💬 Enviar mensaje directo (crea conversación)

#### Backend:
- `SearchController.js`: Maneja búsquedas con filtros
- `SearchService.js`: Servicio frontend para la API
- Rutas: `/api/search/users`, `/api/search/interests`, `/api/search/profile/:id`

### 2. Módulo de Chat (Chat.jsx)

#### Funcionalidades:
- **Lista de conversaciones**: Carga conversaciones reales de la BD
- **Envío de mensajes**: Conectado a la API real
- **Nuevo mensaje**: Botón para enviar mensaje a cualquier usuario
- **Modal de selección**: Permite elegir usuario y enviar mensaje directo

#### Backend:
- `ConversationController.js`: Maneja conversaciones
- `MessageController.js`: Maneja mensajes
- `ChatService.js`: Servicio de chat existente
- Rutas: `/api/conversations/create-or-get`, `/api/messages/send`

## Archivos Creados/Modificados

### Backend:
```
src/backend/
├── controllers/
│   ├── SearchController.js (NUEVO)
│   ├── MatchController.js (modificado - agregados likeUser, passUser)
│   └── ConversationController.js (modificado - agregado createOrGetConversation)
├── models/
│   ├── Conversation.js (NUEVO - era archivo vacío)
│   └── Match.js (modificado - agregados checkExistingMatch)
├── middleware/
│   └── tempAuth.js (NUEVO - middleware temporal de auth)
└── routes/
    └── api.js (modificado - nuevas rutas)
```

### Frontend:
```
src/
├── services/
│   └── SearchService.js (NUEVO)
├── frontend/pages/components/
│   ├── Busqueda/
│   │   ├── Busqueda.jsx (modificado - conectado a API)
│   │   └── Busqueda.css (modificado - estilos para modal)
│   └── Chat/
│       ├── Chat.jsx (modificado - botón nuevo mensaje)
│       └── Chat.css (modificado - estilos para modal)
```

## Configuración de la Base de Datos

### Tablas Utilizadas:
- `usuarios` - Perfiles de usuarios
- `intereses` - Lista de intereses disponibles  
- `usuario_intereses` - Relación usuario-intereses
- `matches` - Likes y matches entre usuarios
- `conversaciones` - Conversaciones entre usuarios
- `mensajes` - Mensajes dentro de conversaciones
- `usuario_fotos` - Fotos de perfil de usuarios

### Datos de Ejemplo:
El archivo `database_setup.sql` ya incluye datos de ejemplo para probar el sistema.

## Cómo Usar

### 1. Búsqueda de Perfiles:
1. Ve a la página de Búsqueda
2. Ajusta los filtros en la barra lateral
3. Navega entre perfiles con los botones ‹ ›
4. Interactúa con los botones:
   - ✕ para pasar
   - 💖 para dar like
   - 💬 para enviar mensaje directo

### 2. Chat:
1. Ve a la página de Chat
2. Haz clic en el botón ✉️ en la esquina superior derecha
3. Selecciona un usuario de la lista
4. Escribe tu mensaje y envía
5. La conversación aparecerá en tu lista de chats

## Características Técnicas

### Autenticación Temporal:
- Se implementó un middleware temporal (`tempAuth.js`) que simula un usuario autenticado
- En producción se debe reemplazar con JWT o sistema de auth real

### Filtros de Búsqueda:
- Edad: funcional con datos reales
- Intereses: funcional con datos reales  
- Género y Estado: simulados (se pueden implementar agregando campos a la BD)
- Distancia: simulada (se puede implementar con coordenadas GPS)

### Gestión de Errores:
- Fallback a datos simulados si falla la API
- Manejo de estados de loading
- Mensajes de error al usuario

### Responsive Design:
- Los modales y componentes son responsive
- Estilos optimizados para diferentes tamaños de pantalla

## Próximos Pasos

1. **Implementar autenticación real** con JWT
2. **Agregar campos género y estado** a la tabla usuarios
3. **Implementar sistema de coordenadas GPS** para distancia real
4. **Agregar notificaciones push** para nuevos mensajes
5. **Implementar sistema de matches mutuos** completo
6. **Agregar validaciones de seguridad** en el backend
7. **Optimizar consultas de base de datos** con índices
8. **Implementar paginación** en la búsqueda
9. **Agregar sistema de reportes** y moderación
10. **Implementar chat en tiempo real** con WebSockets

## Testing

Para probar el sistema:
1. Asegúrate de que PostgreSQL está ejecutándose
2. Ejecuta el script `database_setup.sql`
3. Inicia el backend (`npm start` en la carpeta backend)
4. Inicia el frontend (`npm start` en la carpeta raíz)
5. Ve a las páginas de Búsqueda y Chat para probar las funcionalidades
