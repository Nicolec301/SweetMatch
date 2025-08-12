// Configuración de CORS centralizada
const corsOptions = {
  origin: [
    'http://localhost:3000', // Frontend React (puerto estándar)
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200, // Para legacy browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization'
  ]
};

module.exports = corsOptions;