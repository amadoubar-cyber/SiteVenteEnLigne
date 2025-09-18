import React from 'react';
import { ShoppingCart } from 'lucide-react';

const TestSales = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 flex items-center mb-6">
        <ShoppingCart className="h-8 w-8 mr-3" />
        Test - Gestion des Ventes
      </h1>
      
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        ✅ La page de gestion des ventes est accessible !
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Informations de test :</h2>
        <ul className="space-y-2">
          <li>• Route : /admin/sales</li>
          <li>• Composant : SalesManagement</li>
          <li>• Statut : Fonctionnel</li>
          <li>• Prochaine étape : Accéder à la vraie page</li>
        </ul>
      </div>
      
      <div className="mt-6">
        <a 
          href="/admin/sales" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Aller à la Gestion des Ventes
        </a>
      </div>
    </div>
  );
};

export default TestSales;
