import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Calendar,
  BarChart3,
  PieChart,
  Filter,
  Download,
  RefreshCw,
  Eye,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity
} from 'lucide-react';

const StockControl = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalProductsSold: 0,
    totalProductsRemaining: 0,
    dailySales: [],
    monthlySales: [],
    yearlySales: [],
    categoryStats: [],
    topProducts: [],
    lowStockProducts: [],
    recentMovements: []
  });

  const categories = [
    { value: '', label: 'Toutes les catégories', color: 'bg-gray-100 text-gray-800' },
    { value: 'construction', label: 'Matériaux de Construction', color: 'bg-orange-100 text-orange-800' },
    { value: 'electronics', label: 'Électronique', color: 'bg-blue-100 text-blue-800' }
  ];

  const timeRanges = [
    { value: 'day', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'year', label: 'Cette année' },
    { value: 'all', label: 'Tout le temps' }
  ];

  // Données de test
  useEffect(() => {
    loadStats();
  }, [timeRange, selectedCategory]);

  const loadStats = async () => {
    setLoading(true);
    
    // Simulation de données - à remplacer par des appels API réels
    const mockStats = {
      totalSales: 15750000, // 15,750,000 FG
      totalProfit: 3150000, // 3,150,000 FG (20% de marge)
      totalProductsSold: 1247,
      totalProductsRemaining: 2156,
      dailySales: [
        { date: '2024-01-15', sales: 450000, profit: 90000, products: 23 },
        { date: '2024-01-14', sales: 380000, profit: 76000, products: 19 },
        { date: '2024-01-13', sales: 520000, profit: 104000, products: 28 },
        { date: '2024-01-12', sales: 290000, profit: 58000, products: 15 },
        { date: '2024-01-11', sales: 610000, profit: 122000, products: 31 }
      ],
      monthlySales: [
        { month: 'Janvier 2024', sales: 15750000, profit: 3150000, products: 1247 },
        { month: 'Décembre 2023', sales: 14200000, profit: 2840000, products: 1123 },
        { month: 'Novembre 2023', sales: 13800000, profit: 2760000, products: 1089 }
      ],
      yearlySales: [
        { year: '2024', sales: 15750000, profit: 3150000, products: 1247 },
        { year: '2023', sales: 145000000, profit: 29000000, products: 12567 },
        { year: '2022', sales: 128000000, profit: 25600000, products: 11234 }
      ],
      categoryStats: [
        {
          category: 'construction',
          name: 'Matériaux de Construction',
          totalSales: 8750000,
          totalProfit: 1750000,
          productsSold: 856,
          productsRemaining: 1245,
          totalStock: 1050, // Stock total en unités
          totalIn: 1200, // Entrées totales
          totalOut: 344, // Sorties totales
          color: 'bg-orange-100 text-orange-800'
        },
        {
          category: 'electronics',
          name: 'Électronique',
          totalSales: 7000000,
          totalProfit: 1400000,
          productsSold: 391,
          productsRemaining: 911,
          totalStock: 48, // Stock total en unités
          totalIn: 65, // Entrées totales
          totalOut: 17, // Sorties totales
          color: 'bg-blue-100 text-blue-800'
        }
      ],
      topProducts: [
        { name: 'Ciment Portland 50kg', sold: 156, remaining: 44, sales: 3900000, category: 'construction' },
        { name: 'Samsung Galaxy S24', sold: 23, remaining: 2, sales: 19550000, category: 'electronics' },
        { name: 'Tuyau PVC 100mm', sold: 89, remaining: 111, sales: 1335000, category: 'construction' },
        { name: 'iPhone 15 Pro', sold: 12, remaining: 3, sales: 14400000, category: 'electronics' },
        { name: 'Câble électrique 2.5mm', sold: 234, remaining: 266, sales: 1872000, category: 'construction' }
      ],
      lowStockProducts: [
        { name: 'Samsung Galaxy S24', remaining: 2, minStock: 10, category: 'electronics' },
        { name: 'iPhone 15 Pro', remaining: 3, minStock: 5, category: 'electronics' },
        { name: 'Ciment Portland 50kg', remaining: 44, minStock: 50, category: 'construction' }
      ],
      recentMovements: [
        { id: 1, product: 'Ciment Portland 50kg', type: 'out', quantity: 25, reason: 'Vente client', time: 'Il y a 2h' },
        { id: 2, product: 'Samsung Galaxy S24', type: 'in', quantity: 10, reason: 'Réception commande', time: 'Il y a 4h' },
        { id: 3, product: 'Tuyau PVC 100mm', type: 'out', quantity: 15, reason: 'Vente client', time: 'Il y a 6h' }
      ]
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  const getCurrentPeriodData = () => {
    switch (timeRange) {
      case 'day':
        return stats.dailySales.slice(0, 1);
      case 'week':
        return stats.dailySales.slice(0, 7);
      case 'month':
        return stats.monthlySales.slice(0, 1);
      case 'year':
        return stats.yearlySales.slice(0, 1);
      default:
        return stats.yearlySales;
    }
  };

  const getFilteredStats = () => {
    if (!selectedCategory) return stats;
    
    return {
      ...stats,
      categoryStats: stats.categoryStats.filter(cat => cat.category === selectedCategory),
      topProducts: stats.topProducts.filter(prod => prod.category === selectedCategory),
      lowStockProducts: stats.lowStockProducts.filter(prod => prod.category === selectedCategory)
    };
  };

  const filteredStats = getFilteredStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contrôle de Stock</h1>
          <p className="text-gray-600 mt-1">Tableau de bord complet des ventes et mouvements de stock</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadStats}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredStats.totalSales)}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(filteredStats.totalProfit)}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatNumber(filteredStats.totalProductsSold)}</p>
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
              <p className="text-2xl font-bold text-gray-900">{formatNumber(filteredStats.totalProductsRemaining)}</p>
              <p className="text-sm text-orange-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                En stock
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventes par période */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Ventes par Période
          </h3>
          <div className="space-y-3">
            {getCurrentPeriodData().map((period, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {period.date || period.month || period.year}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatNumber(period.products)} produits vendus
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(period.sales)}</p>
                  <p className="text-sm text-green-600">+{formatCurrency(period.profit)} bénéfice</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top produits */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Top Produits Vendus
          </h3>
          <div className="space-y-3">
            {filteredStats.topProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Vendus: {product.sold} | Restants: {product.remaining}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(product.sales)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${categories.find(c => c.value === product.category)?.color || 'bg-gray-100 text-gray-800'}`}>
                    {categories.find(c => c.value === product.category)?.label || product.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistiques par catégorie avec quantités détaillées */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Performance par Catégorie - Quantités Détaillées
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredStats.categoryStats.map((category, index) => (
            <div key={index} className="p-6 border rounded-lg bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">Mouvements et quantités</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                  {category.category}
                </span>
              </div>
              
              {/* Métriques financières */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(category.totalSales)}</div>
                  <div className="text-sm text-gray-600">Chiffre d'affaires</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(category.totalProfit)}</div>
                  <div className="text-sm text-gray-600">Bénéfice</div>
                </div>
              </div>

              {/* Quantités de stock */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  Mouvements de Stock
                </h5>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <div className="text-xl font-bold text-green-600">+{formatNumber(category.totalIn)}</div>
                    <div className="text-xs text-gray-600">Entrées</div>
                  </div>
                  <div className="text-center p-3 bg-red-100 rounded-lg">
                    <div className="text-xl font-bold text-red-600">-{formatNumber(category.totalOut)}</div>
                    <div className="text-xs text-gray-600">Sorties</div>
                  </div>
                  <div className="text-center p-3 bg-blue-100 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{formatNumber(category.totalStock)}</div>
                    <div className="text-xs text-gray-600">Stock actuel</div>
                  </div>
                </div>

                {/* Détails des produits */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{formatNumber(category.productsSold)}</div>
                    <div className="text-sm text-gray-600">Produits vendus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{formatNumber(category.productsRemaining)}</div>
                    <div className="text-sm text-gray-600">Produits restants</div>
                  </div>
                </div>
                
                {/* Barre de progression pour le stock */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Niveau de stock</span>
                    <span>{Math.round((category.totalStock / (category.totalIn + category.totalOut)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${category.category === 'construction' ? 'bg-orange-500' : 'bg-blue-500'}`}
                      style={{ width: `${(category.totalStock / (category.totalIn + category.totalOut)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Résumé des mouvements */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Résumé des mouvements :</div>
                  <div className="text-xs text-gray-500">
                    {category.totalIn > category.totalOut ? 
                      `Excédent de ${formatNumber(category.totalIn - category.totalOut)} unités` :
                      `Déficit de ${formatNumber(category.totalOut - category.totalIn)} unités`
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes stock faible */}
      {filteredStats.lowStockProducts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center text-yellow-800">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alertes Stock Faible
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStats.lowStockProducts.map((product, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${categories.find(c => c.value === product.category)?.color || 'bg-gray-100 text-gray-800'}`}>
                    {categories.find(c => c.value === product.category)?.label || product.category}
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
      )}

      {/* Mouvements récents */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Mouvements Récents
        </h3>
        <div className="space-y-3">
          {filteredStats.recentMovements.map((movement, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {movement.type === 'in' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{movement.product}</p>
                  <p className="text-sm text-gray-600">{movement.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                </p>
                <p className="text-sm text-gray-500">{movement.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Chargement des données...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockControl;
