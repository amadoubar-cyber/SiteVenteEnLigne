import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import { Eye, Edit, Package, User, MapPin, Phone, Mail, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: ordersData, isLoading } = useQuery(
    ['admin-orders', { page: currentPage, status: statusFilter }],
    () => ordersAPI.getAllOrders({
      page: currentPage,
      limit: 10,
      status: statusFilter
    }),
    {
      select: (response) => response.data.data
    }
  );

  const updateStatusMutation = useMutation(
    ({ orderId, statusData }) => ordersAPI.updateOrderStatus(orderId, statusData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-orders');
        toast.success('Statut mis à jour avec succès');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
      }
    }
  );

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || {};

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

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({
      orderId,
      statusData: { orderStatus: newStatus }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Commandes
          </h1>
          <p className="text-gray-600">
            Gérez et suivez les commandes de vos clients
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrer par statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="processing">En cours</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Effacer le filtre
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Commandes ({pagination.totalOrders || 0})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune commande trouvée
              </h3>
              <p className="text-gray-600">
                Les commandes apparaîtront ici une fois passées
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Adresse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Articles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items.length} article(s)
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.firstName} {order.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user?.email}
                          </div>
                          {order.shippingAddress?.phone && (
                            <div className="text-sm text-gray-600 flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {order.shippingAddress.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {order.shippingAddress ? (
                            <div className="text-sm text-gray-600">
                              <div className="font-medium">{order.shippingAddress.street}</div>
                              <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
                              {order.shippingAddress.country && (
                                <div>{order.shippingAddress.country}</div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 italic">
                              Adresse non fournie
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.items?.length} article(s)
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.items?.reduce((sum, item) => sum + item.quantity, 0)} unités
                          </div>
                          {order.items?.slice(0, 1).map((item, index) => (
                            <div key={index} className="text-xs text-gray-600 mt-1">
                              • {item.product?.name || 'Produit supprimé'} (x{item.quantity})
                            </div>
                          ))}
                          {order.items?.length > 1 && (
                            <div className="text-xs text-gray-500">
                              +{order.items.length - 1} autre(s)
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(order.total)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : 'Payé'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(order.orderStatus)}`}
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="processing">En cours</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Affichage de {((pagination.currentPage - 1) * 10) + 1} à{' '}
                      {Math.min(pagination.currentPage * 10, pagination.totalOrders)} sur{' '}
                      {pagination.totalOrders} résultats
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => setCurrentPage(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
