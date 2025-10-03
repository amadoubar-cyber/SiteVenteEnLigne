// Service de notifications pour les commandes
const NOTIFICATIONS_KEY = 'bowoye_notifications';

export const notificationService = {
  // Créer une notification
  createNotification: (type, title, message, orderId) => {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const notification = {
      id: Date.now().toString(),
      type, // 'order_validated', 'order_rejected', 'order_created'
      title,
      message,
      orderId,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(notification); // Ajouter au début
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    
    // Déclencher une notification navigateur si possible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/images/products/logo/logo-koula.jpg'
      });
    }
    
    return notification;
  },

  // Récupérer toutes les notifications
  getNotifications: () => {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  },

  // Marquer une notification comme lue
  markAsRead: (notificationId) => {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: () => {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  },

  // Compter les notifications non lues
  getUnreadCount: () => {
    const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    return notifications.filter(n => !n.read).length;
  },

  // Demander la permission pour les notifications
  requestPermission: async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
};

export default notificationService;
