import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminPage = () => {
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

  // Vérification admin
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Admin */}
      <div className="bg-blue-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🔧 Administration Koula</h1>
              <p className="text-blue-200 mt-2">Gestion complète de votre boutique en ligne</p>
            </div>
            <div className="text-right">
              {isAuthenticated ? (
                <div>
                  <p className="text-lg">Bonjour, {user?.firstName}</p>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isAdmin ? '👑 ADMINISTRATEUR' : '👤 UTILISATEUR'}
                  </span>
                </div>
              ) : (
                <p className="text-lg">Non connecté</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Message d'état */}
        {!isAuthenticated ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Accès refusé</h2>
            <p className="text-red-700 mb-4">Vous devez être connecté pour accéder à l'administration.</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔐 Se connecter
            </button>
          </div>
        ) : !isAdmin ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">⚠️ Accès limité</h2>
            <p className="text-yellow-700 mb-4">Vous êtes connecté mais vous n'avez pas les droits d'administrateur.</p>
            <div className="space-y-2">
              <p className="text-sm text-yellow-600">• Rôle actuel : {user?.role}</p>
              <p className="text-sm text-yellow-600">• Rôle requis : admin</p>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Accès autorisé</h2>
            <p className="text-green-700">Bienvenue dans l'interface d'administration, {user?.firstName} !</p>
          </div>
        )}

        {/* Interface admin */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Dashboard */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Dashboard</h3>
              </div>
              <p className="text-gray-600 mb-4">Vue d'ensemble des statistiques et métriques</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Commandes aujourd'hui</span>
                  <span className="text-sm font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Produits en stock</span>
                  <span className="text-sm font-semibold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Utilisateurs actifs</span>
                  <span className="text-sm font-semibold">89</span>
                </div>
              </div>
            </div>

            {/* Produits */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Produits</h3>
              </div>
              <p className="text-gray-600 mb-4">Gestion des produits et images</p>
              <div className="space-y-2">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  ➕ Ajouter un produit
                </button>
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  📝 Modifier les produits
                </button>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  🖼️ Gérer les images
                </button>
              </div>
            </div>

            {/* Commandes */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Commandes</h3>
              </div>
              <p className="text-gray-600 mb-4">Gestion des commandes clients</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">En attente</span>
                  <span className="text-sm font-semibold text-yellow-600">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">En cours</span>
                  <span className="text-sm font-semibold text-blue-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Livrées</span>
                  <span className="text-sm font-semibold text-green-600">23</span>
                </div>
              </div>
            </div>

            {/* Utilisateurs */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Utilisateurs</h3>
              </div>
              <p className="text-gray-600 mb-4">Gestion des comptes utilisateurs</p>
              <div className="space-y-2">
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  👤 Voir tous les utilisateurs
                </button>
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  ➕ Créer un utilisateur
                </button>
              </div>
            </div>

            {/* Catégories */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏷️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Catégories</h3>
              </div>
              <p className="text-gray-600 mb-4">Gestion des catégories de produits</p>
              <div className="space-y-2">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  🏷️ Gérer les catégories
                </button>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🖼️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">Images</h3>
              </div>
              <p className="text-gray-600 mb-4">Galerie d'images et upload</p>
              <div className="space-y-2">
                <button className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                  📤 Upload d'images
                </button>
                <button className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  🖼️ Galerie
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Actions rapides</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔐 Se connecter
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🏠 Retour au site
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              🔄 Recharger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
