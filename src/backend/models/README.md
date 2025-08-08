# Sistema CRUD Generalizado - SweetMatch

## Descripción

Este sistema CRUD generalizado proporciona una abstracción completa para todas las operaciones de base de datos en SweetMatch. Está construido sobre PostgreSQL y utiliza el patrón de Repository con herencia para maximizar la reutilización de código.

## Arquitectura

### BaseModel
El `BaseModel` es la clase base que proporciona todas las operaciones CRUD estándar:

- `findAll(filters, options)` - Obtener todos los registros con filtros y paginación
- `findById(id)` - Obtener un registro por ID
- `findOne(conditions)` - Buscar un registro que cumpla condiciones específicas
- `create(data)` - Crear un nuevo registro
- `update(id, data)` - Actualizar un registro existente
- `delete(id)` - Eliminar un registro
- `count(filters)` - Contar registros con filtros
- `customQuery(query, params)` - Ejecutar consultas SQL personalizadas
- `transaction(callback)` - Ejecutar operaciones en transacción

### Modelos Especializados

Cada modelo extiende `BaseModel` y agrega funcionalidades específicas:

#### UserModel (`models/User.js`)
- `createUserWithInterests(userData, intereses)` - Crear usuario con intereses
- `getUserWithInterests(userId)` - Obtener usuario con sus intereses
- `validateCredentials(email, password)` - Validar login
- `existsByEmail(email)` - Verificar si existe usuario por email
- `getUsers(filters, pagination)` - Listar usuarios con paginación

#### MatchModel (`models/Match.js`)
- `getMatchesByUser(userId, estado)` - Obtener matches de un usuario
- `createMatch(usuario1Id, usuario2Id, estado)` - Crear match entre usuarios
- `updateMatchStatus(matchId, nuevoEstado)` - Actualizar estado de match
- `checkMutualMatch(usuario1Id, usuario2Id)` - Verificar match mutuo

#### MessageModel (`models/Message.js`)
- `getMessagesByConversation(conversationId, options)` - Mensajes de una conversación
- `createMessage(conversationId, senderId, content)` - Crear mensaje
- `markAsRead(conversationId, userId)` - Marcar mensajes como leídos
- `getLastMessage(conversationId)` - Último mensaje de conversación
- `getUnreadCount(userId)` - Contar mensajes no leídos

#### ConversationModel (`models/Conversation.js`)
- `getUserConversations(userId)` - Conversaciones de un usuario
- `getOrCreateConversation(user1Id, user2Id)` - Crear/obtener conversación
- `userBelongsToConversation(conversationId, userId)` - Verificar pertenencia
- `getConversationDetails(conversationId, currentUserId)` - Detalles de conversación

#### InterestModel (`models/Interest.js`)
- `getAllInterests()` - Todos los intereses ordenados
- `searchInterests(searchTerm)` - Buscar intereses por nombre
- `getUserInterests(userId)` - Intereses de un usuario
- `addUserInterest(userId, interestId)` - Agregar interés a usuario
- `removeUserInterest(userId, interestId)` - Remover interés de usuario
- `updateUserInterests(userId, interestIds)` - Actualizar todos los intereses

## Uso en Controladores

### Ejemplo básico de uso:

\`\`\`javascript
const UserModel = require('../models/User');

// Obtener todos los usuarios
const result = await UserModel.findAll();

// Obtener usuario por ID
const user = await UserModel.findById(1);

// Crear nuevo usuario
const newUser = await UserModel.create({
  nombre: 'Juan',
  email: 'juan@example.com',
  edad: 25
});

// Actualizar usuario
const updated = await UserModel.update(1, {
  edad: 26
});

// Eliminar usuario
const deleted = await UserModel.delete(1);
\`\`\`

### Ejemplo con filtros y paginación:

\`\`\`javascript
// Buscar usuarios mayores de 25 años, paginado
const result = await UserModel.findAll(
  { edad: 25 }, // filtros WHERE
  { 
    limit: 10, 
    offset: 0, 
    orderBy: 'created_at',
    orderDirection: 'DESC' 
  }
);
\`\`\`

### Ejemplo con transacciones:

\`\`\`javascript
const result = await UserModel.transaction(async (client) => {
  // Crear usuario
  const userResult = await client.query('INSERT INTO usuarios...');
  
  // Agregar intereses
  for (const interest of interests) {
    await client.query('INSERT INTO usuario_intereses...');
  }
  
  return userResult.rows[0];
});
\`\`\`

## Estructura de Respuestas

Todas las operaciones retornan un objeto con estructura estándar:

\`\`\`javascript
{
  success: boolean,      // true si la operación fue exitosa
  data: object|array,    // datos resultantes (null si no hay datos)
  error: string,         // mensaje de error (solo si success=false)
  message: string,       // mensaje descriptivo
  count: number,         // número de registros (para operaciones de listado)
  found: boolean,        // si el registro fue encontrado (para findById/findOne)
  updated: boolean,      // si se actualizó algún registro (para update)
  deleted: boolean,      // si se eliminó algún registro (para delete)
  created: boolean       // si se creó un nuevo registro (para algunas operaciones)
}
\`\`\`

## Beneficios del Sistema

1. **Consistencia**: Todas las operaciones siguen el mismo patrón
2. **Reutilización**: Código compartido en BaseModel reduce duplicación
3. **Mantenibilidad**: Cambios centralizados afectan todos los modelos
4. **Seguridad**: Uso de parámetros preparados previene SQL injection
5. **Flexibilidad**: Consultas personalizadas cuando se necesite
6. **Transacciones**: Soporte nativo para operaciones atomicas
7. **Paginación**: Sistema integrado de paginación y filtros
8. **Validación**: Respuestas estructuradas facilitan manejo de errores

## API Endpoints Actualizados

El sistema incluye endpoints RESTful completos para todas las entidades:

### Usuarios
- `GET /api/users` - Listar usuarios con paginación
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Matches
- `GET /api/matches` - Listar matches
- `GET /api/matches/:id` - Obtener match por ID
- `POST /api/matches` - Crear match
- `PUT /api/matches/:id` - Actualizar match
- `DELETE /api/matches/:id` - Eliminar match

### Conversaciones y Mensajes
- `GET /api/conversations/user/:userId` - Conversaciones de usuario
- `GET /api/conversations/:id/messages` - Mensajes de conversación
- `POST /api/messages` - Enviar mensaje
- `PUT /api/conversations/:id/read` - Marcar como leído

## Configuración

El sistema utiliza la configuración existente de base de datos en `config/database.js` y es compatible con el esquema actual en español.

## Logging y Debugging

Todas las operaciones incluyen logging detallado para facilitar el debugging:
- Queries SQL ejecutadas
- Parámetros utilizados  
- Errores con stack traces
- Tiempos de ejecución

## Futuras Mejoras

- Cache de consultas frecuentes
- Validación de esquemas con Joi
- Migraciones automáticas
- Índices optimizados
- Middleware de autenticación
- Rate limiting
- Compresión de respuestas
