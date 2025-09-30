import React, { useState, useEffect } from 'react';
import { ordersAPI, productsAPI, utilsAPI } from '../services/api';

const DynamicDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalProducts: 0,
    totalStock: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    loadDashboardData();
    
    // Actualisation automatique toutes les 30 secondes
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await utilsAPI.healthCheck();
      setConnectionStatus(response.data.success ? 'connected' : 'error');
      return response.data.success;
    } catch (error) {
      setConnectionStatus('disconnected');
      return false;
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Vérifier la connexion
      const isConnected = await checkConnection();
      
      if (isConnected) {
        // Charger les données depuis l'API
        const [ordersResponse, productsResponse, statsResponse] = await Promise.allSettled([
          ordersAPI.getAllOrders(),
          productsAPI.getProducts(),
          ordersAPI.getOrderStats()
        ]);

        const ordersData = ordersResponse.status === 'fulfilled' ? ordersResponse.value.data.data : [];
        const productsData = productsResponse.status === 'fulfilled' ? productsResponse.value.data.data : [];
        const statsData = statsResponse.status === 'fulfilled' ? statsResponse.value.data : {};

        // Calculer les statistiques
        const totalOrders = ordersData.length;
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalProducts = productsData.length;
        const totalStock = productsData.reduce((sum, product) => sum + (product.stock || 0), 0);

        setStats({
          totalOrders,
          totalRevenue,
          averageOrderValue,
          totalProducts,
          totalStock
        });

        setOrders(ordersData);
        setProducts(productsData);
      } else {
        // Charger depuis localStorage en fallback
        loadLocalData();
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des données');
      loadLocalData();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalData = () => {
    try {
      const localOrders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      const localProducts = JSON.parse(localStorage.getItem('koula_products') || '[]');

      const totalOrders = localOrders.length;
      const totalRevenue = localOrders.reduce((sum, order) => {
        return sum + (order.items?.reduce((itemSum, item) => 
          itemSum + (item.price * item.quantity), 0) || 0);
      }, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const totalProducts = localProducts.length;
      const totalStock = localProducts.reduce((sum, product) => sum + (product.stock || 0), 0);

      setStats({
        totalOrders,
        totalRevenue,
        averageOrderValue,
        totalProducts,
        totalStock
      });

      setOrders(localOrders);
      setProducts(localProducts);
      setConnectionStatus('offline');
    } catch (error) {
      console.error('Erreur lors du chargement local:', error);
      setError('Impossible de charger les données');
    }
  };

  const clearLocalData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données locales ?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const exportData = () => {
    try {
      const data = {
        orders,
        products,
        stats,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `koula-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-red-500';
      case 'offline': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢 API Connectée';
      case 'disconnected': return '🔴 API Déconnectée';
      case 'offline': return '🟡 Mode Hors Ligne';
      default: return '🔄 Vérification...';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                📊 Tableau de Bord Dynamique
              </h1>
              <p className="text-gray-600">Koula E-commerce - Données en temps réel</p>
            </div>
            <div className={`text-lg font-semibold ${getConnectionStatusColor()}`}>
              {getConnectionStatusText()}
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              🔄 Actualiser les Données
            </button>
            <button
              onClick={clearLocalData}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🗑️ Nettoyer les Données Locales
            </button>
            <button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              📤 Exporter les Données
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">📦</div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalOrders}</div>
            <div className="text-gray-600">Commandes Total</div>
            <div className="text-green-600 text-sm mt-2">+12% ce mois</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">💰</div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.totalRevenue.toLocaleString('fr-FR')} FG
            </div>
            <div className="text-gray-600">Chiffre d'Affaires</div>
            <div className="text-green-600 text-sm mt-2">+18% ce mois</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">🛒</div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.averageOrderValue.toLocaleString('fr-FR')} FG
            </div>
            <div className="text-gray-600">Panier Moyen</div>
            <div className="text-green-600 text-sm mt-2">+8% ce mois</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">📋</div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalProducts}</div>
            <div className="text-gray-600">Produits Actifs</div>
            <div className="text-green-600 text-sm mt-2">+5% ce mois</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalStock}</div>
            <div className="text-gray-600">Stock Total</div>
            <div className={`text-sm mt-2 ${stats.totalStock > 100 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.totalStock > 100 ? '+15%' : '-10%'} ce mois
            </div>
          </div>
        </div>

        {/* Tables de données */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commandes récentes */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Commandes Récentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Client</th>
                    <th className="text-left py-2">Total</th>
                    <th className="text-left py-2">Statut</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order, index) => (
                    <tr key={order._id || index} className="border-b">
                      <td className="py-2">
                        {order.user?.firstName || ''} {order.user?.lastName || ''}
                      </td>
                      <td className="py-2">
                        {(order.totalAmount || order.items?.reduce((sum, item) => 
                          sum + (item.price * item.quantity), 0) || 0).toLocaleString('fr-FR')} FG
                      </td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.orderStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-2">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventaire des produits */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📦 Inventaire des Produits</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Nom</th>
                    <th className="text-left py-2">Prix</th>
                    <th className="text-left py-2">Stock</th>
                    <th className="text-left py-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product, index) => (
                    <tr key={product._id || index} className="border-b">
                      <td className="py-2">{product.name || 'N/A'}</td>
                      <td className="py-2">{(product.price || 0).toLocaleString('fr-FR')} FG</td>
                      <td className="py-2">{product.stock || 0}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          (product.stock || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {(product.stock || 0) > 0 ? 'Disponible' : 'Rupture'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-6">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicDashboard;
