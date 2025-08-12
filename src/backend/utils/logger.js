// Logger centralizado para el backend
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    }) + '\n';
  }

  writeToFile(filename, content) {
    const filePath = path.join(this.logsDir, filename);
    fs.appendFileSync(filePath, content);
  }

  info(message, meta = {}) {
    const formatted = this.formatMessage('INFO', message, meta);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('ℹ️', message, meta);
    }
    
    this.writeToFile('app.log', formatted);
  }

  error(message, error = null, meta = {}) {
    const errorMeta = error ? {
      error: error.message,
      stack: error.stack,
      ...meta
    } : meta;
    
    const formatted = this.formatMessage('ERROR', message, errorMeta);
    
    console.error('❌', message, errorMeta);
    this.writeToFile('error.log', formatted);
  }

  warn(message, meta = {}) {
    const formatted = this.formatMessage('WARN', message, meta);
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️', message, meta);
    }
    
    this.writeToFile('app.log', formatted);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('DEBUG', message, meta);
      console.log('🐛', message, meta);
      this.writeToFile('debug.log', formatted);
    }
  }

  // Logger para requests HTTP
  request(req, res, duration) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    this.info('HTTP Request', logData);
  }
}

// Singleton
const logger = new Logger();

module.exports = logger;