import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calculator, Plus, Minus, Trash2, Send } from 'lucide-react';

const QuoteRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: {
      name: '',
      email: '',
      phone: '',
      company: ''
    },
    products: [],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.products) {
      setFormData(prev => ({
        ...prev,
        products: location.state.products.map(product => ({
          product: product,
          quantity: 1,
          unitPrice: product.price,
          totalPrice: product.price
        }))
      }));
    }
  }, [location.state]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }));
  };

  const handleProductQuantityChange = (index, quantity) => {
    const newProducts = [...formData.products];
    newProducts[index].quantity = Math.max(1, quantity);
    newProducts[index].totalPrice = newProducts[index].unitPrice * newProducts[index].quantity;
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const removeProduct = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const calculateTotal = () => {
    return formData.products.reduce((total, item) => total + item.totalPrice, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ici, vous feriez l'appel API pour créer le devis
      console.log('Soumission du devis:', formData);
      
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirection vers une page de confirmation
      navigate('/quote-success', { 
        state: { 
          quoteNumber: `QT${Date.now()}`,
          totalAmount: calculateTotal()
        } 
      });
    } catch (error) {
      console.error('Erreur lors de la soumission du devis:', error);
      alert('Erreur lors de la soumission du devis. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formData.products.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <Calculator className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Aucun produit sélectionné
          </h2>
          <p className="text-secondary-600 mb-4">
            Sélectionnez des matériaux pour demander un devis
          </p>
          <button
            onClick={() => navigate('/construction')}
            className="btn btn-primary"
          >
            Voir les matériaux
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Calculator className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Demande de Devis
              </h1>
              <p className="text-secondary-600">
                Obtenez un devis personnalisé pour vos matériaux de construction
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations client */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">
              Informations de contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer.name}
                  onChange={(e) => handleCustomerChange('name', e.target.value)}
                  className="input w-full"
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customer.email}
                  onChange={(e) => handleCustomerChange('email', e.target.value)}
                  className="input w-full"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.customer.phone}
                  onChange={(e) => handleCustomerChange('phone', e.target.value)}
                  className="input w-full"
                  placeholder="+224 XX XX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  value={formData.customer.company}
                  onChange={(e) => handleCustomerChange('company', e.target.value)}
                  className="input w-full"
                  placeholder="Nom de votre entreprise"
                />
              </div>
            </div>
          </div>

          {/* Produits sélectionnés */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">
              Matériaux sélectionnés
            </h2>
            <div className="space-y-4">
              {formData.products.map((item, index) => (
                <div key={index} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.product.images?.[0]?.url || '/placeholder-product.svg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {item.product.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleProductQuantityChange(index, item.quantity - 1)}
                            className="btn btn-outline btn-sm"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleProductQuantityChange(index, item.quantity + 1)}
                            className="btn btn-outline btn-sm"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="text-sm text-secondary-600">
                          {item.product.unit}
                        </span>
                        <span className="font-medium text-primary-600">
                          {formatPrice(item.unitPrice)} / {item.product.unit}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        {formatPrice(item.totalPrice)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="btn btn-outline btn-sm text-red-600 hover:bg-red-50 mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-secondary-200 pt-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-secondary-900">
                  Total estimé:
                </span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">
              Informations complémentaires
            </h2>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Notes ou commentaires
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="input w-full h-32"
                placeholder="Décrivez votre projet, vos besoins spécifiques, délais souhaités, etc."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/construction')}
              className="btn btn-outline"
            >
              Retour aux matériaux
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer la demande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuoteRequest;
