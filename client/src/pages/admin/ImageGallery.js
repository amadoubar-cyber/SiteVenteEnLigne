import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  Eye, 
  Download, 
  Search,
  Filter,
  Grid,
  List,
  Image as ImageIcon,
  Plus,
  X
} from 'lucide-react';
import ConfirmationModal from '../../components/ConfirmationModal';
import useConfirmation from '../../hooks/useConfirmation';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { confirmation, showConfirmation, hideConfirmation, handleConfirm } = useConfirmation();

  // Récupérer les images
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/upload/images', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.images) {
        setImages(result.images);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload d'images
  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      alert('Veuillez sélectionner des fichiers image valides');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setImages(prev => [...result.images, ...prev]);
        setShowUploadModal(false);
        alert(`${result.images.length} image(s) uploadée(s) avec succès`);
      } else {
        alert('Erreur lors de l\'upload: ' + result.message);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
    }
  };

  // Supprimer une image
  const deleteImage = async (filename) => {
    const image = images.find(img => img.filename === filename);
    
    console.log('deleteImage called with filename:', filename);
    console.log('showConfirmation function:', showConfirmation);
    
    showConfirmation({
      title: 'Supprimer une image',
      message: `Êtes-vous sûr de vouloir supprimer cette image ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      icon: Trash2,
      details: [
        `Nom: ${filename}`,
        `Taille: ${image ? (image.size / 1024).toFixed(1) + ' KB' : 'Inconnue'}`,
        `URL: ${image ? image.url : 'Inconnue'}`
      ],
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/upload/image/${filename}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            setImages(prev => prev.filter(img => img.filename !== filename));
            setSelectedImages(prev => prev.filter(f => f !== filename));
          } else {
            alert('Erreur lors de la suppression de l\'image');
          }
        } catch (error) {
          console.error('Erreur suppression:', error);
          alert('Erreur lors de la suppression de l\'image');
        }
      }
    });
  };

  // Supprimer plusieurs images
  const deleteSelectedImages = async () => {
    if (selectedImages.length === 0) return;
    
    const selectedImagesData = images.filter(img => selectedImages.includes(img.filename));
    
    showConfirmation({
      title: 'Supprimer plusieurs images',
      message: `Êtes-vous sûr de vouloir supprimer ${selectedImages.length} image(s) sélectionnée(s) ?`,
      confirmText: 'Supprimer tout',
      cancelText: 'Annuler',
      type: 'danger',
      icon: Trash2,
      details: selectedImagesData.map(img => 
        `${img.filename} (${(img.size / 1024).toFixed(1)} KB)`
      ),
      onConfirm: async () => {
        try {
          await Promise.all(
            selectedImages.map(filename => 
              fetch(`/api/upload/image/${filename}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              })
            )
          );
          
          setImages(prev => prev.filter(img => !selectedImages.includes(img.filename)));
          setSelectedImages([]);
        } catch (error) {
          console.error('Erreur suppression multiple:', error);
          alert('Erreur lors de la suppression des images');
        }
      }
    });
  };

  // Toggle sélection d'image
  const toggleImageSelection = (filename) => {
    setSelectedImages(prev => 
      prev.includes(filename) 
        ? prev.filter(f => f !== filename)
        : [...prev, filename]
    );
  };

  // Filtrer les images
  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Galerie d'Images</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Uploader des images
        </button>
      </div>

      {/* Actions en lot */}
      {selectedImages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedImages.length} image(s) sélectionnée(s)
            </span>
            <button
              onClick={deleteSelectedImages}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer sélection
            </button>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une image..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Galerie d'images */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' 
          : 'grid-cols-1'
      }`}>
        {filteredImages.map((image) => (
          <div key={image.filename} className="relative group">
            <div className={`aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer ${
              selectedImages.includes(image.filename) ? 'ring-2 ring-blue-500' : ''
            }`}>
              <img
                src={image.url}
                alt={image.filename}
                className="w-full h-full object-cover"
                onClick={() => toggleImageSelection(image.filename)}
              />
            </div>
            
            {/* Overlay avec actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(image.url, '_blank')}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Voir l'image"
                >
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => deleteImage(image.filename)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Supprimer l'image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Checkbox de sélection */}
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selectedImages.includes(image.filename)}
                onChange={() => toggleImageSelection(image.filename)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            {/* Info de l'image */}
            {viewMode === 'list' && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {image.filename}
                </p>
                <p className="text-xs text-gray-500">
                  {(image.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'Aucune image trouvée' : 'Aucune image dans la galerie'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Uploader votre première image
            </button>
          )}
        </div>
      )}

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Uploader des images</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Cliquez pour sélectionner des images
                  </p>
                  <p className="text-sm text-gray-500">
                    Formats acceptés: JPG, PNG, GIF, WebP (max 5MB)
                  </p>
                </label>
              </div>

              {uploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Upload en cours...</p>
                </div>
              )}
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

export default ImageGallery;
