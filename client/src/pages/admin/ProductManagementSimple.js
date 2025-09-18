import React, { useState, useEffect } from 'react';
import SimpleImageUpload from '../../components/SimpleImageUpload';
import ImageGallery from '../../components/ImageGallery';
import ConfirmationDialog from '../../components/ConfirmationDialog';
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
  CheckCircle, 
  XCircle as XCircleIcon, 
  UploadCloud, 
  Star, 
  EyeOff 
} from 'lucide-react';

const ProductManagementSimple = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null, productName: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    productType: 'construction',
    category: 'Matériaux de Construction',
    featured: false,
    isPublished: false,
    images: [],
  });

  // Charger les produits depuis localStorage au démarrage
  useEffect(() => {
    const savedProducts = localStorage.getItem('koula_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Données de test par défaut
      const defaultProducts = [
        {
          _id: '1',
          name: 'Ciment Portland',
          description: 'Ciment de haute qualité pour construction',
          price: 15000,
          stock: 50,
          productType: 'construction',
          category: 'Matériaux de Construction',
          featured: true,
          isPublished: true,
          images: [{ url: '/test-image-1.jpg' }]
        },
        {
          _id: '2',
          name: 'Tôle Galvanisée',
          description: 'Tôle galvanisée 2mm d\'épaisseur',
          price: 25000,
          stock: 30,
          productType: 'construction',
          category: 'Matériaux de Construction',
          featured: false,
          isPublished: true,
          images: [{ url: '/test-image-2.jpg' }]
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('koula_products', JSON.stringify(defaultProducts));
    }
  }, []);

  // Sauvegarder les produits dans localStorage
  const saveProducts = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('koula_products', JSON.stringify(newProducts));
  };

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterType || product.productType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      // Utiliser les images uploadées ou une image par défaut
      images: formData.images.length > 0 ? formData.images : [{ url: `/test-image-${Math.floor(Math.random() * 2) + 1}.jpg` }]
    };

    if (editingProduct) {
      // Modifier un produit existant
      const updatedProducts = products.map(p => 
        p._id === editingProduct._id 
          ? { ...p, ...productData, _id: editingProduct._id }
          : p
      );
      saveProducts(updatedProducts);
      alert('✅ Produit modifié avec succès !');
    } else {
      // Créer un nouveau produit
      const newProduct = {
        ...productData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      saveProducts([...products, newProduct]);
      alert('✅ Produit créé avec succès !');
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      productType: product.productType,
      category: product.category,
      featured: product.featured || false,
      isPublished: product.isPublished || false,
      images: product.images || [],
    });
    setShowForm(true);
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
    const updatedProducts = products.filter(p => p._id !== deleteConfirm.productId);
    saveProducts(updatedProducts);
    setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
    alert('🗑️ Produit supprimé avec succès !');
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
  };

  const handleTogglePublish = (product) => {
    const updatedProducts = products.map(p => 
      p._id === product._id 
        ? { ...p, isPublished: !p.isPublished }
        : p
    );
    saveProducts(updatedProducts);
    alert(`📢 Produit ${!product.isPublished ? 'publié' : 'dépublié'} avec succès !`);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      productType: 'construction',
      category: 'Matériaux de Construction',
      featured: false,
      isPublished: false,
      images: [],
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const openImageGallery = (productImages) => {
    setGalleryImages(productImages);
    setIsGalleryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="mt-2 text-gray-600">Gérez votre inventaire de produits</p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Tous les types</option>
                  <option value="construction">Matériaux de Construction</option>
                  <option value="electronics">Électronique</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* Formulaire d'ajout/édition */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full relative">
              <button
                onClick={resetForm}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <SimpleImageUpload
                  onImagesChange={handleImagesChange}
                  existingImages={formData.images}
                  maxImages={5}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de produit *
                    </label>
                    <select
                      required
                      value={formData.productType}
                      onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="construction">Matériaux de Construction</option>
                      <option value="electronics">Électronique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (FG) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                      Produit vedette
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                      Publier immédiatement
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="relative cursor-pointer group"
                        onClick={() => product.images?.length > 0 && openImageGallery(product.images)}
                      >
                        <img
                          src={product.images?.[0]?.url || '/placeholder-product.svg'}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover group-hover:opacity-80 transition-opacity"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.svg';
                          }}
                        />
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      {product.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                          <Star className="w-3 h-3 mr-1" /> Vedette
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price.toLocaleString()} FG
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isPublished ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(product)}
                          className={`p-1 rounded-md ${product.isPublished ? 'text-red-600 hover:text-red-900 hover:bg-red-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'}`}
                          title={product.isPublished ? 'Dépublier' : 'Publier'}
                        >
                          {product.isPublished ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun produit trouvé.
            </div>
          )}
        </div>

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
    </div>
  );
};

export default ProductManagementSimple;
