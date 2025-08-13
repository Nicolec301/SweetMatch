// Controlador de usuarios
const GoogleAuthService = require('../services/googleAuthService');
const UserModel = require('../models/User');
const UserPhotoModel = require('../models/UserPhoto');
const InterestModel = require('../models/Interest');
const uploadService = require('../services/uploadService');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class UserController {
  // Obtener todos los usuarios
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      
      const result = await UserModel.getUsers(
        filters, 
        { page: parseInt(page), limit: parseInt(limit) }
      );
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: result.count
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo usuarios',
          error: result.error
        });
      }
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
        ubicacion = null 
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
      const userExists = await UserModel.existsByEmail(email);
      if (!userExists.success) {
        return res.status(500).json({
          success: false,
          message: 'Error verificando usuario existente'
        });
      }

      if (userExists.exists) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya existe con ese email'
        });
      }

      // Crear usuario con intereses
      const userData = {
        nombre,
        email,
        edad,
        descripcion,
        password, // En producción, esto debe hashearse
        ubicacion
      };

      const result = await UserModel.createUserWithInterests(userData, intereses || []);
      
      if (result.success) {
        const { password: _, ...userWithoutPassword } = result.data;
        
        res.json({
          success: true,
          message: 'Usuario creado correctamente',
          data: {
            ...userWithoutPassword,
            preferencias: {
              genero,
              busco,
              edad_min: parseInt(edad_min),
              edad_max: parseInt(edad_max)
            },
            intereses: intereses || []
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error creando usuario',
          error: result.error
        });
      }
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
      const result = await InterestModel.getAllInterests();
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo intereses',
          error: result.error
        });
      }
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

      // Buscar usuario por email
      const userResult = await UserModel.findOne({ email });

      if (!userResult.success || !userResult.found) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      const user = userResult.data;

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales incorrectas'
        });
      }

      // Obtener usuario completo con intereses
      const completeUser = await UserModel.getUserWithInterests(user.id);
      
      if (completeUser.success && completeUser.data) {
        const { password: _, ...userWithoutPassword } = completeUser.data;
        
        res.json({
          success: true,
          message: 'Login exitoso',
          data: userWithoutPassword
        });
      } else {
        // Fallback si no se pueden obtener los intereses
        const { password: _, ...userWithoutPassword } = user;
        res.json({
          success: true,
          message: 'Login exitoso',
          data: userWithoutPassword
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

  // Obtener un usuario por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const result = await UserModel.getUserWithInterests(parseInt(id));
      
      if (result.success && result.data) {
        const { password: _, ...userWithoutPassword } = result.data;
        res.json({
          success: true,
          data: userWithoutPassword
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar usuario
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Remover campos que no deben actualizarse directamente
  const { password, email, intereses, user_id, ...userData } = updateData;
      
      const result = await UserModel.update(parseInt(id), userData);
      
      if (result.success && result.updated) {
        // Si se proporcionaron intereses, actualizarlos
        if (intereses && intereses.length >= 0) {
          const interestIds = [];
          for (const interes of intereses) {
            const interestResult = await InterestModel.findOne({ nombre: interes });
            if (interestResult.found) {
              interestIds.push(interestResult.data.id);
            }
          }
          await InterestModel.updateUserInterests(parseInt(id), interestIds);
        }
        
        // Obtener usuario actualizado con intereses
        const updatedUser = await UserModel.getUserWithInterests(parseInt(id));
        const { password: _, ...userWithoutPassword } = updatedUser.data;
        
        res.json({
          success: true,
          message: 'Usuario actualizado correctamente',
          data: userWithoutPassword
        });
      } else if (result.success && !result.updated) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error actualizando usuario',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar perfil completo del usuario (incluye detalles y configuración)
  async updateUserProfile(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Separar datos de perfil y configuración
      const { 
        configuracion,
        password, 
        email, 
        intereses, 
        ...profileData 
      } = updateData;
      
      // Actualizar datos del perfil principal
      const userResult = await UserModel.update(parseInt(id), profileData);
      
      if (!userResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Error actualizando perfil del usuario',
          error: userResult.error
        });
      }

      // Actualizar intereses si se proporcionaron
      if (intereses && Array.isArray(intereses)) {
        const interestIds = [];
        for (const interes of intereses) {
          const interestResult = await InterestModel.findOne({ nombre: interes });
          if (interestResult.found) {
            interestIds.push(interestResult.data.id);
          } else {
            // Crear nuevo interés si no existe
            const newInterest = await InterestModel.create({ nombre: interes });
            if (newInterest.success) {
              interestIds.push(newInterest.data.id);
            }
          }
        }
        await InterestModel.updateUserInterests(parseInt(id), interestIds);
      }

      // Actualizar configuración de privacidad si se proporcionó
      if (configuracion && typeof configuracion === 'object') {
        // Aquí necesitarías un método para actualizar la configuración
        // Por ahora lo dejamos como comentario
        // await UserConfigModel.updateUserConfig(parseInt(id), configuracion);
      }

      // Obtener usuario actualizado completo
      const updatedUser = await UserModel.getUserWithInterests(parseInt(id));
      
      if (updatedUser.success) {
        const { password: _, ...userWithoutPassword } = updatedUser.data;
        
        res.json({
          success: true,
          message: 'Perfil actualizado correctamente',
          data: userWithoutPassword
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
    } catch (error) {
      console.error('Error actualizando perfil del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  // Eliminar usuario
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      const result = await UserModel.delete(parseInt(id));
      
      if (result.success && result.deleted) {
        res.json({
          success: true,
          message: 'Usuario eliminado correctamente'
        });
      } else if (result.success && !result.deleted) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error eliminando usuario',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error);
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
        // 1) Buscar usuario por email en BD
        const email = result.user.email;
        const name = result.user.name || 'Usuario';
        const picture = result.user.picture || null;

        const existing = await UserModel.findOne({ email });

        if (existing.success && existing.found) {
          // Obtener usuario completo con intereses
          const dbUser = await UserModel.getUserWithInterests(existing.data.id);
          if (dbUser.success && dbUser.data) {
            const { password: _, ...userWithoutPassword } = dbUser.data;
            return res.json({
              success: true,
              message: 'Login exitoso',
              data: {
                ...userWithoutPassword,
                foto: picture || userWithoutPassword.foto || null
              }
            });
          }
          // Fallback: devolver lo mínimo
          const { password: __, ...userMin } = existing.data;
          return res.json({
            success: true,
            message: 'Login exitoso',
            data: {
              ...userMin,
              foto: picture || null
            }
          });
        }

        // 2) Si no existe, crear usuario mínimo con contraseña aleatoria
        const randomPass = crypto.randomBytes(16).toString('hex');
        const hashed = await bcrypt.hash(randomPass, 10);
        const createRes = await UserModel.create({
          nombre: name,
          email,
          password: hashed,
          verificada: true,
          perfil_completado: false
        });

        if (!createRes.success) {
          return res.status(500).json({
            success: false,
            message: 'No se pudo crear el usuario de Google',
            error: createRes.error
          });
        }

        const newDbUser = await UserModel.getUserWithInterests(createRes.data.id);
        if (newDbUser.success && newDbUser.data) {
          const { password: _, ...userWithoutPassword } = newDbUser.data;
          return res.json({
            success: true,
            message: 'Login exitoso',
            data: {
              ...userWithoutPassword,
              foto: picture || null
            }
          });
        }

        // Fallback si no se pudo leer con intereses
        const { password: _, ...userMinCreated } = createRes.data;
        return res.json({
          success: true,
          message: 'Login exitoso',
          data: {
            ...userMinCreated,
            foto: picture || null
          }
        });
      } else {
  return res.status(401).json({
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

  // Completar perfil después del registro
  async completeProfile(req, res) {
    try {
      const {
        user_id,
        ubicacion,
        trabajo,
        educacion,
        altura,
        signo,
        fumador,
        bebe,
        mascotas,
        hijos,
        religion,
        politica,
        perfil_completado = true
      } = req.body;

      // Validar datos requeridos
      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario es requerido',
          errors: ['user_id es requerido']
        });
      }

      // Validar que user_id sea entero válido
  const userIdNum = Number(user_id);
  // Validar entero positivo y dentro de rango seguro de JS y del tipo integer de PostgreSQL
  if (!Number.isInteger(userIdNum) || !Number.isSafeInteger(userIdNum) || userIdNum <= 0 || userIdNum > 2147483647) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
      }

      // Validaciones de longitud y valores permitidos según el esquema
      const errors = [];
      const MAX = {
        ubicacion: 255,
        trabajo: 255,
        educacion: 255,
        altura: 10,
        signo: 20,
        fumador: 20,
        bebe: 30,
        religion: 100,
        politica: 100,
        // mascotas / hijos son TEXT (sin límite estricto en DB), aplicamos uno razonable
        mascotas: 1000,
        hijos: 1000
      };

      const allowed = {
        fumador: ['No', 'Sí', 'Si', 'Ocasionalmente'],
        bebe: ['No', 'Sí', 'Si', 'Ocasionalmente', 'Socialmente']
      };

      const maybeTrim = (v) => (typeof v === 'string' ? v.trim() : v);

      const fieldsToValidate = {
        ubicacion: maybeTrim(ubicacion),
        trabajo: maybeTrim(trabajo),
        educacion: maybeTrim(educacion),
        altura: maybeTrim(altura),
        signo: maybeTrim(signo),
        fumador: maybeTrim(fumador),
        bebe: maybeTrim(bebe),
        mascotas: maybeTrim(mascotas),
        hijos: maybeTrim(hijos),
        religion: maybeTrim(religion),
        politica: maybeTrim(politica)
      };

      // Validar longitudes
      for (const [key, value] of Object.entries(fieldsToValidate)) {
        if (value !== null && value !== undefined) {
          if (typeof value !== 'string') continue; // ignorar no-string
          if (MAX[key] && value.length > MAX[key]) {
            errors.push(`${key} supera el máximo de ${MAX[key]} caracteres`);
          }
        }
      }

      // Validar enums simples
      if (fieldsToValidate.fumador && !allowed.fumador.includes(fieldsToValidate.fumador)) {
        errors.push(`fumador debe ser uno de: ${allowed.fumador.join(', ')}`);
      }
      if (fieldsToValidate.bebe && !allowed.bebe.includes(fieldsToValidate.bebe)) {
        errors.push(`bebe debe ser uno de: ${allowed.bebe.join(', ')}`);
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Datos de perfil inválidos',
          errors
        });
      }

      // Preparar datos para actualizar
      const updateData = {
        ubicacion: fieldsToValidate.ubicacion,
        trabajo: fieldsToValidate.trabajo,
        educacion: fieldsToValidate.educacion,
        altura: fieldsToValidate.altura,
        signo: fieldsToValidate.signo,
        fumador: fieldsToValidate.fumador,
        bebe: fieldsToValidate.bebe,
        mascotas: fieldsToValidate.mascotas,
        hijos: fieldsToValidate.hijos,
        religion: fieldsToValidate.religion,
        politica: fieldsToValidate.politica,
        perfil_completado
      };

      // Filtrar valores null/undefined
      const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== null && value !== undefined)
      );

      // Comprobar columnas existentes en la tabla para evitar errores si falta alguna (p. ej. perfil_completado)
      const columnsRes = await UserModel.customQuery(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios'`
      );
      if (!columnsRes.success) {
        console.warn('⚠️ No se pudo obtener metadata de columnas. Continuando sin filtro de columnas.');
      }

      let safeData = filteredData;
      if (columnsRes.success) {
        const existingCols = new Set(columnsRes.data.map(r => r.column_name));
        safeData = Object.fromEntries(
          Object.entries(filteredData).filter(([key]) => existingCols.has(key))
        );

        const skipped = Object.keys(filteredData).filter(k => !existingCols.has(k));
        if (skipped.length) {
          console.warn(`⚠️ Campos omitidos al actualizar porque no existen en BD: ${skipped.join(', ')}`);
          if (skipped.includes('perfil_completado')) {
            console.warn('💡 Aplica la migración de perfil para agregar columna perfil_completado (src/backend/postgres/migration_complete_profile.sql) o usa schema_merged.sql.');
          }
        }
      }

      if (Object.keys(safeData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No hay cambios para actualizar'
        });
      }

      console.log('🔄 Completando perfil para usuario:', userIdNum);
      console.log('📋 Datos a actualizar (según columnas existentes):', safeData);
      // Actualizar usando el método genérico del modelo
      const result = await UserModel.update(userIdNum, safeData);

      if (result.success && result.updated) {
        // Obtener el usuario actualizado con intereses
        const updatedUserResult = await UserModel.getUserWithInterests(userIdNum);

        if (updatedUserResult.success && updatedUserResult.data) {
          const { password, ...userWithoutPassword } = updatedUserResult.data;

          return res.json({
            success: true,
            message: 'Perfil completado exitosamente',
            data: userWithoutPassword
          });
        }

        // Fallback si no se pudo obtener con intereses
        return res.json({
          success: true,
          message: 'Perfil actualizado, pero no se pudieron obtener los datos completos'
        });
      }

      if (result.success && !result.updated) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Manejo específico de errores conocidos
      if (result.error && /No hay campos para actualizar/i.test(result.error)) {
        return res.status(400).json({
          success: false,
          message: 'No hay cambios para actualizar'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error actualizando perfil',
        error: result.error
      });
    } catch (error) {
      console.error('Error completando perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Subir foto de perfil
  async uploadProfilePhoto(req, res) {
    try {
      const userId = req.params.userId || req.body.user_id;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se encontró archivo de imagen'
        });
      }

      // Procesar el archivo subido
      const fileInfo = uploadService.processUploadedFile(req.file);
      
      // Actualizar la foto principal del usuario
      const result = await UserModel.updateUserFields(parseInt(userId), {
        foto_principal: fileInfo.url
      });

      if (result.success) {
        // Guardar en la tabla de fotos de usuario
        const photoResult = await UserPhotoModel.create({
          usuario_id: parseInt(userId),
          url: fileInfo.url,
          es_principal: true,
          orden: 1
        });

        res.json({
          success: true,
          message: 'Foto de perfil subida exitosamente',
          data: {
            url: fileInfo.url,
            filename: fileInfo.filename,
            photo_id: photoResult.data?.id
          }
        });
      } else {
        // Si falla la actualización, eliminar el archivo
        uploadService.deleteFile(fileInfo.filename);
        res.status(500).json({
          success: false,
          message: 'Error guardando foto de perfil',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error subiendo foto de perfil:', error);
      
      // Limpiar archivo si existe
      if (req.file) {
        uploadService.deleteFile(req.file.filename);
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Subir múltiples fotos adicionales
  async uploadAdditionalPhotos(req, res) {
    try {
      const userId = req.params.userId || req.body.user_id;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se encontraron archivos de imagen'
        });
      }

      const uploadedPhotos = [];
      const errors = [];

      // Procesar cada archivo
      for (let i = 0; i < req.files.length; i++) {
        try {
          const file = req.files[i];
          const fileInfo = uploadService.processUploadedFile(file);
          
          // Guardar en la tabla de fotos de usuario
          const photoResult = await UserPhotoModel.create({
            usuario_id: parseInt(userId),
            url: fileInfo.url,
            es_principal: false,
            orden: i + 2 // Empezar en 2 porque la principal es 1
          });

          if (photoResult.success) {
            uploadedPhotos.push({
              url: fileInfo.url,
              filename: fileInfo.filename,
              photo_id: photoResult.data?.id,
              order: i + 2
            });
          } else {
            uploadService.deleteFile(fileInfo.filename);
            errors.push(`Error guardando foto ${i + 1}: ${photoResult.error}`);
          }
        } catch (fileError) {
          if (req.files[i]) {
            uploadService.deleteFile(req.files[i].filename);
          }
          errors.push(`Error procesando foto ${i + 1}: ${fileError.message}`);
        }
      }

      res.json({
        success: uploadedPhotos.length > 0,
        message: `${uploadedPhotos.length} fotos subidas exitosamente${errors.length > 0 ? ` (${errors.length} errores)` : ''}`,
        data: {
          uploaded_photos: uploadedPhotos,
          errors: errors
        }
      });
    } catch (error) {
      console.error('Error subiendo fotos adicionales:', error);
      
      // Limpiar archivos si existen
      if (req.files) {
        req.files.forEach(file => {
          uploadService.deleteFile(file.filename);
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar foto de usuario
  async deleteUserPhoto(req, res) {
    try {
      const { userId, photoId } = req.params;
      
      if (!userId || !photoId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario y foto requeridos'
        });
      }

      // Buscar la foto en la base de datos
      const photo = await UserPhotoModel.findById(parseInt(photoId));
      
      if (!photo.success || !photo.found) {
        return res.status(404).json({
          success: false,
          message: 'Foto no encontrada'
        });
      }

      // Verificar que la foto pertenece al usuario
      if (photo.data.usuario_id !== parseInt(userId)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para eliminar esta foto'
        });
      }

      // Eliminar de la base de datos
      const deleteResult = await UserPhotoModel.delete(parseInt(photoId));
      
      if (deleteResult.success) {
        // Eliminar archivo físico
        const filename = photo.data.url.split('/').pop();
        uploadService.deleteFile(filename);

        // Si era la foto principal, actualizar el usuario
        if (photo.data.es_principal) {
          await UserModel.updateUserFields(parseInt(userId), {
            foto_principal: null
          });
        }

        res.json({
          success: true,
          message: 'Foto eliminada exitosamente'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error eliminando foto',
          error: deleteResult.error
        });
      }
    } catch (error) {
      console.error('Error eliminando foto de usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener fotos de un usuario
  async getUserPhotos(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
      }

      const result = await UserPhotoModel.getPhotosByUserId(parseInt(userId));
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data.map(photo => ({
            id: photo.id,
            url: photo.url,
            es_principal: photo.es_principal,
            orden: photo.orden,
            fecha_subida: photo.fecha_subida
          }))
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo fotos del usuario',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo fotos del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new UserController();
