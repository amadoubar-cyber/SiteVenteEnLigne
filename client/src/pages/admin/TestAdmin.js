import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createTestAdmin, isAdmin, getCurrentUser } from '../../utils/createAdmin';

const TestAdmin = () => {
  const { user, isAuthenticated } = useAuth();
  const [adminCreated, setAdminCreated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setUserInfo(getCurrentUser());
    }
  }, [isAuthenticated]);

  const handleCreateAdmin = async () => {
    const result = await createTestAdmin();
    if (result) {
      setAdminCreated(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Admin</h1>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations de connexion</h2>
          <div className="space-y-2">
            <p><strong>Connecté :</strong> {isAuthenticated ? 'Oui' : 'Non'}</p>
            <p><strong>Utilisateur :</strong> {user ? `${user.firstName} ${user.lastName}` : 'Non connecté'}</p>
            <p><strong>Email :</strong> {user?.email || 'Non disponible'}</p>
            <p><strong>Rôle :</strong> {user?.role || 'Non défini'}</p>
            <p><strong>Est Admin :</strong> {isAdmin(user) ? 'Oui' : 'Non'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations du token</h2>
          <div className="space-y-2">
            <p><strong>Token présent :</strong> {localStorage.getItem('token') ? 'Oui' : 'Non'}</p>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleCreateAdmin}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Créer un admin de test
            </button>
            
            {adminCreated && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Admin créé avec succès ! Email: admin@koula.gn, Mot de passe: admin123
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Comptes de test :</h3>
              <div className="bg-gray-100 p-4 rounded">
                <p><strong>Admin :</strong> admin@koula.gn / admin123</p>
                <p><strong>Client :</strong> client@koula.gn / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdmin;
