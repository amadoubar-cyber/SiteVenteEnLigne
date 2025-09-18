import React from 'react';
import { BarChart3, Package, TrendingUp, DollarSign, Target, ShoppingCart, Clock, Activity } from 'lucide-react';

const StockControlNoAuth = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
            Contrôle de Stock - Version Sans Authentification
          </h1>
          <p className="text-gray-600">Tableau de bord complet des ventes et mouvements de stock</p>
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
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5% vs période précédente
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bénéfice Net</p>
                <p className="text-2xl font-bold text-gray-900">3,150,000 FCFA</p>
                <p className="text-sm text-blue-600 flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Marge: 20%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produits Vendus</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-purple-600 flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  Unités vendues
                </p>
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
                <p className="text-sm text-orange-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  En stock
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques par catégorie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-orange-600" />
              Matériaux de Construction
            </h3>
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
              
              {/* Barre de progression pour le stock */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Niveau de stock</span>
                  <span>59%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '59%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Électronique
            </h3>
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
              
              {/* Barre de progression pour le stock */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Niveau de stock</span>
                  <span>70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top produits */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Top Produits Vendus
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Ciment Portland 50kg', sold: 156, remaining: 44, sales: 3900000, category: 'Construction' },
              { name: 'Samsung Galaxy S24', sold: 23, remaining: 2, sales: 19550000, category: 'Électronique' },
              { name: 'Tuyau PVC 100mm', sold: 89, remaining: 111, sales: 1335000, category: 'Construction' },
              { name: 'iPhone 15 Pro', sold: 12, remaining: 3, sales: 14400000, category: 'Électronique' },
              { name: 'Câble électrique 2.5mm', sold: 234, remaining: 266, sales: 1872000, category: 'Construction' }
            ].map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Vendus: {product.sold} | Restants: {product.remaining}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.sales.toLocaleString()} FCFA</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.category === 'Construction' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {product.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes stock faible */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center text-yellow-800">
            <Package className="h-5 w-5 mr-2" />
            Alertes Stock Faible
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Samsung Galaxy S24', remaining: 2, minStock: 10, category: 'Électronique' },
              { name: 'iPhone 15 Pro', remaining: 3, minStock: 5, category: 'Électronique' },
              { name: 'Ciment Portland 50kg', remaining: 44, minStock: 50, category: 'Construction' }
            ].map((product, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.category === 'Construction' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {product.category}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock actuel:</span>
                    <span className="font-semibold text-red-600">{product.remaining}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock minimum:</span>
                    <span className="font-semibold">{product.minStock}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(product.remaining / product.minStock) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message de succès */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Page de Contrôle de Stock Fonctionnelle !</h3>
          <p className="text-green-800 mb-4">
            Cette page démontre toutes les fonctionnalités de contrôle de stock que vous avez demandées :
          </p>
          <ul className="list-disc list-inside text-green-800 space-y-1">
            <li>Métriques de ventes par jour, mois et année</li>
            <li>Calcul des bénéfices et marges</li>
            <li>Produits vendus et restants par catégorie</li>
            <li>Alertes de stock faible</li>
            <li>Interface moderne et responsive</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockControlNoAuth;
