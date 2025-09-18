import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Image as ImageIcon,
  Plus,
  X,
  Check,
  AlertCircle,
  Grid,
  List,
  Folder,
  Calendar,
  FileImage,
  Maximize2,
  RotateCw,
  Crop
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import useConfirmation from '../../hooks/useConfirmation';

const AdminImagesComplete = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedImages, setSelectedImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { confirmation, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();

  const categories = [
    'Toutes les images',
    'Produits',
    'Bannières',
    'Logos',
    'Galerie',
    'Autres'
  ];

  // Simuler le chargement des données
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockImages = [
        {
          id: 1,
          name: 'ciment-portland.jpg',
          originalName: 'ciment-portland.jpg',
          url: '/images/ciment-portland.jpg',
          category: 'Produits',
          size: 245760, // en bytes
          width: 800,
          height: 600,
          format: 'JPEG',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          alt: 'Ciment Portland 50kg',
          tags: ['ciment', 'construction', 'matériaux']
        },
        {
          id: 2,
          name: 'samsung-galaxy.jpg',
          originalName: 'samsung-galaxy.jpg',
          url: '/images/samsung-galaxy.jpg',
          category: 'Produits',
          size: 512000,
          width: 1200,
          height: 800,
          format: 'JPEG',
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z',
          alt: 'Samsung Galaxy A54',
          tags: ['téléphone', 'samsung', 'électronique']
        },
        {
          id: 3,
          name: 'tuyau-pvc.jpg',
          originalName: 'tuyau-pvc.jpg',
          url: '/images/tuyau-pvc.jpg',
          category: 'Produits',
          size: 189440,
          width: 600,
          height: 400,
          format: 'JPEG',
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
          alt: 'Tuyau PVC 100mm',
          tags: ['tuyau', 'pvc', 'plomberie']
        },
        {
          id: 4,
          name: 'banniere-principale.jpg',
          originalName: 'banniere-principale.jpg',
          url: '/images/banniere-principale.jpg',
          category: 'Bannières',
          size: 1024000,
          width: 1920,
          height: 600,
          format: 'JPEG',
          createdAt: '2024-01-12T16:45:00Z',
          updatedAt: '2024-01-12T16:45:00Z',
          alt: 'Bannière principale du site',
          tags: ['bannière', 'accueil', 'marketing']
        },
        {
          id: 5,
          name: 'logo-koula.png',
          originalName: 'logo-koula.png',
          url: '/images/logo-koula.png',
          category: 'Logos',
          size: 128000,
          width: 300,
          height: 300,
          format: 'PNG',
          createdAt: '2024-01-11T12:00:00Z',
          updatedAt: '2024-01-11T12:00:00Z',
          alt: 'Logo Koula',
          tags: ['logo', 'marque', 'identité']
        },
        {
          id: 6,
          name: 'cable-electrique.jpg',
          originalName: 'cable-electrique.jpg',
          url: '/images/cable-electrique.jpg',
          category: 'Produits',
          size: 156800,
          width: 700,
          height: 500,
          format: 'JPEG',
          createdAt: '2024-01-10T08:30:00Z',
          updatedAt: '2024-01-10T08:30:00Z',
          alt: 'Câble électrique 2.5mm²',
          tags: ['câble', 'électricité', 'cuivre']
        }
      ];

      setImages(mockImages);
      setFilteredImages(mockImages);
      setLoading(false);
    };

    loadImages();
  }, []);

  // Filtrer les images
  useEffect(() => {
    let filtered = images;

    if (searchTerm) {
      filtered = filtered.filter(image =>
        image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory && selectedCategory !== 'Toutes les images') {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }

    setFilteredImages(filtered);
  }, [searchTerm, selectedCategory, images]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map(img => img.id));
    }
  };

  const handleDeleteSelected = () => {
    const selectedImagesData = images.filter(img => selectedImages.includes(img.id));
    
    showConfirmation({
      title: 'Supprimer plusieurs images',
      message: `Êtes-vous sûr de vouloir supprimer ${selectedImages.length} image(s) sélectionnée(s) ?`,
      confirmText: 'Supprimer tout',
      cancelText: 'Annuler',
      type: 'danger',
      icon: Trash2,
      details: selectedImagesData.map(img => 
        `${img.name} (${img.size ? (img.size / 1024).toFixed(1) + ' KB' : 'Taille inconnue'})`
      ),
      onConfirm: () => {
        setImages(images.filter(img => !selectedImages.includes(img.id)));
        setSelectedImages([]);
      }
    });
  };

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleUpload = async (files) => {
    setUploading(true);
    
    // Simuler l'upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newImages = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      originalName: file.name,
      url: URL.createObjectURL(file),
      category: 'Autres',
      size: file.size,
      width: 800,
      height: 600,
      format: file.type.split('/')[1].toUpperCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      alt: file.name.split('.')[0],
      tags: []
    }));
    
    setImages([...newImages, ...images]);
    setShowUploadModal(false);
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des images...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Galerie d'images</h1>
              <p className="text-gray-600">Gérez et organisez vos images</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Uploader des images
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total images</p>
                <p className="text-2xl font-semibold text-gray-900">{images.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Folder className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Catégories</p>
                <p className="text-2xl font-semibold text-gray-900">{categories.length - 1}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <FileImage className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Taille totale</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ajoutées ce mois</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {images.filter(img => new Date(img.createdAt).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une image..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedImages.length} sélectionné(s)</span>
                  <button
                    onClick={handleDeleteSelected}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Images Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-sm border overflow-hidden group">
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                      <button
                        onClick={() => handleViewImage(image)}
                        className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleImageSelect(image.id)}
                        className={`p-2 rounded-lg ${
                          selectedImages.includes(image.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {selectedImages.includes(image.id) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{image.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{formatFileSize(image.size)}</p>
                  <p className="text-xs text-gray-500">{image.width} × {image.height}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedImages.length === filteredImages.length && filteredImages.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
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
                      Taille
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dimensions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredImages.map((image) => (
                    <tr key={image.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(image.id)}
                          onChange={() => handleImageSelect(image.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-12 rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{image.name}</div>
                        <div className="text-sm text-gray-500">{image.alt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {image.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(image.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {image.width} × {image.height}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(image.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewImage(image)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune image trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploader des images</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Glissez-déposez vos images ici ou cliquez pour sélectionner</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
                >
                  Sélectionner des fichiers
                </label>
              </div>
              
              {uploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Upload en cours...</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image View Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Détails de l'image</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom du fichier</label>
                    <p className="text-sm text-gray-900">{selectedImage.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{selectedImage.alt}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Taille</label>
                      <p className="text-sm text-gray-900">{formatFileSize(selectedImage.size)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Format</label>
                      <p className="text-sm text-gray-900">{selectedImage.format}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Largeur</label>
                      <p className="text-sm text-gray-900">{selectedImage.width}px</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hauteur</label>
                      <p className="text-sm text-gray-900">{selectedImage.height}px</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {selectedImage.category}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedImage.tags.map((tag, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date d'ajout</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedImage.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </button>
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
    </div>
  );
};

export default AdminImagesComplete;
