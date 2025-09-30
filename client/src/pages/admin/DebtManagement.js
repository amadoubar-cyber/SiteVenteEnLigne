import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  User,
  Calendar,
  Phone,
  MapPin,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  FileText,
  Receipt,
  Package
} from 'lucide-react';
import ResetButton from '../../components/ResetButton';

const DebtManagement = () => {
  const [debts, setDebts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  // Statistiques supprimées - plus d'affichage des cartes de stats
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreateDebtModal, setShowCreateDebtModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState({
    show: false,
    client: '',
    product: '',
    amount: 0,
    dueDate: null
  });
  const [showReceiptModal, setShowReceiptModal] = useState({
    show: false,
    debt: null
  });
  const [createDebtData, setCreateDebtData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    productName: '',
    productCategory: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    dueDate: '',
    paymentMethod: 'cash',
    notes: ''
  });
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'cash',
    notes: ''
  });

  // Charger les données au montage du composant
  useEffect(() => {
    console.log('DebtManagement component loaded');
    loadDebtsData();
    loadSalesData();
  }, []);


  // Fonction de calcul des statistiques supprimée - plus d'affichage des cartes de stats

  // Fonction de réinitialisation des dettes
  const handleResetDebts = async () => {
    try {
      // Vider toutes les données de dettes
      localStorage.removeItem('debts');
      localStorage.removeItem('debtData');
      localStorage.removeItem('adminDebts');
      
      // Réinitialiser l'état
      setDebts([]);
      
      console.log('✅ Données de dettes réinitialisées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation des dettes:', error);
      throw error;
    }
  };

  const loadSalesData = async () => {
    // Simulation de données - à remplacer par des appels API réels
    const mockSales = [];

    setSales(mockSales);
  };

  const loadDebtsData = async () => {
    console.log('Loading debts data...');
    setLoading(true);
    
    try {
      // Charger les dettes depuis localStorage
      const savedDebts = localStorage.getItem('debts');
      console.log('Saved debts from localStorage:', savedDebts);
      let debtsData = [];
      
      if (savedDebts) {
        // Charger les dettes existantes
        const parsedDebts = JSON.parse(savedDebts);
        console.log('Parsed debts:', parsedDebts);
        debtsData = parsedDebts.map(debt => ({
          ...debt,
          dueDate: new Date(debt.dueDate),
          createdAt: new Date(debt.createdAt)
        }));
      } else {
        console.log('No saved debts found - starting with empty state');
        // Ne pas créer de données de test - commencer avec un état vide
        debtsData = [];
      }
      
      setDebts(debtsData);
      console.log('Dettes chargées et définies:', debtsData);
      
    } catch (error) {
      console.error('Erreur lors du chargement des dettes:', error);
      setDebts([]);
    }
    
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    // Gérer les valeurs NaN, undefined, null
    const safeAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : Number(amount) || 0;
    return new Intl.NumberFormat('fr-FR').format(safeAmount) + ' FG';
  };

  const formatDate = (date) => {
    if (!date) return 'Date non spécifiée';
    try {
    return new Date(date).toLocaleDateString('fr-FR');
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      partial: <DollarSign className="h-4 w-4" />,
      paid: <CheckCircle className="h-4 w-4" />,
      overdue: <AlertTriangle className="h-4 w-4" />,
      cancelled: <Trash2 className="h-4 w-4" />
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const handlePayment = (debt) => {
    setSelectedDebt(debt);
    setPaymentData({
      amount: debt.amountRemaining,
      paymentMethod: 'cash',
      notes: ''
    });
    setShowPaymentModal(true);
  };

  const handleReceipt = (debt) => {
    setShowReceiptModal({
      show: true,
      debt: debt
    });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDebt) return;
    
    // Mettre à jour la dette avec le nouveau paiement
    const updatedDebts = debts.map(debt => {
      if (debt._id === selectedDebt._id) {
        const newAmountPaid = debt.amountPaid + paymentData.amount;
        const newAmountRemaining = debt.amount - newAmountPaid;
        const newStatus = newAmountRemaining <= 0 ? 'paid' : 'partial';
        
        const updatedDebt = {
          ...debt,
          amountPaid: newAmountPaid,
          amountRemaining: newAmountRemaining,
          status: newStatus,
          payments: [
            ...debt.payments,
            {
              amount: paymentData.amount,
              paymentMethod: paymentData.paymentMethod,
              paymentDate: new Date(),
              notes: paymentData.notes
            }
          ]
        };
        
        return updatedDebt;
      }
      return debt;
    });
    
    // Sauvegarder les dettes mises à jour
    setDebts(updatedDebts);
    localStorage.setItem('debts', JSON.stringify(updatedDebts));
    
    console.log('Paiement enregistré:', paymentData);
    setShowPaymentModal(false);
    setSelectedDebt(null);
    
    // Recharger les statistiques
    loadDebtsData();
  };

  const handleCreateDebtInputChange = (e) => {
    const { name, value } = e.target;
    setCreateDebtData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateDebtSubmit = async (e) => {
    e.preventDefault();
    
    if (!createDebtData.customerName || !createDebtData.productName || !createDebtData.unitPrice || !createDebtData.dueDate) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Calculer le prix total
    const totalPrice = createDebtData.quantity * createDebtData.unitPrice;

    // Créer la nouvelle dette
    const newDebt = {
      _id: Date.now().toString(), // ID temporaire
      customerName: createDebtData.customerName,
      customerPhone: createDebtData.customerPhone,
      customerAddress: createDebtData.customerAddress,
      productName: createDebtData.productName,
      productCategory: createDebtData.productCategory,
      quantity: createDebtData.quantity,
      unitPrice: createDebtData.unitPrice,
      totalPrice: totalPrice,
      amount: totalPrice,
      amountPaid: 0,
      amountRemaining: totalPrice,
      dueDate: new Date(createDebtData.dueDate),
      status: 'pending',
      paymentMethod: createDebtData.paymentMethod,
      notes: createDebtData.notes,
      createdAt: new Date(),
      payments: []
    };

    // Ajouter la nouvelle dette à la liste existante
    setDebts(prevDebts => {
      const updatedDebts = [newDebt, ...prevDebts];
      // Sauvegarder dans localStorage
      localStorage.setItem('debts', JSON.stringify(updatedDebts));
      console.log('Dettes sauvegardées dans localStorage:', updatedDebts);
      return updatedDebts;
    });
    
    // Statistiques supprimées - plus de mise à jour nécessaire

    console.log('Dette créée et ajoutée:', newDebt);
    
    // Afficher un message de succès personnalisé
    setShowSuccessModal({
      show: true,
      client: newDebt.customerName,
      product: newDebt.productName,
      amount: newDebt.totalPrice,
      dueDate: newDebt.dueDate
    });
    
    // Fermer le modal et réinitialiser le formulaire
    setShowCreateDebtModal(false);
    setCreateDebtData({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      productName: '',
      productCategory: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      dueDate: '',
      paymentMethod: 'cash',
      notes: ''
    });
  };

  const handleDebtInputChange = (e) => {
    const { name, value } = e.target;
    const newData = {
      ...createDebtData,
      [name]: value
    };

    // Recalculer le prix total si quantité ou prix unitaire change
    if (name === 'quantity' || name === 'unitPrice') {
      newData.totalPrice = newData.quantity * newData.unitPrice;
    }

    setCreateDebtData(newData);
  };

  const filteredDebts = debts.filter(debt => {
    if (filters.status !== 'all' && debt.status !== filters.status) return false;
    if (filters.search && !debt.customerName.toLowerCase().includes(filters.search.toLowerCase()) && 
        !debt.customerPhone.includes(filters.search)) return false;
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
            <CreditCard className="h-8 w-8 mr-3 text-blue-600" />
            Gestion des Dettes
          </h1>
          <p className="text-gray-600 mt-1">
            Suivi des paiements et encaissements clients
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Bouton Vente à Crédit cliqué');
                setShowCreateDebtModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Vente à Crédit
            </button>
            <ResetButton
              onReset={handleResetDebts}
              resetType="dettes"
              confirmMessage="Êtes-vous sûr de vouloir réinitialiser toutes les dettes ? Cette action supprimera définitivement toutes les dettes, paiements et données associées."
              variant="danger"
            />
        </div>
      </div>


      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="partial">Paiement partiel</option>
              <option value="paid">Payé</option>
              <option value="overdue">En retard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Client ou téléphone..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des dettes */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Liste des Dettes ({filteredDebts.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Échéance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDebts.map((debt) => (
                <tr key={debt._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{debt.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {debt.customerPhone}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {debt.customerAddress}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{debt.productName}</div>
                    <div className="text-sm text-gray-500">{debt.quantity} unités</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Total: {formatCurrency(debt.totalPrice || 0)}</div>
                    <div className="text-sm text-green-600">Payé: {formatCurrency(debt.paidAmount || debt.amountPaid || 0)}</div>
                    <div className="text-sm font-bold text-orange-600">
                      Restant: {formatCurrency(debt.remainingAmount || debt.amountRemaining || 0)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(debt.status)}`}>
                      {getStatusIcon(debt.status)}
                      <span className="ml-1">{debt.status}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(debt.dueDate)}</div>
                    {isOverdue(debt.dueDate) && debt.status !== 'paid' && (
                      <div className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        En retard
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handlePayment(debt)}
                        className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded-md text-xs font-medium flex items-center"
                        title="Enregistrer un paiement"
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Payer
                      </button>
                      <button 
                        onClick={() => {/* Voir détails */}}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium flex items-center"
                        title="Voir détails"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </button>
                      <button 
                        onClick={() => handleReceipt(debt)}
                        className="text-purple-600 hover:text-purple-900 bg-purple-50 px-2 py-1 rounded-md text-xs font-medium flex items-center"
                        title="Générer reçu"
                      >
                        <Receipt className="h-3 w-3 mr-1" />
                        Reçu
                      </button>
                      <button 
                        onClick={() => handlePayment(debt)}
                        className="text-orange-600 hover:text-orange-900 bg-orange-50 px-2 py-1 rounded-md text-xs font-medium flex items-center"
                        title="Modifier le paiement"
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDebts.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune dette trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune dette ne correspond aux critères sélectionnés.
            </p>
          </div>
        )}
      </div>

      {/* Modal de paiement */}
      {showPaymentModal && selectedDebt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Enregistrer un Paiement
              </h3>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client: {selectedDebt.customerName}
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant restant: {formatCurrency(selectedDebt.amountRemaining)}
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant du paiement *
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    max={selectedDebt.amountRemaining}
                    min="0"
                    step="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de paiement
                  </label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cash">Espèces</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="credit_card">Carte de crédit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de dette */}
      {showCreateDebtModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Vente à Crédit - Nouvelle Dette
              </h3>
              
              <form onSubmit={handleCreateDebtSubmit} className="space-y-4">
                {/* Informations client */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Informations Client
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du client *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={createDebtData.customerName}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom complet du client"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={createDebtData.customerPhone}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+223 XX XX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="customerAddress"
                        value={createDebtData.customerAddress}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Adresse du client"
                      />
                    </div>
                  </div>
                </div>

                {/* Informations produit */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Informations Produit
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du produit *
                      </label>
                      <input
                        type="text"
                        name="productName"
                        value={createDebtData.productName}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom du produit"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie
                      </label>
                      <select
                        name="productCategory"
                        value={createDebtData.productCategory}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        <option value="construction">Matériaux de Construction</option>
                        <option value="electronics">Électronique</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantité *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={createDebtData.quantity}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix unitaire (FG) *
                      </label>
                      <input
                        type="number"
                        name="unitPrice"
                        value={createDebtData.unitPrice}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="100"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Informations de paiement */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Informations de Paiement
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'échéance *
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        value={createDebtData.dueDate}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mode de paiement préféré
                      </label>
                      <select
                        name="paymentMethod"
                        value={createDebtData.paymentMethod}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="cash">Espèces</option>
                        <option value="mobile_money">Mobile Money</option>
                        <option value="bank_transfer">Virement bancaire</option>
                        <option value="credit_card">Carte de crédit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <input
                        type="text"
                        name="notes"
                        value={createDebtData.notes}
                        onChange={handleDebtInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Notes sur la dette..."
                      />
                    </div>
                  </div>
                </div>

                {/* Résumé de la dette */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Résumé de la Dette :</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Produit :</span>
                      <span className="ml-2 font-medium">{createDebtData.productName || 'Non spécifié'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantité :</span>
                      <span className="ml-2 font-medium">{createDebtData.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Prix unitaire :</span>
                      <span className="ml-2 font-medium">{createDebtData.unitPrice.toLocaleString()} FG</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Montant total :</span>
                      <span className="ml-2 font-bold text-red-600 text-lg">
                        {createDebtData.totalPrice.toLocaleString()} FG
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateDebtModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Enregistrer la Vente à Crédit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de succès personnalisé */}
      {showSuccessModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmation de Vente à Crédit
              </h3>
            </div>
            
            {/* Content */}
            <div className="px-6 py-4">
              {/* Success Icon and Message */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-lg">✅</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Vente à crédit enregistrée avec succès !
                  </p>
                </div>
              </div>
              
              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Client:</span>
                  <span className="text-sm font-medium text-gray-900">{showSuccessModal.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Produit:</span>
                  <span className="text-sm font-medium text-gray-900">{showSuccessModal.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Montant:</span>
                  <span className="text-sm font-bold text-blue-600">
                    {showSuccessModal.amount.toLocaleString()} FG
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Échéance:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {showSuccessModal.dueDate ? showSuccessModal.dueDate.toLocaleDateString('fr-FR') : ''}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
              <button
                onClick={() => {
                  console.log('Bouton Enregistrer Paiement cliqué');
                  console.log('Dettes disponibles:', debts);
                  console.log('Recherche de:', showSuccessModal.client, showSuccessModal.product);
                  
                  // Trouver la dette créée et ouvrir le modal de paiement
                  const createdDebt = debts.find(debt => 
                    debt.customerName === showSuccessModal.client && 
                    debt.productName === showSuccessModal.product
                  );
                  
                  console.log('Dette trouvée:', createdDebt);
                  
                  if (createdDebt) {
                    setSelectedDebt(createdDebt);
                    setPaymentData({
                      amount: createdDebt.amountRemaining,
                      paymentMethod: 'cash',
                      notes: ''
                    });
                    setShowPaymentModal(true);
                    console.log('Modal de paiement ouvert');
                  } else {
                    console.log('Aucune dette trouvée');
                    alert('Dette non trouvée. Veuillez actualiser la page.');
                  }
                  setShowSuccessModal({ show: false, client: '', product: '', amount: 0, dueDate: null });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Enregistrer Paiement
              </button>
              <button
                onClick={() => setShowSuccessModal({ show: false, client: '', product: '', amount: 0, dueDate: null })}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de reçu */}
      {showReceiptModal.show && showReceiptModal.debt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Reçu de Paiement
                </h3>
                <button
                  onClick={() => setShowReceiptModal({ show: false, debt: null })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Receipt Content */}
            <div className="px-6 py-4">
              {/* Company Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Bowoye Multi Services</h1>
                <p className="text-gray-600">Votre partenaire de confiance</p>
                <p className="text-sm text-gray-500">Conakry, Guinée</p>
              </div>

              {/* Receipt Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Informations du Reçu</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">N° Reçu:</span> R{new Date().getFullYear()}{String(new Date().getMonth() + 1).padStart(2, '0')}{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}</div>
                    <div><span className="font-medium">Date:</span> {new Date().toLocaleDateString('fr-FR')}</div>
                    <div><span className="font-medium">Heure:</span> {new Date().toLocaleTimeString('fr-FR')}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Nom:</span> {showReceiptModal.debt.customerName}</div>
                    <div><span className="font-medium">Téléphone:</span> {showReceiptModal.debt.customerPhone || 'Non renseigné'}</div>
                    <div><span className="font-medium">Adresse:</span> {showReceiptModal.debt.customerAddress || 'Non renseignée'}</div>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Détails de la Transaction</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Produit:</span> {showReceiptModal.debt.productName}
                    </div>
                    <div>
                      <span className="font-medium">Quantité:</span> {showReceiptModal.debt.quantity} unités
                    </div>
                    <div>
                      <span className="font-medium">Prix unitaire:</span> {showReceiptModal.debt.unitPrice.toLocaleString()} FG
                    </div>
                    <div>
                      <span className="font-medium">Date d'échéance:</span> {showReceiptModal.debt.dueDate.toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Résumé des Paiements</h3>
                <div className="bg-white border rounded-lg p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Montant total:</span>
                      <span className="font-semibold">{showReceiptModal.debt.totalPrice.toLocaleString()} FG</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Montant payé:</span>
                      <span className="font-semibold">{showReceiptModal.debt.amountPaid.toLocaleString()} FG</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Montant restant:</span>
                      <span className="font-semibold">{showReceiptModal.debt.amountRemaining.toLocaleString()} FG</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Statut:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          showReceiptModal.debt.status === 'paid' ? 'bg-green-100 text-green-800' :
                          showReceiptModal.debt.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {showReceiptModal.debt.status === 'paid' ? 'Payé' :
                           showReceiptModal.debt.status === 'partial' ? 'Partiel' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              {showReceiptModal.debt.payments && showReceiptModal.debt.payments.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Historique des Paiements</h3>
                  <div className="space-y-2">
                    {showReceiptModal.debt.payments.map((payment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Paiement #{index + 1}</span>
                            <span className="text-gray-500 ml-2">
                              ({payment.paymentMethod === 'cash' ? 'Espèces' :
                                payment.paymentMethod === 'mobile_money' ? 'Mobile Money' :
                                payment.paymentMethod === 'bank_transfer' ? 'Virement bancaire' :
                                'Carte de crédit'})
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              {payment.amount.toLocaleString()} FG
                            </div>
                            <div className="text-gray-500 text-xs">
                              {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        {payment.notes && (
                          <div className="mt-1 text-gray-600 text-xs">
                            Note: {payment.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 border-t pt-4">
                <p>Merci pour votre confiance !</p>
                <p>Pour toute question, contactez-nous au +223 XX XX XX XX</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => {
                  // Fonction d'impression
                  window.print();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Imprimer
              </button>
              <button
                onClick={() => setShowReceiptModal({ show: false, debt: null })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtManagement;
