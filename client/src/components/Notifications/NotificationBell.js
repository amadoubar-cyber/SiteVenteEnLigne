import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import useClientNotifications from '../../hooks/useClientNotifications';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead, unreadCount, addNotification } = useClientNotifications();

  // Écouter les événements de commandes pour mettre à jour les notifications
  useEffect(() => {
    const handleOrderApproved = (event) => {
      const { order } = event.detail;
      console.log('🔔 NotificationBell: Commande approuvée reçue:', order._id);
      
      // Ajouter une notification
      addNotification({
        type: 'success',
        title: 'Commande Approuvée ! 🎉',
        message: `Votre commande ${order.trackingNumber} a été approuvée. Vous pouvez maintenant télécharger votre facture.`,
        orderId: order._id
      });
    };

    const handleOrderRejected = (event) => {
      const { order } = event.detail;
      console.log('🔔 NotificationBell: Commande rejetée reçue:', order._id);
      
      // Ajouter une notification
      addNotification({
        type: 'error',
        title: 'Commande Rejetée',
        message: `Votre commande ${order.trackingNumber} a été rejetée. ${order.rejectionReason ? 'Raison: ' + order.rejectionReason : ''}`,
        orderId: order._id
      });
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('orderApproved', handleOrderApproved);
    window.addEventListener('orderRejected', handleOrderRejected);

    // Nettoyer les écouteurs
    return () => {
      window.removeEventListener('orderApproved', handleOrderApproved);
      window.removeEventListener('orderRejected', handleOrderRejected);
    };
  }, [addNotification]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_validated':
        return '✅';
      case 'order_rejected':
        return '❌';
      case 'order_created':
        return '🆕';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'order_validated':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'order_rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'order_created':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications ({unreadCount})
            </h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Tout marquer comme lu
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border mb-2 transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 border-gray-100' 
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Marquer comme lu"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        notification.read ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
