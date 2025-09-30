import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  DollarSign,
  Eye,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { localOrdersAPI } from '../../services/localOrdersAPI';
import useNotifications from '../../hooks/useNotifications';
import useRealtimeSync from '../../hooks/useRealtimeSync';

const OrderApproval = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const { forceSync } = useRealtimeSync('orderApproval', (eventType, data) => {
    console.log('🔄 OrderApproval synchronisé:', eventType, data);
    // Rafraîchir la liste des commandes en attente
    if (eventType === 'orderApproved' || eventType === 'orderRejected') {
      refetch();
    }
  });

  // Charger toutes les commandes (en attente + historique)
  const { data: allOrders, isLoading, refetch } = useQuery(
    'all-orders-history',
    () => localOrdersAPI.getAllOrders(),
    {
      select: (response) => response.data.orders,
      refetchInterval: 5000, // Actualiser toutes les 5 secondes
      staleTime: 1000
    }
  );

  // Filtrer les commandes selon le statut sélectionné
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredOrders = allOrders?.filter(order => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return order.orderStatus === 'pending_approval';
    if (statusFilter === 'approved') return order.orderStatus === 'approved';
    if (statusFilter === 'rejected') return order.orderStatus === 'rejected';
    return true;
  }) || [];

  const pendingOrders = allOrders?.filter(order => order.orderStatus === 'pending_approval') || [];

  // Mutation pour approuver une commande
  const approveOrderMutation = useMutation(
    ({ orderId, notes }) => localOrdersAPI.approveOrder(orderId, notes),
    {
      onSuccess: (response) => {
        addNotification({
          type: 'success',
          title: 'Commande Approuvée',
          message: `Commande #${response.data.order.trackingNumber} approuvée avec succès`
        });
        
        // Invalider les caches
        queryClient.invalidateQueries('pending-approval-orders');
        queryClient.invalidateQueries('admin-order-stats');
        queryClient.invalidateQueries('admin-products');
        queryClient.invalidateQueries('admin-recent-orders');
        
        // Forcer la synchronisation globale
        forceSync();
        
        setShowApprovalModal(false);
        setAdminNotes('');
        setSelectedOrder(null);
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Erreur',
          message: error.message || 'Erreur lors de l\'approbation de la commande'
        });
      }
    }
  );

  // Mutation pour rejeter une commande
  const rejectOrderMutation = useMutation(
    ({ orderId, reason }) => localOrdersAPI.rejectOrder(orderId, reason),
    {
      onSuccess: (response) => {
        addNotification({
          type: 'warning',
          title: 'Commande Rejetée',
          message: `Commande #${response.data.order.trackingNumber} rejetée`
        });
        
        // Invalider les caches
        queryClient.invalidateQueries('pending-approval-orders');
        queryClient.invalidateQueries('admin-order-stats');
        queryClient.invalidateQueries('admin-products');
        queryClient.invalidateQueries('admin-recent-orders');
        
        // Forcer la synchronisation globale
        forceSync();
        
        setShowRejectionModal(false);
        setRejectionReason('');
        setSelectedOrder(null);
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Erreur',
          message: error.message || 'Erreur lors du rejet de la commande'
        });
      }
    }
  );

  const formatPrice = (price) => {
    return `${(price || 0).toLocaleString('fr-FR')} FG`;
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

  const handleApprove = () => {
    if (!selectedOrder) return;
    setIsProcessing(true);
    approveOrderMutation.mutate({
      orderId: selectedOrder._id,
      notes: adminNotes
    }, {
      onSettled: () => setIsProcessing(false)
    });
  };

  const handleReject = () => {
    if (!selectedOrder) return;
    setIsProcessing(true);
    rejectOrderMutation.mutate({
      orderId: selectedOrder._id,
      reason: rejectionReason
    }, {
      onSettled: () => setIsProcessing(false)
    });
  };

  const openApprovalModal = (order) => {
    setSelectedOrder(order);
    setAdminNotes('');
    setShowApprovalModal(true);
  };

  const openRejectionModal = (order) => {
    setSelectedOrder(order);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const getOrderTotal = (order) => {
    return order.items?.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0) || 0;
  };

  if (isLoading) {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestion des Commandes
              </h1>
              <p className="text-gray-600">
                Validez les commandes et consultez l'historique complet
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {pendingOrders?.length || 0} en attente
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {allOrders?.length || 0} total
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filtrer par statut :</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes ({allOrders?.length || 0})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En Attente ({pendingOrders?.length || 0})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approuvées ({allOrders?.filter(o => o.orderStatus === 'approved').length || 0})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejetées ({allOrders?.filter(o => o.orderStatus === 'rejected').length || 0})
              </button>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === 'all' ? 'Aucune commande' : 
               statusFilter === 'pending' ? 'Aucune commande en attente' :
               statusFilter === 'approved' ? 'Aucune commande approuvée' :
               statusFilter === 'rejected' ? 'Aucune commande rejetée' :
               'Aucune commande trouvée'}
            </h3>
            <p className="text-gray-600">
              {statusFilter === 'all' ? 'Aucune commande n\'a été passée' :
               statusFilter === 'pending' ? 'Toutes les commandes ont été traitées' :
               statusFilter === 'approved' ? 'Aucune commande n\'a été approuvée' :
               statusFilter === 'rejected' ? 'Aucune commande n\'a été rejetée' :
               'Aucune commande ne correspond au filtre'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* En-tête de la commande */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande #{order.trackingNumber}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.orderStatus === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                            order.orderStatus === 'approved' ? 'bg-green-100 text-green-800' :
                            order.orderStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.orderStatus === 'pending_approval' ? 'En Attente' :
                             order.orderStatus === 'approved' ? 'Approuvée' :
                             order.orderStatus === 'rejected' ? 'Rejetée' :
                             order.orderStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                          {order.approvedAt && (
                            <span className="ml-2 text-green-600">
                              • Approuvée le {formatDate(order.approvedAt)}
                            </span>
                          )}
                          {order.rejectedAt && (
                            <span className="ml-2 text-red-600">
                              • Rejetée le {formatDate(order.rejectedAt)}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(getOrderTotal(order))}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} article(s)
                        </p>
                      </div>
                    </div>

                    {/* Informations client */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.user?.firstName} {order.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">Client</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.user?.phone}
                          </p>
                          <p className="text-sm text-gray-600">Téléphone</p>
                        </div>
                      </div>
                    </div>

                    {/* Adresse de livraison */}
                    <div className="flex items-start space-x-3 mb-4">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Adresse de livraison</p>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </p>
                      </div>
                    </div>

                    {/* Articles commandés */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Articles commandés</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">{item.name}</span>
                              <span className="text-sm text-gray-600">x{item.quantity}</span>
                            </div>
                            <span className="text-sm font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes du client */}
                    {order.notes && (
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Notes du client</p>
                            <p className="text-sm text-gray-600">{order.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes d'approbation */}
                    {order.adminNotes && (
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Notes d'approbation</p>
                            <p className="text-sm text-gray-600">{order.adminNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Raison de rejet */}
                    {order.rejectionReason && (
                      <div className="mb-4">
                        <div className="flex items-start space-x-3">
                          <XCircle className="h-5 w-5 text-red-400 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">Raison du rejet</p>
                            <p className="text-sm text-gray-600">{order.rejectionReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex flex-col space-y-2">
                    {order.orderStatus === 'pending_approval' ? (
                      <>
                        <button
                          onClick={() => openApprovalModal(order)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approuver
                        </button>
                        <button
                          onClick={() => openRejectionModal(order)}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rejeter
                        </button>
                      </>
                    ) : order.orderStatus === 'approved' ? (
                      <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuvée
                      </div>
                    ) : order.orderStatus === 'rejected' ? (
                      <div className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejetée
                      </div>
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg">
                        <Clock className="h-4 w-4 mr-2" />
                        {order.orderStatus}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal d'approbation */}
        {showApprovalModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Approuver la commande #{selectedOrder.trackingNumber}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes d'approbation (optionnel)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Ajoutez des notes pour le client..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isProcessing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Approbation...' : 'Approuver'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de rejet */}
        {showRejectionModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rejeter la commande #{selectedOrder.trackingNumber}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du rejet *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Expliquez pourquoi cette commande est rejetée..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isProcessing}
                >
                  Annuler
                </button>
                <button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Rejet...' : 'Rejeter'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderApproval;
