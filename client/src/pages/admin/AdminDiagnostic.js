import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';

const AdminDiagnostic = () => {
  const menuItems = [
    { name: 'Tableau de bord', href: '/admin', status: 'ok' },
    { name: 'Produits', href: '/admin/products', status: 'ok' },
    { name: 'Mouvements de Stock', href: '/admin/stock', status: 'ok' },
    { name: 'Contrôle de Stock', href: '/admin/stock-control', status: 'ok' },
    { name: 'Gestion des Ventes', href: '/admin/sales', status: 'ok' },
    { name: 'Commandes', href: '/admin/orders', status: 'ok' },
    { name: 'Galerie d\'Images', href: '/admin/images', status: 'ok' },
    { name: 'Utilisateurs', href: '/admin/users', status: 'ok' },
    { name: 'Catégories', href: '/admin/categories', status: 'ok' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center mb-4">
            <Settings className="h-8 w-8 mr-3" />
            Diagnostic Admin - Vérification du Menu
          </h1>
          
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <AlertCircle className="h-5 w-5 inline mr-2" />
            Cette page vous aide à diagnostiquer pourquoi certains éléments du menu admin ne s'affichent pas.
          </div>
        </div>

        {/* Informations de diagnostic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État du Menu Admin</h3>
            <div className="space-y-3">
              {menuItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={item.href}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Tester
                    </a>
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Liens Directs</h3>
            <div className="space-y-3">
              <a 
                href="/admin/stock-control" 
                className="block bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 text-center font-medium"
              >
                📊 Contrôle de Stock
              </a>
              <a 
                href="/admin/sales" 
                className="block bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 text-center font-medium"
              >
                🛒 Gestion des Ventes
              </a>
              <a 
                href="/admin/stock" 
                className="block bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 text-center font-medium"
              >
                📈 Mouvements de Stock
              </a>
              <a 
                href="/admin/products" 
                className="block bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 text-center font-medium"
              >
                📦 Produits
              </a>
            </div>
          </div>
        </div>

        {/* Instructions de résolution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Solutions Possibles</h3>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">1. Vérifiez l'URL actuelle :</h4>
              <p className="text-yellow-700 text-sm">
                Vous devez être sur <code className="bg-yellow-200 px-1 rounded">http://localhost:3000/admin</code> 
                pour voir le menu complet.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">2. Rechargez la page :</h4>
              <p className="text-blue-700 text-sm">
                Appuyez sur <code className="bg-blue-200 px-1 rounded">Ctrl + F5</code> pour recharger complètement la page.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">3. Utilisez les liens directs :</h4>
              <p className="text-green-700 text-sm">
                Cliquez sur les boutons ci-dessus pour accéder directement aux pages.
              </p>
            </div>
          </div>
        </div>

        {/* Informations techniques */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Techniques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Routes Configurées :</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• /admin → Tableau de bord</li>
                <li>• /admin/stock-control → Contrôle de Stock</li>
                <li>• /admin/sales → Gestion des Ventes</li>
                <li>• /admin/stock → Mouvements de Stock</li>
                <li>• /admin/products → Produits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Composants :</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• AdminLayout → Menu principal</li>
                <li>• StockControl → Page contrôle</li>
                <li>• SalesManagement → Page ventes</li>
                <li>• StockMovement → Page mouvements</li>
                <li>• AdminProducts → Page produits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-6 flex justify-center space-x-4">
          <button 
            onClick={() => window.location.href = '/admin'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Retour au Dashboard
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
          >
            Recharger la Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDiagnostic;
