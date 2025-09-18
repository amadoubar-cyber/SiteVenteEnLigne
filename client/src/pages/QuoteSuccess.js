import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, ArrowLeft, Home } from 'lucide-react';

const QuoteSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quoteNumber, totalAmount } = location.state || {};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Demande de devis envoyée !
          </h1>
          <p className="text-lg text-secondary-600 mb-8">
            Votre demande a été transmise à notre équipe commerciale.
          </p>

          {/* Quote Details */}
          <div className="bg-secondary-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-secondary-900">Détails du devis</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-secondary-600">Numéro de devis:</span>
                <span className="font-medium text-secondary-900">{quoteNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Montant estimé:</span>
                <span className="font-bold text-primary-600">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Statut:</span>
                <span className="text-orange-600 font-medium">En attente</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-left mb-8">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Prochaines étapes :
            </h2>
            <ul className="space-y-2 text-secondary-600">
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">1.</span>
                <span>Notre équipe commerciale va analyser votre demande</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">2.</span>
                <span>Vous recevrez un devis détaillé par email dans les 24h</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">3.</span>
                <span>Un commercial vous contactera pour discuter de votre projet</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-600 font-bold">4.</span>
                <span>Vous pourrez valider et finaliser votre commande</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">
              Besoin d'aide ?
            </h3>
            <p className="text-blue-700 text-sm">
              Notre équipe commerciale est disponible du lundi au vendredi de 8h à 18h.
              <br />
              Téléphone: +224 XXX XX XX XX | Email: commercial@votresite.com
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/construction')}
              className="btn btn-outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voir d'autres matériaux
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteSuccess;
