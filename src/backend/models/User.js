const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
  constructor() {
    super('usuarios', [
      'id', 'nombre', 'email', 'edad', 'descripcion', 
      'password', 'ubicacion', 'created_at'
    ]);
  }

  /**
   * Crear usuario con intereses
   * @param {Object} userData - Datos del usuario
   * @param {Array} intereses - Array de intereses
   * @returns {Object} Resultado de la creación
   */
  async createUserWithInterests(userData, intereses = []) {
    return await this.transaction(async (client) => {
      // Crear usuario
      const userInsertQuery = `
        INSERT INTO usuarios (nombre, email, edad, descripcion, password, ubicacion, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
      `;
      
      const userResult = await client.query(userInsertQuery, [
        userData.nombre,
        userData.email,
        parseInt(userData.edad),
        userData.descripcion,
        userData.password,
        userData.ubicacion || null
      ]);

      const user = userResult.rows[0];

      // Agregar intereses si se proporcionaron
      if (intereses && intereses.length > 0) {
        for (const interes of intereses) {
          try {
            // Buscar el ID del interés
            const interestResult = await client.query(
              'SELECT id FROM intereses WHERE LOWER(nombre) = LOWER($1)', 
              [interes]
            );
            
            if (interestResult.rows.length > 0) {
              const interestId = interestResult.rows[0].id;
              
              // Insertar la relación usuario-interés
              await client.query(
                'INSERT INTO usuario_intereses (usuario_id, interes_id) VALUES ($1, $2) ON CONFLICT (usuario_id, interes_id) DO NOTHING',
                [user.id, interestId]
              );
            }
          } catch (interestError) {
            console.error(`Error insertando interés ${interes}:`, interestError);
          }
        }
      }

      return user;
    });
  }

  /**
   * Obtener usuario con sus intereses
   * @param {number} userId - ID del usuario
   * @returns {Object} Usuario con intereses
   */
  async getUserWithInterests(userId) {
    try {
      const userResult = await this.findById(userId);
      
      if (!userResult.success || !userResult.found) {
        return userResult;
      }

      // Obtener intereses del usuario
      const interesesResult = await this.customQuery(`
        SELECT i.id, i.nombre 
        FROM intereses i 
        JOIN usuario_intereses ui ON i.id = ui.interes_id 
        WHERE ui.usuario_id = $1
        ORDER BY i.nombre
      `, [userId]);

      const user = userResult.data;
      user.intereses = interesesResult.success ? interesesResult.data : [];

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error obteniendo usuario con intereses:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Validar credenciales de login
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} Resultado de la validación
   */
  async validateCredentials(email, password) {
    try {
      const result = await this.findOne({ email, password });
      
      if (result.success && result.found) {
        // Obtener intereses del usuario
        const userWithInterests = await this.getUserWithInterests(result.data.id);
        return userWithInterests;
      }
      
      return {
        success: false,
        error: 'Credenciales incorrectas'
      };
    } catch (error) {
      console.error('Error validando credenciales:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar si un usuario existe por email
   * @param {string} email - Email a verificar
   * @returns {Object} Resultado de la verificación
   */
  async existsByEmail(email) {
    const result = await this.findOne({ email });
    return {
      success: result.success,
      exists: result.found,
      data: result.data,
      error: result.error
    };
  }

  /**
   * Obtener todos los usuarios con paginación y filtros
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} pagination - Opciones de paginación
   * @returns {Object} Lista de usuarios
   */
  async getUsers(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const options = {
      limit,
      offset,
      orderBy: 'created_at',
      orderDirection: 'DESC'
    };

    return await this.findAll(filters, options);
  }
}

module.exports = new UserModel();
