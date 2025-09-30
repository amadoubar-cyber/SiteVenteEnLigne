// Configuration des variables d'environnement pour le déploiement
const config = {
  // URL de l'API backend
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // Environnement
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',
  
  // Version
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Configuration pour différents environnements
  development: {
    API_URL: 'http://localhost:3001/api',
    DEBUG: true,
    LOG_LEVEL: 'debug'
  },
  
  production: {
    API_URL: 'https://bowoye-backend.onrender.com/api',
    DEBUG: false,
    LOG_LEVEL: 'error'
  }
};

// Retourner la configuration selon l'environnement
const environment = config.ENVIRONMENT || 'development';
const envConfig = config[environment] || config.development;

export default {
  ...config,
  ...envConfig
};
