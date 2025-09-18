import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ordersAPI } from '../../services/api';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  ShoppingCart, 
  CreditCard,
  Calendar,
  Truck,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: order, isLoading, error } = useQuery(
    ['order-detail', orderId],
    () => ordersAPI.getOrderById(orderId),
    {
      select: (response) => response.data.data
    }
  );

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
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <XCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour aux commandes
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: Package },
    { id: 'customer', name: 'Informations Client', icon: User },
    { id: 'items', name: 'Articles', icon: ShoppingCart },
    { id: 'shipping', name: 'Livraison', icon: Truck }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour aux commandes
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Commande #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-2">
                Passée le {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                <span className="ml-2">{getStatusText(order.orderStatus)}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(order.total)}
                </div>
                <div className="text-sm text-gray-500">
                  {order.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : 'Payé'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Informations générales */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Date de commande</div>
                        <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Méthode de paiement</div>
                        <div className="text-sm text-gray-500">
                          {order.paymentMethod === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Paiement en ligne'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Nombre d'articles</div>
                        <div className="text-sm text-gray-500">
                          {order.items?.reduce((sum, item) => sum + item.quantity, 0)} article(s)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Résumé financier */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé Financier</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sous-total</span>
                      <span className="text-sm font-medium">{formatPrice(order.subtotal || order.total)}</span>
                    </div>
                    {order.shippingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Frais de livraison</span>
                        <span className="text-sm font-medium">{formatPrice(order.shippingCost)}</span>
                      </div>
                    )}
                    {order.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Taxes</span>
                        <span className="text-sm font-medium">{formatPrice(order.tax)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-base font-semibold text-gray-900">Total</span>
                        <span className="text-base font-semibold text-gray-900">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customer' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations du Client</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Contact</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Nom complet</div>
                        <div className="text-sm text-gray-500">
                          {order.user?.firstName} {order.user?.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Email</div>
                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                      </div>
                    </div>
                    {order.shippingAddress?.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Téléphone</div>
                          <div className="text-sm text-gray-500">{order.shippingAddress.phone}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Adresse de livraison</h4>
                  {order.shippingAddress ? (
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Adresse</div>
                          <div className="text-sm text-gray-500">
                            {order.shippingAddress.street}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                            {order.shippingAddress.country && (
                              <>
                                <br />
                                {order.shippingAddress.country}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">Adresse non fournie</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Articles Commandés</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix unitaire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.product?.image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover mr-4"
                                src={item.product.image}
                                alt={item.product.name}
                              />
                            ) : (
                              <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.product?.name || 'Produit supprimé'}
                              </div>
                              {item.product?.category && (
                                <div className="text-sm text-gray-500">
                                  {item.product.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Informations de Livraison</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Adresse de livraison</h4>
                  {order.shippingAddress ? (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-900">{order.shippingAddress.street}</div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </div>
                      {order.shippingAddress.country && (
                        <div className="text-sm text-gray-500">{order.shippingAddress.country}</div>
                      )}
                      {order.shippingAddress.phone && (
                        <div className="text-sm text-gray-500 mt-2">
                          <Phone className="h-4 w-4 inline mr-1" />
                          {order.shippingAddress.phone}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">Adresse non fournie</div>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Statut de livraison</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-2">{getStatusText(order.orderStatus)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {order.orderStatus === 'delivered' 
                        ? 'Commande livrée avec succès'
                        : order.orderStatus === 'shipped'
                        ? 'Commande en cours de livraison'
                        : 'Commande en préparation'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
