import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const TestSimple = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            🎯 Test Interface Admin
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">État de connexion</h2>
              <div className="space-y-2">
                <p><strong>Connecté :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</p>
                <p><strong>Utilisateur :</strong> {user ? `${user.firstName} ${user.lastName}` : 'Non défini'}</p>
                <p><strong>Email :</strong> {user?.email || 'Non défini'}</p>
                <p><strong>Rôle :</strong> {user?.role || 'Non défini'}</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  🔐 Se connecter
                </button>
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  🏠 Dashboard Admin
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  🔄 Recharger
                </button>
              </div>
            </div>
          </div>

          {isAuthenticated && user?.role === 'admin' ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <h3 className="font-bold">✅ Succès !</h3>
              <p>Vous êtes connecté en tant qu'administrateur. L'interface admin devrait fonctionner.</p>
            </div>
          ) : (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <h3 className="font-bold">❌ Problème détecté</h3>
              <p>Vous n'êtes pas connecté en tant qu'administrateur. Veuillez vous connecter avec admin@koula.gn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSimple;
