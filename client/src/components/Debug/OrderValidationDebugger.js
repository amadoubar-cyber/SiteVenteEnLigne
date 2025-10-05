import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Bug, Database, Bell } from 'lucide-react';

const OrderValidationDebugger = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Charger les informations de débogage
  const loadDebugInfo = () => {
    const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
    
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
      return acc;
    }, {});

    setDebugInfo({
      totalOrders: orders.length,
      statusCounts,
      pendingOrders: orders.filter(o => o.orderStatus === 'pending_approval'),
      approvedOrders: orders.filter(o => o.orderStatus === 'approved'),
      rejectedOrders: orders.filter(o => o.orderStatus === 'rejected'),
      notifications: notifications.length,
      unreadNotifications: notifications.filter(n => !n.read).length,
      lastOrder: orders[0] || null,
      lastNotification: notifications[0] || null
    });
  };

  // Test de création de commande
  const testCreateOrder = async () => {
    setIsLoading(true);
    try {
      const { localOrdersAPI } = await import('../services/localOrdersAPI');
      
      const testOrder = {
        items: [
          {
            product: 'test-product',
            quantity: 1,
            price: 100000,
            name: 'Produit Test',
            image: ''
          }
        ],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'Debug',
          street: '123 Rue Test',
          city: 'Conakry',
          phone: '+224 123 456 789'
        },
        paymentMethod: 'mobile_money',
        notes: 'Commande de test pour débogage',
        subtotal: 100000,
        tax: 0,
        total: 100000
      };

      const result = await localOrdersAPI.createOrder(testOrder);
      
      setTestResults(prev => ({
        ...prev,
        createOrder: result.success ? '✅ Succès' : `❌ Erreur: ${result.error}`
      }));
      
      loadDebugInfo();
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        createOrder: `❌ Erreur: ${error.message}`
      }));
    }
    setIsLoading(false);
  };

  // Test d'approbation
  const testApproveOrder = async () => {
    setIsLoading(true);
    try {
      const { localOrdersAPI } = await import('../services/localOrdersAPI');
      
      // Trouver une commande en attente
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      const pendingOrder = orders.find(o => o.orderStatus === 'pending_approval');
      
      if (!pendingOrder) {
        setTestResults(prev => ({
          ...prev,
          approveOrder: '❌ Aucune commande en attente trouvée'
        }));
        setIsLoading(false);
        return;
      }

      const result = await localOrdersAPI.approveOrder(
        pendingOrder._id, 
        'Test d\'approbation automatique'
      );
      
      setTestResults(prev => ({
        ...prev,
        approveOrder: result.success ? '✅ Succès' : `❌ Erreur: ${result.error}`
      }));
      
      loadDebugInfo();
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        approveOrder: `❌ Erreur: ${error.message}`
      }));
    }
    setIsLoading(false);
  };

  // Test de rejet
  const testRejectOrder = async () => {
    setIsLoading(true);
    try {
      const { localOrdersAPI } = await import('../services/localOrdersAPI');
      
      // Trouver une commande en attente
      const orders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
      const pendingOrder = orders.find(o => o.orderStatus === 'pending_approval');
      
      if (!pendingOrder) {
        setTestResults(prev => ({
          ...prev,
          rejectOrder: '❌ Aucune commande en attente trouvée'
        }));
        setIsLoading(false);
        return;
      }

      const result = await localOrdersAPI.rejectOrder(
        pendingOrder._id,
        'Test de rejet automatique'
      );
      
      setTestResults(prev => ({
        ...prev,
        rejectOrder: result.success ? '✅ Succès' : `❌ Erreur: ${result.error}`
      }));
      
      loadDebugInfo();
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        rejectOrder: `❌ Erreur: ${error.message}`
      }));
    }
    setIsLoading(false);
  };

  // Test des notifications
  const testNotifications = () => {
    try {
      const notifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
      
      setTestResults(prev => ({
        ...prev,
        notifications: `📱 ${notifications.length} notifications trouvées (${notifications.filter(n => !n.read).length} non lues)`
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        notifications: `❌ Erreur: ${error.message}`
      }));
    }
  };

  // Réinitialiser les données de test
  const resetTestData = () => {
    localStorage.removeItem('clientOrders');
    localStorage.removeItem('admin_notifications');
    setDebugInfo({});
    setTestResults(null);
    loadDebugInfo();
  };

  useEffect(() => {
    loadDebugInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Bug className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Débogueur de Validation des Commandes
                </h1>
                <p className="text-gray-600">
                  Diagnostic et test du système de validation des commandes
                </p>
              </div>
            </div>
            <button
              onClick={loadDebugInfo}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>

          {/* Informations de débogage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">Commandes</h3>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {debugInfo.totalOrders || 0}
              </p>
              <p className="text-sm text-blue-700">
                Total dans localStorage
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-900">En Attente</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-900">
                {debugInfo.statusCounts?.pending_approval || 0}
              </p>
              <p className="text-sm text-yellow-700">
                À valider
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-900">Notifications</h3>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {debugInfo.notifications || 0}
              </p>
              <p className="text-sm text-green-700">
                {debugInfo.unreadNotifications || 0} non lues
              </p>
            </div>
          </div>

          {/* Répartition des statuts */}
          {debugInfo.statusCounts && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Répartition par Statut
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(debugInfo.statusCounts).map(([status, count]) => (
                  <div key={status} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-600 capitalize">
                      {status.replace('_', ' ')}
                    </p>
                    <p className="text-xl font-bold text-gray-900">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tests */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tests de Fonctionnalité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={testCreateOrder}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Créer Commande
              </button>
              
              <button
                onClick={testApproveOrder}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </button>
              
              <button
                onClick={testRejectOrder}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </button>
              
              <button
                onClick={testNotifications}
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </button>
            </div>
          </div>

          {/* Résultats des tests */}
          {testResults && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Résultats des Tests
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {Object.entries(testResults).map(([test, result]) => (
                  <div key={test} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span className="font-medium text-gray-700 capitalize">
                      {test.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions de maintenance */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Actions de Maintenance
              </h3>
              <p className="text-sm text-gray-600">
                Réinitialiser les données de test pour repartir à zéro
              </p>
            </div>
            <button
              onClick={resetTestData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Réinitialiser les Tests
            </button>
          </div>
        </div>

        {/* Dernière commande */}
        {debugInfo.lastOrder && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dernière Commande
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm text-gray-700 overflow-x-auto">
                {JSON.stringify(debugInfo.lastOrder, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Dernière notification */}
        {debugInfo.lastNotification && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dernière Notification
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre className="text-sm text-gray-700 overflow-x-auto">
                {JSON.stringify(debugInfo.lastNotification, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderValidationDebugger;
