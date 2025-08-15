// Router central de la API - Monta sub-routers modulares
const express = require('express');
const router = express.Router();

// Importar sub-routers modulares
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const chatRoutes = require('./chatRoutes');
const matchRoutes = require('./matchRoutes');
const searchRoutes = require('./searchRoutes');

// Montar sub-routers con sus prefijos
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chat', chatRoutes);
router.use('/matches', matchRoutes);
router.use('/search', searchRoutes);

// Health check endpoint (público)
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'SweetMatch API funcionando con arquitectura modular',
    timestamp: new Date().toISOString(),
    version: '2.1.0',
    modules: ['auth', 'users', 'chat', 'matches', 'search']
  });
});

module.exports = router;
