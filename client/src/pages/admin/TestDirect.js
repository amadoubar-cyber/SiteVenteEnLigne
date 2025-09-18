import React from 'react';

const TestDirect = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
            ✅ TEST DIRECT - PAGE FONCTIONNE !
          </h1>
          
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <h2 className="text-xl font-semibold mb-2">🎉 Succès !</h2>
            <p>Cette page confirme que le routage React fonctionne correctement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">📊 Contrôle de Stock</h3>
              <p className="text-blue-600 mb-4">Page complète avec toutes les fonctionnalités</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Chiffre d'affaires:</span>
                  <span className="font-bold">15,750,000 FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Bénéfice:</span>
                  <span className="font-bold text-green-600">3,150,000 FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span>Produits vendus:</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock restant:</span>
                  <span className="font-bold">2,156</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">📈 Catégories</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-orange-700">Matériaux Construction</span>
                  <span className="bg-orange-200 px-2 py-1 rounded text-sm">856 vendus</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-700">Électronique</span>
                  <span className="bg-orange-200 px-2 py-1 rounded text-sm">391 vendus</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🔗 URLs de Test</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Page actuelle:</span>
                <code className="bg-gray-200 px-2 py-1 rounded">/admin-direct</code>
              </div>
              <div className="flex justify-between">
                <span>Contrôle de stock simple:</span>
                <code className="bg-gray-200 px-2 py-1 rounded">/admin/stock-control</code>
              </div>
              <div className="flex justify-between">
                <span>Contrôle de stock complet:</span>
                <code className="bg-gray-200 px-2 py-1 rounded">/admin/stock-control-full</code>
              </div>
              <div className="flex justify-between">
                <span>Test ultra simple:</span>
                <code className="bg-gray-200 px-2 py-1 rounded">/admin/test-ultra-simple</code>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Si vous voyez cette page, le système fonctionne ! 
              Vous pouvez maintenant accéder aux autres pages admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDirect;
