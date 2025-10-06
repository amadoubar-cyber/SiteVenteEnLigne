import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Clock, CheckCircle, XCircle, RefreshCw, Bell } from 'lucide-react';
import { localOrdersAPI } from '../services/localOrdersAPI';
import { useAuth } from '../contexts/AuthContext';
import useClientNotifications from '../hooks/useClientNotifications';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addNotification, notifications } = useClientNotifications();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOrders();
    
    // Écouter les notifications de changement de statut de commande
    const handleOrderApproved = (event) => {
      const { order } = event.detail;
      console.log('🎉 Commande approuvée reçue:', order._id);
      
      // Vérifier si c'est une commande de cet utilisateur
      if (order.user.email === user.email || order.user.id === user.id) {
        // Mettre à jour la liste des commandes
        loadOrders();
        
        // Ajouter une notification
        addNotification({
          type: 'success',
          title: 'Commande approuvée !',
          message: `Votre commande ${order.trackingNumber} a été approuvée. Vous pouvez maintenant télécharger votre facture.`,
          orderId: order._id
        });
      }
    };

    const handleOrderRejected = (event) => {
      const { order } = event.detail;
      console.log('❌ Commande rejetée reçue:', order._id);
      
      // Vérifier si c'est une commande de cet utilisateur
      if (order.user.email === user.email || order.user.id === user.id) {
        // Mettre à jour la liste des commandes
        loadOrders();
        
        // Ajouter une notification
        addNotification({
          type: 'error',
          title: 'Commande rejetée',
          message: `Votre commande ${order.trackingNumber} a été rejetée. ${order.rejectionReason ? 'Raison: ' + order.rejectionReason : ''}`,
          orderId: order._id
        });
      }
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('orderApproved', handleOrderApproved);
    window.addEventListener('orderRejected', handleOrderRejected);

    // Nettoyer les écouteurs
    return () => {
      window.removeEventListener('orderApproved', handleOrderApproved);
      window.removeEventListener('orderRejected', handleOrderRejected);
    };
  }, [user, navigate, addNotification]);

  const loadOrders = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const result = await localOrdersAPI.getMyOrders();
      if (result.success) {
        // Filtrer les commandes de l'utilisateur connecté
        const userOrders = result.data.orders.filter(order => 
          order.user.email === user.email || 
          order.user.id === user.id
        );
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadOrders(true);
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      // SÉCURITÉ : Vérifier que la commande est approuvée par l'admin
      const order = orders.find(o => o._id === orderId);
      if (!order) {
        alert('Commande non trouvée');
        return;
      }

      // Vérifier le statut de la commande
      if (order.orderStatus !== 'approved' && order.orderStatus !== 'delivered') {
        alert('Cette commande n\'est pas encore validée par l\'administrateur. Vous ne pouvez pas télécharger la facture.');
        return;
      }

      // Générer la facture HTML
      const dateFacture = new Date().toLocaleDateString('fr-FR');
      const heureFacture = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateCommande = new Date(order.createdAt).toLocaleDateString('fr-FR');
      const heureCommande = new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const factureHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${order.trackingNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .facture-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #3B82F6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }
        .logo-img {
            width: 80px;
            height: 80px;
            object-fit: contain;
            margin-right: 15px;
            border-radius: 10px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #3B82F6;
        }
        .company-info {
            color: #666;
            font-size: 14px;
        }
        .facture-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
        }
        .facture-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-section {
            flex: 1;
            margin: 0 10px;
        }
        .info-section h3 {
            color: #3B82F6;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .info-section p {
            margin: 5px 0;
            color: #666;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .items-table th,
        .items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #333;
        }
        .items-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .total-section {
            margin-top: 30px;
            text-align: right;
        }
        .total-line {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 5px 0;
        }
        .total-final {
            font-size: 18px;
            font-weight: bold;
            color: #3B82F6;
            border-top: 2px solid #3B82F6;
            padding-top: 10px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
        }
        .status-approved {
            background-color: #d4edda;
            color: #155724;
        }
        .status-delivered {
            background-color: #cce5ff;
            color: #004085;
        }
    </style>
</head>
<body>
    <div class="facture-container">
        <div class="header">
            <div class="logo-container">
                <img src="http://localhost:3000/images/products/logo/logo-koula.jpg" alt="Bowoye Multi Services Logo" class="logo-img" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <div class="logo-fallback" style="display:none; width:80px; height:80px; background:#3B82F6; border-radius:10px; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:24px;">B</div>
                <div class="logo">BOWOYE MULTI SERVICES</div>
            </div>
            <div class="company-info">
                Votre partenaire de confiance pour tous vos besoins en matériaux de construction<br>
                Labé, République de Guinée<br>
                Contact: +224 612 63 73 35
            </div>
        </div>
        
        <div class="facture-title">
            FACTURE N° ${order.trackingNumber}
            <span class="status-badge status-${order.orderStatus}">
                ${order.orderStatus === 'approved' ? 'APPROUVÉE' : 'LIVRÉE'}
            </span>
        </div>
        
        <div class="facture-info">
            <div class="info-section">
                <h3>Informations Client</h3>
                <p><strong>Nom:</strong> ${order.user.firstName} ${order.user.lastName}</p>
                <p><strong>Email:</strong> ${order.user.email}</p>
                <p><strong>Téléphone:</strong> ${order.user.phone}</p>
                <p><strong>Adresse:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
            </div>
            <div class="info-section">
                <h3>Informations Facture</h3>
                <p><strong>Date de facture:</strong> ${dateFacture} à <span style="font-family: monospace; color: #3B82F6;">${heureFacture}</span></p>
                <p><strong>Date de commande:</strong> ${dateCommande} à <span style="font-family: monospace; color: #3B82F6;">${heureCommande}</span></p>
                <p><strong>Méthode de paiement:</strong> ${order.paymentMethod === 'mobile_money' ? 'Mobile Money' : order.paymentMethod}</p>
                <p><strong>Statut:</strong> ${order.orderStatus === 'approved' ? 'Approuvée' : 'Livrée'}</p>
            </div>
        </div>
        
        <table class="items-table">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price.toLocaleString('fr-FR')} GNF</td>
                        <td>${(item.price * item.quantity).toLocaleString('fr-FR')} GNF</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="total-section">
            <div class="total-line">
                <span>Sous-total:</span>
                <span>${order.subtotal.toLocaleString('fr-FR')} GNF</span>
            </div>
            <div class="total-line">
                <span>Frais de livraison:</span>
                <span>${order.shippingCost.toLocaleString('fr-FR')} GNF</span>
            </div>
            <div class="total-line">
                <span>Taxes:</span>
                <span>${order.tax.toLocaleString('fr-FR')} GNF</span>
            </div>
            <div class="total-line total-final">
                <span>TOTAL:</span>
                <span>${order.total.toLocaleString('fr-FR')} GNF</span>
            </div>
        </div>
        
        <div class="footer">
            <p>Merci pour votre confiance !</p>
            <p>Pour toute question, contactez-nous au +224 612 63 73 35</p>
            <p>Bowoye Multi Services - Labé, République de Guinée</p>
            <p>Cette facture a été générée automatiquement le ${dateFacture} à <span style="font-family: monospace; color: #3B82F6;">${heureFacture}</span></p>
        </div>
    </div>
