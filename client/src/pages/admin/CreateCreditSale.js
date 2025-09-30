import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  User, 
  Package, 
  Calendar,
  DollarSign,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react';

const CreateCreditSale = () => {
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      phone: '',
      address: ''
    },
    product: {
      name: '',
      category: '',
      quantity: 1,
      unitPrice: 0
    },
    payment: {
      dueDate: '',
      method: 'cash',
      notes: ''
    }
  });

  const [categories] = useState([
    'Matériaux de Construction',
    'Électronique',
    'Outillage',
    'Plomberie',
    'Électricité',
    'Peinture',
    'Autre'
  ]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Effacer les erreurs
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ''
      }));
    }
  };

  const handleQuantityChange = (operation) => {
    const newQuantity = operation === 'plus' 
      ? formData.product.quantity + 1 
      : Math.max(1, formData.product.quantity - 1);
    
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product,
        quantity: newQuantity
      }
    }));
  };

  const calculateTotal = () => {
    return formData.product.quantity * formData.product.unitPrice;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation client
    if (!formData.customer.name.trim()) {
      newErrors['customer.name'] = 'Le nom du client est requis';
    }
    if (!formData.customer.phone.trim()) {
      newErrors['customer.phone'] = 'Le téléphone est requis';
    }

    // Validation produit
    if (!formData.product.name.trim()) {
      newErrors['product.name'] = 'Le nom du produit est requis';
    }
    if (!formData.product.category) {
      newErrors['product.category'] = 'La catégorie est requise';
    }
    if (formData.product.unitPrice <= 0) {
      newErrors['product.unitPrice'] = 'Le prix unitaire doit être supérieur à 0';
    }

    // Validation paiement
    if (!formData.payment.dueDate) {
      newErrors['payment.dueDate'] = 'La date d\'échéance est requise';
    }

    // Vérifier que la date d'échéance est dans le futur
    if (formData.payment.dueDate && new Date(formData.payment.dueDate) <= new Date()) {
      newErrors['payment.dueDate'] = 'La date d\'échéance doit être dans le futur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulation de création de vente à crédit - à remplacer par un appel API réel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        customer: { name: '', phone: '', address: '' },
        product: { name: '', category: '', quantity: 1, unitPrice: 0 },
        payment: { dueDate: '', method: 'cash', notes: '' }
      });
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la création de la vente à crédit:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => window.history.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <CreditCard className="h-8 w-8 mr-3 text-blue-600" />
              Vente à Crédit - Nouvelle Dette
            </h1>
            <p className="text-gray-600 mt-1">
              Enregistrer une nouvelle vente à crédit
            </p>
          </div>
        </div>
      </div>

      {/* Message de succès */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <span className="text-green-800 font-medium">Vente à crédit créée avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Informations Client */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Informations Client
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  value={formData.customer.name}
                  onChange={(e) => handleInputChange('customer', 'name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customer.name'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nom complet du client"
                />
                {errors['customer.name'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors['customer.name']}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.customer.phone}
                  onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['customer.phone'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+223 XX XX XX XX"
                />
                {errors['customer.phone'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors['customer.phone']}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.customer.address}
                  onChange={(e) => handleInputChange('customer', 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Adresse du client"
                />
              </div>
            </div>
          </div>

          {/* Section Informations Produit */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-green-600" />
              Informations Produit
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.product.name}
                  onChange={(e) => handleInputChange('product', 'name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['product.name'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nom du produit"
                />
                {errors['product.name'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors['product.name']}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.product.category}
                  onChange={(e) => handleInputChange('product', 'category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['product.category'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors['product.category'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors['product.category']}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité *
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange('minus')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={formData.product.quantity}
                    onChange={(e) => handleInputChange('product', 'quantity', parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange('plus')}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix unitaire (FG) *
                </label>
                <input
                  type="number"
                  value={formData.product.unitPrice}
                  onChange={(e) => handleInputChange('product', 'unitPrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['product.unitPrice'] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                {errors['product.unitPrice'] && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors['product.unitPrice']}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Informations de Paiement */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-purple-600" />
            Informations de Paiement
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'échéance *
              </label>
              <input
                type="date"
                value={formData.payment.dueDate}
                onChange={(e) => handleInputChange('payment', 'dueDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors['payment.dueDate'] ? 'border-red-300' : 'border-gray-300'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors['payment.dueDate'] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors['payment.dueDate']}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de paiement préféré
              </label>
              <select
                value={formData.payment.method}
                onChange={(e) => handleInputChange('payment', 'method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cash">Espèces</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="credit_card">Carte de crédit</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.payment.notes}
              onChange={(e) => handleInputChange('payment', 'notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notes sur la dette..."
            />
          </div>
        </div>

        {/* Résumé de la Dette */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la Dette :</h3>
          
          <div className="bg-white p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Produit :</span>
                <span className="ml-2 font-medium">
                  {formData.product.name || 'Non spécifié'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Quantité :</span>
                <span className="ml-2 font-medium">{formData.product.quantity}</span>
              </div>
              <div>
                <span className="text-gray-600">Prix unitaire :</span>
                <span className="ml-2 font-medium">
                  {formData.product.unitPrice.toLocaleString('fr-FR')} FG
                </span>
              </div>
              <div>
                <span className="text-gray-600">Montant total :</span>
                <span className="ml-2 font-bold text-lg text-blue-600">
                  {totalAmount.toLocaleString('fr-FR')} FG
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer la Vente à Crédit
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCreditSale;
