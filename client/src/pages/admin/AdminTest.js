import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminTest = () => {
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
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Test Interface Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* État de connexion */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 État de connexion</h2>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Authentifié :</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}
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

          {/* Actions de test */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Actions de test</h2>
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
                onClick={() => window.location.href = '/admin-direct'}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                🔧 Admin Direct
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔄 Recharger
              </button>
            </div>
          </div>

          {/* Résultat du test */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Résultat du test</h2>
            
            {isAuthenticated && user?.role === 'admin' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Test Réussi !</h3>
                <p className="text-green-700 mb-4">L'interface admin fonctionne correctement. Vous pouvez accéder à toutes les fonctionnalités d'administration.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900">📊 Dashboard</h4>
                    <p className="text-sm text-gray-600">Vue d'ensemble</p>
                    <a href="/admin" className="text-blue-600 text-sm hover:underline">Accéder →</a>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900">📦 Produits</h4>
                    <p className="text-sm text-gray-600">Gestion des produits</p>
                    <a href="/admin/products" className="text-blue-600 text-sm hover:underline">Accéder →</a>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900">🛒 Commandes</h4>
                    <p className="text-sm text-gray-600">Gestion des commandes</p>
                    <a href="/admin/orders" className="text-blue-600 text-sm hover:underline">Accéder →</a>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900">👥 Utilisateurs</h4>
                    <p className="text-sm text-gray-600">Gestion des utilisateurs</p>
                    <a href="/admin/users" className="text-blue-600 text-sm hover:underline">Accéder →</a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Test Échoué</h3>
                <p className="text-red-700 mb-4">L'interface admin ne peut pas fonctionner car vous n'êtes pas connecté en tant qu'administrateur.</p>
                <div className="space-y-2">
                  <p className="text-sm text-red-600">• Connectez-vous avec admin@koula.gn / admin123</p>
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

export default AdminTest;
