import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productsAPI } from '../../services/api';
import * as localStorageAPI from '../../services/localStorageAPI';
import { initializeProductSystem } from '../../utils/productPersistenceFix';
import ImageUpload from '../../components/admin/ImageUpload';
import ConfirmationModal from '../../components/ConfirmationModal';
import ConfirmationMessage from '../../components/ConfirmationMessage';
import SuccessModal from '../../components/SuccessModal';
import ImageGallery from '../../components/ImageGallery';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { getImageUrl, handleImageError, handleImageLoad } from '../../utils/imageUtils';
import useConfirmation from '../../hooks/useConfirmation';
import useConfirmationMessage from '../../hooks/useConfirmationMessage';
import useSuccessModal from '../../hooks/useSuccessModal';
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
  EyeOff,
  CheckCircle
} from 'lucide-react';
import ResetButton from '../../components/ResetButton';

const ProductManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: 0,
    stock: '',
    productType: 'construction',
    category: '',
    featured: false,
    images: [],
    isPublished: true
  });
  const { confirmation, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();
  const { message, showSuccess, showError, showWarning, showInfo, hideMessage } = useConfirmationMessage();
  const { isOpen: isSuccessModalOpen, modalData, showSuccess: showSuccessModal, hideSuccess: hideSuccessModal } = useSuccessModal();
  
  // États pour la galerie d'images et la confirmation de suppression
  const [galleryImages, setGalleryImages] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null, productName: '' });

  const queryClient = useQueryClient();

  // Initialiser et corriger le système de persistance des produits
  useEffect(() => {
    console.log('🔧 Initialisation du système de produits...');
    const initResult = initializeProductSystem();
    if (initResult.success) {
      console.log(`✅ ${initResult.productCount} produits chargés`);
    } else {
      console.error('❌ Erreur d\'initialisation:', initResult.error);
    }
  }, []);

  // Récupérer les produits depuis localStorage
  const { data: products, isLoading } = useQuery(
    ['products', searchTerm, filterType],
    () => {
      console.log('🔄 Chargement des produits...');
      const allProducts = localStorageAPI.getAllProducts();
      console.log(`📊 ${allProducts.length} produits chargés depuis localStorage`);
      
      let filteredProducts = allProducts;
      
      // Filtrer par terme de recherche
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log(`🔍 ${filteredProducts.length} produits après filtrage par recherche`);
      }
      
      // Filtrer par type de produit
      if (filterType) {
        filteredProducts = filteredProducts.filter(product =>
          product.productType === filterType
        );
        console.log(`🔍 ${filteredProducts.length} produits après filtrage par type`);
      }
      
      console.log(`✅ ${filteredProducts.length} produits retournés`);
      return { data: filteredProducts };
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  );

  // Récupérer les catégories
  const { data: categories } = useQuery('categories', localStorageAPI.getCategories);

  // Mutation pour créer/modifier un produit
  const createProductMutation = useMutation(localStorageAPI.createProduct, {
    onSuccess: (response) => {
      console.log('✅ Produit créé avec succès:', response.data.product);
      queryClient.invalidateQueries('products');
      resetForm();
      showSuccessModal(
        "Produit créé avec succès !",
        "Votre produit a été ajouté et est maintenant visible.",
        response.data.product.name
      );
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la création du produit:', error);
      showError(error.message || 'Une erreur est survenue lors de la création du produit. Veuillez réessayer.');
    }
  });

  const updateProductMutation = useMutation(
    ({ id, data }) => localStorageAPI.updateProduct(id, data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('products');
        resetForm();
        showSuccess(`✅ Le produit "${response.data.product.name}" a été modifié avec succès !`);
      },
      onError: (error) => {
        showError(error.message || 'Une erreur est survenue lors de la modification du produit. Veuillez réessayer.');
      }
    }
  );

  const deleteProductMutation = useMutation(localStorageAPI.deleteProduct, {
    onSuccess: (response, productId) => {
      queryClient.invalidateQueries('products');
      const productName = products?.find(p => p._id === productId)?.name || 'le produit';
      showSuccess(`🗑️ ${productName} a été supprimé avec succès !`);
    },
    onError: (error) => {
      showError(error.message || 'Une erreur est survenue lors de la suppression du produit. Veuillez réessayer.');
    }
  });

  const togglePublishMutation = useMutation(
    ({ id, published }) => localStorageAPI.updateProduct(id, { isPublished: published }),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('products');
        const action = response.data.product.isPublished ? 'publié' : 'dépublié';
        showSuccess(`📢 Le produit a été ${action} avec succès !`);
      },
      onError: (error) => {
        showError('Erreur lors de la modification du statut de publication');
      }
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPercentage: 0,
      stock: '',
      productType: 'construction',
      category: '',
      featured: false,
      images: [],
      isPublished: true
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      discountPercentage: parseFloat(formData.discountPercentage)
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discountPercentage: product.discountPercentage || 0,
      stock: product.stock.toString(),
      productType: product.productType,
      category: product.category?._id || '',
      featured: product.featured || false,
      images: product.images || [],
      published: product.published !== false
    });
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    const product = products?.find(p => p._id === productId);
    setDeleteConfirm({
      isOpen: true,
      productId: productId,
      productName: product?.name || 'ce produit'
    });
  };

  const confirmDelete = () => {
    deleteProductMutation.mutate(deleteConfirm.productId);
    setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, productId: null, productName: '' });
  };

  const handleTogglePublish = (product) => {
    togglePublishMutation.mutate({ 
      id: product._id, 
      published: !product.published 
    });
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const openImageGallery = (productImages) => {
    setGalleryImages(productImages);
    setIsGalleryOpen(true);
  };

  // Fonction de réinitialisation des produits
  const handleResetProducts = async () => {
    try {
      // Vider toutes les données de produits
      localStorage.removeItem('koula_products');
      localStorage.removeItem('adminProducts');
      localStorage.removeItem('productsData');
      
      // Invalider le cache des requêtes
      queryClient.invalidateQueries('products');
      
      console.log('✅ Données de produits réinitialisées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation des produits:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
      
      {/* Modal de succès */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={hideSuccessModal}
        title={modalData.title}
        message={modalData.message}
        productName={modalData.productName}
      />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600 mt-1">Gérez votre inventaire de produits</p>
        </div>
        <div className="flex gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter un produit
        </button>
          <ResetButton
            onReset={handleResetProducts}
            resetType="produits"
            confirmMessage="Êtes-vous sûr de vouloir réinitialiser tous les produits ? Cette action supprimera définitivement tous les produits, images et données associées."
            variant="danger"
          />
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
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
          <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
              <option value="">Toutes les catégories</option>
            <option value="construction">Matériaux de Construction</option>
            <option value="electronics">Électronique</option>
          </select>
            <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
                <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
                <List className="w-4 h-4" />
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images du produit
                  </label>
                  <ImageUpload
                    onImagesChange={handleImagesChange}
                    maxImages={5}
                    existingImages={formData.images}
                  />
                </div>

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
                      step="0.01"
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
                      Remise (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="construction">Matériaux de Construction</option>
                      <option value="electronics">Électronique</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-6">
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
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-700">
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
                    disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
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
                  PRODUIT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CATÉGORIE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PRIX
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STOCK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
        {products?.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="flex-shrink-0 h-12 w-12 relative cursor-pointer group"
                        onClick={() => product.images?.length > 0 && openImageGallery(product.images)}
                      >
                        <img
                          className="h-12 w-12 rounded-lg object-cover group-hover:opacity-80 transition-opacity"
                          src={product.images?.[0]?.url ? `/test-image-${product._id.charCodeAt(0) % 2 + 1}.jpg` : '/placeholder-product.svg'}
                    alt={product.name}
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
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                  </div>
                </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.productType === 'construction' ? 'Matériaux de Construction' : 'Électronique'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString()} FG
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.published !== false 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.published !== false ? 'Publié' : 'Brouillon'}
                    </span>
                      {product.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Vedette
                      </span>
                    )}
                  </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(product)}
                        className={`p-1 rounded ${
                          product.published !== false 
                            ? 'text-orange-600 hover:text-orange-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={product.published !== false ? 'Dépublier' : 'Publier'}
                      >
                        {product.published !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                  </div>
      </div>

      {products?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
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

export default ProductManagement;
