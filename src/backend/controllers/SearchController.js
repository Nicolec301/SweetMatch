const UserModel = require('../models/User');
const InterestModel = require('../models/Interest');

class SearchController {
  /**
   * Buscar usuarios con filtros avanzados
   * @param {*} req 
   * @param {*} res 
   */
  async searchUsers(req, res) {
    try {
      const {
        edadMin = 18,
        edadMax = 65,
        distancia = 50, // Para implementar después con coordenadas GPS
        genero,
        intereses = [],
        estado = 'todos',
        excluirUsuario,
        page = 1,
        limit = 20
      } = req.query;

      // Convertir parámetros
      const edadMinima = parseInt(edadMin);
      const edadMaxima = parseInt(edadMax);
      const currentPage = parseInt(page);
      const pageLimit = parseInt(limit);
      const offset = (currentPage - 1) * pageLimit;

      // Construir consulta base
      let baseQuery = `
        SELECT DISTINCT u.id, u.nombre, u.edad, u.descripcion, u.ubicacion,
               u.trabajo, u.educacion, u.altura, u.verificada, u.created_at,
               uf.url_foto as foto_principal,
               -- Simular distancia (implementar después con coordenadas reales)
               ROUND(RANDOM() * 50 + 1) as distancia,
               RANDOM() as orden_aleatorio
        FROM usuarios u
        LEFT JOIN usuario_fotos uf ON u.id = uf.usuario_id AND uf.es_principal = true
        LEFT JOIN usuario_intereses ui ON u.id = ui.usuario_id
        LEFT JOIN intereses i ON ui.interes_id = i.id
        WHERE 1=1
      `;

      let queryParams = [];
      let paramCounter = 1;

      // Filtro por edad
      baseQuery += ` AND u.edad >= $${paramCounter} AND u.edad <= $${paramCounter + 1}`;
      queryParams.push(edadMinima, edadMaxima);
      paramCounter += 2;

      // Excluir usuario actual si se proporciona
      if (excluirUsuario) {
        baseQuery += ` AND u.id != $${paramCounter}`;
        queryParams.push(parseInt(excluirUsuario));
        paramCounter++;
      }

      // Filtro por género (implementar después cuando se agregue campo género)
      // Por ahora simularemos género aleatorio
      if (genero && genero !== 'ambos') {
        // baseQuery += ` AND u.genero = $${paramCounter}`;
        // queryParams.push(genero);
        // paramCounter++;
      }

      // Filtro por intereses
      if (intereses && intereses.length > 0) {
        const interesesArray = Array.isArray(intereses) ? intereses : [intereses];
        queryParams.push(...interesesArray);
        
        baseQuery += ` AND LOWER(i.nombre) IN (${interesesArray.map((_, idx) => `$${paramCounter + idx}`).join(',')})`;
        paramCounter += interesesArray.length;
      }

      // Agregar ordenamiento y paginación
      baseQuery += ` 
        ORDER BY u.created_at DESC, orden_aleatorio
        LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
      `;
      queryParams.push(pageLimit, offset);

      console.log('Search Query:', baseQuery);
      console.log('Query Params:', queryParams);

      // Ejecutar consulta
      const result = await UserModel.customQuery(baseQuery, queryParams);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: 'Error en la búsqueda de usuarios',
          error: result.error
        });
      }

      // Obtener intereses para cada usuario encontrado
      const usersWithInterests = await Promise.all(
        result.data.map(async (user) => {
          try {
            const interesesResult = await UserModel.customQuery(`
              SELECT i.nombre 
              FROM intereses i 
              JOIN usuario_intereses ui ON i.id = ui.interes_id 
              WHERE ui.usuario_id = $1
            `, [user.id]);

            return {
              ...user,
              intereses: interesesResult.success ? 
                interesesResult.data.map(int => int.nombre) : [],
              // Simular género por ahora
              genero: Math.random() > 0.5 ? 'masculino' : 'femenino',
              // Simular estado en línea
              estado: Math.random() > 0.7 ? 'en_linea' : 'recientemente_activa'
            };
          } catch (error) {
            console.error(`Error obteniendo intereses para usuario ${user.id}:`, error);
            return {
              ...user,
              intereses: [],
              genero: 'masculino',
              estado: 'recientemente_activa'
            };
          }
        })
      );

      // Contar total para paginación
      let countQuery = `
        SELECT COUNT(DISTINCT u.id) as total
        FROM usuarios u
        LEFT JOIN usuario_intereses ui ON u.id = ui.usuario_id
        LEFT JOIN intereses i ON ui.interes_id = i.id
        WHERE u.edad >= $1 AND u.edad <= $2
      `;
      
      let countParams = [edadMinima, edadMaxima];
      let countParamCounter = 3;

      if (excluirUsuario) {
        countQuery += ` AND u.id != $${countParamCounter}`;
        countParams.push(parseInt(excluirUsuario));
        countParamCounter++;
      }

      if (intereses && intereses.length > 0) {
        const interesesArray = Array.isArray(intereses) ? intereses : [intereses];
        countQuery += ` AND LOWER(i.nombre) IN (${interesesArray.map((_, idx) => `$${countParamCounter + idx}`).join(',')})`;
        countParams.push(...interesesArray);
      }

      const countResult = await UserModel.customQuery(countQuery, countParams);
      const totalUsers = countResult.success ? countResult.data[0]?.total || 0 : 0;

      res.json({
        success: true,
        data: usersWithInterests,
        pagination: {
          page: currentPage,
          limit: pageLimit,
          total: parseInt(totalUsers),
          totalPages: Math.ceil(totalUsers / pageLimit)
        },
        filters: {
          edadMin: edadMinima,
          edadMax: edadMaxima,
          distancia,
          genero,
          intereses: Array.isArray(intereses) ? intereses : (intereses ? [intereses] : []),
          estado
        }
      });

    } catch (error) {
      console.error('Error en búsqueda de usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

  /**
   * Obtener todos los intereses disponibles
   * @param {*} req 
   * @param {*} res 
   */
  async getAvailableInterests(req, res) {
    try {
      const result = await InterestModel.findAll();

      if (result.success) {
        res.json({
          success: true,
          data: result.data.map(interest => interest.nombre)
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

  /**
   * Obtener perfil detallado de un usuario específico
   * @param {*} req 
   * @param {*} res 
   */
  async getUserProfile(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario requerido'
        });
      }

      const result = await UserModel.getUserWithInterests(parseInt(userId));

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: 'Error obteniendo perfil de usuario',
          error: result.error
        });
      }

      if (!result.data) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Obtener fotos del usuario
      const fotosResult = await UserModel.customQuery(`
        SELECT url_foto, es_principal 
        FROM usuario_fotos 
        WHERE usuario_id = $1 
        ORDER BY es_principal DESC, id ASC
      `, [userId]);

      // Remover datos sensibles
      const { password, email, ...userProfile } = result.data;

      res.json({
        success: true,
        data: {
          ...userProfile,
          fotos: fotosResult.success ? fotosResult.data : [],
          // Simular datos adicionales
          genero: Math.random() > 0.5 ? 'masculino' : 'femenino',
          estado: Math.random() > 0.7 ? 'en_linea' : 'recientemente_activa',
          distancia: Math.floor(Math.random() * 50) + 1
        }
      });

    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Enviar mensaje directo a un usuario (crea conversación automáticamente)
   * @param {*} req 
   * @param {*} res 
   */
  async sendDirectMessage(req, res) {
    const ConversationModel = require('../models/Conversation');
    const MessageModel = require('../models/Message');
    
    try {
      const { recipientId, mensaje } = req.body;
      const senderId = req.user.id; // Obtener del token JWT autenticado
      
      console.log('📨 sendDirectMessage - Datos recibidos:', {
        recipientId,
        senderId,
        mensaje: mensaje?.substring(0, 50) + '...',
        userFromToken: req.user
      });
      
      if (!recipientId || !mensaje) {
        return res.status(400).json({
          success: false,
          message: 'ID del destinatario y mensaje son requeridos'
        });
      }

      if (parseInt(recipientId) === parseInt(senderId)) {
        return res.status(400).json({
          success: false,
          message: 'No puedes enviarte mensajes a ti mismo'
        });
      }

      // 1. Crear o obtener conversación existente
      console.log('🔄 Creando/obteniendo conversación entre:', senderId, 'y', recipientId);
      const conversationResult = await ConversationModel.getOrCreateConversation(
        parseInt(senderId),
        parseInt(recipientId)
      );

      console.log('💬 Resultado de conversación:', conversationResult);

      if (!conversationResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Error creando conversación',
          error: conversationResult.error
        });
      }

      // 2. Enviar mensaje en la conversación
      const conversationId = conversationResult.data?.data?.id || conversationResult.data?.id;
      console.log('📝 Creando mensaje en conversación ID:', conversationId);
      
      if (!conversationId) {
        console.error('❌ No se pudo obtener ID de conversación:', conversationResult);
        return res.status(500).json({
          success: false,
          message: 'Error obteniendo ID de conversación'
        });
      }
      
      const messageResult = await MessageModel.createMessage(
        conversationId,
        parseInt(senderId),
        mensaje
      );

      console.log('✉️ Resultado de crear mensaje:', messageResult);

      if (messageResult.success) {
        console.log('✅ Mensaje enviado exitosamente');
        res.json({
          success: true,
          message: 'Mensaje enviado correctamente',
          data: {
            conversation: conversationResult.data?.data || conversationResult.data,
            message: messageResult.data,
            conversationCreated: conversationResult.created
          }
        });
      } else {
        console.log('❌ Error enviando mensaje:', messageResult.error);
        res.status(500).json({
          success: false,
          message: 'Error enviando mensaje',
          error: messageResult.error
        });
      }
    } catch (error) {
      console.error('Error enviando mensaje directo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Crear mensajes de prueba para debugging
   * SOLO PARA DESARROLLO
   */
  async createTestMessages(req, res) {
    try {
      console.log('🧪 Creando mensajes de prueba...');
      
      const MessageModel = require('../models/Message');
      
      const testMessages = [
        // Mensajes para conversación 5
        { conversacion_id: 5, remitente_id: 2, contenido: '¡Hola! ¿Cómo estás?', fecha_envio: new Date(Date.now() - 2*60*60*1000) },
        { conversacion_id: 5, remitente_id: 7, contenido: 'Muy bien, gracias. ¿Y tú?', fecha_envio: new Date(Date.now() - 90*60*1000), fecha_lectura: new Date(Date.now() - 80*60*1000) },
        { conversacion_id: 5, remitente_id: 2, contenido: 'Genial! Me alegra escuchar eso', fecha_envio: new Date(Date.now() - 75*60*1000) },
        { conversacion_id: 5, remitente_id: 7, contenido: '¿Te gustaría quedar para tomar un café?', fecha_envio: new Date(Date.now() - 60*60*1000) },
        { conversacion_id: 5, remitente_id: 2, contenido: '¡Me encantaría! ¿Cuándo te viene bien?', fecha_envio: new Date(Date.now() - 45*60*1000), fecha_lectura: new Date(Date.now() - 40*60*1000) },
        
        // Mensajes para conversación 6
        { conversacion_id: 6, remitente_id: 3, contenido: 'Hey! Vi tu perfil y me parece interesante', fecha_envio: new Date(Date.now() - 3*60*60*1000) },
        { conversacion_id: 6, remitente_id: 7, contenido: '¡Hola! Gracias, el tuyo también me llamó la atención', fecha_envio: new Date(Date.now() - 150*60*1000), fecha_lectura: new Date(Date.now() - 140*60*1000) },
        { conversacion_id: 6, remitente_id: 3, contenido: '¿Qué tipo de música te gusta?', fecha_envio: new Date(Date.now() - 120*60*1000) },
        { conversacion_id: 6, remitente_id: 7, contenido: 'Me gusta mucho el rock y el pop. ¿Y a ti?', fecha_envio: new Date(Date.now() - 105*60*1000), fecha_lectura: new Date(Date.now() - 90*60*1000) },
        { conversacion_id: 6, remitente_id: 3, contenido: 'También me gusta el rock! ¿Has ido a algún concierto últimamente?', fecha_envio: new Date(Date.now() - 90*60*1000) }
      ];
      
      const results = [];
      for (const msg of testMessages) {
        const result = await MessageModel.create(msg);
        results.push(result);
      }
      
      res.json({
        success: true,
        message: 'Mensajes de prueba creados',
        data: results
      });
      
    } catch (error) {
      console.error('Error creando mensajes de prueba:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando mensajes de prueba',
        error: error.message
      });
    }
  }
}

module.exports = new SearchController();
