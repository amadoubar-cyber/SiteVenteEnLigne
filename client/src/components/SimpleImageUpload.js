import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const SimpleImageUpload = ({ onImagesChange, existingImages = [], maxImages = 5 }) => {
  const [images, setImages] = useState(existingImages);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Veuillez sélectionner des fichiers image valides.');
      return;
    }

    if (images.length + imageFiles.length > maxImages) {
      alert(`Vous ne pouvez ajouter que ${maxImages} images maximum.`);
      return;
    }

    const newImages = imageFiles.map(file => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            name: file.name,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages).then((newImageObjects) => {
      const updatedImages = [...images, ...newImageObjects];
      setImages(updatedImages);
      onImagesChange(updatedImages);
    });
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

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Images du produit
      </label>
      
      {/* Zone de drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Cliquez pour sélectionner
            </span>
            {' '}ou glissez-déposez vos images ici
          </div>
          <div className="text-xs text-gray-500">
            PNG, JPG, JPEG jusqu'à 5MB (max {maxImages} images)
          </div>
        </label>
      </div>

      {/* Aperçu des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Aperçu ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                {image.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Images existantes (pour l'édition) */}
      {existingImages.length > 0 && images.length === 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {existingImages.map((image, index) => (
            <div key={`existing-${index}`} className="relative group">
              <img
                src={image.url}
                alt={`Image existante ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                Image existante
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && existingImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Aucune image sélectionnée</p>
        </div>
      )}
    </div>
  );
};

export default SimpleImageUpload;
