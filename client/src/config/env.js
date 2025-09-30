// Configuration des variables d'environnement
export const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  SITE_NAME: process.env.REACT_APP_SITE_NAME || 'Bowoye Multi Services',
  SITE_URL: process.env.REACT_APP_SITE_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

export default config;
