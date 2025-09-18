import React, { useState } from 'react';

const AdminFinal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const loginAsAdmin = () => {
    const adminUser = {
      firstName: 'Admin',
      lastName: 'Koula',
      email: 'admin@koula.gn',
      role: 'admin'
    };
    setUser(adminUser);
    setIsLoggedIn(true);
    localStorage.setItem('adminUser', JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('adminUser');
  };

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
              {isLoggedIn ? (
                <div>
                  <p className="text-lg">Bonjour, {user?.firstName} {user?.lastName}</p>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    👑 ADMINISTRATEUR
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
        {!isLoggedIn ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Accès refusé</h2>
            <p className="text-red-700 mb-4">Vous devez être connecté pour accéder à l'administration.</p>
            <button
              onClick={loginAsAdmin}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔐 Se connecter en tant qu'Admin
            </button>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Accès autorisé</h2>
            <p className="text-green-700">Bienvenue dans l'interface d'administration, {user?.firstName} {user?.lastName} !</p>
            <button
              onClick={logout}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        )}

        {/* Interface admin */}
        {isLoggedIn && (
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
                <button 
                  onClick={() => {
                    console.log('Dashboard button clicked!');
                    alert('Fonctionnalité : Dashboard détaillé\n\nCette fonctionnalité affichera :\n- Graphiques de ventes\n- Statistiques en temps réel\n- Rapports de performance\n- Alertes et notifications');
                  }}
                  className="w-full mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  📊 Voir le dashboard détaillé
                </button>
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
                <button 
                  onClick={() => {
                    console.log('Ajouter produit button clicked!');
                    alert('Fonctionnalité : Ajouter un produit\n\nCette fonctionnalité permettra d\'ajouter de nouveaux produits à votre catalogue avec :\n- Nom et description\n- Prix et catégorie\n- Images multiples\n- Stock et disponibilité');
                  }}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  ➕ Ajouter un produit
                </button>
                <button 
                  onClick={() => alert('Fonctionnalité : Modifier les produits\n\nCette fonctionnalité permettra de :\n- Modifier les informations des produits existants\n- Changer les prix\n- Mettre à jour les descriptions\n- Gérer le stock')}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  📝 Modifier les produits
                </button>
                <button 
                  onClick={() => alert('Fonctionnalité : Gérer les images\n\nCette fonctionnalité permettra de :\n- Uploader des images pour les produits\n- Organiser la galerie\n- Redimensionner et optimiser\n- Supprimer les images inutiles')}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
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
                <button 
                  onClick={() => alert('Fonctionnalité : Gestion des commandes\n\nCette fonctionnalité permettra de :\n- Voir toutes les commandes\n- Changer le statut des commandes\n- Gérer les livraisons\n- Exporter les rapports')}
                  className="w-full mt-3 bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                >
                  🛒 Gérer les commandes
                </button>
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
                <button 
                  onClick={() => alert('Fonctionnalité : Voir tous les utilisateurs\n\nCette fonctionnalité permettra de :\n- Lister tous les utilisateurs inscrits\n- Voir leurs informations de contact\n- Gérer leurs permissions\n- Activer/désactiver des comptes')}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  👤 Voir tous les utilisateurs
                </button>
                <button 
                  onClick={() => alert('Fonctionnalité : Créer un utilisateur\n\nCette fonctionnalité permettra de :\n- Créer de nouveaux comptes utilisateurs\n- Définir les rôles (admin, client)\n- Envoyer des invitations par email\n- Gérer les permissions d\'accès')}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
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
                <button 
                  onClick={() => alert('Fonctionnalité : Gérer les catégories\n\nCette fonctionnalité permettra de :\n- Créer de nouvelles catégories\n- Modifier les catégories existantes\n- Organiser la hiérarchie\n- Gérer les sous-catégories')}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
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
                <button 
                  onClick={() => alert('Fonctionnalité : Upload d\'images\n\nCette fonctionnalité permettra de :\n- Uploader des images en drag & drop\n- Redimensionner automatiquement\n- Optimiser la qualité\n- Gérer les formats (JPG, PNG, WebP)')}
                  className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  📤 Upload d'images
                </button>
                <button 
                  onClick={() => alert('Fonctionnalité : Galerie\n\nCette fonctionnalité permettra de :\n- Voir toutes les images uploadées\n- Organiser par albums\n- Rechercher et filtrer\n- Supprimer les images inutiles')}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
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

export default AdminFinal;
