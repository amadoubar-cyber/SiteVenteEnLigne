import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react';

const StockDemo = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      
      // Charger les produits
      const savedProducts = localStorage.getItem('adminProducts');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }

      // Charger les mouvements
      const savedMovements = localStorage.getItem('stockMovements');
      if (savedMovements) {
        setMovements(JSON.parse(savedMovements));
      }

      // Charger les commandes
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStock = (productId) => {
    const productMovements = movements.filter(m => m.productId === productId);
    let stock = 0;
    
    productMovements.forEach(movement => {
      if (movement.type === 'in') {
        stock += movement.quantity;
      } else if (movement.type === 'out') {
        stock -= movement.quantity;
      }
    });
    
    return Math.max(0, stock);
  };

  const simulateOrder = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setDemoStep(0);

    // Étape 1: Créer une commande
    setTimeout(() => {
      setDemoStep(1);
      
      const newOrder = {
        id: Date.now(),
        orderNumber: `CMD-DEMO-${String(Date.now()).slice(-3)}`,
        customerName: 'Client Démo',
        customerPhone: '+224 123 456 789',
        items: [
          { productId: '2', productName: 'Téléphone Samsung', quantity: 3, price: 250000, total: 750000 }
        ],
        totalAmount: 750000,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      };

      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }, 1000);

    // Étape 2: Confirmer la commande
    setTimeout(() => {
      setDemoStep(2);
      
      const confirmedOrder = {
        ...orders[0],
        status: 'confirmed',
        updatedAt: new Date().toISOString().split('T')[0]
      };

      const updatedOrders = [confirmedOrder, ...orders.slice(1)];
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));

      // Créer les mouvements de stock
      const newMovements = [
        {
          id: Date.now() + Math.random(),
          productId: '2',
          productName: 'Téléphone Samsung',
          category: 'electronics',
          type: 'out',
          quantity: 3,
          reason: 'Vente client',
          notes: `Commande ${confirmedOrder.orderNumber} - ${confirmedOrder.customerName}`,
          date: new Date().toISOString().split('T')[0],
          images: [],
          reference: confirmedOrder.orderNumber,
          supplier: confirmedOrder.customerName
        }
      ];

      const updatedMovements = [...movements, ...newMovements];
      setMovements(updatedMovements);
      localStorage.setItem('stockMovements', JSON.stringify(updatedMovements));
    }, 3000);

    // Étape 3: Afficher le résultat
    setTimeout(() => {
      setDemoStep(3);
      setIsRunning(false);
    }, 5000);
  };

  const resetDemo = () => {
    setDemoStep(0);
    setIsRunning(false);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la démonstration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Démonstration : Mise à jour automatique du stock</h1>
          <p className="text-gray-600 mt-1">Voyez comment le stock diminue automatiquement quand une commande est confirmée</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetDemo}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
          <button
            onClick={simulateOrder}
            disabled={isRunning}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-5 h-5" />
            {isRunning ? 'Simulation en cours...' : 'Lancer la démonstration'}
          </button>
        </div>
      </div>

      {/* Étapes de la démonstration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border-2 ${demoStep >= 1 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${demoStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {demoStep >= 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <h3 className="ml-3 font-medium">Commande créée</h3>
          </div>
          <p className="text-sm text-gray-600">Un client passe une commande de 3 téléphones Samsung</p>
        </div>

        <div className={`p-4 rounded-lg border-2 ${demoStep >= 2 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${demoStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {demoStep >= 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <h3 className="ml-3 font-medium">Commande confirmée</h3>
          </div>
          <p className="text-sm text-gray-600">L'admin confirme la commande</p>
        </div>

        <div className={`p-4 rounded-lg border-2 ${demoStep >= 3 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${demoStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {demoStep >= 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
            </div>
            <h3 className="ml-3 font-medium">Mouvement créé</h3>
          </div>
          <p className="text-sm text-gray-600">Mouvement de sortie automatiquement créé</p>
        </div>

        <div className={`p-4 rounded-lg border-2 ${demoStep >= 3 ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          <div className="flex items-center mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${demoStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {demoStep >= 3 ? <CheckCircle className="w-5 h-5" /> : '4'}
            </div>
            <h3 className="ml-3 font-medium">Stock mis à jour</h3>
          </div>
          <p className="text-sm text-gray-600">Le stock diminue automatiquement</p>
        </div>
      </div>

      {/* État actuel du stock */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">État actuel du stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(product => {
            const currentStock = getCurrentStock(product._id);
            const initialStock = 20; // Stock initial pour la démo
            const stockChange = currentStock - initialStock;
            
            return (
              <div key={product._id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stockChange < 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {stockChange < 0 ? `${stockChange}` : `+${stockChange}`}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-blue-600">{currentStock}</div>
                  <div className="text-sm text-gray-500">unités en stock</div>
                </div>
                {stockChange < 0 && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Stock diminué de {Math.abs(stockChange)} unités
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Derniers mouvements */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Derniers mouvements de stock</h3>
        <div className="space-y-2">
          {movements.slice(0, 5).map(movement => (
            <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {movement.type === 'in' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{movement.productName}</div>
                  <div className="text-sm text-gray-600">{movement.reason}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                  {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                </div>
                <div className="text-sm text-gray-500">{movement.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Commandes récentes</h3>
        <div className="space-y-2">
          {orders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{order.orderNumber}</div>
                <div className="text-sm text-gray-600">{order.customerName}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{order.totalAmount.toLocaleString()} FG</div>
                <div className={`text-sm px-2 py-1 rounded-full ${
                  order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockDemo;
