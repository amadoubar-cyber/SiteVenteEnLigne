import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDirect = () => {
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
    <div className="min-h-screen bg-gray-100">
      {/* Header Admin */}
      <div className="bg-blue-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">🔧 Administration Koula</h1>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span>Bonjour, {user?.firstName}</span>
                <span className="bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                  {user?.role === 'admin' ? 'ADMIN' : 'USER'}
                </span>
              </div>
            ) : (
              <span>Non connecté</span>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: État de connexion */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 État de connexion</h2>
            <div className="space-y-2">
              <div className={`p-3 rounded-lg ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Connecté :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}
              </div>
              <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
                <strong>Utilisateur :</strong> {user ? `${user.firstName} ${user.lastName}` : 'Non défini'}
              </div>
              <div className="p-3 rounded-lg bg-purple-100 text-purple-800">
                <strong>Email :</strong> {user?.email || 'Non défini'}
              </div>
              <div className={`p-3 rounded-lg ${user?.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Rôle :</strong> {user?.role || 'Non défini'} {user?.role === 'admin' ? '👑' : '👤'}
              </div>
            </div>
          </div>

          {/* Card 2: Actions rapides */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Actions rapides</h2>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔐 Se connecter
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🏠 Dashboard Admin
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔄 Recharger
              </button>
            </div>
          </div>

          {/* Card 3: Informations système */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">⚙️ Informations système</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Frontend :</strong> http://localhost:3001</p>
              <p><strong>Backend :</strong> http://localhost:5000</p>
              <p><strong>Token :</strong> {localStorage.getItem('token') ? 'Présent' : 'Absent'}</p>
              <p><strong>Date :</strong> {new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Card 4: Interface admin simulée */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2 lg:col-span-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Interface Admin Simulée</h2>
            
            {isAuthenticated && user?.role === 'admin' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Accès Admin Confirmé</h3>
                <p className="text-green-700 mb-4">Vous êtes connecté en tant qu'administrateur. L'interface admin devrait fonctionner.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900">📊 Dashboard</h4>
                    <p className="text-sm text-gray-600">Vue d'ensemble</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900">📦 Produits</h4>
                    <p className="text-sm text-gray-600">Gestion des produits</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900">🛒 Commandes</h4>
                    <p className="text-sm text-gray-600">Gestion des commandes</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900">👥 Utilisateurs</h4>
                    <p className="text-sm text-gray-600">Gestion des utilisateurs</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Accès Refusé</h3>
                <p className="text-red-700 mb-4">Vous n'êtes pas connecté en tant qu'administrateur.</p>
                <div className="space-y-2">
                  <p className="text-sm text-red-600">• Connectez-vous avec admin@koula.gn</p>
                  <p className="text-sm text-red-600">• Vérifiez que votre rôle est 'admin'</p>
                  <p className="text-sm text-red-600">• Rechargez la page après connexion</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDirect;
