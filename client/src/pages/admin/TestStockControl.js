import React from 'react';
import { BarChart3, Package, TrendingUp } from 'lucide-react';

const TestStockControl = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
          Test - Contrôle de Stock
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Produits Total</p>
                <p className="text-2xl font-bold text-blue-900">1,247</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Ventes</p>
                <p className="text-2xl font-bold text-green-900">15,750,000 FCFA</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Bénéfice</p>
                <p className="text-2xl font-bold text-orange-900">3,150,000 FCFA</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ Page de Test Fonctionnelle</h3>
          <p className="text-gray-600">
            Cette page de test confirme que la route /admin/stock-control fonctionne correctement.
            La page complète StockControl.js est maintenant accessible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestStockControl;
