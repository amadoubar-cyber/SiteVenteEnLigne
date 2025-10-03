import React from 'react';
import { Printer, Download, FileText, Calendar, MapPin, Phone, Mail } from 'lucide-react';

const Invoice = ({ order, onClose }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const texts = {
      pending_approval: 'En attente de validation',
      approved: 'Approuvée',
      rejected: 'Rejetée',
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En cours de traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return texts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      mobile_money: 'Mobile Money',
      orange_money: 'Orange Money',
      card: 'Carte bancaire',
      cash_on_delivery: 'Paiement à la livraison'
    };
    return methods[method] || method;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.getElementById('invoice-content');
    const htmlContent = element.outerHTML;
    
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture - ${order.trackingNumber || order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-header { text-align: center; margin-bottom: 30px; }
            .company-info { margin-bottom: 20px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-info, .invoice-info { flex: 1; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .totals { text-align: right; margin-top: 20px; }
            .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .status-pending { background: #fff3cd; color: #856404; }
            .status-approved { background: #d4edda; color: #155724; }
            .status-rejected { background: #f8d7da; color: #721c24; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${order.trackingNumber || order._id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Facture</h1>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Fermer
              </button>
            )}
          </div>
        </div>

        {/* Contenu de la facture */}
        <div id="invoice-content" className="bg-white shadow-lg rounded-lg p-8">
          {/* En-tête de la facture */}
          <div className="invoice-header border-b-2 border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="w-16 h-16 rounded flex items-center justify-center overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0">
                  <img 
                    src="/images/products/logo/logo-koula.jpg" 
                    alt="Bowoye Multi Services Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-blue-600 rounded flex items-center justify-center" style={{display: 'none'}}>
                    <span className="text-white font-bold text-xl">B</span>
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Bowoye Multi Services</h2>
                  <p className="text-gray-600 text-sm">Votre partenaire de confiance</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Informations Entreprise</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Labé, Guinée</p>
                  <p>Email: amadoubowoye@gmail.com</p>
                  <p>Téléphone: +224 626 99 13 18</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Informations Facture</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>N° Facture:</strong> {order.trackingNumber || order._id}</p>
                  <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                  <p><strong>Statut:</strong> 
                    <span className={`status-badge status-${order.orderStatus} ml-2`}>
                      {getStatusText(order.orderStatus)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="customer-info">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Adresse de Facturation
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
                <p className="flex items-center mt-2">
                  <Phone className="h-3 w-3 mr-1" />
                  {order.shippingAddress?.phone}
                </p>
                {order.user?.email && (
                  <p className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {order.user.email}
                  </p>
                )}
              </div>
            </div>

            <div className="invoice-info">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Détails de la Commande
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Numéro de suivi:</strong> {order.trackingNumber || order._id}</p>
                <p><strong>Méthode de paiement:</strong> {getPaymentMethodText(order.paymentMethod)}</p>
                <p><strong>Date de commande:</strong> {formatDate(order.createdAt)}</p>
                {order.approvedAt && (
                  <p><strong>Date d'approbation:</strong> {formatDate(order.approvedAt)}</p>
                )}
                {order.rejectedAt && (
                  <p><strong>Date de rejet:</strong> {formatDate(order.rejectedAt)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Articles commandés */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Articles Commandés</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix Unitaire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.product?.images?.[0]?.url && (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product?.name}
                              className="h-12 w-12 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.product?.name || item.name || 'Produit'}
                            </div>
                            {item.product?.description && (
                              <div className="text-sm text-gray-500">
                                {item.product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes de commande */}
          {order.notes && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Notes de Commande</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Notes d'approbation */}
          {order.adminNotes && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Notes d'Approbation</h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">{order.adminNotes}</p>
              </div>
            </div>
          )}

          {/* Raison de rejet */}
          {order.rejectionReason && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Raison du Rejet</h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">{order.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Totaux */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="max-w-md ml-auto">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison:</span>
                  <span className="font-medium text-green-600">
                    {order.shippingCost === 0 ? 'Gratuite' : formatPrice(order.shippingCost || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes:</span>
                  <span className="font-medium">{formatPrice(order.tax || 0)}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatPrice(order.total || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pied de page */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
            <p>Merci pour votre confiance !</p>
            <p>Bowoye Multi Services - Votre partenaire de confiance</p>
            <p className="mt-2">
              Cette facture a été générée le {formatDate(new Date())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
