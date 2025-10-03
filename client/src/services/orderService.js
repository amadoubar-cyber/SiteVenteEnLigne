// Service de gestion des commandes avec validation
import notificationService from './notificationService';

const ORDERS_KEY = 'bowoye_orders';

export const orderService = {
  // Créer une nouvelle commande
  createOrder: async (orderData) => {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const newOrder = {
        _id: Date.now().toString(),
        orderNumber: `CMD-${Date.now()}`,
        ...orderData,
        status: 'pending', // En attente de validation
        validated: false, // Pas encore validée par l'admin
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      orders.unshift(newOrder);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      
      // Créer une notification pour l'admin
      notificationService.createNotification(
        'order_created',
        'Nouvelle commande reçue',
        `Commande ${newOrder.orderNumber} de ${newOrder.customerName}`,
        newOrder._id
      );
      
      console.log('✅ Commande créée:', newOrder.orderNumber);
      return { success: true, order: newOrder };
    } catch (error) {
      console.error('❌ Erreur création commande:', error);
      return { success: false, error: error.message };
    }
  },

  // Valider une commande (admin)
  validateOrder: async (orderId) => {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const orderIndex = orders.findIndex(o => o._id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Commande non trouvée');
      }
      
      const order = orders[orderIndex];
      order.status = 'validated';
      order.validated = true;
      order.validatedAt = new Date().toISOString();
      order.updatedAt = new Date().toISOString();
      
      orders[orderIndex] = order;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      
      // Créer une notification pour le client
      notificationService.createNotification(
        'order_validated',
        'Commande validée !',
        `Votre commande ${order.orderNumber} a été validée. Vous pouvez maintenant télécharger votre facture.`,
        orderId
      );
      
      console.log('✅ Commande validée:', order.orderNumber);
      return { success: true, order };
    } catch (error) {
      console.error('❌ Erreur validation commande:', error);
      return { success: false, error: error.message };
    }
  },

  // Rejeter une commande (admin)
  rejectOrder: async (orderId, reason) => {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const orderIndex = orders.findIndex(o => o._id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Commande non trouvée');
      }
      
      const order = orders[orderIndex];
      order.status = 'rejected';
      order.validated = false;
      order.rejectionReason = reason;
      order.updatedAt = new Date().toISOString();
      
      orders[orderIndex] = order;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      
      // Créer une notification pour le client
      notificationService.createNotification(
        'order_rejected',
        'Commande rejetée',
        `Votre commande ${order.orderNumber} a été rejetée. Raison: ${reason}`,
        orderId
      );
      
      console.log('❌ Commande rejetée:', order.orderNumber);
      return { success: true, order };
    } catch (error) {
      console.error('❌ Erreur rejet commande:', error);
      return { success: false, error: error.message };
    }
  },

  // Récupérer toutes les commandes
  getAllOrders: async () => {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      return { success: true, data: orders };
    } catch (error) {
      console.error('❌ Erreur récupération commandes:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Récupérer une commande par ID
  getOrderById: async (orderId) => {
    try {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const order = orders.find(o => o._id === orderId);
      
      if (!order) {
        throw new Error('Commande non trouvée');
      }
      
      return { success: true, data: order };
    } catch (error) {
      console.error('❌ Erreur récupération commande:', error);
      return { success: false, error: error.message };
    }
  },

  // Vérifier si une commande peut être téléchargée
  canDownloadInvoice: async (orderId) => {
    try {
      const result = await orderService.getOrderById(orderId);
      if (!result.success) return false;
      
      const order = result.data;
      return order.validated === true && order.status === 'validated';
    } catch (error) {
      console.error('❌ Erreur vérification téléchargement:', error);
      return false;
    }
  },

  // Générer le PDF de la facture
  generateInvoicePDF: async (orderId) => {
    try {
      const result = await orderService.getOrderById(orderId);
      if (!result.success) {
        throw new Error('Commande non trouvée');
      }
      
      const order = result.data;
      if (!order.validated) {
        throw new Error('Commande non validée - impossible de télécharger la facture');
      }
      
      // Ici vous pouvez intégrer une bibliothèque PDF comme jsPDF
      // Pour l'instant, on retourne les données de la commande
      return { 
        success: true, 
        data: {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          items: order.items,
          total: order.total,
          validatedAt: order.validatedAt,
          createdAt: order.createdAt
        }
      };
    } catch (error) {
      console.error('❌ Erreur génération facture:', error);
      return { success: false, error: error.message };
    }
  }
};

export default orderService;
