// Controlador de matches
const MatchModel = require('../models/Match');

class MatchController {
  // Obtener matches
  async getMatches(req, res) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario es requerido'
        });
      }

      const result = await MatchModel.getMatchesByUser(parseInt(userId));
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo matches',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo matches:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear nuevo match
  async createMatch(req, res) {
    try {
      const { usuario1_id, usuario2_id } = req.body;
      
      if (!usuario1_id || !usuario2_id) {
        return res.status(400).json({
          success: false,
          message: 'IDs de usuarios son requeridos'
        });
      }

      if (usuario1_id === usuario2_id) {
        return res.status(400).json({
          success: false,
          message: 'No puedes hacer match contigo mismo'
        });
      }

      const result = await MatchModel.createMatch(
        parseInt(usuario1_id), 
        parseInt(usuario2_id)
      );
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Match creado correctamente',
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error || 'Error creando match'
        });
      }
    } catch (error) {
      console.error('Error creando match:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar match (método genérico)
  async updateMatch(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await MatchModel.update(parseInt(id), updateData);
      
      if (result.success && result.updated) {
        res.json({
          success: true,
          message: 'Match actualizado correctamente',
          data: result.data
        });
      } else if (result.success && !result.updated) {
        res.status(404).json({
          success: false,
          message: 'Match no encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error actualizando match',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error actualizando match:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Verificar match mutuo
  async checkMutualMatch(req, res) {
    try {
      const { usuario1_id, usuario2_id } = req.query;
      
      if (!usuario1_id || !usuario2_id) {
        return res.status(400).json({
          success: false,
          message: 'IDs de usuarios son requeridos'
        });
      }

      const result = await MatchModel.checkMutualMatch(
        parseInt(usuario1_id), 
        parseInt(usuario2_id)
      );
      
      if (result.success) {
        res.json({
          success: true,
          data: {
            isMutual: result.isMutual
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error verificando match mutuo',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error verificando match mutuo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener match por ID
  async getMatchById(req, res) {
    try {
      const { id } = req.params;
      
      const result = await MatchModel.findById(parseInt(id));
      
      if (result.success && result.found) {
        res.json({
          success: true,
          data: result.data
        });
      } else if (result.success && !result.found) {
        res.status(404).json({
          success: false,
          message: 'Match no encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error obteniendo match',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error obteniendo match:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar match
  async deleteMatch(req, res) {
    try {
      const { id } = req.params;
      
      const result = await MatchModel.delete(parseInt(id));
      
      if (result.success && result.deleted) {
        res.json({
          success: true,
          message: 'Match eliminado correctamente'
        });
      } else if (result.success && !result.deleted) {
        res.status(404).json({
          success: false,
          message: 'Match no encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error eliminando match',
          error: result.error
        });
      }
    } catch (error) {
      console.error('Error eliminando match:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = new MatchController();
