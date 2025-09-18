import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  Search,
  Filter,
  Grid,
  List,
  Package,
  ShoppingCart,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import useConfirmation from '../../hooks/useConfirmation';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    items: [{ productId: '', quantity: 1, price: 0 }],
    totalAmount: 0,
    status: 'pending',
    notes: ''
  });
  const { confirmation, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();

  const orderStatuses = [
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'En cours', color: 'bg-orange-100 text-orange-800' },
    { value: 'shipped', label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
    { value: 'delivered', label: 'Livrée', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Annulée', color: 'bg-red-100 text-red-800' }
  ];

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      
      // Charger les produits
      const savedProducts = localStorage.getItem('adminProducts');
      if (savedProducts) {
        const productsData = JSON.parse(savedProducts);
        setProducts(productsData);
      }

      // Charger les commandes
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const ordersData = JSON.parse(savedOrders);
        setOrders(ordersData);
      } else {
        // Données de test
        const testOrders = [
          {
            id: 1,
            orderNumber: 'CMD-2024-001',
            customerName: 'Moussa Diallo',
            customerPhone: '+224 123 456 789',
            customerEmail: 'moussa@email.com',
            customerAddress: 'Conakry, Guinée',
            items: [
              { productId: '1', productName: 'Ciment Portland', quantity: 5, price: 15000, total: 75000 },
              { productId: '2', productName: 'Téléphone Samsung', quantity: 2, price: 250000, total: 500000 }
            ],
            totalAmount: 575000,
            status: 'confirmed',
            notes: 'Livraison urgente demandée',
            createdAt: '2024-01-20',
            updatedAt: '2024-01-20'
          },
          {
            id: 2,
            orderNumber: 'CMD-2024-002',
            customerName: 'Fatou Camara',
            customerPhone: '+224 987 654 321',
            customerEmail: 'fatou@email.com',
            customerAddress: 'Labé, Guinée',
            items: [
              { productId: '2', productName: 'Téléphone Samsung', quantity: 1, price: 250000, total: 250000 }
            ],
            totalAmount: 250000,
            status: 'pending',
            notes: '',
            createdAt: '2024-01-21',
            updatedAt: '2024-01-21'
          }
        ];
        setOrders(testOrders);
        localStorage.setItem('orders', JSON.stringify(testOrders));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'productId') {
      const product = products.find(p => p._id === value);
      if (product) {
        newItems[index].productName = product.name;
        newItems[index].price = product.price;
        newItems[index].total = newItems[index].quantity * product.price;
      }
    } else if (field === 'quantity') {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems,
      totalAmount: newItems.reduce((sum, item) => sum + item.total, 0)
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
      totalAmount: prev.items.filter((_, i) => i !== index).reduce((sum, item) => sum + item.total, 0)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      id: editingOrder ? editingOrder.id : Date.now(),
      orderNumber: editingOrder ? editingOrder.orderNumber : `CMD-2024-${String(Date.now()).slice(-3)}`,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      customerAddress: formData.customerAddress,
      items: formData.items.filter(item => item.productId),
      totalAmount: formData.totalAmount,
      status: formData.status,
      notes: formData.notes,
      createdAt: editingOrder ? editingOrder.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    let updatedOrders;
    if (editingOrder) {
      updatedOrders = orders.map(o => o.id === editingOrder.id ? orderData : o);
    } else {
      updatedOrders = [orderData, ...orders];
    }

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    showConfirmation({
      title: '✅ Commande enregistrée !',
      message: `La commande ${orderData.orderNumber} a été ${editingOrder ? 'modifiée' : 'créée'} avec succès.`,
      type: 'success',
      onConfirm: () => {
        resetForm();
      }
    });
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      items: [{ productId: '', quantity: 1, price: 0 }],
      totalAmount: 0,
      status: 'pending',
      notes: ''
    });
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      customerAddress: order.customerAddress,
      items: order.items.length > 0 ? order.items : [{ productId: '', quantity: 1, price: 0 }],
      totalAmount: order.totalAmount,
      status: order.status,
      notes: order.notes
    });
    setShowForm(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] };
        
        // Si la commande est confirmée, créer automatiquement les mouvements de stock
        if (newStatus === 'confirmed') {
          createStockMovements(updatedOrder);
        }
        
        return updatedOrder;
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    showConfirmation({
      title: '✅ Statut mis à jour !',
      message: `Le statut de la commande a été mis à jour en "${orderStatuses.find(s => s.value === newStatus)?.label}".`,
      type: 'success',
      onConfirm: () => {}
    });
  };

  const createStockMovements = (order) => {
    const existingMovements = JSON.parse(localStorage.getItem('stockMovements') || '[]');
    
    order.items.forEach(item => {
      const newMovement = {
        id: Date.now() + Math.random(),
        productId: item.productId,
        productName: item.productName,
        category: products.find(p => p._id === item.productId)?.category || 'construction',
        type: 'out',
        quantity: item.quantity,
        reason: 'Vente client',
        notes: `Commande ${order.orderNumber} - ${order.customerName}`,
        date: new Date().toISOString().split('T')[0],
        images: [],
        reference: order.orderNumber,
        supplier: order.customerName
      };
      
      existingMovements.push(newMovement);
    });

    localStorage.setItem('stockMovements', JSON.stringify(existingMovements));
    
    // Recharger les données pour mettre à jour les stocks
    loadData();
  };

  const handleDelete = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    showConfirmation({
      title: '❌ Supprimer la commande ?',
      message: `Êtes-vous sûr de vouloir supprimer la commande ${order.orderNumber} ?`,
      type: 'danger',
      onConfirm: () => {
        const updatedOrders = orders.filter(o => o.id !== orderId);
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
      }
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    const matchesStatus = !filterStatus || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusInfo = orderStatuses.find(s => s.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo?.color}`}>
        {statusInfo?.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-1">Gérez les commandes clients et mettez à jour les stocks automatiquement</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Package className="w-5 h-5" />
            Recharger
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Commande
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Commandes</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmées</p>
              <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'confirmed').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Livrées</p>
              <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'delivered').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            {orderStatuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">#{order.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.productName}</span>
                          <span className="text-gray-500">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.totalAmount.toLocaleString()} FG
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      >
                        {orderStatuses.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations client */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client *</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <input
                      type="text"
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Articles */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Articles commandés</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      + Ajouter un article
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                          <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Sélectionner un produit</option>
                            {products.map(product => (
                              <option key={product._id} value={product._id}>
                                {product.name} - {product.price.toLocaleString()} FG
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
                          <input
                            type="number"
                            value={item.price}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                          />
                        </div>
                        <div className="flex items-end">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                            <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-medium">
                              {item.total.toLocaleString()} FG
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total et statut */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total de la commande</label>
                    <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-lg font-bold">
                      {formData.totalAmount.toLocaleString()} FG
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {orderStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingOrder ? 'Modifier' : 'Créer'} la commande
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        type={confirmation.type}
        onConfirm={handleConfirm}
        onCancel={hideConfirmation}
      />
    </div>
  );
};

export default OrderManagement;
