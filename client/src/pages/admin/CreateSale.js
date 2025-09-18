import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  User, 
  MapPin, 
  CreditCard,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CreateSale = () => {
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    unitPrice: 0,
    customer: '',
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPrice: 0,
    paymentMethod: 'cash',
    notes: ''
  });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Données de test
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Simulation de données - à remplacer par des appels API réels
    const mockProducts = [];

    const mockCustomers = [
      { _id: '1', name: 'Moussa Diallo', phone: '+223 70 12 34 56', address: 'Quartier Sotuba, Bamako' },
      { _id: '2', name: 'Fatoumata Keita', phone: '+223 65 78 90 12', address: 'ACI 2000, Bamako' },
      { _id: '3', name: 'Boubacar Diarra', phone: '+223 76 54 32 10', address: 'Badalabougou, Bamako' }
    ];

    setProducts(mockProducts);
    setCustomers(mockCustomers);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculer le prix unitaire quand le produit change
    if (name === 'product') {
      const selectedProduct = products.find(p => p._id === value);
      if (selectedProduct) {
        setFormData(prev => ({
          ...prev,
          unitPrice: selectedProduct.price
        }));
      }
    }

    // Effacer les erreurs
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, formData.quantity + change);
    setFormData(prev => ({
      ...prev,
      quantity: newQuantity
    }));
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer: customer._id,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: customer.address,
      deliveryCity: 'Bamako'
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.product) newErrors.product = 'Sélectionnez un produit';
    if (!formData.customerName) newErrors.customerName = 'Nom du client requis';
    if (!formData.customerPhone) newErrors.customerPhone = 'Téléphone du client requis';
    if (!formData.deliveryAddress) newErrors.deliveryAddress = 'Adresse de livraison requise';
    if (!formData.deliveryCity) newErrors.deliveryCity = 'Ville de livraison requise';
    if (formData.quantity < 1) newErrors.quantity = 'Quantité minimale: 1';
    if (formData.unitPrice <= 0) newErrors.unitPrice = 'Prix unitaire requis';

    // Vérifier le stock
    const selectedProduct = products.find(p => p._id === formData.product);
    if (selectedProduct && formData.quantity > selectedProduct.stock) {
      newErrors.quantity = `Stock insuffisant. Disponible: ${selectedProduct.stock}`;
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
      // Simulation de création de vente - à remplacer par un appel API réel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        product: '',
        quantity: 1,
        unitPrice: 0,
        customer: '',
        customerName: '',
        customerPhone: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryPrice: 0,
        paymentMethod: 'cash',
        notes: ''
      });
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la création de la vente:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p._id === formData.product);
  const totalPrice = formData.quantity * formData.unitPrice;
  const totalWithDelivery = totalPrice + (formData.deliveryPrice || 0);

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
              <ShoppingCart className="h-8 w-8 mr-3 text-blue-600" />
              Nouvelle Vente
            </h1>
            <p className="text-gray-600 mt-1">
              Enregistrer une nouvelle vente avec livraison
            </p>
          </div>
        </div>
      </div>

      {/* Message de succès */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <span className="text-green-800 font-medium">Vente créée avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Produit */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Informations Produit
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produit *
                </label>
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.product ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez un produit</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} - Stock: {product.stock} - {product.category}
                    </option>
                  ))}
                </select>
                {errors.product && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.product}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité *
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      className={`flex-1 px-3 py-2 border-t border-b border-gray-300 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.quantity ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.quantity}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix unitaire (FG) *
                  </label>
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.unitPrice ? 'border-red-300' : 'border-gray-300'
                    }`}
                    min="0"
                  />
                  {errors.unitPrice && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.unitPrice}
                    </p>
                  )}
                </div>
              </div>

              {selectedProduct && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stock disponible:</span>
                    <span className="font-medium">{selectedProduct.stock} unités</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Total produit:</span>
                    <span className="font-bold text-lg">{totalPrice.toLocaleString()} FG</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Client */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Informations Client
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client existant
                </label>
                <select
                  onChange={(e) => {
                    const customer = customers.find(c => c._id === e.target.value);
                    if (customer) handleCustomerSelect(customer);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un client existant</option>
                  {customers.map(customer => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du client *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customerName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nom complet du client"
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.customerPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+223 XX XX XX XX"
                />
                {errors.customerPhone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Livraison */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-orange-600" />
            Informations de Livraison
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse de livraison *
              </label>
              <textarea
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.deliveryAddress ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Adresse complète de livraison"
              />
              {errors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.deliveryAddress}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="deliveryCity"
                  value={formData.deliveryCity}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.deliveryCity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ville de livraison"
                />
                {errors.deliveryCity && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.deliveryCity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frais de livraison (FG)
                </label>
                <input
                  type="number"
                  name="deliveryPrice"
                  value={formData.deliveryPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Paiement */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
            Informations de Paiement
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de paiement
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
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
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Notes supplémentaires..."
              />
            </div>
          </div>
        </div>

        {/* Résumé et Actions */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Résumé de la Vente</h3>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total produit: {totalPrice.toLocaleString()} FG</div>
              <div className="text-sm text-gray-600">Frais de livraison: {formData.deliveryPrice.toLocaleString()} FG</div>
              <div className="text-xl font-bold text-blue-600">Total: {totalWithDelivery.toLocaleString()} FG</div>
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
                  Enregistrer la Vente
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSale;
