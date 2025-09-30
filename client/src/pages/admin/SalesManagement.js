import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Clock, 
  MapPin, 
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import ResetButton from '../../components/ResetButton';
import useRealtimeSync from '../../hooks/useRealtimeSync';

const SalesManagement = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: ''
  });

  // Synchronisation en temps réel
  const { forceSync } = useRealtimeSync('salesManagement', (eventType, data) => {
    console.log('🔄 SalesManagement synchronisé:', eventType, data);
    
    // Recharger les données si nécessaire
    if (eventType === 'orderApproved' || eventType === 'orderRejected' || eventType === 'newOrderCreated') {
      loadSalesData();
    }
  });

  // Données de test
  useEffect(() => {
    loadSalesData();
  }, [selectedDate, filters]);

  const loadSalesData = async () => {
    setLoading(true);
    
    try {
      // Charger les commandes depuis localStorage (clé 'clientOrders')
      let ordersData = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      
      // Convertir les commandes en format de ventes pour l'affichage
      let salesData = ordersData.map(order => {
        // Pour chaque commande, créer une vente par produit
        return order.items.map(item => ({
          _id: `${order._id}_${item.product}`,
          productName: item.name || 'Produit non spécifié',
          customerName: `${order.user.firstName} ${order.user.lastName}`,
          customerPhone: order.user.phone || 'Non spécifié',
          customerAddress: `${order.shippingAddress.street}, ${order.shippingAddress.city}`,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
          productCategory: 'construction', // Par défaut, peut être amélioré
          status: order.orderStatus === 'pending' ? 'pending' : 
                 order.orderStatus === 'confirmed' ? 'confirmed' :
                 order.orderStatus === 'shipped' ? 'shipped' :
                 order.orderStatus === 'delivered' ? 'delivered' : 'pending',
          soldAt: order.createdAt,
          createdAt: order.createdAt,
          orderNumber: order.trackingNumber,
          delivery: {
            address: `${order.shippingAddress.street}, ${order.shippingAddress.city}`,
            city: order.shippingAddress.city,
            deliveryPrice: order.shippingCost || 0,
            status: order.orderStatus === 'shipped' ? 'shipped' :
                   order.orderStatus === 'delivered' ? 'delivered' : 'pending'
          },
          payment: {
            method: order.paymentMethod || 'mobile_money',
            status: order.orderStatus === 'delivered' ? 'paid' : 'pending',
            amount: item.price * item.quantity
          },
          notes: order.notes || '',
          orderId: order._id
        }));
      }).flat(); // Aplatir le tableau de tableaux
      
      console.log('📊 Commandes chargées:', ordersData.length);
      console.log('📊 Ventes converties:', salesData.length);
      
      // Calculer les statistiques réelles
      const totalSales = salesData.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
      const totalOrders = salesData.length;
      const totalQuantity = salesData.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
      const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
      
      // Statistiques par catégorie
      const byCategory = {};
      salesData.forEach(sale => {
        const categoryKey = sale.productCategory === 'Matériaux de Construction' ? 'construction' : 'electronics';
        if (!byCategory[categoryKey]) {
          byCategory[categoryKey] = { sales: 0, orders: 0, quantity: 0 };
        }
        byCategory[categoryKey].sales += sale.totalPrice || 0;
        byCategory[categoryKey].quantity += sale.quantity || 0;
        byCategory[categoryKey].orders += 1;
      });
      
      // Statistiques par statut
      const byStatus = {};
      salesData.forEach(sale => {
        const status = sale.status || 'pending';
        byStatus[status] = (byStatus[status] || 0) + 1;
      });

      const realStats = {
        totalSales,
        totalOrders,
        totalQuantity,
        averageOrderValue,
        byCategory,
        byStatus
      };

      setSales(salesData);
      setStats(realStats);
      
      console.log('✅ Statistiques calculées:', realStats);
    } catch (error) {
      console.error('Erreur lors du chargement des données de vente:', error);
      setSales([]);
      setStats({
        totalSales: 0,
        totalOrders: 0,
        totalQuantity: 0,
        averageOrderValue: 0,
        byCategory: {},
        byStatus: {}
      });
    }
    
    setLoading(false);
  };

  // Fonction pour créer des données de test réalistes
  const createTestSalesData = () => {
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const sales = [];
    const today = new Date();
    
    // Clients réalistes
    const customers = [
      { name: 'Fatou Camara', phone: '+224 123 456 789', address: 'Conakry, Guinée' },
      { name: 'Mamadou Diallo', phone: '+224 987 654 321', address: 'Kankan, Guinée' },
      { name: 'Aminata Traoré', phone: '+224 555 123 456', address: 'Labé, Guinée' },
      { name: 'Ibrahima Barry', phone: '+224 777 888 999', address: 'N\'Zérékoré, Guinée' },
      { name: 'Mariama Keita', phone: '+224 333 222 111', address: 'Boké, Guinée' }
    ];
    
    // Statuts possibles
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    const deliveryStatuses = ['pending', 'preparing', 'shipped', 'delivered'];
    const paymentStatuses = ['pending', 'paid'];
    const paymentMethods = ['mobile_money', 'cash', 'bank_transfer'];
    
    // Créer des ventes pour les 7 derniers jours
    for (let i = 0; i < 15; i++) {
      const saleDate = new Date(today);
      saleDate.setDate(saleDate.getDate() - Math.floor(Math.random() * 7));
      
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)] || { name: 'Produit Test', price: 50000, category: 'Test' };
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = product.price || 50000;
      const totalPrice = unitPrice * quantity;
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const deliveryStatus = deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      const sale = {
        _id: `sale_${Date.now()}_${i}`,
        productName: product.name || 'Produit Test',
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        productCategory: product.category || 'Test',
        status: status,
        soldAt: saleDate.toISOString(),
        createdAt: saleDate.toISOString(),
        delivery: {
          address: customer.address,
          city: customer.address.split(',')[1]?.trim() || 'Conakry',
          deliveryPrice: Math.floor(Math.random() * 10000) + 5000, // 5000-15000 FG
          status: deliveryStatus
        },
        payment: {
          method: paymentMethod,
          status: paymentStatus,
          amount: totalPrice
        },
        notes: `Vente ${status} - ${customer.name}`,
        orderNumber: `CMD-${saleDate.getFullYear()}${String(saleDate.getMonth() + 1).padStart(2, '0')}${String(saleDate.getDate()).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`
      };
      
      sales.push(sale);
    }
    
    return sales;
  };

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString('fr-FR')} FG`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDeliveryStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-orange-100 text-orange-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />
    };
    return icons[status] || <AlertCircle className="h-4 w-4" />;
  };

  // Fonctions de gestion des ventes
  const handleEditSale = (saleId) => {
    console.log('Modifier la vente:', saleId);
    // TODO: Implémenter la modification de vente
    console.log('Fonction de modification en cours de développement');
  };

  const handleDeleteSale = (saleId) => {
    const updatedSales = sales.filter(sale => sale._id !== saleId);
    setSales(updatedSales);
    localStorage.setItem('salesData', JSON.stringify(updatedSales));
    
    // Recalculer les statistiques
    const totalSales = updatedSales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
    const totalOrders = updatedSales.length;
    const totalQuantity = updatedSales.reduce((sum, sale) => sum + (sale.quantity || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    
    setStats(prev => ({
      ...prev,
      totalSales,
      totalOrders,
      totalQuantity,
      averageOrderValue
    }));
    
    // Afficher un message de succès discret
    console.log('Vente supprimée avec succès');
  };

  const handleViewSale = (saleId) => {
    const sale = sales.find(s => s._id === saleId);
    if (sale) {
      console.log('Détails de la vente:', sale);
      console.log(`Détails de la vente:\n\nProduit: ${sale.productName}\nClient: ${sale.customerName}\nQuantité: ${sale.quantity}\nPrix total: ${formatCurrency(sale.totalPrice)}\nStatut: ${sale.status}`);
    }
  };

  // Fonction de réinitialisation des données de vente
  const handleResetSales = async () => {
    try {
      // Vider toutes les données de vente
      localStorage.removeItem('salesData');
      localStorage.removeItem('ordersData');
      localStorage.removeItem('adminOrders');
      localStorage.removeItem('revenueData');
      localStorage.removeItem('salesStats');
      
      // Réinitialiser l'état
      setSales([]);
      setStats({
        totalSales: 0,
        totalOrders: 0,
        totalQuantity: 0,
        averageOrderValue: 0,
        byCategory: {},
        byStatus: {}
      });
      
      console.log('✅ Données de vente réinitialisées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      throw error;
    }
  };

  const filteredSales = sales.filter(sale => {
    if (filters.status !== 'all' && sale.status !== filters.status) return false;
    if (filters.category !== 'all' && sale.productCategory !== filters.category) return false;
    if (filters.search && !(sale.productName || '').toLowerCase().includes(filters.search.toLowerCase()) && 
        !(sale.customerName || '').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3 text-blue-600" />
            Gestion des Ventes
          </h1>
          <p className="text-gray-600 mt-1">
            Suivi en temps réel des ventes et livraisons
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => navigate('/admin/sales/create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Vente
          </button>
          <ResetButton
            onReset={handleResetSales}
            resetType="ventes"
            confirmMessage="Êtes-vous sûr de vouloir réinitialiser toutes les données de vente ? Cette action supprimera définitivement toutes les ventes, commandes et statistiques."
            variant="danger"
          />
        </div>
      </div>

      {/* Statistiques du jour */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSales)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commandes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produits vendus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuantity}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Panier moyen</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="shipped">Expédié</option>
              <option value="delivered">Livré</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              <option value="construction">Matériaux de Construction</option>
              <option value="electronics">Électronique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Produit ou client..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des ventes */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Ventes du {new Date(selectedDate).toLocaleDateString('fr-FR')}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit & Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité & Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livraison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sale.productName || 'Produit non spécifié'}</div>
                      <div className="text-sm text-gray-500">{sale.customerName || 'Client non spécifié'}</div>
                      <div className="text-xs text-gray-400">{sale.customerPhone || 'Téléphone non spécifié'}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.quantity || 0} unités</div>
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(sale.unitPrice || 0)}/unité</div>
                    <div className="text-sm font-bold text-green-600">{formatCurrency(sale.totalPrice || 0)}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.delivery?.address || 'Non spécifiée'}</div>
                    <div className="text-sm text-gray-500">{sale.delivery?.city || 'Non spécifiée'}</div>
                    <div className="text-xs text-gray-400">
                      {sale.delivery?.deliveryPrice > 0 && `+${formatCurrency(sale.delivery.deliveryPrice)}`}
                    </div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeliveryStatusColor(sale.delivery?.status || 'pending')}`}>
                        {getStatusIcon(sale.delivery?.status || 'pending')}
                        <span className="ml-1">{sale.delivery?.status || 'En attente'}</span>
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{sale.payment?.method?.replace('_', ' ') || 'Non spécifié'}</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(sale.payment?.status || 'pending')}`}>
                        {sale.payment?.status || 'En attente'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sale.status || 'pending')}`}>
                      {getStatusIcon(sale.status || 'pending')}
                      <span className="ml-1">{sale.status || 'En attente'}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(sale.soldAt || sale.createdAt || new Date())}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewSale(sale._id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditSale(sale._id)}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Modifier la vente"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSale(sale._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Supprimer la vente"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune vente trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune vente ne correspond aux critères sélectionnés.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesManagement;
