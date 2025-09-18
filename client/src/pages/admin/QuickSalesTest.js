import React from 'react';
import { ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';

const QuickSalesTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center mb-4">
            <ShoppingCart className="h-8 w-8 mr-3" />
            Test Rapide - Gestion des Ventes
          </h1>
          
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <CheckCircle className="h-5 w-5 inline mr-2" />
            ✅ Page accessible ! Le système de gestion des ventes est fonctionnel.
          </div>
        </div>

        {/* Informations du système */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités Disponibles</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Enregistrement des ventes
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Suivi des livraisons
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Statistiques quotidiennes
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Mise à jour automatique du stock
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Gestion des paiements
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accès aux Pages</h3>
            <div className="space-y-3">
              <a 
                href="/admin/sales" 
                className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
              >
                📊 Gestion des Ventes
              </a>
              <a 
                href="/admin/sales/create" 
                className="block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-center"
              >
                ➕ Nouvelle Vente
              </a>
              <a 
                href="/admin/stock-control" 
                className="block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-center"
              >
                📈 Contrôle de Stock
              </a>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Instructions d'Accès
          </h3>
          <div className="text-yellow-700 space-y-2">
            <p><strong>1. Connexion Admin :</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Allez sur <code className="bg-yellow-200 px-1 rounded">http://localhost:3000</code></li>
              <li>• Cliquez sur "Connexion Administrateur"</li>
              <li>• Email: <code className="bg-yellow-200 px-1 rounded">admin@koula.com</code></li>
              <li>• Mot de passe: <code className="bg-yellow-200 px-1 rounded">admin123</code></li>
            </ul>
            
            <p className="mt-4"><strong>2. Menu Admin :</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Dans le menu de gauche, cherchez "Gestion des Ventes"</li>
              <li>• Ou utilisez les liens ci-dessus</li>
            </ul>
          </div>
        </div>

        {/* Données de test */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Données de Test Incluses</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Produits :</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Ciment Portland 50kg</li>
                <li>• Samsung Galaxy S24</li>
                <li>• Tuyau PVC 100mm</li>
                <li>• iPhone 15 Pro</li>
                <li>• Câble électrique 2.5mm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Clients :</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Moussa Diallo</li>
                <li>• Fatoumata Keita</li>
                <li>• Boubacar Diarra</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Ventes :</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 3 ventes d'exemple</li>
                <li>• Statuts variés</li>
                <li>• Livraisons configurées</li>
                <li>• Paiements enregistrés</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSalesTest;
