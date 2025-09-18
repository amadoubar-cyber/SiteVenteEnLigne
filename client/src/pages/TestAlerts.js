import React from 'react';
import useConfirmationMessage from '../hooks/useConfirmationMessage';
import ConfirmationMessage from '../components/ConfirmationMessage';

const TestAlerts = () => {
  const { message, showSuccess, showError, showWarning, hideMessage } = useConfirmationMessage();

  const testNativeAlert = () => {
    alert('Ceci est un test d\'alerte native - elle devrait être interceptée !');
  };

  const testSuccessMessage = () => {
    showSuccess('Message de succès personnalisé !');
  };

  const testErrorMessage = () => {
    showError('Message d\'erreur personnalisé !');
  };

  const testWarningMessage = () => {
    showWarning('Message d\'avertissement personnalisé !');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test des Messages de Confirmation
          </h1>
          
          {/* Message de confirmation */}
          {message && (
            <ConfirmationMessage
              type={message.type}
              message={message.message}
              duration={message.duration}
              onClose={hideMessage}
              show={message.show}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tests des Messages Personnalisés
              </h2>
              
              <button
                onClick={testSuccessMessage}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Message de Succès
              </button>
              
              <button
                onClick={testErrorMessage}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Test Message d'Erreur
              </button>
              
              <button
                onClick={testWarningMessage}
                className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Test Message d'Avertissement
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Test d'Interception d'Alertes
              </h2>
              
              <button
                onClick={testNativeAlert}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Alerte Native (devrait être interceptée)
              </button>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">
                  Note importante :
                </h3>
                <p className="text-sm text-yellow-700">
                  Si l'interception fonctionne, l'alerte native sera remplacée par notre message de confirmation personnalisé.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instructions de Test
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Cliquez sur "Test Alerte Native" - vous devriez voir notre message personnalisé au lieu de l'alerte du navigateur</li>
              <li>Testez les autres boutons pour voir les différents types de messages</li>
              <li>Vérifiez que les messages s'affichent en haut à droite de l'écran</li>
              <li>Vérifiez que les messages disparaissent automatiquement après quelques secondes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAlerts;
