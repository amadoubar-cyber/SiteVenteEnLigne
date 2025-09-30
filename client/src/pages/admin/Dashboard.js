import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ordersAPI, productsAPI } from '../../services/api';
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import ResetButton from '../../components/ResetButton';
import NotificationPanel from '../../components/NotificationPanel';
import useNotifications from '../../hooks/useNotifications';
import useRealtimeSync from '../../hooks/useRealtimeSync';

const AdminDashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { notifyNewOrder } = useNotifications();
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [syncCount, setSyncCount] = useState(0);

  // Synchronisation en temps réel
  const { forceSync, getStats } = useRealtimeSync('dashboard', (eventType, data) => {
    console.log('🔄 Dashboard synchronisé:', eventType, data);
    setSyncCount(prev => prev + 1);
    
    // Forcer le rafraîchissement des données
    if (eventType === 'orderApproved' || eventType === 'orderRejected' || eventType === 'newOrderCreated') {
      refetchOrderStats();
      refetchProducts();
      refetchOrders();
    }
  });

  // Détecter les nouvelles commandes et envoyer des notifications
  useEffect(() => {
    const checkForNewOrders = () => {
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      const currentOrderCount = orders.length;
      
      if (currentOrderCount > lastOrderCount && lastOrderCount > 0) {
        // Nouvelles commandes détectées
        const newOrders = orders.slice(0, currentOrderCount - lastOrderCount);
        newOrders.forEach(order => {
          notifyNewOrder(order);
        });
      }
      
      setLastOrderCount(currentOrderCount);
    };

    // Écouter les événements de nouvelle commande
    const handleNewOrder = (event) => {
      const order = event.detail.order;
      notifyNewOrder(order);
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('newOrderCreated', handleNewOrder);

    // Vérifier immédiatement
    checkForNewOrders();

    // Vérifier toutes les 5 secondes (moins fréquent car on a les événements)
    const interval = setInterval(checkForNewOrders, 5000);

    return () => {
      window.removeEventListener('newOrderCreated', handleNewOrder);
      clearInterval(interval);
    };
  }, [lastOrderCount, notifyNewOrder]);

  const { data: orderStats, refetch: refetchOrderStats } = useQuery(
    'admin-order-stats',
    () => {
      // Charger les commandes depuis localStorage
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      
      // Calculer les statistiques réelles
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => {
        const orderTotal = order.items?.reduce((itemSum, item) => 
          itemSum + (item.price * item.quantity), 0) || 0;
        return sum + orderTotal;
      }, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      console.log('📊 Statistiques calculées:', {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        orders: orders.map(o => ({
          id: o._id,
          total: o.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
          status: o.orderStatus
        }))
      });
      
      // Statistiques par statut
      const statusCounts = {};
      orders.forEach(order => {
        const status = order.orderStatus || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      return Promise.resolve({
        data: {
          data: {
            overview: {
              totalOrders,
              totalRevenue,
              averageOrderValue,
              statusCounts
            }
          }
        }
      });
    },
    {
      select: (response) => response.data.data,
      refetchInterval: 5000, // Actualiser toutes les 5 secondes
      staleTime: 1000 // Considérer les données comme périmées après 1 seconde
    }
  );

  const { data: productsData, refetch: refetchProducts } = useQuery(
    'admin-products',
    () => {
      // Charger depuis localStorage pour une synchronisation immédiate
      const localProducts = JSON.parse(localStorage.getItem('koula_products') || '[]');
      return Promise.resolve({
        data: {
          data: {
            products: localProducts.slice(0, 5)
          }
        }
      });
    },
    {
      select: (response) => response.data.data.products,
      refetchInterval: 3000, // Actualiser toutes les 3 secondes
      staleTime: 1000 // Considérer les données comme périmées après 1 seconde
    }
  );

  const { data: recentOrdersData, refetch: refetchOrders } = useQuery(
    'admin-recent-orders',
    () => {
      // Charger les commandes depuis localStorage
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      
      // Trier par date de création (plus récentes en premier) et limiter à 5
      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      return Promise.resolve({
        data: {
          data: {
            orders: sortedOrders
          }
        }
      });
    },
    {
      select: (response) => response.data.data.orders,
      refetchInterval: 5000, // Actualiser toutes les 5 secondes
      staleTime: 1000 // Considérer les données comme périmées après 1 seconde
    }
  );

  const formatPrice = (price) => {
    return `${(price || 0).toLocaleString('fr-FR')} FG`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-secondary-100 text-secondary-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En cours',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return texts[status] || status;
  };

  const stats = orderStats?.overview || {};
  const recentProducts = productsData || [];
  const recentOrders = recentOrdersData || [];

  // Fonction pour rafraîchir les données
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      // Forcer la synchronisation globale
      forceSync();
      
      // Forcer le rafraîchissement de toutes les requêtes
      await Promise.all([
        refetchProducts(),
        refetchOrderStats(),
        refetchOrders()
      ]);
      console.log('✅ Données rafraîchies avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fonction pour réinitialiser les données
  const handleResetData = async () => {
    try {
      // Supprimer toutes les données localStorage
      localStorage.clear();
      
      // Supprimer toutes les données sessionStorage
      sessionStorage.clear();
      
      // Supprimer les cookies
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Attendre un peu pour que les suppressions prennent effet
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Recharger la page
      window.location.reload(true);
      
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      throw error;
    }
  };


  const renderOverview = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord
              </h1>
              <p className="text-gray-600">
                Vue d'ensemble de votre boutique en ligne
              </p>
            </div>
            
            {/* Boutons d'action dans le tableau de bord */}
            <div className="flex items-center space-x-3">
              {/* Panneau de notifications */}
              <NotificationPanel />
              
              {/* Indicateur de synchronisation */}
              {syncCount > 0 && (
                <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Sync: {syncCount}
                </div>
              )}
              
              <button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </button>
              
              <ResetButton
                onReset={handleResetData}
                resetType="toutes les données"
                confirmMessage="Êtes-vous sûr de vouloir réinitialiser TOUTES les données ? Cette action supprimera définitivement tous les produits, commandes, ventes, utilisateurs et paramètres. Cette action est irréversible !"
                variant="danger"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingApprovalOrders || 0}
                </p>
                <p className="text-xs text-yellow-600">À valider</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentProducts.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Panier moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.averageOrderValue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Commandes récentes
              </h2>
              <a
                href="/admin/orders"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Voir tout
              </a>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune commande récente
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.user?.firstName} {order.user?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Produits récents
              </h2>
              <a
                href="/admin/products"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Voir tout
              </a>
            </div>

            {recentProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun produit récent
              </p>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product._id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={product.images?.[0]?.url || '/placeholder-product.svg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.category?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/admin/products"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Gérer les produits</p>
                  <p className="text-sm text-gray-600">Voir tous les produits</p>
                </div>
              </a>

              <a
                href="/admin/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Gérer les commandes</p>
                  <p className="text-sm text-gray-600">Voir toutes les commandes</p>
                </div>
              </a>

              <a
                href="/admin/categories"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Catégories</p>
                  <p className="text-sm text-gray-600">Gérer les catégories</p>
                </div>
              </a>

              <a
                href="/admin/users"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Utilisateurs</p>
                  <p className="text-sm text-gray-600">Gérer les utilisateurs</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );

  return renderOverview();
};

export default AdminDashboard;
