import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { localOrdersAPI } from '../services/localOrdersAPI';
import useClientNotifications from '../hooks/useClientNotifications';
import { Download, Eye, CheckCircle, XCircle, Clock, RefreshCw, Bell, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientOrdersTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { notifications, addNotification, unreadCount } = useClientNotifications();

  const loadOrders = async () => {
    setLoading(true);
    try {
      if (!user) {
        console.log('User not logged in');
        setOrders([]);
        return;
      }

      const result = await localOrdersAPI.getMyOrders(user.email || user._id);
      if (result.success) {
        setOrders(result.data.orders);
        console.log('📦 Commandes chargées:', result.data.orders.length);
      } else {
        console.error('Erreur chargement commandes:', result.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadOrders();

    // Écouter les événements de changement de statut
    const handleOrderApproved = (event) => {
      const { order } = event.detail;
      console.log('🎉 Commande approuvée reçue:', order._id);
      
      if (order.user.email === user.email || order.user.id === user.id) {
        loadOrders();
        addNotification({
          type: 'success',
          title: 'Commande Approuvée ! 🎉',
          message: `Votre commande ${order.trackingNumber} a été approuvée. Vous pouvez maintenant télécharger votre facture.`,
          orderId: order._id
        });
      }
    };

    const handleOrderRejected = (event) => {
      const { order } = event.detail;
      console.log('❌ Commande rejetée reçue:', order._id);
      
      if (order.user.email === user.email || order.user.id === user.id) {
        loadOrders();
        addNotification({
          type: 'error',
          title: 'Commande Rejetée',
          message: `Votre commande ${order.trackingNumber} a été rejetée. ${order.rejectionReason ? 'Raison: ' + order.rejectionReason : ''}`,
          orderId: order._id
        });
      }
    };

    window.addEventListener('orderApproved', handleOrderApproved);
    window.addEventListener('orderRejected', handleOrderRejected);

    return () => {
      window.removeEventListener('orderApproved', handleOrderApproved);
      window.removeEventListener('orderRejected', handleOrderRejected);
    };
  }, [user, navigate, addNotification]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleDownloadInvoice = async (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) {
      alert('Commande non trouvée');
      return;
    }

    if (order.orderStatus !== 'approved' && order.orderStatus !== 'delivered') {
      alert('Cette commande n\'est pas encore validée par l\'administrateur.');
      return;
    }

    // Générer les données de la facture
    const invoiceData = {
      orderNumber: order.trackingNumber,
      customerName: `${order.user.firstName} ${order.user.lastName}`,
      customerEmail: order.user.email,
      items: order.items,
      total: order.total,
      approvedAt: order.approvedAt,
      createdAt: order.createdAt
    };

    console.log('📄 Facture générée:', invoiceData);
    alert(`Facture pour la commande ${order.trackingNumber} téléchargée !`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_approval': return 'En attente d\'approbation';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
                <p className="mt-2 text-gray-600">
                  Gérez et suivez l'état de vos commandes
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Indicateur de notifications */}
                {notifications && notifications.length > 0 && (
                  <div className="relative">
                    <Bell className="h-6 w-6 text-blue-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </div>
                )}
                
                {/* Bouton d'actualisation */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Actualisation...' : 'Actualiser'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FileText className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune commande
                </h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas encore passé de commande.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Commencer mes achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.orderStatus)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande {order.trackingNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Articles</p>
                        <p className="text-sm text-gray-600">{order.items?.length || 0} produit(s)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total</p>
                        <p className="text-sm text-gray-600 font-semibold">
                          {order.total?.toLocaleString('fr-FR')} GNF
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Statut</p>
                        <p className="text-sm text-gray-600">
                          {order.orderStatus === 'approved' || order.orderStatus === 'delivered' 
                            ? 'Facture disponible' 
                            : order.orderStatus === 'rejected' 
                            ? 'Commande rejetée' 
                            : 'En attente de validation admin'}
                        </p>
                      </div>
                    </div>

                    {order.orderStatus === 'rejected' && order.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Raison du rejet:</strong> {order.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Voir les détails</span>
                      </button>

                      <div className="flex space-x-3">
                        {/* Bouton de téléchargement de facture */}
                        {order.orderStatus === 'approved' || order.orderStatus === 'delivered' ? (
                          <button
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Télécharger la facture</span>
                          </button>
                        ) : order.orderStatus === 'rejected' ? (
                          <div className="flex items-center space-x-2 text-red-400 px-4 py-2">
                            <XCircle className="h-4 w-4" />
                            <span>Commande rejetée</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-yellow-400 px-4 py-2">
                            <Clock className="h-4 w-4" />
                            <span>En attente de validation admin</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Notifications */}
        {notifications.length > 0 && (
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${
                    notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
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

export default ClientOrdersTest;
