import React, { useState } from 'react';

const TestImages = () => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      filename: file.name,
      description: ''
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test - Section d'Images
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Formulaire de Test</h2>
          
          {/* Nom du produit */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nom du produit"
            />
          </div>

          {/* Section d'images - TRÈS VISIBLE */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
            <label className="block text-2xl font-bold text-yellow-800 mb-4">
              📷 IMAGES DU PRODUIT - TEST
            </label>
            <div className="bg-white border-2 border-dashed border-blue-400 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-blue-600 font-bold text-lg mb-2">
                Section d'upload d'images - TEST
              </p>
              <p className="text-gray-600 mb-4">
                Glissez-déposez vos images ici ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-medium"
              />
              
              {images.length > 0 && (
                <div className="mt-6 bg-green-50 border-2 border-green-400 rounded-lg p-4">
                  <p className="text-green-800 font-bold text-lg mb-3">
                    ✅ Images sélectionnées ({images.length}/5):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img, index) => (
                      <div key={index} className="relative bg-white rounded-lg border-2 border-gray-200 p-4">
                        <div className="relative">
                          <img
                            src={img.url}
                            alt={img.filename}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600"
                          >
                            ×
                          </button>
                          {/* Badge image principale */}
                          {index === 0 && (
                            <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Principale
                            </div>
                          )}
                          {/* Numéro d'ordre */}
                          <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-900 truncate" title={img.filename}>
                            {img.filename}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Image {index + 1} de {images.length}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Autres champs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Description du produit"
            />
          </div>

          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Créer le produit
            </button>
            <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestImages;
