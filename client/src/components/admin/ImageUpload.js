import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Trash2, Eye, Edit3, Save, XCircle } from 'lucide-react';
import useConfirmationMessage from '../../hooks/useConfirmationMessage';
import ConfirmationMessage from '../ConfirmationMessage';

const ImageUpload = ({ onImagesChange, maxImages = 5, existingImages = [] }) => {
  const [images, setImages] = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const fileInputRef = useRef(null);
  const { message, showError, showWarning, showSuccess, hideMessage } = useConfirmationMessage();

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      showWarning('Veuillez sélectionner des fichiers image valides');
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      showWarning(`Vous ne pouvez pas uploader plus de ${maxImages} images`);
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
        // Ajouter une description vide par défaut pour chaque nouvelle image
        const newImages = result.images.map(img => ({
          ...img,
          description: ''
        }));
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange(updatedImages);
        showSuccess(`📸 ${validFiles.length} image${validFiles.length > 1 ? 's' : ''} uploadée${validFiles.length > 1 ? 's' : ''} avec succès !`);
      } else {
        showError('Erreur lors de l\'upload: ' + result.message);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      showError('Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = async (imageToRemove) => {
    try {
      const response = await fetch(`/api/upload/image/${imageToRemove.filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const newImages = images.filter(img => img.filename !== imageToRemove.filename);
        setImages(newImages);
        onImagesChange(newImages);
      } else {
        alert('Erreur lors de la suppression de l\'image');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression de l\'image');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const startEditing = (image) => {
    setEditingImage(image);
    setEditDescription(image.description || '');
  };

  const cancelEditing = () => {
    setEditingImage(null);
    setEditDescription('');
  };

  const saveDescription = () => {
    if (editingImage) {
      const updatedImages = images.map(img => 
        img.filename === editingImage.filename 
          ? { ...img, description: editDescription }
          : img
      );
      setImages(updatedImages);
      onImagesChange(updatedImages);
      setEditingImage(null);
      setEditDescription('');
    }
  };

  const moveImageUp = (index) => {
    if (index > 0) {
      const newImages = [...images];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      setImages(newImages);
      onImagesChange(newImages);
    }
  };

  const moveImageDown = (index) => {
    if (index < images.length - 1) {
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setImages(newImages);
      onImagesChange(newImages);
    }
  };

  return (
    <div className="space-y-4">
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
      
      {/* Zone de drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Glissez-déposez vos images ici
        </p>
        <p className="text-sm text-gray-500 mb-4">
          ou cliquez pour sélectionner des fichiers
        </p>
        <button
          type="button"
          onClick={openFileDialog}
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Upload en cours...' : 'Sélectionner des images'}
        </button>
        <p className="text-xs text-gray-400 mt-2">
          Maximum {maxImages} images, formats: JPG, PNG, GIF, WebP
        </p>
      </div>

      {/* Aperçu des images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Images du produit ({images.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Badge image principale */}
                    {index === 0 && (
                      <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Principale
                      </div>
                    )}
                    
                    {/* Numéro d'ordre */}
                    <div className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    {/* Nom du fichier */}
                    <p className="text-sm font-medium text-gray-900 truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    
                    {/* Description */}
                    {editingImage && editingImage.filename === image.filename ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Description de l'image..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveDescription}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            Sauvegarder
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {image.description || 'Aucune description'}
                        </p>
                        <button
                          type="button"
                          onClick={() => startEditing(image)}
                          className="mt-1 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          {image.description ? 'Modifier' : 'Ajouter description'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(image.url, '_blank')}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-1"
                      title="Voir l'image"
                    >
                      <Eye className="w-3 h-3" />
                      Voir
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                      title="Supprimer l'image"
                    >
                      <Trash2 className="w-3 h-3" />
                      Supprimer
                    </button>
                  </div>
                  
                  {/* Boutons de réorganisation */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveImageUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Déplacer vers le haut"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImageDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Déplacer vers le bas"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Note d'information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Astuce :</strong> La première image sera l'image principale du produit. 
              Vous pouvez réorganiser les images en utilisant les flèches ↑ ↓.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

