import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  Search,
  Filter,
  Grid,
  List,
  Package,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  Upload,
  Calendar,
  BarChart3
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import useConfirmation from '../../hooks/useConfirmation';

const StockMovement = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showProductHistory, setShowProductHistory] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    type: 'in', // 'in' ou 'out'
    quantity: '',
    reason: '',
    category: 'construction',
    notes: '',
    images: [],
    date: new Date().toISOString().split('T')[0],
    reference: '', // Nouveau champ de référence
    supplier: '' // Nouveau champ fournisseur
  });
  const { confirmation, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();

  const categories = [
    { value: 'construction', label: 'Matériaux de Construction', color: 'bg-orange-100 text-orange-800' },
    { value: 'electronics', label: 'Électronique', color: 'bg-blue-100 text-blue-800' }
  ];

  const movementTypes = [
    { value: 'in', label: 'Entrée', icon: TrendingUp, color: 'text-green-600' },
    { value: 'out', label: 'Sortie', icon: TrendingDown, color: 'text-red-600' }
  ];

  const movementReasons = {
    in: [
      'Livraison fournisseur',
      'Retour client',
      'Inventaire positif',
      'Transfert entrant',
      'Production interne',
      'Ajustement stock'
    ],
    out: [
      'Vente client',
      'Perte/Casse',
      'Don/Échantillon',
      'Transfert sortant',
      'Inventaire négatif',
      'Vol',
      'Expiration',
      'Ajustement stock'
    ]
  };

  // Charger les données depuis localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      setLoading(true);
      
      // Charger les produits depuis localStorage
      const savedProducts = localStorage.getItem('adminProducts');
      if (savedProducts) {
        const productsData = JSON.parse(savedProducts);
        setProducts(productsData);
      }

      // Charger les mouvements depuis localStorage
      const savedMovements = localStorage.getItem('stockMovements');
      if (savedMovements) {
        const movementsData = JSON.parse(savedMovements);
        setMovements(movementsData);
        // Mettre à jour automatiquement les stocks basés sur les mouvements
        updateProductStocksFromMovements(movementsData);
      } else {
        // Données de test pour les mouvements
        const testMovements = [
          {
            id: 1,
            productId: '1',
            productName: 'Ciment Portland',
            category: 'construction',
            type: 'in',
            quantity: 50,
            reason: 'Livraison fournisseur',
            notes: 'Livraison du fournisseur Lafarge - Commande REF-2024-001',
            date: '2024-01-15',
            images: [],
            reference: 'REF-2024-001',
            supplier: 'Lafarge'
          },
          {
            id: 2,
            productId: '1',
            productName: 'Ciment Portland',
            category: 'construction',
            type: 'out',
            quantity: 10,
            reason: 'Vente client',
            notes: 'Vente à un client - Facture F-2024-001',
            date: '2024-01-16',
            images: [],
            reference: 'F-2024-001',
            supplier: 'Client ABC'
          },
          {
            id: 3,
            productId: '2',
            productName: 'Téléphone Samsung',
            category: 'electronics',
            type: 'in',
            quantity: 20,
            reason: 'Livraison fournisseur',
            notes: 'Commande Samsung - Référence CMD-2024-002',
            date: '2024-01-17',
            images: [],
            reference: 'CMD-2024-002',
            supplier: 'Samsung'
          },
          {
            id: 4,
            productId: '2',
            productName: 'Téléphone Samsung',
            category: 'electronics',
            type: 'out',
            quantity: 5,
            reason: 'Vente client',
            notes: 'Vente en magasin - Facture F-2024-002',
            date: '2024-01-18',
            images: [],
            reference: 'F-2024-002',
            supplier: 'Client XYZ'
          },
          {
            id: 5,
            productId: '1',
            productName: 'Ciment Portland',
            category: 'construction',
            type: 'out',
            quantity: 2,
            reason: 'Perte/Casse',
            notes: 'Produit endommagé lors du transport',
            date: '2024-01-19',
            images: [],
            reference: 'PER-2024-001',
            supplier: 'Interne'
          }
        ];
        setMovements(testMovements);
        localStorage.setItem('stockMovements', JSON.stringify(testMovements));
        // Mettre à jour automatiquement les stocks basés sur les mouvements
        updateProductStocksFromMovements(testMovements);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour automatiquement les stocks basés sur les mouvements
  const updateProductStocksFromMovements = (movementsData) => {
    const stockUpdates = {};
    
    // Calculer les stocks finaux pour chaque produit
    movementsData.forEach(movement => {
      if (!stockUpdates[movement.productId]) {
        stockUpdates[movement.productId] = 0;
      }
      
      if (movement.type === 'in') {
        stockUpdates[movement.productId] += movement.quantity;
      } else if (movement.type === 'out') {
        stockUpdates[movement.productId] -= movement.quantity;
      }
    });

    // Mettre à jour les produits avec les nouveaux stocks
    const updatedProducts = products.map(product => {
      if (stockUpdates[product._id] !== undefined) {
        return { ...product, stock: Math.max(0, stockUpdates[product._id]) };
      }
      return product;
    });

    setProducts(updatedProducts);
    localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
  };

  // Calculer les statistiques
  const getStatistics = () => {
    const stats = {
      totalEntries: 0,
      totalExits: 0,
      constructionEntries: 0,
      constructionExits: 0,
      electronicsEntries: 0,
      electronicsExits: 0,
      constructionStock: 0,
      electronicsStock: 0,
      constructionProducts: 0,
      electronicsProducts: 0
    };

    movements.forEach(movement => {
      if (movement.type === 'in') {
        stats.totalEntries += movement.quantity;
        if (movement.category === 'construction') {
          stats.constructionEntries += movement.quantity;
        } else if (movement.category === 'electronics') {
          stats.electronicsEntries += movement.quantity;
        }
      } else {
        stats.totalExits += movement.quantity;
        if (movement.category === 'construction') {
          stats.constructionExits += movement.quantity;
        } else if (movement.category === 'electronics') {
          stats.electronicsExits += movement.quantity;
        }
      }
    });

    // Calculer le stock actuel par catégorie
    stats.constructionStock = stats.constructionEntries - stats.constructionExits;
    stats.electronicsStock = stats.electronicsEntries - stats.electronicsExits;

    // Compter les produits uniques par catégorie
    const constructionProducts = new Set();
    const electronicsProducts = new Set();
    
    movements.forEach(movement => {
      if (movement.category === 'construction') {
        constructionProducts.add(movement.productId);
      } else if (movement.category === 'electronics') {
        electronicsProducts.add(movement.productId);
      }
    });

    stats.constructionProducts = constructionProducts.size;
    stats.electronicsProducts = electronicsProducts.size;

    return stats;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
      ...prev,
      [name]: value
      };
      
      // Si le type de mouvement change, réinitialiser la raison
      if (name === 'type') {
        newData.reason = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // En mode création, le produit est obligatoire
    if (!editingMovement && !formData.productId) {
      showConfirmation({
        title: '❌ Produit requis',
        message: 'Veuillez sélectionner un produit pour créer un nouveau mouvement.',
        type: 'danger',
        onConfirm: () => {}
      });
      return;
    }

    // En mode modification, utiliser le produit existant si aucun n'est sélectionné
    let product = null;
    let productId = formData.productId;
    let productName = '';

    if (formData.productId) {
      product = products.find(p => p._id === formData.productId);
      if (product) {
        productName = product.name;
      }
    } else if (editingMovement) {
      // En mode modification, garder le produit existant
      productId = editingMovement.productId;
      productName = editingMovement.productName;
    }

    const newMovement = {
      id: editingMovement ? editingMovement.id : Date.now(),
      productId: productId,
      productName: productName,
      category: formData.category,
      type: formData.type,
      quantity: parseInt(formData.quantity),
      reason: formData.reason,
      notes: formData.notes,
      date: formData.date,
      images: formData.images,
      reference: formData.reference,
      supplier: formData.supplier
    };

    let updatedMovements;
    if (editingMovement) {
      updatedMovements = movements.map(m => m.id === editingMovement.id ? newMovement : m);
    } else {
      updatedMovements = [newMovement, ...movements];
    }

    setMovements(updatedMovements);
    localStorage.setItem('stockMovements', JSON.stringify(updatedMovements));

    // Mettre à jour le stock du produit seulement si un produit est sélectionné
    if (productId && product) {
    const stockChange = formData.type === 'in' ? parseInt(formData.quantity) : -parseInt(formData.quantity);
      const updatedProducts = products.map(p => 
        p._id === productId 
          ? { ...p, stock: (p.stock || 0) + stockChange }
          : p
      );

      setProducts(updatedProducts);
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    }

    showConfirmation({
      title: '✅ Mouvement enregistré !',
      message: `Le mouvement de stock a été ${editingMovement ? 'modifié' : 'enregistré'} avec succès.`,
      type: 'success',
      onConfirm: () => {
    resetForm();
      }
    });
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      type: 'in',
      quantity: '',
      reason: '',
      category: 'construction',
      notes: '',
      images: [],
      date: new Date().toISOString().split('T')[0],
      reference: '',
      supplier: ''
    });
    setShowForm(false);
    setEditingMovement(null);
  };

  const handleEdit = (movement) => {
    setEditingMovement(movement);
    setFormData({
      productId: movement.productId ? movement.productId.toString() : '',
      type: movement.type,
      quantity: movement.quantity.toString(),
      reason: movement.reason,
      category: movement.category,
      notes: movement.notes,
      images: movement.images,
      date: movement.date || new Date().toISOString().split('T')[0],
      reference: movement.reference || '',
      supplier: movement.supplier || ''
    });
    setShowForm(true);
  };

  const handleDelete = (movementId) => {
    const movement = movements.find(m => m.id === movementId);
    
    showConfirmation({
      title: 'Supprimer un mouvement',
      message: `Êtes-vous sûr de vouloir supprimer ce mouvement de stock ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      icon: Trash2,
      details: [
        `Produit: ${movement?.productName || 'Inconnu'}`,
        `Type: ${movement?.type === 'in' ? 'Entrée' : 'Sortie'}`,
        `Quantité: ${movement?.quantity || 'Inconnue'}`,
        `Raison: ${movement?.reason || 'Aucune'}`
      ],
      onConfirm: () => {
        setMovements(prev => prev.filter(m => m.id !== movementId));
      }
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => file.name);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (imageIndex) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }));
  };

  // Obtenir l'historique des mouvements pour un produit spécifique
  const getProductHistory = (productId) => {
    return movements
      .filter(movement => movement.productId === productId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Calculer le stock actuel d'un produit basé sur ses mouvements
  const getCurrentStock = (productId) => {
    const productMovements = getProductHistory(productId);
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

  // Filtrer les produits selon le terme de recherche
  const getFilteredProducts = () => {
    if (!productSearchTerm) {
      return products;
    }
    
    return products.filter(product => 
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(productSearchTerm.toLowerCase()))
    );
  };

  // Filtrer les mouvements
  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (movement.reference && movement.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (movement.supplier && movement.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || movement.category === filterCategory;
    const matchesType = !filterType || movement.type === filterType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getMovementIcon = (type) => {
    const movementType = movementTypes.find(t => t.value === type);
    return movementType ? movementType.icon : Package;
  };

  const getMovementColor = (type) => {
    const movementType = movementTypes.find(t => t.value === type);
    return movementType ? movementType.color : 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des mouvements de stock...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mouvements de Stock</h1>
          <p className="text-gray-600 mt-1">Gérez les entrées et sorties de stock par catégorie</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Package className="w-5 h-5" />
            Recharger
          </button>
          <button
            onClick={() => {
              setShowProductHistory(!showProductHistory);
              if (showProductHistory) {
                // Réinitialiser la recherche quand on ferme
                setProductSearchTerm('');
                setSelectedProduct('');
              }
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <BarChart3 className="w-5 h-5" />
            Historique par Produit
          </button>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouveau Mouvement
        </button>
        </div>
      </div>

      {/* Statistiques par catégorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {(() => {
          const stats = getStatistics();
          return (
            <>
        {/* Matériaux de Construction */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Package className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900">Matériaux de Construction</h3>
              <p className="text-gray-600">Mouvements et quantités</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                      {stats.constructionEntries}
              </div>
              <div className="text-sm text-gray-600">Entrées</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                      {stats.constructionExits}
              </div>
              <div className="text-sm text-gray-600">Sorties</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Stock total actuel:</span>
              <span className="font-semibold">
                      {stats.constructionStock} unités
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Produits différents:</span>
              <span className="font-semibold">
                      {stats.constructionProducts} produits
              </span>
            </div>
          </div>
        </div>

        {/* Produits Électroniques */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900">Électronique</h3>
              <p className="text-gray-600">Mouvements et quantités</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                      {stats.electronicsEntries}
              </div>
              <div className="text-sm text-gray-600">Entrées</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                      {stats.electronicsExits}
              </div>
              <div className="text-sm text-gray-600">Sorties</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Stock total actuel:</span>
              <span className="font-semibold">
                      {stats.electronicsStock} unités
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Produits différents:</span>
              <span className="font-semibold">
                      {stats.electronicsProducts} produits
              </span>
            </div>
          </div>
        </div>
            </>
          );
        })()}
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {(() => {
          const stats = getStatistics();
          return (
            <>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Entrées Total</p>
              <p className="text-2xl font-bold text-gray-900">
                      {stats.totalEntries}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sorties Total</p>
              <p className="text-2xl font-bold text-gray-900">
                      {stats.totalExits}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mouvements Construction</p>
              <p className="text-2xl font-bold text-gray-900">
                {movements.filter(m => m.category === 'construction').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mouvements Électronique</p>
              <p className="text-2xl font-bold text-gray-900">
                {movements.filter(m => m.category === 'electronics').length}
              </p>
            </div>
          </div>
        </div>
            </>
          );
        })()}
      </div>

      {/* Historique des mouvements par produit */}
      {showProductHistory && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Historique des Mouvements par Produit</h3>
            <button
              onClick={() => setShowProductHistory(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher et sélectionner un produit pour voir son historique
            </label>
            
            {/* Champ de recherche */}
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un produit par nom, catégorie ou marque..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {productSearchTerm && (
                  <button
                    onClick={() => setProductSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Liste déroulante des produits filtrés */}
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choisir un produit...</option>
              {getFilteredProducts().map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - {product.category} (Stock: {getCurrentStock(product._id)})
                </option>
              ))}
            </select>
            
            {/* Message si aucun produit trouvé */}
            {productSearchTerm && getFilteredProducts().length === 0 && (
              <div className="mt-2 text-sm text-gray-500">
                Aucun produit trouvé pour "{productSearchTerm}"
              </div>
            )}
            
            {/* Message si des produits sont trouvés */}
            {productSearchTerm && getFilteredProducts().length > 0 && (
              <div className="mt-2 text-sm text-green-600">
                {getFilteredProducts().length} produit(s) trouvé(s)
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="space-y-4">
              {(() => {
                const product = products.find(p => p._id === selectedProduct);
                const productHistory = getProductHistory(selectedProduct);
                const currentStock = getCurrentStock(selectedProduct);
                
                if (!product) return null;
                
                return (
                  <>
                    {/* Résumé du produit */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{currentStock}</div>
                          <div className="text-sm text-gray-600">Stock actuel</div>
                        </div>
                      </div>
                    </div>

                    {/* Historique des mouvements */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Historique des mouvements ({productHistory.length})</h5>
                      {productHistory.length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {productHistory.map((movement, index) => {
                            const MovementIcon = getMovementIcon(movement.type);
                            const movementColor = getMovementColor(movement.type);
                            
                            return (
                              <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-lg ${movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <MovementIcon className={`h-4 w-4 ${movementColor}`} />
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="font-medium text-gray-900">
                                        {movement.type === 'in' ? 'Entrée' : 'Sortie'}
                                      </span>
                                      <span className={`text-sm font-medium ${movementColor}`}>
                                        {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-600">{movement.reason}</div>
                                    {movement.reference && (
                                      <div className="text-xs text-gray-500 font-mono">{movement.reference}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-900">{movement.date}</div>
                                  {movement.supplier && (
                                    <div className="text-xs text-gray-500">{movement.supplier}</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Aucun mouvement enregistré pour ce produit
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Filtres et recherche avancée */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recherche et Filtres</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
              placeholder="Rechercher par produit, raison..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            {movementTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              title="Vue grille"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
              title="Vue liste"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Champs de recherche avancée */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche par référence
            </label>
            <input
              type="text"
              placeholder="Ex: REF-2024-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recherche par fournisseur
            </label>
            <input
              type="text"
              placeholder="Ex: Lafarge, Samsung..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                placeholder="Date début"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="date"
                placeholder="Date fin"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des mouvements */}
      <div className="space-y-6">
        {/* Mouvements par catégorie */}
        {categories.filter(cat => cat.value !== '').map(category => {
          const categoryMovements = filteredMovements.filter(m => m.category === category.value);
          if (categoryMovements.length === 0) return null;

          return (
            <div key={category.value} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-600">
                      {categoryMovements.length} mouvement{categoryMovements.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total entrées</div>
                  <div className="text-lg font-bold text-green-600">
                    +{categoryMovements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.quantity, 0)}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-600">Total sorties</div>
                  <div className="text-lg font-bold text-red-600">
                    -{categoryMovements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.quantity, 0)}
                  </div>
                </div>
              </div>

              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {categoryMovements.map((movement) => {
                  const MovementIcon = getMovementIcon(movement.type);
                  const movementColor = getMovementColor(movement.type);
                  
                  return (
                    <div key={movement.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'}`}>
                            <MovementIcon className={`h-4 w-4 ${movementColor}`} />
                          </div>
                          <div className="ml-2">
                            <h4 className="font-medium text-gray-900 text-sm">{movement.productName}</h4>
                            <p className="text-xs text-gray-600">{movement.reason}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${movementColor}`}>
                          {movement.type === 'in' ? 'Entrée' : 'Sortie'}
                        </span>
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Quantité:</span>
                          <span className={`font-medium ${movementColor}`}>
                            {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Date:</span>
                          <span className="text-gray-900">{movement.date}</span>
                        </div>
                        {movement.reference && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Référence:</span>
                            <span className="text-gray-900 font-mono">{movement.reference}</span>
                          </div>
                        )}
                        {movement.supplier && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Fournisseur:</span>
                            <span className="text-gray-900">{movement.supplier}</span>
                          </div>
                        )}
                        {movement.notes && (
                          <div className="text-xs">
                            <span className="text-gray-600">Notes:</span>
                            <p className="text-gray-900 mt-1">{movement.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Images */}
                      {movement.images && movement.images.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-1">Images:</p>
                          <div className="flex gap-1">
                            {movement.images.slice(0, 3).map((image, index) => (
                              <div key={index} className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-gray-400" />
                              </div>
                            ))}
                            {movement.images.length > 3 && (
                              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                +{movement.images.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(movement)}
                          className="flex-1 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-100 flex items-center justify-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(movement.id)}
                          className="flex-1 bg-red-50 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-100 flex items-center justify-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMovements.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm || filterCategory || filterType ? 'Aucun mouvement trouvé' : 'Aucun mouvement de stock'}
          </p>
          {!searchTerm && !filterCategory && !filterType && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Créer le premier mouvement
            </button>
          )}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingMovement ? 'Modifier le mouvement' : 'Nouveau mouvement'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Produit {!editingMovement && '*'}
                    </label>
                    <select
                      name="productId"
                      value={formData.productId}
                      onChange={handleChange}
                      required={!editingMovement}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner un produit</option>
                      {products
                        .filter(p => p.category === formData.category)
                        .map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name} (Stock: {product.stock || 0})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de mouvement *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {movementTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raison *
                  </label>
                    <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner une raison...</option>
                      {movementReasons[formData.type]?.map(reason => (
                        <option key={reason} value={reason}>{reason}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Référence
                    </label>
                    <input
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      placeholder="Ex: REF-2024-001, CMD-123..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fournisseur/Client
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="Ex: Lafarge, Samsung, Client ABC..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Notes supplémentaires..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Cliquez pour ajouter des images</span>
                    </label>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <span className="text-xs text-gray-600 block mt-1 truncate w-16">{image}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingMovement ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation personnalisée */}
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        type={confirmation.type}
        icon={confirmation.icon}
        details={confirmation.details}
      />
    </div>
  );
};

export default StockMovement;

