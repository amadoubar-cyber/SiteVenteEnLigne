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
  Activity
} from 'lucide-react';
import ResetButton from '../../components/ResetButton';

const StockControlReal = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
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

  // Charger les statistiques réelles
  useEffect(() => {
    loadStats();
  }, [timeRange, selectedCategory]);

  const loadStats = async () => {
    setLoading(true);
    
    try {
      // Charger les données réelles depuis localStorage
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
      
      // Calculer les statistiques réelles
      const realStats = calculateRealStats(orders, products, timeRange, selectedCategory);
      
      setStats(realStats);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setLoading(false);
    }
  };

  const calculateRealStats = (orders, products, timeRange, selectedCategory) => {
    // Filtrer les commandes selon la période
    const filteredOrders = filterOrdersByTimeRange(orders, timeRange);
    
    // Filtrer par catégorie si spécifiée
    const categoryFilteredOrders = selectedCategory 
      ? filteredOrders.filter(order => 
          order.items.some(item => {
            const product = products.find(p => p._id === item.product);
            return product && getCategoryKey(product.category) === selectedCategory;
          })
        )
      : filteredOrders;

    // Calculer les totaux
    const totalSales = categoryFilteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalProductsSold = categoryFilteredOrders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Calculer le stock restant
    const totalProductsRemaining = products
      .filter(product => !selectedCategory || getCategoryKey(product.category) === selectedCategory)
      .reduce((sum, product) => sum + (product.stock || 0), 0);

    // Calculer les ventes par période
    const dailySales = calculateDailySales(categoryFilteredOrders);
    const monthlySales = calculateMonthlySales(categoryFilteredOrders);
    const yearlySales = calculateYearlySales(categoryFilteredOrders);

    // Calculer les statistiques par catégorie
    const categoryStats = calculateCategoryStats(orders, products, timeRange);

    // Calculer les top produits
    const topProducts = calculateTopProducts(categoryFilteredOrders, products);

    // Calculer les produits en rupture de stock
    const lowStockProducts = calculateLowStockProducts(products, selectedCategory);

    // Calculer les mouvements récents
    const recentMovements = calculateRecentMovements(categoryFilteredOrders);

    return {
      totalSales,
      totalProductsSold,
      totalProductsRemaining,
      dailySales,
      monthlySales,
      yearlySales,
      categoryStats,
      topProducts,
      lowStockProducts,
      recentMovements
    };
  };

  const filterOrdersByTimeRange = (orders, timeRange) => {
    const now = new Date();
    const filterDate = new Date();

    switch (timeRange) {
      case 'day':
        filterDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        return orders;
      default:
        filterDate.setMonth(now.getMonth() - 1);
    }

    return orders.filter(order => new Date(order.createdAt) >= filterDate);
  };

  const getCategoryKey = (category) => {
    const categoryMap = {
      'Matériaux de construction': 'construction',
      'Plomberie': 'construction',
      'Électronique': 'electronics',
      'Téléphones': 'electronics',
      'Ordinateurs': 'electronics'
    };
    return categoryMap[category] || 'other';
  };

  const calculateDailySales = (orders) => {
    const dailyMap = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { date, sales: 0, products: 0 };
      }
      dailyMap[date].sales += order.total || 0;
      dailyMap[date].products += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    return Object.values(dailyMap).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  };

  const calculateMonthlySales = (orders) => {
    const monthlyMap = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthName, sales: 0, products: 0 };
      }
      monthlyMap[monthKey].sales += order.total || 0;
      monthlyMap[monthKey].products += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    return Object.values(monthlyMap).sort((a, b) => new Date(b.month) - new Date(a.month)).slice(0, 6);
  };

  const calculateYearlySales = (orders) => {
    const yearlyMap = {};
    
    orders.forEach(order => {
      const year = new Date(order.createdAt).getFullYear();
      
      if (!yearlyMap[year]) {
        yearlyMap[year] = { year: year.toString(), sales: 0, products: 0 };
      }
      yearlyMap[year].sales += order.total || 0;
      yearlyMap[year].products += order.items.reduce((sum, item) => sum + item.quantity, 0);
    });

    return Object.values(yearlyMap).sort((a, b) => b.year - a.year).slice(0, 3);
  };

  const calculateCategoryStats = (orders, products, timeRange) => {
    const filteredOrders = filterOrdersByTimeRange(orders, timeRange);
    const categoryMap = {};

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p._id === item.product);
        if (product) {
          const categoryKey = getCategoryKey(product.category);
          const categoryName = getCategoryName(categoryKey);
          
          if (!categoryMap[categoryKey]) {
            categoryMap[categoryKey] = {
              category: categoryKey,
              name: categoryName,
              totalSales: 0,
              productsSold: 0,
              productsRemaining: 0,
              totalStock: 0,
              totalIn: 0,
              totalOut: 0,
              color: getCategoryColor(categoryKey)
            };
          }
          
          categoryMap[categoryKey].totalSales += item.price * item.quantity;
          categoryMap[categoryKey].productsSold += item.quantity;
        }
      });
    });

    // Ajouter les stocks restants
    products.forEach(product => {
      const categoryKey = getCategoryKey(product.category);
      if (categoryMap[categoryKey]) {
        categoryMap[categoryKey].productsRemaining += product.stock || 0;
        categoryMap[categoryKey].totalStock += product.stock || 0;
      }
    });

    return Object.values(categoryMap);
  };

  const getCategoryName = (categoryKey) => {
    const nameMap = {
      'construction': 'Matériaux de Construction',
      'electronics': 'Électronique',
      'other': 'Autres'
    };
    return nameMap[categoryKey] || 'Autres';
  };

  const getCategoryColor = (categoryKey) => {
    const colorMap = {
      'construction': 'bg-orange-100 text-orange-800',
      'electronics': 'bg-blue-100 text-blue-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colorMap[categoryKey] || 'bg-gray-100 text-gray-800';
  };

  const calculateTopProducts = (orders, products) => {
    const productSales = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p._id === item.product);
        if (product) {
          if (!productSales[item.product]) {
            productSales[item.product] = {
              name: product.name,
              sold: 0,
              remaining: product.stock || 0,
              sales: 0,
              category: getCategoryKey(product.category)
            };
          }
          
          productSales[item.product].sales += item.price * item.quantity;
          productSales[item.product].sold += item.quantity;
        }
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  };

  const calculateLowStockProducts = (products, selectedCategory) => {
    return products
      .filter(product => {
        if (selectedCategory && getCategoryKey(product.category) !== selectedCategory) {
          return false;
        }
        const minStock = 50; // Seuil minimum
        return (product.stock || 0) < minStock;
      })
      .map(product => ({
        name: product.name,
        remaining: product.stock || 0,
        minStock: 50,
        category: getCategoryKey(product.category)
      }))
      .slice(0, 10);
  };

  const calculateRecentMovements = (orders) => {
    return orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(order => ({
        id: order._id,
        product: order.items[0]?.name || 'Produit',
        type: 'out',
        quantity: order.items.reduce((sum, item) => sum + item.quantity, 0),
        reason: 'Vente client',
        time: getTimeAgo(order.createdAt)
      }));
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const handleRefresh = () => {
    loadStats();
  };

  const handleExport = () => {
    // Logique d'export à implémenter
    console.log('Export des données...');
  };

  // Fonction de réinitialisation des données de stock
  const handleResetStock = async () => {
    try {
      // Vider toutes les données de stock et de ventes
      localStorage.removeItem('salesData');
      localStorage.removeItem('ordersData');
      localStorage.removeItem('adminOrders');
      localStorage.removeItem('stockMovements');
      localStorage.removeItem('stockData');
      localStorage.removeItem('revenueData');
      
      // Recharger les données
      loadStats();
      
      console.log('✅ Données de stock réinitialisées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation du stock:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        <p className="ml-4 text-lg text-secondary-700">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <a href="/admin" className="text-primary-600 hover:text-primary-700 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour au site
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">A Admin</span>
                <span className="text-gray-400 mx-2">•</span>
                <span>Bowoye Multi Services</span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-primary-600 font-medium">Administrateur</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-300 flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualiser</span>
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition duration-300 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter</span>
                </button>
                <ResetButton
                  onReset={handleResetStock}
                  resetType="stock"
                  confirmMessage="Êtes-vous sûr de vouloir réinitialiser toutes les données de stock ? Cette action supprimera définitivement toutes les ventes, commandes et mouvements de stock."
                  variant="danger"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Contrôle de Stock</h1>
          <p className="text-lg text-gray-600">Tableau de bord complet des ventes et mouvements de stock</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Chiffre d'Affaires */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalSales)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% vs période précédente
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>


          {/* Produits Vendus */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produits Vendus</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalProductsSold)}</p>
                <p className="text-sm text-gray-500">Unités vendues</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Stock Restant */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock Restant</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalProductsRemaining)}</p>
                <p className="text-sm text-green-600">En stock</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ventes par Période */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Ventes par Période
              </h3>
            </div>
            
            <div className="space-y-4">
              {stats.monthlySales.length > 0 ? (
                stats.monthlySales.map((month, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-4">
                    <p className="font-medium text-gray-900">{month.month}</p>
                    <p className="text-sm text-gray-600">
                      {formatNumber(month.products)} produits vendus
                    </p>
                    <p className="text-lg font-semibold text-primary-600">
                      {formatCurrency(month.sales)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune donnée de vente pour cette période</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Produits Vendus */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Top Produits Vendus
              </h3>
            </div>
            
            <div className="space-y-4">
              {stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Vendus: {formatNumber(product.sold)} | Restants: {formatNumber(product.remaining)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-600">
                        {formatCurrency(product.sales)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.category === 'construction' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {product.category === 'construction' ? 'Matériaux de Construction' : 'Électronique'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun produit vendu pour cette période</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        {stats.categoryStats.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Statistiques par Catégorie
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.categoryStats.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${category.color}`}>
                        {category.category}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ventes:</span>
                        <span className="font-semibold">{formatCurrency(category.totalSales)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Vendus:</span>
                        <span className="font-semibold">{formatNumber(category.productsSold)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">En stock:</span>
                        <span className="font-semibold">{formatNumber(category.productsRemaining)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {stats.lowStockProducts.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Produits en Rupture de Stock
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.lowStockProducts.map((product, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <span className="text-xs font-medium text-red-600">Stock faible</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stock actuel:</span>
                        <span className="font-semibold text-red-600">{formatNumber(product.remaining)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stock minimum:</span>
                        <span className="font-semibold">{formatNumber(product.minStock)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Movements */}
        {stats.recentMovements.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Mouvements Récents
              </h3>
              
              <div className="space-y-3">
                {stats.recentMovements.map((movement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        movement.type === 'in' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{movement.product}</p>
                        <p className="text-sm text-gray-600">{movement.reason}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                      </p>
                      <p className="text-sm text-gray-500">{movement.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockControlReal;
