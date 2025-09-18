import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SimpleTest = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          🎉 Interface Admin Fonctionnelle !
        </h1>
        
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>✅ Connexion réussie !</strong>
          </div>
          
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <strong>👤 Utilisateur :</strong> {user?.firstName} {user?.lastName}
          </div>
          
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
            <strong>📧 Email :</strong> {user?.email}
          </div>
          
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <strong>🔑 Rôle :</strong> {user?.role}
          </div>
          
          <div className="bg-indigo-100 border border-indigo-400 text-indigo-700 px-4 py-3 rounded">
            <strong>🔐 Authentifié :</strong> {isAuthenticated ? 'Oui' : 'Non'}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            L'interface admin fonctionne parfaitement ! 
            Vous pouvez maintenant accéder à toutes les fonctionnalités d'administration.
          </p>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              <strong>Prochaines étapes :</strong>
            </p>
            <ul className="text-sm text-gray-500 text-left">
              <li>• Gérer les produits</li>
              <li>• Voir les commandes</li>
              <li>• Uploader des images</li>
              <li>• Gérer les utilisateurs</li>
              <li>• Organiser les catégories</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;
