import React from 'react';

const DebugProductImages = ({ product }) => {
  if (!product) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="font-medium text-yellow-800 mb-2">Debug - Images du produit</h3>
      <div className="text-sm text-yellow-700">
        <p><strong>Nom:</strong> {product.name}</p>
        <p><strong>Images count:</strong> {product.images?.length || 0}</p>
        <p><strong>Images data:</strong></p>
        <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-32">
          {JSON.stringify(product.images, null, 2)}
        </pre>
        {product.images?.length > 0 && (
          <div className="mt-2">
            <p><strong>Première image URL:</strong> {product.images[0]?.url}</p>
            <p><strong>URL complète:</strong> http://localhost:3001{product.images[0]?.url}</p>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-gray-600">Test URL serveur:</p>
                <img 
                  src={`http://localhost:3001${product.images[0]?.url}`}
                  alt="Test image serveur"
                  className="w-16 h-16 object-cover border rounded"
                  onError={(e) => {
                    console.error('Erreur chargement image serveur:', e.target.src);
                    e.target.style.border = '2px solid red';
                  }}
                  onLoad={(e) => console.log('Image serveur chargée:', e.target.src)}
                />
              </div>
              <div>
                <p className="text-xs text-gray-600">Test URL directe:</p>
                <img 
                  src={product.images[0]?.url}
                  alt="Test image directe"
                  className="w-16 h-16 object-cover border rounded"
                  onError={(e) => {
                    console.error('Erreur chargement image directe:', e.target.src);
                    e.target.style.border = '2px solid orange';
                  }}
                  onLoad={(e) => console.log('Image directe chargée:', e.target.src)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugProductImages;
