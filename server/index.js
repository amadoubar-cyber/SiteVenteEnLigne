const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const authWithOTPRoutes = require('./routes/authWithOTP');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const quoteRoutes = require('./routes/quotes');
const comparisonRoutes = require('./routes/comparisons');
const uploadRoutes = require('./routes/upload');
const stockMovementRoutes = require('./routes/stockMovements');
const saleRoutes = require('./routes/sales');
const debtRoutes = require('./routes/debts');
const receiptRoutes = require('./routes/receipts');
const emailRoutes = require('./routes/email');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http://localhost:5000", "http://localhost:3000"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:3000"],
    },
  },
}));

// Rate limiting - Configuration plus permissive pour la production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1000 : 100, // Plus permissif en production
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Réduire la taille des headers pour éviter l'erreur 431
  skip: (req) => {
    // Skip rate limiting pour les requêtes avec des headers trop volumineux
    const headerSize = JSON.stringify(req.headers).length;
    return headerSize > 8000; // 8KB
  }
});
app.use('/api/', limiter);

// Trust proxy for Render (fixes rate limiting warnings)
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://bowoye-frontend.vercel.app',
    'https://bowoye-frontend-git-main.vercel.app',
    'https://bowoye.vercel.app',
    'https://bowoye-multiservices.vercel.app',
    process.env.CLIENT_URL,
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth-otp', authWithOTPRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Koula E-commerce fonctionne correctement',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} existe déjà`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne'
  });
});

const PORT = process.env.PORT || 3001; // Port 3001 par défaut

// Validation des variables d'environnement critiques en production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Variables d\'environnement manquantes:', missingVars.join(', '));
    process.exit(1);
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur Koula E-commerce démarré sur le port ${PORT}`);
  console.log(`📱 Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API disponible sur: http://localhost:${PORT}/api`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
