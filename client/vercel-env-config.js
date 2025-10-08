// Configuration pour Vercel - Variables d'environnement
// Ce fichier sera utilisé pour configurer l'environnement sur Vercel

export const vercelConfig = {
  // URL de l'API backend (Render)
  REACT_APP_API_URL: 'https://bowoye-backend-5nd0.onrender.com/api',
  
  // Site configuration
  REACT_APP_SITE_NAME: 'Bowoye Multi Services',
  REACT_APP_SITE_URL: 'https://bowoye-frontend.vercel.app',
  REACT_APP_ENVIRONMENT: 'production',
  REACT_APP_VERSION: '1.0.0'
};

// Instructions pour configurer sur Vercel:
// 1. Allez sur https://vercel.com/dashboard
// 2. Sélectionnez votre projet bowoye-frontend
// 3. Allez dans Settings → Environment Variables
// 4. Ajoutez ces variables:
//    REACT_APP_API_URL = https://bowoye-backend-5nd0.onrender.com/api
//    REACT_APP_SITE_NAME = Bowoye Multi Services
//    REACT_APP_SITE_URL = https://bowoye-frontend.vercel.app
//    REACT_APP_ENVIRONMENT = production

export default vercelConfig;
