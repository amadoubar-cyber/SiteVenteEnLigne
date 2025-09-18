import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Save,
  X,
  Upload
} from 'lucide-react';

const AdminProductsCompleteFixed = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: []
  });

  const categories = [
    'Matériaux de Construction',
    'Électronique'
  ];

  // Charger les données depuis l'API
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        // TODO: Remplacer par un appel API réel
        // const response = await productsAPI.getProducts();
        // setProducts(response.data);
        // setFilteredProducts(response.data);
        
        // Pour l'instant, commencer avec des données vides
        setProducts([]);
        setFilteredProducts([]);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Filtrer les produits
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.stock) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    setProducts([product, ...products]);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: []
    });
    setShowAddModal(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images || []
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.stock) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const updatedProduct = {
      ...editingProduct,
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock)
    };

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setShowEditModal(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      images: []
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Produits</h1>
        <p className="text-gray-600">Gérez votre catalogue de produits</p>
      </div>

      {/* Header avec bouton d'ajout */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter un produit
            </button>
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory 
                ? 'Aucun produit ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier produit.'
              }
            </p>
            {!searchTerm && !selectedCategory && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter un produit
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={product.images[0].url}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal - COMPLET AVEC IMAGES */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Ajouter un produit</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Nom du produit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom du produit"
                  />
                </div>

                {/* Section d'images - TRÈS VISIBLE */}
                <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-6">
                  <label className="block text-xl font-bold text-yellow-800 mb-4">
                    📷 IMAGES DU PRODUIT
                  </label>
                  <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">📷</div>
                    <p className="text-lg text-blue-700 font-semibold mb-3">
                      Section d'upload d'images
                    </p>
                    <p className="text-gray-600 mb-4">
                      Glissez-déposez vos images ici ou cliquez pour sélectionner
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const newImages = files.map(file => ({
                          url: URL.createObjectURL(file),
                          filename: file.name,
                          description: ''
                        }));
                        setNewProduct({...newProduct, images: [...newProduct.images, ...newImages]});
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                    />
                    {newProduct.images.length > 0 && (
                      <div className="mt-6 bg-green-50 border-2 border-green-400 rounded-lg p-4">
                        <p className="text-green-800 font-bold text-lg mb-4">
                          ✅ Images sélectionnées ({newProduct.images.length}/5):
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {newProduct.images.map((img, index) => (
                            <div key={index} className="relative bg-white rounded-lg border-2 border-gray-200 p-3">
                              <div className="relative">
                                <img
                                  src={img.url}
                                  alt={img.filename}
                                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = newProduct.images.filter((_, i) => i !== index);
                                    setNewProduct({...newProduct, images: newImages});
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600"
                                >
                                  ×
                                </button>
                                {index === 0 && (
                                  <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                    Principale
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-900 truncate" title={img.filename}>
                                  {img.filename}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Image {index + 1} de {newProduct.images.length}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Description du produit"
                  />
                </div>

                {/* Prix et Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (FG) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Matériaux de Construction">Matériaux de Construction</option>
                    <option value="Électronique">Électronique</option>
                  </select>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Créer le produit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal - SIMILAIRE AU ADD */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Modifier le produit</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Nom du produit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom du produit"
                  />
                </div>

                {/* Section d'images - TRÈS VISIBLE */}
                <div className="bg-yellow-100 border-4 border-yellow-400 rounded-lg p-6">
                  <label className="block text-xl font-bold text-yellow-800 mb-4">
                    📷 IMAGES DU PRODUIT
                  </label>
                  <div className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">📷</div>
                    <p className="text-lg text-blue-700 font-semibold mb-3">
                      Section d'upload d'images
                    </p>
                    <p className="text-gray-600 mb-4">
                      Glissez-déposez vos images ici ou cliquez pour sélectionner
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const newImages = files.map(file => ({
                          url: URL.createObjectURL(file),
                          filename: file.name,
                          description: ''
                        }));
                        setNewProduct({...newProduct, images: [...newProduct.images, ...newImages]});
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                    />
                    {newProduct.images.length > 0 && (
                      <div className="mt-6 bg-green-50 border-2 border-green-400 rounded-lg p-4">
                        <p className="text-green-800 font-bold text-lg mb-4">
                          ✅ Images sélectionnées ({newProduct.images.length}/5):
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {newProduct.images.map((img, index) => (
                            <div key={index} className="relative bg-white rounded-lg border-2 border-gray-200 p-3">
                              <div className="relative">
                                <img
                                  src={img.url}
                                  alt={img.filename}
                                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = newProduct.images.filter((_, i) => i !== index);
                                    setNewProduct({...newProduct, images: newImages});
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600"
                                >
                                  ×
                                </button>
                                {index === 0 && (
                                  <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                    Principale
                                  </div>
                                )}
                                <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-900 truncate" title={img.filename}>
                                  {img.filename}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Image {index + 1} de {newProduct.images.length}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Description du produit"
                  />
                </div>

                {/* Prix et Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (FG) *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="Matériaux de Construction">Matériaux de Construction</option>
                    <option value="Électronique">Électronique</option>
                  </select>
                </div>

                {/* Boutons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleUpdateProduct}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Mettre à jour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsCompleteFixed;
