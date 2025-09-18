import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { useMutation } from 'react-query';
import { CreditCard, Smartphone, Truck, MapPin, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [formData, setFormData] = useState({
    shippingAddress: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      postalCode: '',
      phone: ''
    },
    paymentMethod: 'mobile_money',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Pré-remplir avec les données utilisateur
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          postalCode: user.address?.postalCode || '',
          phone: user.phone || ''
        }
      }));
    }
  }, [user]);

  const createOrderMutation = useMutation(ordersAPI.createOrder, {
    onSuccess: (response) => {
      toast.success('Commande passée avec succès !');
      clearCart();
      navigate(`/orders/${response.data.order._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    }
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shippingAddress.firstName.trim()) {
      newErrors['shippingAddress.firstName'] = 'Le prénom est requis';
    }

    if (!formData.shippingAddress.lastName.trim()) {
      newErrors['shippingAddress.lastName'] = 'Le nom est requis';
    }

    if (!formData.shippingAddress.street.trim()) {
      newErrors['shippingAddress.street'] = 'L\'adresse est requise';
    }

    if (!formData.shippingAddress.city.trim()) {
      newErrors['shippingAddress.city'] = 'La ville est requise';
    }

    if (!formData.shippingAddress.phone.trim()) {
      newErrors['shippingAddress.phone'] = 'Le numéro de téléphone est requis';
    } else if (!/^[+]?[0-9\s\-()]{8,15}$/.test(formData.shippingAddress.phone)) {
      newErrors['shippingAddress.phone'] = 'Le numéro de téléphone n\'est pas valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const orderData = {
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingAddress: formData.shippingAddress,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    };

    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            Votre panier est vide
          </h2>
          <p className="text-secondary-600 mb-8">
            Ajoutez des produits à votre panier avant de passer commande
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Voir les Produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Finaliser la commande
          </h1>
          <p className="text-secondary-600">
            Vérifiez vos informations et confirmez votre commande
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <div className="card p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold">Adresse de livraison</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.firstName"
                      value={formData.shippingAddress.firstName}
                      onChange={handleChange}
                      className={`input w-full ${errors['shippingAddress.firstName'] ? 'border-red-500' : ''}`}
                      placeholder="Votre prénom"
                    />
                    {errors['shippingAddress.firstName'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.firstName']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.lastName"
                      value={formData.shippingAddress.lastName}
                      onChange={handleChange}
                      className={`input w-full ${errors['shippingAddress.lastName'] ? 'border-red-500' : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors['shippingAddress.lastName'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.lastName']}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.street"
                    value={formData.shippingAddress.street}
                    onChange={handleChange}
                    className={`input w-full ${errors['shippingAddress.street'] ? 'border-red-500' : ''}`}
                    placeholder="Rue, numéro, quartier"
                  />
                  {errors['shippingAddress.street'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.street']}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.city"
                      value={formData.shippingAddress.city}
                      onChange={handleChange}
                      className={`input w-full ${errors['shippingAddress.city'] ? 'border-red-500' : ''}`}
                      placeholder="Votre ville"
                    />
                    {errors['shippingAddress.city'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.city']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="shippingAddress.postalCode"
                      value={formData.shippingAddress.postalCode}
                      onChange={handleChange}
                      className="input w-full"
                      placeholder="Code postal"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="shippingAddress.phone"
                    value={formData.shippingAddress.phone}
                    onChange={handleChange}
                    className={`input w-full ${errors['shippingAddress.phone'] ? 'border-red-500' : ''}`}
                    placeholder="+224 XXX XX XX XX"
                  />
                  {errors['shippingAddress.phone'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.phone']}</p>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 text-primary-600 mr-3" />
                  <h2 className="text-xl font-semibold">Méthode de paiement</h2>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile_money"
                      checked={formData.paymentMethod === 'mobile_money'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <Smartphone className="h-6 w-6 text-primary-600 mr-3" />
                    <div>
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-sm text-secondary-600">Orange Money, MTN Money</p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <Truck className="h-6 w-6 text-primary-600 mr-3" />
                    <div>
                      <p className="font-medium">Paiement à la livraison</p>
                      <p className="text-sm text-secondary-600">Payez en espèces à la réception</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Notes */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Notes de commande</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="input w-full"
                  placeholder="Instructions spéciales pour la livraison (optionnel)"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
                
                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.product._id} className="flex items-center space-x-3">
                      <img
                        src={item.product.images?.[0]?.url || '/placeholder-product.svg'}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Sous-total</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Livraison</span>
                    <span className="font-medium text-green-600">Gratuite</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Taxes</span>
                    <span className="font-medium">0 GNF</span>
                  </div>
                  <hr className="border-secondary-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createOrderMutation.isLoading}
                  className="btn btn-primary w-full btn-lg disabled:opacity-50"
                >
                  {createOrderMutation.isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Traitement...
                    </div>
                  ) : (
                    'Confirmer la commande'
                  )}
                </button>

                <p className="text-xs text-secondary-500 mt-4 text-center">
                  En confirmant votre commande, vous acceptez nos conditions d'utilisation
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
