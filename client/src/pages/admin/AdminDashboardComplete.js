import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const AdminDashboardComplete = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les données réelles depuis localStorage
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      try {
        // Charger les données réelles depuis localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
        const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
        
        // Calculer les statistiques réelles
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(order => {
          try {
            const orderDate = new Date(order.createdAt);
            if (isNaN(orderDate.getTime())) return false;
            return orderDate.toISOString().split('T')[0] === today;
          } catch (error) {
            return false;
          }
        });
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
        const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total || order.totalAmount || 0), 0);
        
        const pendingOrders = orders.filter(order => 
          (order.status || order.orderStatus) === 'pending' || 
          (order.status || order.orderStatus) === 'En attente'
        ).length;
        
        const completedOrders = orders.filter(order => 
          (order.status || order.orderStatus) === 'delivered' || 
          (order.status || order.orderStatus) === 'Livré'
        ).length;

        setStats({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          todayOrders: todayOrders.length,
          todayRevenue: todayRevenue,
          pendingOrders: pendingOrders,
          completedOrders: completedOrders
        });

        // Commandes récentes (5 dernières)
        const recentOrdersData = orders
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(order => ({
            id: order._id || order.id,
            customer: order.user?.firstName || order.customerName || 'Client',
            amount: order.total || order.totalAmount || 0,
            date: new Date(order.createdAt).toLocaleDateString('fr-FR'),
            status: order.status || order.orderStatus || 'En attente'
          }));

        // Produits récents (5 derniers)
        const recentProductsData = products
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(product => ({
            id: product._id,
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock || 0
          }));

        setRecentOrders(recentOrdersData);
        setRecentProducts(recentProductsData);

      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // En cas d'erreur, garder les valeurs par défaut à 0
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        todayOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0
      });
      setRecentOrders([]);
      setRecentProducts([]);
      }

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString('fr-FR')} FG`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Livré': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre boutique en ligne</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                {stats.totalUsers > 0 ? `${stats.totalUsers} utilisateur${stats.totalUsers > 1 ? 's' : ''}` : 'Aucun utilisateur'}
              </span>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Produits</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                {stats.totalProducts > 0 ? `${stats.totalProducts} produit${stats.totalProducts > 1 ? 's' : ''}` : 'Aucun produit'}
              </span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Commandes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                {stats.totalOrders > 0 ? `${stats.totalOrders} commande${stats.totalOrders > 1 ? 's' : ''}` : 'Aucune commande'}
              </span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">
                {stats.totalRevenue > 0 ? formatCurrency(stats.totalRevenue) : 'Aucun chiffre d\'affaires'}
              </span>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aujourd'hui</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Commandes</span>
                <span className="text-2xl font-bold text-blue-600">{stats.todayOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Chiffre d'affaires</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(stats.todayRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des commandes</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">En attente</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Livrées</span>
                <span className="text-2xl font-bold text-green-600">{stats.completedOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders and Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Commandes récentes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <div key={order.id || order._id || `order-${index}`} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium">
                  Voir toutes les commandes
                </button>
              </div>
            </div>
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Produits récents</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(product.price)}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium">
                  Voir tous les produits
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un produit
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Edit className="h-5 w-5 mr-2" />
              Modifier un produit
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Eye className="h-5 w-5 mr-2" />
              Voir les commandes
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <BarChart3 className="h-5 w-5 mr-2" />
              Voir les rapports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardComplete;
