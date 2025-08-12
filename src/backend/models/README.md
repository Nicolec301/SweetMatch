# 🗄️ Models - Modelos de Datos del Backend

Esta carpeta contiene todos los modelos de datos que representan las entidades del negocio de SweetMatch, implementando el patrón Active Record y la lógica de acceso a datos.

## 📁 Estructura de Models

```
models/
├── 📄 BaseModel.js        # Modelo base con funcionalidades comunes
├── 📄 User.js             # Modelo de usuarios y perfiles
├── 📄 UserPhoto.js        # Modelo de fotos de usuarios
├── 📄 Interest.js         # Modelo de intereses y categorías
├── 📄 Match.js            # Modelo de matches y likes
├── 📄 Conversation.js     # Modelo de conversaciones
├── 📄 Message.js          # Modelo de mensajes individuales
├── 📄 index.js            # Exportaciones y configuración de modelos
└── 📄 README.md           # Documentación de modelos (este archivo)
```

---

## 🏗️ BaseModel.js - Modelo Base

**Propósito**: Proporciona funcionalidades comunes a todos los modelos como CRUD básico, validaciones, timestamps y manejo de errores.

### **Funcionalidades principales**:

```javascript
class BaseModel {
  constructor(tableName, primaryKey = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.db = require('../config/database');
  }
  
  // CRUD básico
  async findById(id) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
      const result = await this.db.query(query, [id]);
      
      return {
        success: true,
        found: result.rows.length > 0,
        data: result.rows[0] || null
      };
    } catch (error) {
      return this.handleError(error, 'findById');
    }
  }
  
  async findMany(conditions = {}, options = {}) {
    try {
      const { limit = 50, offset = 0, orderBy = 'created_at DESC' } = options;
      
      let query = `SELECT * FROM ${this.tableName}`;
      const params = [];
      
      // Construir WHERE clause dinámicamente
      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map((key, index) => `${key} = $${index + 1}`)
          .join(' AND ');
        
        query += ` WHERE ${whereClause}`;
        params.push(...Object.values(conditions));
      }
      
      query += ` ORDER BY ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const result = await this.db.query(query, params);
      
      return {
        success: true,
        data: result.rows,
        count: result.rowCount
      };
    } catch (error) {
      return this.handleError(error, 'findMany');
    }
  }
}

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
