import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { localOrdersAPI } from '../services/localOrdersAPI';
import { Package, Clock, CheckCircle, XCircle, RefreshCw, Eye, Download } from 'lucide-react';

const TestOrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [user, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des commandes...');
      
      const result = await localOrdersAPI.getMyOrders();
      console.log('📦 Résultat API:', result);
      
      if (result.success) {
        // Filtrer les commandes de l'utilisateur connecté
        const userOrders = result.data.orders.filter(order => 
          order.user.email === user.email || 
          order.user.id === user.id
        );
        console.log('👤 Commandes utilisateur:', userOrders);
        setOrders(userOrders);
      } else {
        console.error('❌ Erreur API:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadOrders();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending_approval: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending_approval: 'En attente de validation',
      approved: 'Approuvée',
      rejected: 'Rejetée',
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En cours',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    if (status === 'approved' || status === 'delivered') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'rejected') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🧪 Test - Mes Commandes</h1>
                <p className="mt-2 text-gray-600">
                  Page de test pour vérifier l'espace commandes client
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Informations de debug */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">🔍 Informations de Debug</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Utilisateur connecté:</strong> {user?.email || 'Non connecté'}</p>
                <p><strong>Commandes trouvées:</strong> {orders.length}</p>
                <p><strong>localStorage clientOrders:</strong> {JSON.parse(localStorage.getItem('clientOrders') || '[]').length} commandes</p>
                <p><strong>localStorage client_notifications:</strong> {JSON.parse(localStorage.getItem('client_notifications') || '[]').length} notifications</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Package className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune commande trouvée
                </h3>
                <p className="text-gray-600 mb-8">
                  Vous n'avez pas encore passé de commande ou les commandes ne sont pas chargées correctement.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </button>
                  <button
                    onClick={() => navigate('/products')}
                    className="ml-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Voir les Produits
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Vos Commandes ({orders.length})
                  </h2>
                </div>

                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.orderStatus)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande {order.trackingNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Articles</p>
                        <p className="text-sm text-gray-600">{order.items?.length || 0} produit(s)</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total</p>
                        <p className="text-sm text-gray-600 font-semibold">
                          {formatPrice(order.total || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Statut</p>
                        <p className="text-sm text-gray-600">
                          {order.orderStatus === 'approved' || order.orderStatus === 'delivered' 
                            ? 'Facture disponible' 
                            : order.orderStatus === 'rejected' 
                            ? 'Commande rejetée' 
                            : 'En attente de validation admin'}
                        </p>
                      </div>
                    </div>

                    {/* Informations de debug pour cette commande */}
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
                      <p><strong>Debug:</strong> ID: {order._id}</p>
                      <p><strong>Debug:</strong> User: {order.user?.email || 'N/A'}</p>
                      <p><strong>Debug:</strong> Status: {order.orderStatus}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Voir les détails</span>
                      </button>

                      <div className="flex space-x-3">
                        {/* SÉCURITÉ : Seules les commandes approuvées par l'admin peuvent télécharger la facture */}
                        {order.orderStatus === 'approved' || order.orderStatus === 'delivered' ? (
                          <button
                            onClick={() => {
                              console.log('📄 Téléchargement facture pour:', order._id);
                              alert('Facture téléchargée avec succès !');
                            }}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Télécharger la facture</span>
                          </button>
                        ) : order.orderStatus === 'rejected' ? (
                          <div className="flex items-center space-x-2 text-red-400 px-4 py-2">
                            <XCircle className="h-4 w-4" />
                            <span>Commande rejetée</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-yellow-400 px-4 py-2">
                            <Clock className="h-4 w-4" />
                            <span>En attente de validation admin</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOrdersPage;
