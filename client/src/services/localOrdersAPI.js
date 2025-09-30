// API locale pour les commandes côté client
const LOCAL_ORDERS_KEY = 'clientOrders';

// Simuler un délai de réseau
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Charger les commandes depuis localStorage
const loadOrders = () => {
  try {
    const orders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    return orders;
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error);
    return [];
  }
};

// Sauvegarder les commandes dans localStorage
const saveOrders = (orders) => {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des commandes:', error);
  }
};

// Générer un ID unique pour les commandes
const generateOrderId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Générer un numéro de suivi
const generateTrackingNumber = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let tracking = '';
  
  // 2 lettres
  for (let i = 0; i < 2; i++) {
    tracking += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // 8 chiffres
  for (let i = 0; i < 8; i++) {
    tracking += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return tracking;
};

export const localOrdersAPI = {
  // Créer une nouvelle commande
  createOrder: async (orderData) => {
    await delay(500);
    
    const orders = loadOrders();
    
    // Générer les données de la commande
    const newOrder = {
      _id: generateOrderId(),
      user: {
        id: 'local-user',
        firstName: orderData.shippingAddress.firstName,
        lastName: orderData.shippingAddress.lastName,
        email: 'client@koula.gn',
        phone: orderData.shippingAddress.phone
      },
      items: orderData.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        name: item.name || 'Produit',
        image: item.image || ''
      })),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      notes: orderData.notes || '',
      subtotal: orderData.subtotal || 0,
      shippingCost: 0, // Livraison gratuite
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      orderStatus: 'pending_approval', // Nouvelle commande en attente d'approbation
      trackingNumber: generateTrackingNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Ajouter la commande
    orders.unshift(newOrder);
    saveOrders(orders);
    
    console.log('📦 Commande créée localement:', newOrder._id);
    
    // Déclencher une notification pour l'admin
    try {
      // Créer un événement personnalisé pour notifier l'admin
      const notificationEvent = new CustomEvent('newOrderCreated', {
        detail: { order: newOrder }
      });
      window.dispatchEvent(notificationEvent);
    } catch (error) {
      console.log('Notification non disponible:', error.message);
    }
    
    return {
      success: true,
      data: {
        order: newOrder
      }
    };
  },

  // Récupérer les commandes de l'utilisateur
  getMyOrders: async (filters = {}) => {
    await delay(300);
    
    let orders = loadOrders();
    
    // Filtrer par statut si spécifié
    if (filters.status) {
      orders = orders.filter(order => order.orderStatus === filters.status);
    }
    
    // Trier par date de création (plus récent en premier)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedOrders = orders.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        orders: paginatedOrders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(orders.length / limit),
          totalOrders: orders.length,
          hasNextPage: endIndex < orders.length,
          hasPrevPage: page > 1
        }
      }
    };
  },

  // Récupérer une commande par ID
  getOrderById: async (orderId) => {
    await delay(200);
    
    const orders = loadOrders();
    const order = orders.find(o => o._id === orderId);
    
    if (!order) {
      throw new Error('Commande non trouvée');
    }
    
    return {
      success: true,
      data: {
        order
      }
    };
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (orderId, statusData) => {
    await delay(300);
    
    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o._id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Commande non trouvée');
    }
    
    // Mettre à jour la commande
    orders[orderIndex] = {
      ...orders[orderIndex],
      orderStatus: statusData.orderStatus,
      trackingNumber: statusData.trackingNumber || orders[orderIndex].trackingNumber,
      updatedAt: new Date().toISOString()
    };
    
    saveOrders(orders);
    
    return {
      success: true,
      data: {
        order: orders[orderIndex]
      }
    };
  },

  // Annuler une commande
  cancelOrder: async (orderId) => {
    await delay(300);
    
    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o._id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Commande non trouvée');
    }
    
    // Vérifier que la commande peut être annulée
    const order = orders[orderIndex];
    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      throw new Error('Cette commande ne peut pas être annulée');
    }
    
    // Annuler la commande
    orders[orderIndex] = {
      ...orders[orderIndex],
      orderStatus: 'cancelled',
      updatedAt: new Date().toISOString()
    };
    
    saveOrders(orders);
    
    return {
      success: true,
      data: {
        order: orders[orderIndex]
      }
    };
  },

  // Approuver une commande
  approveOrder: async (orderId, adminNotes = '') => {
    await delay(300);
    
    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o._id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Commande non trouvée');
    }
    
    const order = orders[orderIndex];
    if (order.orderStatus !== 'pending_approval') {
      throw new Error('Cette commande ne peut pas être approuvée');
    }
    
    // Approuver la commande
    orders[orderIndex] = {
      ...order,
      orderStatus: 'approved',
      adminNotes: adminNotes,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveOrders(orders);
    
    // Déclencher une notification
    try {
      const notificationEvent = new CustomEvent('orderApproved', {
        detail: { order: orders[orderIndex] }
      });
      window.dispatchEvent(notificationEvent);
    } catch (error) {
      console.log('Notification non disponible:', error.message);
    }
    
    return {
      success: true,
      data: {
        order: orders[orderIndex]
      }
    };
  },

  // Rejeter une commande
  rejectOrder: async (orderId, rejectionReason = '') => {
    await delay(300);
    
    const orders = loadOrders();
    const orderIndex = orders.findIndex(o => o._id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Commande non trouvée');
    }
    
    const order = orders[orderIndex];
    if (order.orderStatus !== 'pending_approval') {
      throw new Error('Cette commande ne peut pas être rejetée');
    }
    
    // Rejeter la commande
    orders[orderIndex] = {
      ...order,
      orderStatus: 'rejected',
      rejectionReason: rejectionReason,
      rejectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveOrders(orders);
    
    // Déclencher une notification
    try {
      const notificationEvent = new CustomEvent('orderRejected', {
        detail: { order: orders[orderIndex] }
      });
      window.dispatchEvent(notificationEvent);
    } catch (error) {
      console.log('Notification non disponible:', error.message);
    }
    
    return {
      success: true,
      data: {
        order: orders[orderIndex]
      }
    };
  },

  // Obtenir les commandes en attente d'approbation
  getPendingApprovalOrders: async () => {
    await delay(200);
    
    const orders = loadOrders();
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending_approval');
    
    // Trier par date de création (plus récent en premier)
    pendingOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return {
      success: true,
      data: {
        orders: pendingOrders
      }
    };
  },

  // Obtenir toutes les commandes (historique complet)
  getAllOrders: async () => {
    await delay(200);
    
    const orders = loadOrders();
    
    // Trier par date de création (plus récent en premier)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return {
      success: true,
      data: {
        orders: orders
      }
    };
  },

  // Obtenir les statistiques des commandes
  getOrderStats: async () => {
    await delay(200);
    
    const orders = loadOrders();
    
    const stats = {
      totalOrders: orders.length,
      pendingApprovalOrders: orders.filter(o => o.orderStatus === 'pending_approval').length,
      approvedOrders: orders.filter(o => o.orderStatus === 'approved').length,
      rejectedOrders: orders.filter(o => o.orderStatus === 'rejected').length,
      pendingOrders: orders.filter(o => o.orderStatus === 'pending').length,
      confirmedOrders: orders.filter(o => o.orderStatus === 'confirmed').length,
      processingOrders: orders.filter(o => o.orderStatus === 'processing').length,
      shippedOrders: orders.filter(o => o.orderStatus === 'shipped').length,
      deliveredOrders: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelledOrders: orders.filter(o => o.orderStatus === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.orderStatus === 'delivered')
        .reduce((sum, o) => sum + o.total, 0)
    };
    
    return {
      success: true,
      data: {
        stats
      }
    };
  }
};
