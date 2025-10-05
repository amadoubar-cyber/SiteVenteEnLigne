import { useState, useEffect, useCallback } from 'react';

const useClientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les notifications depuis localStorage au démarrage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('client_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      } catch (error) {
        console.error('Erreur lors du chargement des notifications client:', error);
      }
    }
  }, []);

  // Sauvegarder les notifications dans localStorage
  const saveNotifications = useCallback((newNotifications) => {
    localStorage.setItem('client_notifications', JSON.stringify(newNotifications));
  }, []);

  // Ajouter une nouvelle notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      type: notification.type || 'info',
      title: notification.title,
      message: notification.message,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Garder seulement les 50 dernières
      saveNotifications(updated);
      return updated;
    });

    setUnreadCount(prev => prev + 1);

    console.log('🔔 Notification client ajoutée:', newNotification);

    // Notification sonore (optionnel)
    if (notification.sound !== false) {
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignorer les erreurs de lecture audio
        });
      } catch (error) {
        // Ignorer les erreurs audio
      }
    }

    return newNotification.id;
  }, [saveNotifications]);

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      saveNotifications(updated);
      return updated;
    });

    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [saveNotifications]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, read: true }));
      saveNotifications(updated);
      return updated;
    });
    setUnreadCount(0);
  }, [saveNotifications]);

  // Supprimer une notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const updated = prev.filter(n => n.id !== notificationId);
      saveNotifications(updated);
      
      // Décrémenter le compteur si la notification n'était pas lue
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return updated;
    });
  }, [saveNotifications]);

  // Supprimer toutes les notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('client_notifications');
  }, []);

  // Notification pour commande approuvée
  const notifyOrderApproved = useCallback((order) => {
    addNotification({
      type: 'success',
      title: 'Commande Approuvée ! 🎉',
      message: `Votre commande ${order.trackingNumber} a été approuvée par l'administrateur. Vous pouvez maintenant télécharger votre facture.`,
      orderId: order._id,
      orderData: order,
      sound: true,
      urgent: true
    });
  }, [addNotification]);

  // Notification pour commande rejetée
  const notifyOrderRejected = useCallback((order) => {
    addNotification({
      type: 'error',
      title: 'Commande Rejetée',
      message: `Votre commande ${order.trackingNumber} a été rejetée. ${order.rejectionReason ? 'Raison: ' + order.rejectionReason : ''}`,
      orderId: order._id,
      orderData: order,
      sound: true,
      urgent: true
    });
  }, [addNotification]);

  // Notification pour changement de statut
  const notifyStatusUpdate = useCallback((order, newStatus) => {
    const statusTexts = {
      'pending_approval': 'En attente de validation',
      'approved': 'Approuvée',
      'rejected': 'Rejetée',
      'processing': 'En cours de traitement',
      'shipped': 'Expédiée',
      'delivered': 'Livrée',
      'cancelled': 'Annulée'
    };

    addNotification({
      type: 'info',
      title: 'Mise à Jour de Commande',
      message: `Votre commande ${order.trackingNumber} est maintenant ${statusTexts[newStatus] || newStatus}`,
      orderId: order._id,
      orderData: order
    });
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    notifyOrderApproved,
    notifyOrderRejected,
    notifyStatusUpdate
  };
};

export default useClientNotifications;
