import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const authData = localStorage.getItem('adminAuth');
    if (authData) {
      try {
        const { isAuthenticated, loginTime } = JSON.parse(authData);
        const now = new Date();
        const loginDate = new Date(loginTime);
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (isAuthenticated && hoursDiff < 24) {
          // Session valide, rediriger vers l'admin
          navigate('/admin-simple-complete');
        } else {
          // Session expirée, rediriger vers la connexion
          navigate('/admin-login');
        }
      } catch (error) {
        // Erreur de parsing, rediriger vers la connexion
        navigate('/admin-login');
      }
    } else {
      // Pas de session, rediriger vers la connexion
      navigate('/admin-login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers l'interface admin...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;
