// Service de synchronisation en temps réel
class SyncService {
  constructor() {
    this.listeners = new Map();
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // Écouter les événements de validation de commandes
    window.addEventListener('orderApproved', this.handleOrderApproved.bind(this));
    window.addEventListener('orderRejected', this.handleOrderRejected.bind(this));
    window.addEventListener('newOrderCreated', this.handleNewOrderCreated.bind(this));
    
    // Écouter les changements de stock
    window.addEventListener('stockUpdated', this.handleStockUpdated.bind(this));
    window.addEventListener('productUpdated', this.handleProductUpdated.bind(this));
    
    this.isInitialized = true;
    console.log('🔄 Service de synchronisation initialisé');
  }

  // Gérer l'approbation d'une commande
  handleOrderApproved(event) {
    const order = event.detail.order;
    console.log('✅ Commande approuvée, synchronisation en cours...', order._id);
    
    // Créer des mouvements de stock pour les articles vendus
    this.createStockMovements(order);
    
    // Déclencher la synchronisation globale
    this.triggerSync('orderApproved', { order });
    
    // Mettre à jour les statistiques
    this.updateStats();
  }

  // Gérer le rejet d'une commande
  handleOrderRejected(event) {
    const order = event.detail.order;
    console.log('❌ Commande rejetée, synchronisation en cours...', order._id);
    
    // Déclencher la synchronisation globale
    this.triggerSync('orderRejected', { order });
    
    // Mettre à jour les statistiques
    this.updateStats();
  }

  // Gérer une nouvelle commande
  handleNewOrderCreated(event) {
    const order = event.detail.order;
    console.log('📦 Nouvelle commande créée, synchronisation en cours...', order._id);
    
    // Déclencher la synchronisation globale
    this.triggerSync('newOrderCreated', { order });
    
    // Mettre à jour les statistiques
    this.updateStats();
  }

  // Gérer la mise à jour du stock
  handleStockUpdated(event) {
    const stockData = event.detail;
    console.log('📦 Stock mis à jour, synchronisation en cours...', stockData);
    
    // Déclencher la synchronisation globale
    this.triggerSync('stockUpdated', stockData);
  }

  // Gérer la mise à jour d'un produit
  handleProductUpdated(event) {
    const product = event.detail;
    console.log('🛍️ Produit mis à jour, synchronisation en cours...', product._id);
    
    // Déclencher la synchronisation globale
    this.triggerSync('productUpdated', { product });
  }

  // Créer des mouvements de stock pour une commande approuvée
  createStockMovements(order) {
    if (!order.items || order.items.length === 0) return;

    const movements = [];
    const timestamp = new Date().toISOString();

    order.items.forEach((item, index) => {
      const movement = {
        _id: `sale-${order._id}-${index}-${Date.now()}`,
        productId: item.product,
        productName: item.name,
        type: 'out', // Sortie de stock
        quantity: item.quantity,
        reason: 'Vente approuvée',
        category: 'construction', // Par défaut, peut être amélioré
        notes: `Vente à ${order.user?.firstName} ${order.user?.lastName}`,
        date: timestamp,
        createdAt: timestamp,
        orderId: order._id,
        orderNumber: order.trackingNumber,
        customerName: `${order.user?.firstName} ${order.user?.lastName}`,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity
      };

      movements.push(movement);
    });

    // Sauvegarder les mouvements
    this.saveStockMovements(movements);
    
    // Mettre à jour les stocks des produits
    this.updateProductStocks(order.items);
    
    // Déclencher l'événement de mise à jour du stock
    window.dispatchEvent(new CustomEvent('stockUpdated', {
      detail: { movements, order }
    }));
  }

  // Sauvegarder les mouvements de stock
  saveStockMovements(newMovements) {
    try {
      const existingMovements = JSON.parse(localStorage.getItem('stockMovements') || '[]');
      const updatedMovements = [...newMovements, ...existingMovements];
      localStorage.setItem('stockMovements', JSON.stringify(updatedMovements));
      console.log('📦 Mouvements de stock sauvegardés:', newMovements.length);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des mouvements:', error);
    }
  }

  // Mettre à jour les stocks des produits
  updateProductStocks(items) {
    try {
      const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
      
      items.forEach(item => {
        const productIndex = products.findIndex(p => p._id === item.product);
        if (productIndex !== -1) {
          const currentStock = products[productIndex].stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          products[productIndex].stock = newStock;
          products[productIndex].updatedAt = new Date().toISOString();
        }
      });

      localStorage.setItem('koula_products', JSON.stringify(products));
      console.log('📦 Stocks des produits mis à jour');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des stocks:', error);
    }
  }

  // Mettre à jour les statistiques
  updateStats() {
    try {
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      const products = JSON.parse(localStorage.getItem('koula_products') || '[]');
      const movements = JSON.parse(localStorage.getItem('stockMovements') || '[]');

      // Calculer les statistiques
      const stats = {
        totalOrders: orders.length,
        pendingApprovalOrders: orders.filter(o => o.orderStatus === 'pending_approval').length,
        approvedOrders: orders.filter(o => o.orderStatus === 'approved').length,
        rejectedOrders: orders.filter(o => o.orderStatus === 'rejected').length,
        deliveredOrders: orders.filter(o => o.orderStatus === 'delivered').length,
        totalRevenue: orders
          .filter(o => o.orderStatus === 'delivered')
          .reduce((sum, o) => sum + (o.items?.reduce((itemSum, item) => 
            itemSum + (item.price * item.quantity), 0) || 0), 0),
        totalProducts: products.length,
        totalStockMovements: movements.length,
        totalStockIn: movements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0),
        totalStockOut: movements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0)
      };

      // Sauvegarder les statistiques
      localStorage.setItem('adminStats', JSON.stringify(stats));
      
      // Déclencher l'événement de mise à jour des statistiques
      window.dispatchEvent(new CustomEvent('statsUpdated', {
        detail: { stats }
      }));

      console.log('📊 Statistiques mises à jour:', stats);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des statistiques:', error);
    }
  }

  // Déclencher la synchronisation globale
  triggerSync(eventType, data) {
    // Notifier tous les composants enregistrés
    this.listeners.forEach((callback, componentId) => {
      try {
        callback(eventType, data);
      } catch (error) {
        console.error(`❌ Erreur dans le composant ${componentId}:`, error);
      }
    });

    // Déclencher l'événement global de synchronisation
    window.dispatchEvent(new CustomEvent('globalSync', {
      detail: { eventType, data, timestamp: new Date().toISOString() }
    }));
  }

  // Enregistrer un composant pour la synchronisation
  subscribe(componentId, callback) {
    this.listeners.set(componentId, callback);
    console.log(`🔄 Composant ${componentId} enregistré pour la synchronisation`);
  }

  // Désenregistrer un composant
  unsubscribe(componentId) {
    this.listeners.delete(componentId);
    console.log(`🔄 Composant ${componentId} désenregistré de la synchronisation`);
  }

  // Forcer la synchronisation de tous les composants
  forceSync() {
    console.log('🔄 Synchronisation forcée de tous les composants');
    this.updateStats();
    this.triggerSync('forceSync', {});
  }

  // Obtenir les statistiques actuelles
  getStats() {
    try {
      return JSON.parse(localStorage.getItem('adminStats') || '{}');
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      return {};
    }
  }
}

// Créer une instance globale
const syncService = new SyncService();

export default syncService;
