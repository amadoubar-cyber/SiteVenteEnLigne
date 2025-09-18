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

const CreateDebt = () => {
  const [formData, setFormData] = useState({
    sale: '',
    dueDate: '',
    paymentMethod: 'cash',
    notes: ''
  });

  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Données de test
  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    // Simulation de données - à remplacer par des appels API réels
    const mockSales = [];

    setSales(mockSales);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer les erreurs
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.sale) newErrors.sale = 'Sélectionnez une vente';
    if (!formData.dueDate) newErrors.dueDate = 'Date d\'échéance requise';

    // Vérifier que la date d'échéance est dans le futur
    if (formData.dueDate && new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = 'La date d\'échéance doit être dans le futur';
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
      // Simulation de création de dette - à remplacer par un appel API réel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        sale: '',
        dueDate: '',
        paymentMethod: 'cash',
        notes: ''
      });
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la création de la dette:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedSale = sales.find(sale => sale._id === formData.sale);

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
              Nouvelle Dette
            </h1>
            <p className="text-gray-600 mt-1">
              Enregistrer une nouvelle dette client
            </p>
          </div>
        </div>
      </div>

      {/* Message de succès */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <span className="text-green-800 font-medium">Dette créée avec succès !</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Vente */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Sélection de la Vente
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vente *
                </label>
                <select
                  name="sale"
                  value={formData.sale}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.sale ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez une vente</option>
                  {sales.map(sale => (
                    <option key={sale._id} value={sale._id}>
                      {sale.productName} - {sale.customerName} - {sale.totalAmount.toLocaleString()} FCFA
                    </option>
                  ))}
                </select>
                {errors.sale && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.sale}
                  </p>
                )}
              </div>

              {selectedSale && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Détails de la vente sélectionnée :</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client :</span>
                      <span className="font-medium">{selectedSale.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone :</span>
                      <span className="font-medium">{selectedSale.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Produit :</span>
                      <span className="font-medium">{selectedSale.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix produit :</span>
                      <span className="font-medium">{selectedSale.totalPrice.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de livraison :</span>
                      <span className="font-medium">{selectedSale.deliveryPrice.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-semibold">Total :</span>
                      <span className="font-bold text-lg text-blue-600">{selectedSale.totalAmount.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Dette */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-green-600" />
              Informations de la Dette
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'échéance *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dueDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.dueDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode de paiement préféré
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
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notes supplémentaires sur la dette..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Résumé et Actions */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Résumé de la Dette</h3>
            {selectedSale && (
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedSale.totalAmount.toLocaleString()} FCFA
                </div>
                <div className="text-sm text-gray-600">Montant total à payer</div>
              </div>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Ce qui sera créé :</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Dette enregistrée pour le client</li>
              <li>• Reçu initial généré automatiquement</li>
              <li>• Suivi des échéances activé</li>
              <li>• Possibilité de paiements partiels</li>
            </ul>
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
              disabled={loading || !selectedSale}
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
                  Créer la Dette
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDebt;
