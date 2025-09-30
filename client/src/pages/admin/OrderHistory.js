import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  DollarSign,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  MessageSquare
} from 'lucide-react';
import { localOrdersAPI } from '../../services/localOrdersAPI';
import useRealtimeSync from '../../hooks/useRealtimeSync';

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Synchronisation en temps réel
  const { forceSync } = useRealtimeSync('orderHistory', (eventType, data) => {
    console.log('🔄 OrderHistory synchronisé:', eventType, data);
    if (eventType === 'orderApproved' || eventType === 'orderRejected' || eventType === 'newOrderCreated') {
      refetch();
    }
  });

  // Charger toutes les commandes
  const { data: allOrders, isLoading, refetch } = useQuery(
    'all-orders-history',
    () => localOrdersAPI.getAllOrders(),
    {
      select: (response) => response.data.orders,
      refetchInterval: 10000, // Actualiser toutes les 10 secondes
      staleTime: 5000
    }
  );

  // Filtrer et trier les commandes
  const filteredOrders = allOrders?.filter(order => {
    // Filtre par statut
    if (statusFilter !== 'all' && order.orderStatus !== statusFilter) {
      return false;
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      
      if (dateFilter === 'today') {
        return orderDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= monthAgo;
      }
    }

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.trackingNumber.toLowerCase().includes(searchLower) ||
        `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase().includes(searchLower) ||
        order.user?.phone?.includes(searchTerm) ||
        order.items?.some(item => item.name.toLowerCase().includes(searchLower))
      );
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'amount') {
      return getOrderTotal(b) - getOrderTotal(a);
    } else if (sortBy === 'status') {
      return a.orderStatus.localeCompare(b.orderStatus);
    }
    return 0;
  }) || [];

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

  const getOrderTotal = (order) => {
    return order.items?.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0) || 0;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_approval':
        return { color: 'yellow', text: 'En Attente', icon: Clock };
      case 'approved':
        return { color: 'green', text: 'Approuvée', icon: CheckCircle };
      case 'rejected':
        return { color: 'red', text: 'Rejetée', icon: XCircle };
      default:
        return { color: 'gray', text: status, icon: AlertTriangle };
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Numéro', 'Client', 'Téléphone', 'Total', 'Statut', 'Date', 'Articles'],
      ...filteredOrders.map(order => [
        order.trackingNumber,
        `${order.user?.firstName} ${order.user?.lastName}`,
        order.user?.phone || '',
        getOrderTotal(order),
        getStatusInfo(order.orderStatus).text,
        formatDate(order.createdAt),
        order.items?.map(item => `${item.name} (x${item.quantity})`).join(', ') || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
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
                Historique des Commandes
              </h1>
              <p className="text-gray-600">
                Consultez l'historique complet de toutes les commandes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {filteredOrders.length} commande(s)
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter CSV
              </button>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Numéro, client, téléphone..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending_approval">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
            </div>

            {/* Filtre par date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>

            {/* Tri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date (récent)</option>
                <option value="amount">Montant (élevé)</option>
                <option value="status">Statut</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune commande trouvée
            </h3>
            <p className="text-gray-600">
              Aucune commande ne correspond aux critères de recherche
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.orderStatus);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* En-tête de la commande */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            #{order.trackingNumber}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                            statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            <StatusIcon className="h-3 w-3 inline mr-1" />
                            {statusInfo.text}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {formatPrice(getOrderTotal(order))}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Informations client */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                        <div className="flex items-center space-x-3">
                          <Package className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.items?.length || 0} article(s)
                            </p>
                            <p className="text-sm text-gray-600">Articles</p>
                          </div>
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

                      {/* Notes et raisons */}
                      {(order.notes || order.adminNotes || order.rejectionReason) && (
                        <div className="space-y-2">
                          {order.notes && (
                            <div className="flex items-start space-x-3">
                              <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                              <div>
                                <p className="font-medium text-gray-900">Notes du client</p>
                                <p className="text-sm text-gray-600">{order.notes}</p>
                              </div>
                            </div>
                          )}
                          {order.adminNotes && (
                            <div className="flex items-start space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                              <div>
                                <p className="font-medium text-gray-900">Notes d'approbation</p>
                                <p className="text-sm text-gray-600">{order.adminNotes}</p>
                              </div>
                            </div>
                          )}
                          {order.rejectionReason && (
                            <div className="flex items-start space-x-3">
                              <XCircle className="h-5 w-5 text-red-400 mt-1" />
                              <div>
                                <p className="font-medium text-gray-900">Raison du rejet</p>
                                <p className="text-sm text-gray-600">{order.rejectionReason}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
