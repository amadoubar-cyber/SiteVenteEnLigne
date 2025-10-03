import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import orderService from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
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
      const result = await orderService.getAllOrders();
      if (result.success) {
        // Filtrer les commandes de l'utilisateur connecté
        const userOrders = result.data.filter(order => 
          order.customerEmail === user.email || 
          order.customerId === user.id
        );
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const canDownload = await orderService.canDownloadInvoice(orderId);
      if (!canDownload) {
        alert('Cette commande n\'est pas encore validée par l\'administrateur. Vous ne pouvez pas télécharger la facture.');
        return;
      }

      const result = await orderService.generateInvoicePDF(orderId);
      if (result.success) {
        // Ici vous pouvez implémenter le téléchargement réel du PDF
        alert('Facture téléchargée avec succès !');
        console.log('Données de la facture:', result.data);
      } else {
        alert('Erreur lors de la génération de la facture: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur téléchargement facture:', error);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  const getStatusIcon = (status, validated) => {
    if (validated) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'rejected') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status, validated) => {
    if (validated) {
      return 'Validée';
    } else if (status === 'rejected') {
      return 'Rejetée';
    } else {
      return 'En attente de validation';
    }
  };

  const getStatusColor = (status, validated) => {
    if (validated) {
      return 'bg-green-100 text-green-800';
    } else if (status === 'rejected') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
            <p className="mt-2 text-gray-600">
              Gérez et suivez l'état de vos commandes
            </p>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune commande
                </h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas encore passé de commande.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Commencer mes achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(order.status, order.validated)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status, order.validated)}`}>
                        {getStatusText(order.status, order.validated)}
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
                          {order.total?.toLocaleString('fr-FR')} FG
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Statut</p>
                        <p className="text-sm text-gray-600">
                          {order.validated ? 'Facture disponible' : 'En attente de validation'}
                        </p>
                      </div>
                    </div>

                    {order.status === 'rejected' && order.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Raison du rejet:</strong> {order.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Voir les détails</span>
                      </button>

                      <div className="flex space-x-3">
                        {order.validated ? (
                          <button
                            onClick={() => handleDownloadInvoice(order._id)}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Télécharger la facture</span>
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400 px-4 py-2">
                            <Download className="h-4 w-4" />
                            <span>Facture non disponible</span>
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

export default Orders;