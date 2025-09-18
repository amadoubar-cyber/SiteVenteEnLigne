import React, { useState } from 'react';
import { getImageUrl } from '../utils/imageUtils';

const TestImages = () => {
  const [testUrl, setTestUrl] = useState('/uploads/clusterO.PNG');
  const [imageStatus, setImageStatus] = useState('');

  const testImageUrl = getImageUrl(testUrl);

  const handleTestImage = () => {
    setImageStatus('Chargement...');
    
    const img = new Image();
    img.onload = () => {
      setImageStatus('✅ Image chargée avec succès');
    };
    img.onerror = () => {
      setImageStatus('❌ Erreur de chargement');
    };
    img.src = testImageUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test des Images
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image à tester
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="/uploads/image.jpg"
                />
                <button
                  onClick={handleTestImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tester
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                URL complète générée
              </h3>
              <code className="block p-3 bg-gray-100 rounded text-sm">
                {testImageUrl}
              </code>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Statut du chargement
              </h3>
              <p className={`text-sm ${imageStatus.includes('✅') ? 'text-green-600' : imageStatus.includes('❌') ? 'text-red-600' : 'text-gray-600'}`}>
                {imageStatus || 'Cliquez sur "Tester" pour vérifier l\'image'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aperçu de l'image
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <img
                  src={testImageUrl}
                  alt="Test image"
                  className="max-w-xs max-h-48 object-contain mx-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="text-center text-gray-500 text-sm" style={{ display: 'none' }}>
                  Image non trouvée
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Images disponibles sur le serveur
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  '/uploads/clusterO.PNG',
                  '/uploads/image_poubelle.jpeg',
                  '/uploads/images.jpeg',
                  '/uploads/NAD.PNG'
                ].map((imagePath, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={getImageUrl(imagePath)}
                      alt={`Test ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border mx-auto mb-2"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="text-xs text-gray-500" style={{ display: 'none' }}>
                      Erreur
                    </div>
                    <p className="text-xs text-gray-600 truncate">{imagePath}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestImages;
