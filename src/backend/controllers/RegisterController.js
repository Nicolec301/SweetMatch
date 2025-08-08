// Controlador específico para registro de usuarios
const UserModel = require('../models/User');
const InterestModel = require('../models/Interest');
const bcrypt = require('bcryptjs');

class RegisterController {
  /**
   * Validar datos de registro
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Resultado de la validación
   */
  validateRegistrationData(userData) {
    const errors = [];
    
    // Validar campos requeridos
    const requiredFields = {
      nombre: 'Nombre',
      email: 'Correo electrónico',
      password: 'Contraseña',
      edad: 'Edad',
      genero: 'Género',
      busco: 'Preferencia de búsqueda',
      edad_min: 'Edad mínima',
      edad_max: 'Edad máxima',
      descripcion: 'Descripción'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!userData[field] || userData[field].toString().trim() === '') {
        errors.push(`${label} es requerido`);
      }
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      errors.push('El formato del email no es válido');
    }

    // Validar contraseña
    if (userData.password) {
      if (userData.password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
      }
      // Solo requiere mayúscula y número (sin minúscula obligatoria)
      if (!/(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
        errors.push('La contraseña debe contener al menos una mayúscula y un número');
      }
    }

    // Validar edad
    const edad = parseInt(userData.edad);
    if (userData.edad && (isNaN(edad) || edad < 18 || edad > 100)) {
      errors.push('La edad debe estar entre 18 y 100 años');
    }

    // Validar rangos de edad de búsqueda
    const edadMin = parseInt(userData.edad_min);
    const edadMax = parseInt(userData.edad_max);
    
    if (userData.edad_min && (isNaN(edadMin) || edadMin < 18)) {
      errors.push('La edad mínima de búsqueda debe ser mayor a 18 años');
    }
    
    if (userData.edad_max && (isNaN(edadMax) || edadMax > 100)) {
      errors.push('La edad máxima de búsqueda debe ser menor a 100 años');
    }
    
    if (edadMin && edadMax && edadMin > edadMax) {
      errors.push('La edad mínima no puede ser mayor que la edad máxima');
    }

    // Validar género
    const validGenders = ['hombre', 'mujer', 'nobinario', 'otro'];
    if (userData.genero && !validGenders.includes(userData.genero.toLowerCase())) {
      errors.push('Género seleccionado no es válido');
    }

    // Validar preferencia de búsqueda
    const validPreferences = ['hombres', 'mujeres', 'todos'];
    if (userData.busco && !validPreferences.includes(userData.busco.toLowerCase())) {
      errors.push('Preferencia de búsqueda no es válida');
    }

    // Validar descripción
    if (userData.descripcion && userData.descripcion.length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (userData.descripcion && userData.descripcion.length > 500) {
      errors.push('La descripción no puede exceder 500 caracteres');
    }

    // Validar intereses
    if (!userData.intereses || !Array.isArray(userData.intereses) || userData.intereses.length === 0) {
      errors.push('Debe seleccionar al menos un interés');
    }

    if (userData.intereses && userData.intereses.length > 10) {
      errors.push('No puede seleccionar más de 10 intereses');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validar que los intereses existen en la base de datos
   * @param {Array} intereses - Array de nombres de intereses
   * @returns {Object} Resultado de la validación
   */
  async validateInterests(intereses) {
    try {
      if (!intereses || !Array.isArray(intereses)) {
        return {
          isValid: false,
          errors: ['Los intereses deben ser un array']
        };
      }

      const validInterests = [];
      const invalidInterests = [];

      for (const interes of intereses) {
        const result = await InterestModel.findOne({ nombre: interes });
        if (result.success && result.found) {
          validInterests.push(result.data);
        } else {
          invalidInterests.push(interes);
        }
      }

      if (invalidInterests.length > 0) {
        return {
          isValid: false,
          errors: [`Los siguientes intereses no son válidos: ${invalidInterests.join(', ')}`],
          validInterests
        };
      }

      return {
        isValid: true,
        validInterests,
        errors: []
      };
    } catch (error) {
      console.error('Error validando intereses:', error);
      return {
        isValid: false,
        errors: ['Error interno validando intereses']
      };
    }
  }

  /**
   * Sanitizar datos de entrada
   * @param {Object} userData - Datos del usuario
   * @returns {Object} Datos sanitizados
   */
  sanitizeUserData(userData) {
    return {
      nombre: userData.nombre?.toString().trim(),
      email: userData.email?.toString().toLowerCase().trim(),
      password: userData.password?.toString(),
      edad: parseInt(userData.edad),
      genero: userData.genero?.toString().toLowerCase().trim(),
      busco: userData.busco?.toString().toLowerCase().trim(),
      edad_min: parseInt(userData.edad_min),
      edad_max: parseInt(userData.edad_max),
      descripcion: userData.descripcion?.toString().trim(),
      intereses: Array.isArray(userData.intereses) ? userData.intereses : [],
      ubicacion: userData.ubicacion?.toString().trim() || null
    };
  }

  /**
   * Registrar nuevo usuario
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async registerUser(req, res) {
    try {
      console.log('📋 Iniciando proceso de registro:', req.body);

      // Sanitizar datos de entrada
      const sanitizedData = this.sanitizeUserData(req.body);
      console.log('🧹 Datos sanitizados:', { ...sanitizedData, password: '***' });

      // Validar datos básicos
      console.log('🔍 Iniciando validación de datos...');
      const validation = this.validateRegistrationData(sanitizedData);
      console.log('📋 Resultado de validación:', validation);
      
      if (!validation.isValid) {
        console.log('❌ Validación fallida:', validation.errors);
        return res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: validation.errors
        });
      }
      
      console.log('✅ Validación básica exitosa');

      // Verificar que el email no esté en uso
      console.log('📧 Verificando email existente:', sanitizedData.email);
      const existingUser = await UserModel.existsByEmail(sanitizedData.email);
      
      if (!existingUser.success) {
        return res.status(500).json({
          success: false,
          message: 'Error verificando email',
          error: existingUser.error
        });
      }

      if (existingUser.exists) {
        return res.status(409).json({
          success: false,
          message: 'Ya existe una cuenta con este correo electrónico'
        });
      }

      // Validar intereses
      console.log('❤️ Validando intereses:', sanitizedData.intereses);
      const interestValidation = await this.validateInterests(sanitizedData.intereses);
      if (!interestValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Errores en intereses',
          errors: interestValidation.errors
        });
      }

      // Hashear contraseña
      console.log('🔒 Hasheando contraseña...');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(sanitizedData.password, saltRounds);

      // Preparar datos para crear usuario
      const userData = {
        nombre: sanitizedData.nombre,
        email: sanitizedData.email,
        edad: sanitizedData.edad,
        descripcion: sanitizedData.descripcion,
        password: hashedPassword,
        ubicacion: sanitizedData.ubicacion
      };

      console.log('👤 Creando usuario con datos:', { ...userData, password: '***' });

      // Crear usuario con intereses en transacción
      const result = await UserModel.createUserWithInterests(
        userData, 
        sanitizedData.intereses
      );

      if (!result.success) {
        console.error('❌ Error creando usuario:', result.error);
        return res.status(500).json({
          success: false,
          message: 'Error creando usuario',
          error: result.error
        });
      }

      console.log('✅ Usuario creado exitosamente:', result.data.id);

      // Obtener usuario completo con intereses para respuesta
      const completeUser = await UserModel.getUserWithInterests(result.data.id);
      
      if (completeUser.success && completeUser.data) {
        // Remover password de la respuesta
        const { password: _, ...userWithoutPassword } = completeUser.data;
        
        res.status(201).json({
          success: true,
          message: '¡Registro completado exitosamente! Bienvenido a SweetMatch 💖',
          data: {
            ...userWithoutPassword,
            preferencias: {
              genero: sanitizedData.genero,
              busco: sanitizedData.busco,
              edad_min: sanitizedData.edad_min,
              edad_max: sanitizedData.edad_max
            }
          }
        });
      } else {
        // Si hay error obteniendo el usuario completo, usar datos básicos
        const { password: _, ...userWithoutPassword } = result.data;
        
        res.status(201).json({
          success: true,
          message: '¡Registro completado exitosamente! Bienvenido a SweetMatch 💖',
          data: {
            ...userWithoutPassword,
            intereses: sanitizedData.intereses,
            preferencias: {
              genero: sanitizedData.genero,
              busco: sanitizedData.busco,
              edad_min: sanitizedData.edad_min,
              edad_max: sanitizedData.edad_max
            }
          }
        });
      }

    } catch (error) {
      console.error('❌ Error en proceso de registro:', error);
      
      // Manejo específico de errores de base de datos
      if (error.code === '23505') { // Violación de constraint único
        return res.status(409).json({
          success: false,
          message: 'Ya existe una cuenta con este correo electrónico'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error interno del servidor durante el registro',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
      });
    }
  }

  /**
   * Verificar disponibilidad de email
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async checkEmailAvailability(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email es requerido'
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Formato de email no válido'
        });
      }

      const result = await UserModel.existsByEmail(email.toLowerCase().trim());
      
      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: 'Error verificando email'
        });
      }

      res.json({
        success: true,
        available: !result.exists,
        message: result.exists ? 'Email ya está en uso' : 'Email disponible'
      });

    } catch (error) {
      console.error('Error verificando disponibilidad de email:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Validar paso del formulario
   * @param {Object} req - Request
   * @param {Object} res - Response
   */
  async validateStep(req, res) {
    try {
      const { step, data } = req.body;
      const errors = [];

      switch (parseInt(step)) {
        case 1: // Información personal
          if (!data.nombre || data.nombre.trim().length < 2) {
            errors.push('Nombre debe tener al menos 2 caracteres');
          }
          if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Email no es válido');
          }
          if (!data.password || data.password.length < 6) {
            errors.push('Contraseña debe tener al menos 6 caracteres');
          }
          if (!data.edad || parseInt(data.edad) < 18) {
            errors.push('Edad debe ser mayor a 18 años');
          }
          if (!data.genero) {
            errors.push('Debe seleccionar un género');
          }
          break;

        case 2: // Preferencias
          if (!data.busco) {
            errors.push('Debe seleccionar qué busca');
          }
          if (!data.edad_min || parseInt(data.edad_min) < 18) {
            errors.push('Edad mínima debe ser mayor a 18');
          }
          if (!data.edad_max || parseInt(data.edad_max) > 100) {
            errors.push('Edad máxima debe ser menor a 100');
          }
          if (parseInt(data.edad_min) > parseInt(data.edad_max)) {
            errors.push('Edad mínima no puede ser mayor que la máxima');
          }
          break;

        case 3: // Intereses
          if (!data.intereses || data.intereses.length === 0) {
            errors.push('Debe seleccionar al menos un interés');
          }
          break;

        case 4: // Biografía
          if (!data.descripcion || data.descripcion.trim().length < 10) {
            errors.push('Descripción debe tener al menos 10 caracteres');
          }
          break;

        default:
          errors.push('Paso de validación no válido');
          break;
      }

      res.json({
        success: true,
        valid: errors.length === 0,
        errors
      });

    } catch (error) {
      console.error('Error validando paso:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new RegisterController();
