import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  Package,
  Save,
  X,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen
} from 'lucide-react';

const AdminCategoriesComplete = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: null,
    isActive: true,
    sortOrder: 0
  });

  // Simuler le chargement des données
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCategories = [
        {
          id: 1,
          name: 'Matériaux de construction',
          description: 'Ciment, briques, tôles et autres matériaux de construction',
          parentId: null,
          isActive: true,
          sortOrder: 1,
          productCount: 25,
          createdAt: '2024-01-01T00:00:00Z',
          children: [
            {
              id: 11,
              name: 'Ciment et mortier',
              description: 'Ciment Portland, mortier, colle',
              parentId: 1,
              isActive: true,
              sortOrder: 1,
              productCount: 8,
              createdAt: '2024-01-01T00:00:00Z'
            },
            {
              id: 12,
              name: 'Briques et blocs',
              description: 'Briques, blocs de béton, parpaings',
              parentId: 1,
              isActive: true,
              sortOrder: 2,
              productCount: 12,
              createdAt: '2024-01-01T00:00:00Z'
            },
            {
              id: 13,
              name: 'Tôles et métaux',
              description: 'Tôles ondulées, tôles planes, fer à béton',
              parentId: 1,
              isActive: true,
              sortOrder: 3,
              productCount: 5,
              createdAt: '2024-01-01T00:00:00Z'
            }
          ]
        },
        {
          id: 2,
          name: 'Électronique',
          description: 'Téléphones, ordinateurs, accessoires électroniques',
          parentId: null,
          isActive: true,
          sortOrder: 2,
          productCount: 18,
          createdAt: '2024-01-01T00:00:00Z',
          children: [
            {
              id: 21,
              name: 'Téléphones',
              description: 'Smartphones, téléphones portables',
              parentId: 2,
              isActive: true,
              sortOrder: 1,
              productCount: 8,
              createdAt: '2024-01-01T00:00:00Z'
            },
            {
              id: 22,
              name: 'Ordinateurs',
              description: 'Laptops, ordinateurs de bureau',
              parentId: 2,
              isActive: true,
              sortOrder: 2,
              productCount: 5,
              createdAt: '2024-01-01T00:00:00Z'
            },
            {
              id: 23,
              name: 'Accessoires',
              description: 'Chargeurs, écouteurs, étuis',
              parentId: 2,
              isActive: true,
              sortOrder: 3,
              productCount: 5,
              createdAt: '2024-01-01T00:00:00Z'
            }
          ]
        },
        {
          id: 3,
          name: 'Plomberie',
          description: 'Tuyaux, robinets, accessoires de plomberie',
          parentId: null,
          isActive: true,
          sortOrder: 3,
          productCount: 32,
          createdAt: '2024-01-01T00:00:00Z',
          children: [
            {
              id: 31,
              name: 'Tuyaux et raccords',
              description: 'Tuyaux PVC, cuivre, raccords',
              parentId: 3,
              isActive: true,
              sortOrder: 1,
              productCount: 20,
              createdAt: '2024-01-01T00:00:00Z'
            },
            {
              id: 32,
              name: 'Robinetterie',
              description: 'Robinetts, mitigeurs, vannes',
              parentId: 3,
              isActive: true,
              sortOrder: 2,
              productCount: 12,
              createdAt: '2024-01-01T00:00:00Z'
            }
          ]
        },
        {
          id: 4,
          name: 'Électricité',
          description: 'Câbles, interrupteurs, accessoires électriques',
          parentId: null,
          isActive: true,
          sortOrder: 4,
          productCount: 28,
          createdAt: '2024-01-01T00:00:00Z',
          children: [
            {
              id: 41,
              name: 'Câbles et fils',
              description: 'Câbles électriques, fils de cuivre',
              parentId: 4,
              isActive: true,
              sortOrder: 1,
              productCount: 15,
              createdAt: '2024-01-01T00:00:00Z'
            },
            {
              id: 42,
              name: 'Interrupteurs et prises',
              description: 'Interrupteurs, prises, boîtiers',
              parentId: 4,
              isActive: true,
              sortOrder: 2,
              productCount: 13,
              createdAt: '2024-01-01T00:00:00Z'
            }
          ]
        },
        {
          id: 5,
          name: 'Peinture',
          description: 'Peintures, pinceaux, accessoires de peinture',
          parentId: null,
          isActive: true,
          sortOrder: 5,
          productCount: 15,
          createdAt: '2024-01-01T00:00:00Z',
          children: []
        },
        {
          id: 6,
          name: 'Outillage',
          description: 'Outils manuels et électriques',
          parentId: null,
          isActive: true,
          sortOrder: 6,
          productCount: 22,
          createdAt: '2024-01-01T00:00:00Z',
          children: []
        }
      ];

      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    };

    loadCategories();
  }, []);

  // Filtrer les catégories
  useEffect(() => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      const category = {
        id: Date.now(),
        ...newCategory,
        productCount: 0,
        createdAt: new Date().toISOString(),
        children: []
      };
      
      if (newCategory.parentId) {
        // Ajouter comme sous-catégorie
        const updatedCategories = categories.map(cat => {
          if (cat.id === newCategory.parentId) {
            return {
              ...cat,
              children: [...(cat.children || []), category]
            };
          }
          return cat;
        });
        setCategories(updatedCategories);
      } else {
        // Ajouter comme catégorie principale
        setCategories([category, ...categories]);
      }
      
      setNewCategory({
        name: '',
        description: '',
        parentId: null,
        isActive: true,
        sortOrder: 0
      });
      setShowAddModal(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder
    });
    setShowEditModal(true);
  };

  const handleUpdateCategory = () => {
    if (editingCategory && newCategory.name) {
      const updatedCategories = categories.map(cat => {
        if (cat.id === editingCategory.id) {
          return {
            ...cat,
            name: newCategory.name,
            description: newCategory.description,
            isActive: newCategory.isActive,
            sortOrder: newCategory.sortOrder
          };
        }
        return cat;
      });
      
      setCategories(updatedCategories);
      setShowEditModal(false);
      setEditingCategory(null);
      setNewCategory({
        name: '',
        description: '',
        parentId: null,
        isActive: true,
        sortOrder: 0
      });
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parentId);
  };

  const renderCategory = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const indentClass = `ml-${level * 4}`;

    return (
      <div key={category.id} className={`${indentClass} border-b border-gray-200 last:border-b-0`}>
        <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50">
          <div className="flex items-center flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleCategory(category.id)}
                className="mr-3 p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-7 mr-3" />
            )}
            
            <div className="flex items-center flex-1">
              {hasChildren ? (
                isExpanded ? (
                  <FolderOpen className="h-5 w-5 text-blue-500 mr-3" />
                ) : (
                  <Folder className="h-5 w-5 text-gray-400 mr-3" />
                )
              ) : (
                <Tag className="h-5 w-5 text-gray-400 mr-3" />
              )}
              
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{category.productCount} produits</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {category.isActive ? 'Actif' : 'Inactif'}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditCategory(category)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="bg-gray-50">
            {category.children.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des catégories</h1>
              <p className="text-gray-600">Organisez vos produits par catégories et sous-catégories</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter une catégorie
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total catégories</p>
                <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Folder className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sous-catégories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {categories.reduce((acc, cat) => acc + (cat.children?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Produits total</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {categories.reduce((acc, cat) => acc + cat.productCount, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Catégories actives</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {categories.filter(cat => cat.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres avancés
            </button>
            <button 
              onClick={() => {
                const allExpanded = new Set(categories.map(cat => cat.id));
                setExpandedCategories(allExpanded);
              }}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center"
            >
              Développer tout
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Liste des catégories</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredCategories.map(category => renderCategory(category))}
          </div>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une catégorie</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la catégorie</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de la catégorie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Description de la catégorie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie parente</label>
                  <select
                    value={newCategory.parentId || ''}
                    onChange={(e) => setNewCategory({...newCategory, parentId: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Catégorie principale</option>
                    {getParentCategories().map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordre de tri</label>
                    <input
                      type="number"
                      value={newCategory.sortOrder}
                      onChange={(e) => setNewCategory({...newCategory, sortOrder: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newCategory.isActive}
                      onChange={(e) => setNewCategory({...newCategory, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Actif
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier la catégorie</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la catégorie</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de la catégorie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Description de la catégorie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie parente</label>
                  <select
                    value={newCategory.parentId || ''}
                    onChange={(e) => setNewCategory({...newCategory, parentId: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Catégorie principale</option>
                    {getParentCategories().filter(cat => cat.id !== editingCategory?.id).map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordre de tri</label>
                    <input
                      type="number"
                      value={newCategory.sortOrder}
                      onChange={(e) => setNewCategory({...newCategory, sortOrder: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActiveEdit"
                      checked={newCategory.isActive}
                      onChange={(e) => setNewCategory({...newCategory, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActiveEdit" className="ml-2 block text-sm text-gray-700">
                      Actif
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpdateCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesComplete;
