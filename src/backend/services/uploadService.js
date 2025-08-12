// Servicio para manejo de archivos subidos
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

class UploadService {
  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads', 'users');
    this.ensureUploadDirectory();
    this.setupMulter();
  }

  ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      logger.info('Directorio de uploads creado', { dir: this.uploadDir });
    }
  }

  setupMulter() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || '.jpg';
        const safeName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        cb(null, safeName);
      }
    });

    this.multerInstance = multer({
      storage,
      limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 6 // Máximo 6 fotos por usuario
      },
      fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        
        if (!allowedMimes.includes(file.mimetype)) {
          const error = new Error('Formato de imagen no permitido');
          error.code = 'INVALID_FILE_TYPE';
          return cb(error);
        }
        
        cb(null, true);
      }
    });
  }

  // Middleware para subir una sola imagen
  single(fieldName) {
    return this.multerInstance.single(fieldName);
  }

  // Middleware para subir múltiples imágenes
  array(fieldName, maxCount = 6) {
    return this.multerInstance.array(fieldName, maxCount);
  }

  // Procesar archivo subido
  processUploadedFile(file) {
    if (!file) {
      throw new Error('No se encontró archivo');
    }

    const relativePath = `/uploads/users/${file.filename}`;
    
    logger.info('Archivo procesado exitosamente', {
      originalName: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype
    });

    return {
      url: relativePath,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  // Eliminar archivo físico
  deleteFile(filename) {
    try {
      const filePath = path.join(this.uploadDir, filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info('Archivo eliminado', { filename });
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Error eliminando archivo', error, { filename });
      return false;
    }
  }

  // Validar que el archivo existe
  fileExists(filename) {
    const filePath = path.join(this.uploadDir, filename);
    return fs.existsSync(filePath);
  }

  // Obtener información del archivo
  getFileInfo(filename) {
    try {
      const filePath = path.join(this.uploadDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        exists: true
      };
    } catch (error) {
      return {
        filename,
        exists: false,
        error: error.message
      };
    }
  }
}

// Singleton
const uploadService = new UploadService();

module.exports = uploadService;
