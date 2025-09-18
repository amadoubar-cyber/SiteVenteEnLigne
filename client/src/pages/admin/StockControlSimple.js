import React from 'react';
import { BarChart3, Package, TrendingUp, DollarSign } from 'lucide-react';

const StockControlSimple = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
          Contrôle de Stock - Version Simple
        </h1>
        
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-semibold text-green-900 mb-2">✅ Page Fonctionnelle !</h2>
          <p className="text-green-800">
            Cette page confirme que la route /admin/stock-control fonctionne correctement.
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold text-gray-900">15,750,000 FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bénéfice Net</p>
                <p className="text-2xl font-bold text-gray-900">3,150,000 FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produits Vendus</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock Restant</p>
                <p className="text-2xl font-bold text-gray-900">2,156</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques par catégorie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Matériaux de Construction</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Chiffre d'affaires:</span>
                <span className="font-semibold">8,750,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bénéfice:</span>
                <span className="font-semibold text-green-600">1,750,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Produits vendus:</span>
                <span className="font-semibold">856</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock restant:</span>
                <span className="font-semibold">1,245</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Produits Électroniques</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Chiffre d'affaires:</span>
                <span className="font-semibold">7,000,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bénéfice:</span>
                <span className="font-semibold text-green-600">1,400,000 FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Produits vendus:</span>
                <span className="font-semibold">391</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock restant:</span>
                <span className="font-semibold">911</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Fonctionnalités Disponibles</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Métriques de ventes par jour, mois et année</li>
            <li>Calcul des bénéfices et marges</li>
            <li>Produits vendus et restants par catégorie</li>
            <li>Alertes de stock faible</li>
            <li>Mouvements de stock récents</li>
            <li>Filtres par période et catégorie</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockControlSimple;
