import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categoriesAPI } from '../../services/api';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import ResetButton from '../../components/ResetButton';

const AdminCategories = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading } = useQuery(
    'admin-categories',
    () => categoriesAPI.getCategories(),
    {
      select: (response) => response.data.data.categories
    }
  );

  const createCategoryMutation = useMutation(categoriesAPI.createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-categories');
      toast.success('Catégorie créée avec succès');
      setIsAdding(false);
      setFormData({ name: '', description: '', image: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    }
  });

  const updateCategoryMutation = useMutation(
    ({ id, data }) => categoriesAPI.updateCategory(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-categories');
        toast.success('Catégorie mise à jour avec succès');
        setEditingCategory(null);
        setFormData({ name: '', description: '', image: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
      }
    }
  );

  const deleteCategoryMutation = useMutation(categoriesAPI.deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-categories');
      toast.success('Catégorie supprimée avec succès');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  });

  const categories = categoriesData || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory._id,
        data: formData
      });
    } else {
      createCategoryMutation.mutate(formData);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    });
    setIsAdding(true);
  };

  const handleDelete = (categoryId) => {
    // Utiliser une confirmation moderne avec toast
    toast((t) => (
      <div className="flex flex-col space-y-2">
        <span className="font-medium">Confirmer la suppression</span>
        <span className="text-sm text-gray-600">Êtes-vous sûr de vouloir supprimer cette catégorie ?</span>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => {
              deleteCategoryMutation.mutate(categoryId);
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          >
            Supprimer
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
    });
  };

  // Fonction de réinitialisation des catégories
  const handleResetCategories = async () => {
    try {
      // Vider toutes les données de catégories
      localStorage.removeItem('categories');
      localStorage.removeItem('adminCategories');
      localStorage.removeItem('categoryData');
      
      // Invalider le cache des requêtes
      queryClient.invalidateQueries('admin-categories');
      
      console.log('✅ Données de catégories réinitialisées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation des catégories:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestion des Catégories
              </h1>
              <p className="text-gray-600">
                Organisez vos produits par catégories
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsAdding(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une catégorie
              </button>
              <ResetButton
                onReset={handleResetCategories}
                resetType="catégories"
                confirmMessage="Êtes-vous sûr de vouloir réinitialiser toutes les catégories ? Cette action supprimera définitivement toutes les catégories et leurs données."
                variant="warning"
              />
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de la catégorie"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de la catégorie"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={createCategoryMutation.isLoading || updateCategoryMutation.isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {createCategoryMutation.isLoading || updateCategoryMutation.isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sauvegarde...
                    </div>
                  ) : (
                    editingCategory ? 'Mettre à jour' : 'Créer'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune catégorie
              </h3>
              <p className="text-gray-600 mb-6">
                Commencez par créer votre première catégorie
              </p>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une catégorie
              </button>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-1" />
                      {category.products?.length || 0} produit(s)
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {category.image && (
                  <div className="mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Créée le {new Date(category.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
