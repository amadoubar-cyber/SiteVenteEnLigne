import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { CheckCircle, XCircle, Eye, RefreshCw, Clock, AlertTriangle, Package, User, Phone, MapPin } from 'lucide-react';
import { localOrdersAPI } from '../../services/localOrdersAPI';

const OrderApproval = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await localOrdersAPI.getAllOrders();
      if (result.success) {
        setOrders(result.data.orders);
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      setProcessing(prev => ({ ...prev, [orderId]: 'approving' }));
      
      const result = await localOrdersAPI.approveOrder(
        orderId, 
        'Commande approuvée par l\'administrateur'
      );
      
      if (result.success) {
        console.log('✅ Commande approuvée:', orderId);
        
        // Déclencher l'événement pour notifier le client
        const orderApprovedEvent = new CustomEvent('orderApproved', {
          detail: { order: result.data.order }
        });
        window.dispatchEvent(orderApprovedEvent);
        
        // Recharger les commandes
        await loadOrders();
        
        alert('Commande approuvée avec succès ! Le client a été notifié.');
      } else {
        alert('Erreur lors de l\'approbation: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur approbation:', error);
      alert('Erreur lors de l\'approbation de la commande');
    } finally {
      setProcessing(prev => ({ ...prev, [orderId]: null }));
    }
  };

  const handleRejectOrder = async (orderId) => {
    const reason = prompt('Raison du rejet de la commande:');
    if (!reason) return;
    
    try {
      setProcessing(prev => ({ ...prev, [orderId]: 'rejecting' }));
      
      const result = await localOrdersAPI.rejectOrder(orderId, reason);
      
      if (result.success) {
        console.log('❌ Commande rejetée:', orderId);
        
        // Déclencher l'événement pour notifier le client
        const orderRejectedEvent = new CustomEvent('orderRejected', {
          detail: { order: result.data.order }
        });
        window.dispatchEvent(orderRejectedEvent);
        
        // Recharger les commandes
        await loadOrders();
        
        alert('Commande rejetée. Le client a été notifié.');
      } else {
        alert('Erreur lors du rejet: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur rejet:', error);
      alert('Erreur lors du rejet de la commande');
    } finally {
      setProcessing(prev => ({ ...prev, [orderId]: null }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending_approval: 'En attente de validation',
      approved: 'Approuvée',
      rejected: 'Rejetée',
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En cours',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    if (status === 'approved' || status === 'delivered') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'rejected') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const pendingOrders = orders.filter(order => order.orderStatus === 'pending_approval');
  const otherOrders = orders.filter(order => order.orderStatus !== 'pending_approval');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📋 Validation des Commandes</h1>
              <p className="mt-2 text-gray-600">
                Gérez et validez les commandes des clients
              </p>
            </div>
            <button
              onClick={loadOrders}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.orderStatus === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.orderStatus === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Commandes en attente */}
        {pendingOrders.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  Commandes en attente de validation ({pendingOrders.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {pendingOrders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-6 bg-yellow-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.orderStatus)}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Commande {order.trackingNumber}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Passée le {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusText(order.orderStatus)}
                        </span>
                      </div>

                      {/* Informations client */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Informations client
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Nom:</strong> {order.user?.firstName} {order.user?.lastName}</p>
                            <p><strong>Email:</strong> {order.user?.email}</p>
                            <p className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {order.shippingAddress?.phone}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Adresse de livraison
                          </h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.shippingAddress?.street}</p>
                            <p>{order.shippingAddress?.city}</p>
                          </div>
                        </div>
                      </div>

                      {/* Articles */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          Articles commandés
                        </h4>
                        <div className="space-y-2">
                          {order.items?.map((item, index) => (
                            <div key={`${order._id}-item-${index}`} className="flex items-center justify-between bg-white p-3 rounded border">
                              <div className="flex items-center space-x-3">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total et actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-lg font-semibold">
                          Total: {formatPrice(order.total || 0)}
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleRejectOrder(order._id)}
                            disabled={processing[order._id]}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                          >
                            {processing[order._id] === 'rejecting' ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            Rejeter
                          </button>
                          <button
                            onClick={() => handleApproveOrder(order._id)}
                            disabled={processing[order._id]}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            {processing[order._id] === 'approving' ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Approuver
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Autres commandes */}
        {otherOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Historique des commandes ({otherOrders.length})
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {otherOrders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.orderStatus)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Commande {order.trackingNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {order.user?.firstName} {order.user?.lastName} - {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusText(order.orderStatus)}
                        </span>
                        <span className="font-semibold">{formatPrice(order.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune commande trouvée
            </h3>
            <p className="text-gray-600">
              Les commandes des clients apparaîtront ici une fois passées.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderApproval;