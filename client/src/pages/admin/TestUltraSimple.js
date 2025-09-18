import React from 'react';

const TestUltraSimple = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          ✅ Test Ultra Simple - Ça marche !
        </h1>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800">
            Si vous voyez cette page, le routage fonctionne correctement.
          </p>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Pages disponibles :</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li><code>/admin/stock-control</code> - Contrôle de stock simple</li>
            <li><code>/admin/stock-control-full</code> - Contrôle de stock complet</li>
            <li><code>/admin/test-stock-control</code> - Test contrôle de stock</li>
            <li><code>/admin/diagnostic</code> - Diagnostic des routes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestUltraSimple;
