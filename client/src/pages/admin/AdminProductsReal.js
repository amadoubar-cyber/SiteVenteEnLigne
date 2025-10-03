import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Package,
  X,
  Upload,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import useConfirmation from '../../hooks/useConfirmation';
import ConfirmationModal from '../../components/ConfirmationModal';
import ImageGallery from '../../components/ImageGallery';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import SimpleImageUpload from '../../components/SimpleImageUpload';
import localProductsAPI from '../../services/localProductsAPI';

const AdminProductsReal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, published, draft
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    productType: '',
    stock: '',
    brand: '',
    images: [],
    isPublished: false,
    isFeatured: false
  });

  const { showConfirmation, hideConfirmation, confirmation } = useConfirmation();

  // États pour la galerie d'images et la confirmation de suppression
  const [galleryImages, setGalleryImages] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null, productName: '' });

  const [categories, setCategories] = useState([
    { _id: '1', name: 'Matériaux de Construction' },
    { _id: '2', name: 'Électronique' }
  ]);

  // Charger les produits et catégories depuis localStorage
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Utiliser l'API hybride (backend + localStorage)
      const response = await localProductsAPI.getAll();
      if (response.data.success) {
        setProducts(response.data.data);
        console.log(`📦 ${response.data.data.length} produits chargés`);
      } else {
        setProducts([]);
        console.log('📦 Aucun produit trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de synchronisation
  const syncProducts = async () => {
    try {
      setLoading(true);
      const result = await localProductsAPI.syncProducts();
      if (result.success) {
        console.log(`✅ ${result.count} produits synchronisés`);
        await loadProducts(); // Recharger après synchronisation
      } else {
        console.error('❌ Erreur de synchronisation:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de synchronisation des images
  const syncImages = async () => {
    try {
      setLoading(true);
      const result = await localProductsAPI.syncAllImages();
      if (result.success) {
        console.log(`✅ ${result.count} produits avec images synchronisés`);
        await loadProducts(); // Recharger après synchronisation
        showConfirmation({
          title: '✅ Images synchronisées !',
          message: `${result.count} produits avec images ont été synchronisés avec succès.`,
          type: 'success',
          onConfirm: () => {}
        });
      } else {
        console.error('❌ Erreur de synchronisation des images:', result.error);
        showConfirmation({
          title: '❌ Erreur de synchronisation',
          message: `Erreur lors de la synchronisation des images: ${result.error}`,
          type: 'danger',
          onConfirm: () => {}
        });
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation des images:', error);
      showConfirmation({
        title: '❌ Erreur',
        message: `Erreur lors de la synchronisation des images: ${error.message}`,
        type: 'danger',
        onConfirm: () => {}
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = () => {
      setCategories([
        { _id: '1', name: 'Matériaux de Construction' },
      { _id: '2', name: 'Électronique' },
      { _id: '3', name: 'Vêtements' },
      { _id: '4', name: 'Alimentation' }
      ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!newProduct.name || !newProduct.price || !newProduct.category) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        productType: newProduct.productType,
        stock: parseInt(newProduct.stock) || 0,
        brand: newProduct.brand,
        images: newProduct.images.map(img => typeof img === 'string' ? { url: img } : img),
        isPublished: newProduct.isPublished,
        isFeatured: newProduct.isFeatured
      };

      if (editingProduct) {
        // Modification : mettre à jour localement
        const updatedProducts = products.map(p => 
          p._id === editingProduct._id 
            ? { ...p, ...productData, updatedAt: new Date().toISOString() }
            : p
        );
        
        setProducts(updatedProducts);
        localStorage.setItem('koula_products', JSON.stringify(updatedProducts));
        
        showConfirmation({
          title: '✅ Produit modifié avec succès !',
          message: `Le produit "${newProduct.name}" a été modifié avec succès.`,
          type: 'success',
          onConfirm: () => {}
        });
      } else {
        // Création : utiliser l'API backend
        const result = await localProductsAPI.addProduct(productData);
        
        if (result.success) {
          // Recharger les produits pour avoir la version synchronisée
          await loadProducts();
          
          showConfirmation({
            title: '✅ Produit créé avec succès !',
            message: `Le produit "${newProduct.name}" a été créé et synchronisé avec succès.`,
            type: 'success',
            onConfirm: () => {}
          });
        } else {
          throw new Error(result.error || 'Erreur lors de la création');
        }
      }

      // Fermer le modal et vider les champs
      closeModal();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit:', error);
      showConfirmation({
        title: '❌ Erreur lors de la sauvegarde',
        message: `Impossible de sauvegarder le produit : ${error.message}`,
        type: 'danger',
        onConfirm: () => {}
      });
    }
  };

  const handleDelete = (productId) => {
    const product = products.find(p => p._id === productId);
    setDeleteConfirm({
      isOpen: true,
      productId: productId,
      productName: product?.name || 'ce produit'
    });
  };

  const confirmDelete = () => {
    try {
      // Supprimer le produit de la liste locale
      const updatedProducts = products.filter(p => p._id !== deleteConfirm.productId);
      setProducts(updatedProducts);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('koula_products', JSON.stringify(updatedProducts));
      
      // Message de confirmation
      showConfirmation({
        title: '✅ Produit supprimé !',
        message: `Le produit "${deleteConfirm.productName}" a été supprimé avec succès.`,
        type: 'success',
        onConfirm: () => {}
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showConfirmation({
        title: '❌ Erreur lors de la suppression',
        message: `Impossible de supprimer le produit : ${error.message}`,
        type: 'danger',
        onConfirm: () => {}
      });
    }
    setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
  };

  const openImageGallery = (productImages) => {
    setGalleryImages(productImages);
    setIsGalleryOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      productType: product.productType,
      stock: product.stock.toString(),
      brand: product.brand,
      images: product.images || []
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      productType: '',
      stock: '',
      brand: '',
      images: [],
      isPublished: false,
      isFeatured: false
    });
  };

  const togglePublish = (productId) => {
    const updatedProducts = products.map(product => {
      if (product._id === productId) {
        return { ...product, isPublished: !product.isPublished };
      }
      return product;
    });
    
    setProducts(updatedProducts);
    localStorage.setItem('koula_products', JSON.stringify(updatedProducts));
    
    const product = products.find(p => p._id === productId);
    showConfirmation({
      title: product.isPublished ? '📤 Produit dépublié !' : '📢 Produit publié !',
      message: `Le produit "${product.name}" est maintenant ${product.isPublished ? 'dépublié' : 'publié'}.`,
      type: 'success',
      onConfirm: () => {}
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && product.isPublished) ||
                         (statusFilter === 'draft' && !product.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Produits</h1>
        <p className="text-gray-600">Gérez votre inventaire de produits</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
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
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un produit
          </button>
          <button
            onClick={syncProducts}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
            title="Synchroniser avec le backend"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Synchroniser
          </button>
          <button
            onClick={syncImages}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            title="Synchroniser les images"
          >
            <ImageIcon className="h-5 w-5 mr-2" />
            Sync Images
          </button>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="flex-shrink-0 h-12 w-12 relative cursor-pointer group"
                          onClick={() => product.images?.length > 0 && openImageGallery(product.images)}
                        >
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover group-hover:opacity-80 transition-opacity"
                              src={product.images[0].url || product.images[0]}
                              alt={product.name}
                              onError={(e) => {
                                console.log('Erreur image:', product.images[0]);
                                e.target.src = '/placeholder-product.svg';
                              }}
                              onLoad={() => {
                                console.log('Image chargée:', product.images[0]);
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          {product.images?.length > 1 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {product.images.length}
                            </div>
                          )}
                          {product.images?.length > 0 && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                                Voir
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.isFeatured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Vedette
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                          <div className="mt-1">
                            {product.isPublished ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                ✅ Publié
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                📝 Brouillon
                              </span>
                            )}
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
                      {product.price} FG
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock || product.countInStock || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => togglePublish(product._id)}
                          className={`${product.isPublished ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                          title={product.isPublished ? 'Dépublier' : 'Publier'}
                        >
                          {product.isPublished ? '📤' : '📢'}
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
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

      {/* Modal d'ajout de produit */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Informations du produit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (FG) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      name="category"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(category => (
                        <option key={category._id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de produit *
                    </label>
                    <input
                      type="text"
                      name="productType"
                      value={newProduct.productType}
                      onChange={handleInputChange}
                      placeholder="Ex: Smartphone, Ciment, Télévision, etc."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité en stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marque
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={newProduct.brand}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Description du produit (optionnel)"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images du produit
                  </label>
                  <SimpleImageUpload
                    images={newProduct.images}
                    onImagesChange={(images) => setNewProduct(prev => ({ ...prev, images }))}
                    maxImages={5}
                  />
                </div>

                {/* Options de publication */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">📢 Options de Publication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPublished"
                        name="isPublished"
                        checked={newProduct.isPublished}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, isPublished: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isPublished" className="ml-2 text-sm font-medium text-gray-700">
                        Publier immédiatement (visible sur le site public)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={newProduct.isFeatured}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-700">
                        Mettre en vedette (produit mis en avant)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingProduct ? 'Modifier le produit' : 'Créer le produit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isVisible={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        type={confirmation.type}
        onConfirm={confirmation.handleConfirm}
        onCancel={hideConfirmation}
      />

      {/* Galerie d'images */}
      <ImageGallery
        images={galleryImages}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      {/* Dialog de confirmation de suppression */}
      <ConfirmationDialog
        isOpen={deleteConfirm.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm.productName}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
};

export default AdminProductsReal;
