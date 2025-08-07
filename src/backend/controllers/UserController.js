// Controlador de usuarios
const GoogleAuthService = require('../services/googleAuthService');
const { pool } = require('../config/database');

class UserController {
  // Obtener todos los usuarios
  async getUsers(req, res) {
    try {
      const result = await pool.query('SELECT id, name, email, age, bio, location, created_at FROM users');
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear nuevo usuario (Registro)
  async createUser(req, res) {
    try {
      const { 
        nombre, 
        email, 
        edad, 
        descripcion, 
        password, 
        genero,
        busco,
        edad_min,
        edad_max,
        intereses,
        location = null 
      } = req.body;
      
      console.log('Datos recibidos:', req.body);
      
      // Validar datos requeridos
      if (!nombre || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, email y contraseña son requeridos'
        });
      }

      // Verificar si el usuario ya existe
      const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userExists.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya existe con ese email'
        });
      }

      // Crear usuario en la base de datos (tabla users)
      const insertUserQuery = `
        INSERT INTO users (name, email, age, bio, password, location, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id, name, email, age, bio, location, created_at
      `;
      
      const userResult = await pool.query(insertUserQuery, [
        nombre, 
        email, 
        parseInt(edad), 
        descripcion, 
        password, // En producción, esto debe hashearse
        location
      ]);
      
      const userId = userResult.rows[0].id;
      
      // Insertar intereses si se proporcionaron
      if (intereses && intereses.length > 0) {
        for (const interes of intereses) {
          try {
            // Buscar el ID del interés
            const interestResult = await pool.query(
              'SELECT id FROM interest WHERE LOWER(name) = LOWER($1)', 
              [interes]
            );
            
            if (interestResult.rows.length > 0) {
              const interestId = interestResult.rows[0].id;
              
              // Insertar la relación usuario-interés
              await pool.query(
                'INSERT INTO user_interest (user_id, interest_id) VALUES ($1, $2) ON CONFLICT (user_id, interest_id) DO NOTHING',
                [userId, interestId]
              );
            } else {
              console.warn(`Interés '${interes}' no encontrado en la base de datos`);
            }
          } catch (interestError) {
            console.error(`Error insertando interés ${interes}:`, interestError);
          }
        }
      }
      
      res.json({
        success: true,
        message: 'Usuario creado correctamente',
        data: {
          ...userResult.rows[0],
          preferencias: {
            genero,
            busco,
            edad_min: parseInt(edad_min),
            edad_max: parseInt(edad_max)
          },
          intereses
        }
      });
    } catch (error) {
      console.error('Error creando usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando usuario: ' + error.message
      });
    }
  }

  // Obtener todos los intereses disponibles
  async getInterests(req, res) {
    try {
      const result = await pool.query('SELECT id, name FROM interest ORDER BY name');
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error obteniendo intereses:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Login normal
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validar datos requeridos
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
      }

      // Buscar usuario por email y password
      const result = await pool.query(
        'SELECT id, name, email, age, bio, location, created_at FROM users WHERE email = $1 AND password = $2',
        [email, password]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      const user = result.rows[0];

      // Obtener intereses del usuario
      const interesesResult = await pool.query(`
        SELECT i.name 
        FROM interest i 
        JOIN user_interest ui ON i.id = ui.interest_id 
        WHERE ui.user_id = $1
      `, [user.id]);

      const intereses = interesesResult.rows.map(row => row.name);

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          ...user,
          intereses
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Login con Google
  async googleLogin(req, res) {
    try {
      const { token } = req.body;
      const result = await GoogleAuthService.verifyToken(token);
      
      if (result.valid) {
        res.json({
          success: true,
          message: 'Login exitoso',
          user: result.user
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
      }
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new UserController();
