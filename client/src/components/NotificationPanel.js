import React, { useState } from 'react';
import { Bell, X, Check, Trash2, Clock, ShoppingCart, Package, AlertCircle } from 'lucide-react';
import NotificationToast from './NotificationToast';
import useNotifications from '../hooks/useNotifications';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotifications();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Si c'est une notification de commande, rediriger vers la gestion des commandes
    if (notification.type === 'order' && notification.orderId) {
      // Vous pouvez ajouter une redirection ici si nécessaire
      console.log('Redirection vers la commande:', notification.orderId);
    }
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau de notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          {/* En-tête */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {unreadCount} non lues
                </span>
              )}
            </h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800"
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
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatTime(notification.timestamp)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pied de page */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={clearAllNotifications}
                className="flex items-center text-sm text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notifications toast (pour les nouvelles notifications) */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications
          .filter(n => !n.read && new Date(n.timestamp) > new Date(Date.now() - 10000)) // Afficher seulement les 10 dernières secondes
          .slice(0, 3) // Maximum 3 notifications toast
          .map((notification) => (
            <NotificationToast
              key={notification.id}
              id={notification.id}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              duration={5000}
              onClose={(id) => markAsRead(id)}
            />
          ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
