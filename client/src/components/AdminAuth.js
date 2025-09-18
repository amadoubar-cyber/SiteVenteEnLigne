import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';

const AdminAuth = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        const { isAuthenticated, loginTime } = JSON.parse(authData);
        
        // Vérifier si la session n'a pas expiré (24 heures)
        const now = new Date();
        const loginDate = new Date(loginTime);
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
        
        if (isAuthenticated && hoursDiff < 24) {
          setIsAuthenticated(true);
        } else {
          // Session expirée
          localStorage.removeItem('adminAuth');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    checkAuth();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Ajouter la fonction de déconnexion aux enfants
  return React.cloneElement(children, { onLogout: handleLogout });
};

export default AdminAuth;
