import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ordersAPI } from '../services/api';
import { Package, MapPin, CreditCard, Calendar, Truck, ArrowLeft } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();

  const { data: orderData, isLoading } = useQuery(
    ['order', id],
    () => ordersAPI.getOrder(id),
    {
      select: (response) => response.data.data.order
    }
  );

  const order = orderData;

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

  const getPaymentMethodText = (method) => {
    const methods = {
      mobile_money: 'Mobile Money',
      orange_money: 'Orange Money',
      card: 'Carte bancaire',
      cash_on_delivery: 'Paiement à la livraison'
    };
    return methods[method] || method;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Commande non trouvée
          </h2>
          <Link to="/orders" className="btn btn-primary">
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/orders"
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux commandes
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Commande #{order.orderNumber}
              </h1>
              <p className="text-secondary-600">
                Passée le {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                {getStatusText(order.orderStatus)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="card p-6">
              <div className="flex items-center mb-6">
                <Package className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold">Articles commandés</h2>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-lg">
                    <img
                      src={item.product?.images?.[0]?.url || '/placeholder-product.svg'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-secondary-900">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-sm text-secondary-600">
                        Prix unitaire: {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-secondary-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-6">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-xl font-semibold">Adresse de livraison</h2>
              </div>

              <div className="space-y-2">
                <p className="font-medium text-secondary-900">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-secondary-700">{order.shippingAddress.street}</p>
                <p className="text-secondary-700">
                  {order.shippingAddress.city}
                  {order.shippingAddress.postalCode && `, ${order.shippingAddress.postalCode}`}
                </p>
                <p className="text-secondary-700">{order.shippingAddress.country}</p>
                <p className="text-secondary-700">{order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Notes de commande</h2>
                <p className="text-secondary-700">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Résumé de la commande</h2>

              {/* Order Status Timeline */}
              <div className="mb-6">
                <h3 className="font-medium text-secondary-900 mb-4">Statut de la commande</h3>
                <div className="space-y-3">
                  {[
                    { status: 'pending', label: 'Commande passée', date: order.createdAt },
                    { status: 'confirmed', label: 'Commande confirmée', date: order.orderStatus === 'confirmed' ? order.updatedAt : null },
                    { status: 'processing', label: 'En préparation', date: order.orderStatus === 'processing' ? order.updatedAt : null },
                    { status: 'shipped', label: 'Expédiée', date: order.orderStatus === 'shipped' ? order.updatedAt : null },
                    { status: 'delivered', label: 'Livrée', date: order.deliveredAt }
                  ].map((step, index) => {
                    const isCompleted = order.orderStatus === step.status || 
                      (step.status === 'pending' && order.orderStatus !== 'cancelled') ||
                      (step.status === 'confirmed' && ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.orderStatus)) ||
                      (step.status === 'processing' && ['processing', 'shipped', 'delivered'].includes(order.orderStatus)) ||
                      (step.status === 'shipped' && ['shipped', 'delivered'].includes(order.orderStatus)) ||
                      (step.status === 'delivered' && order.orderStatus === 'delivered');

                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          isCompleted ? 'bg-primary-600' : 'bg-secondary-300'
                        }`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            isCompleted ? 'text-secondary-900' : 'text-secondary-500'
                          }`}>
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="text-xs text-secondary-500">
                              {formatDate(step.date)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Information */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="font-medium text-secondary-900">Paiement</h3>
                </div>
                <p className="text-sm text-secondary-700">
                  {getPaymentMethodText(order.paymentMethod)}
                </p>
                <p className="text-sm text-secondary-700">
                  Statut: {order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                </p>
              </div>

              {/* Tracking Information */}
              {order.trackingNumber && (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <Truck className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="font-medium text-secondary-900">Suivi</h3>
                  </div>
                  <p className="text-sm text-secondary-700 font-mono">
                    {order.trackingNumber}
                  </p>
                  {order.estimatedDelivery && (
                    <p className="text-sm text-secondary-700">
                      Livraison estimée: {formatDate(order.estimatedDelivery)}
                    </p>
                  )}
                </div>
              )}

              {/* Order Totals */}
              <div className="space-y-3 pt-6 border-t border-secondary-200">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Livraison</span>
                  <span className="font-medium">{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Taxes</span>
                  <span className="font-medium">{formatPrice(order.tax)}</span>
                </div>
                <hr className="border-secondary-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
