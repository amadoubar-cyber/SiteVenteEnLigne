import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ordersAPI } from '../services/api';
import { localOrdersAPI } from '../services/localOrdersAPI';
import { Package, Eye, Calendar, MapPin, Phone, Mail, ShoppingCart, CreditCard, User, FileText } from 'lucide-react';
import Invoice from '../components/Invoice';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const { data: ordersData, isLoading } = useQuery(
    'my-orders',
    async () => {
      try {
        // Essayer d'abord l'API locale
        const localData = await localOrdersAPI.getMyOrders();
        return localData;
      } catch (error) {
        console.error('Erreur API locale:', error);
        // Si l'API locale échoue, essayer l'API serveur
        const serverResponse = await ordersAPI.getMyOrders();
        return serverResponse.data.data;
      }
    },
    {
      select: (response) => {
        // Si c'est l'API locale, retourner directement
        if (response.orders) {
          return response.orders;
        }
        // Si c'est l'API serveur, extraire data.data.orders
        return response.orders;
      }
    }
  );

  const orders = ordersData || [];

  const handleShowInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const handleCloseInvoice = () => {
    setSelectedOrder(null);
    setShowInvoice(false);
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
      month: 'long',
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
      processing: 'En cours de traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Commandes
          </h1>
          <p className="text-gray-600">
            Suivez l'état de vos commandes
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Aucune commande
            </h2>
            <p className="text-gray-600 mb-8">
              Vous n'avez pas encore passé de commande
            </p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Découvrir nos Produits
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Commande #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Passée le {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {getStatusText(order.orderStatus)}
                    </span>
                    <div className="flex space-x-2">
                      <Link
                        to={`/orders/${order._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les détails
                      </Link>
                      <button
                        onClick={() => handleShowInvoice(order)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Facture
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Order Items */}
                  <div className="lg:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Articles commandés
                    </h4>
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <img
                            src={item.product?.images?.[0]?.url || '/placeholder-product.svg'}
                            alt={item.product?.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product?.name || 'Produit supprimé'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantité: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-600 text-center py-2">
                          +{order.items.length - 3} autre(s) article(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Contact
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {order.user?.email}
                      </div>
                      {order.shippingAddress?.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {order.shippingAddress.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Livraison
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                        <p>{order.shippingAddress?.street}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                        {order.shippingAddress?.country && (
                          <p>{order.shippingAddress.country}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Paiement
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium text-lg text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-xs">
                          {order.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : 'Payé en ligne'}
                        </p>
                      </div>
                    </div>

                    {order.trackingNumber && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Suivi</h4>
                        <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                          {order.trackingNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de facture */}
      {showInvoice && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="relative">
            <Invoice 
              order={selectedOrder} 
              onClose={handleCloseInvoice} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
