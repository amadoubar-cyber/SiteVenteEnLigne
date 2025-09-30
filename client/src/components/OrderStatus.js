import React from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Package, Truck, Home } from 'lucide-react';

const OrderStatus = ({ order }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_approval':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          text: 'En attente d\'approbation',
          description: 'Votre commande est en cours de validation par notre équipe'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Approuvée',
          description: 'Votre commande a été approuvée et sera traitée'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Rejetée',
          description: 'Votre commande a été rejetée'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'En attente',
          description: 'Votre commande est en cours de traitement'
        };
      case 'confirmed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Confirmée',
          description: 'Votre commande a été confirmée'
        };
      case 'processing':
        return {
          icon: Package,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          text: 'En cours',
          description: 'Votre commande est en cours de préparation'
        };
      case 'shipped':
        return {
          icon: Truck,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-100',
          text: 'Expédiée',
          description: 'Votre commande a été expédiée'
        };
      case 'delivered':
        return {
          icon: Home,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Livrée',
          description: 'Votre commande a été livrée'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Annulée',
          description: 'Votre commande a été annulée'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Inconnu',
          description: 'Statut inconnu'
        };
    }
  };

  const statusInfo = getStatusInfo(order?.orderStatus);

  if (!order) {
    return (
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Aucune commande</p>
          <p className="text-xs text-gray-500">Aucune information disponible</p>
        </div>
      </div>
    );
  }

  const Icon = statusInfo.icon;

  return (
    <div className="space-y-4">
      {/* Statut principal */}
      <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
        <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${statusInfo.color}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{statusInfo.text}</p>
          <p className="text-xs text-gray-500">{statusInfo.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            #{order.trackingNumber || order._id}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Messages spéciaux selon le statut */}
      {order.orderStatus === 'pending_approval' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">
                Validation en cours
              </h4>
              <p className="text-sm text-yellow-700 mt-1">
                Notre équipe examine votre commande. Vous recevrez une notification une fois qu'elle sera approuvée.
              </p>
            </div>
          </div>
        </div>
      )}

      {order.orderStatus === 'rejected' && order.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Commande rejetée
              </h4>
              <p className="text-sm text-red-700 mt-1">
                <strong>Raison :</strong> {order.rejectionReason}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Vous pouvez créer une nouvelle commande en corrigeant les problèmes mentionnés.
              </p>
            </div>
          </div>
        </div>
      )}

      {order.orderStatus === 'approved' && order.adminNotes && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-green-800">
                Commande approuvée
              </h4>
              <p className="text-sm text-green-700 mt-1">
                <strong>Note de l'équipe :</strong> {order.adminNotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informations de suivi */}
      {order.orderStatus === 'shipped' && order.trackingNumber && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Truck className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                Suivi de livraison
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                <strong>Numéro de suivi :</strong> {order.trackingNumber}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