</body>
</html>
      `;

      // Créer un blob avec le HTML
      const blob = new Blob([factureHTML], { type: 'text/html' });
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${order.trackingNumber}.html`;
      
      // Déclencher le téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL
      URL.revokeObjectURL(url);
      
      console.log('📄 Facture téléchargée avec succès!');
      
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
                <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
                <p className="mt-2 text-gray-600">
                  Gérez et suivez l'état de vos commandes
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* Indicateur de notifications */}
                {notifications && notifications.length > 0 && (
                  <div className="relative">
                    <Bell className="h-6 w-6 text-blue-600" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  </div>
                )}
                
                {/* Bouton d'actualisation */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Actualisation...' : 'Actualiser'}
                </button>
              </div>
            </div>
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
                        {getStatusIcon(order.orderStatus)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Commande {order.trackingNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} à <span className="font-mono text-blue-600">{new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
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
                          {order.total?.toLocaleString('fr-FR')} FG
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

                    {order.orderStatus === 'rejected' && order.rejectionReason && (
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
                        {/* SÉCURITÉ : Seules les commandes approuvées par l'admin peuvent télécharger la facture */}
                        {order.orderStatus === 'approved' || order.orderStatus === 'delivered' ? (
                          <button
                            onClick={() => handleDownloadInvoice(order._id)}
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

export default Orders;