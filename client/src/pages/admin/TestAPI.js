import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestAPI = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPIs = async () => {
    setLoading(true);
    const testResults = {};

    try {
      // Test 1: API Products
      console.log('🧪 Test API Products...');
      try {
        const productsResponse = await axios.get('/api/products');
        testResults.products = {
          status: 'success',
          statusCode: productsResponse.status,
          data: productsResponse.data
        };
        console.log('✅ Products API OK:', productsResponse.data);
      } catch (error) {
        testResults.products = {
          status: 'error',
          error: error.message,
          statusCode: error.response?.status,
          data: error.response?.data
        };
        console.error('❌ Products API Error:', error);
      }

      // Test 2: API Categories
      console.log('🧪 Test API Categories...');
      try {
        const categoriesResponse = await axios.get('/api/categories');
        testResults.categories = {
          status: 'success',
          statusCode: categoriesResponse.status,
          data: categoriesResponse.data
        };
        console.log('✅ Categories API OK:', categoriesResponse.data);
      } catch (error) {
        testResults.categories = {
          status: 'error',
          error: error.message,
          statusCode: error.response?.status,
          data: error.response?.data
        };
        console.error('❌ Categories API Error:', error);
      }

      // Test 3: Test avec fetch
      console.log('🧪 Test avec fetch...');
      try {
        const fetchResponse = await fetch('/api/products');
        const fetchData = await fetchResponse.json();
        testResults.fetch = {
          status: 'success',
          statusCode: fetchResponse.status,
          data: fetchData
        };
        console.log('✅ Fetch API OK:', fetchData);
      } catch (error) {
        testResults.fetch = {
          status: 'error',
          error: error.message
        };
        console.error('❌ Fetch API Error:', error);
      }

    } catch (error) {
      console.error('❌ Erreur générale:', error);
    }

    setResults(testResults);
    setLoading(false);
  };

  useEffect(() => {
    testAPIs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Test de Connectivité API
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={testAPIs}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '🔄 Test en cours...' : '🔄 Relancer les tests'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Test Products API */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              📦 Test API Products
            </h2>
            {results.products ? (
              <div className={`p-4 rounded-lg ${
                results.products.status === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  <span className={`text-2xl mr-2 ${
                    results.products.status === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results.products.status === 'success' ? '✅' : '❌'}
                  </span>
                  <span className="font-semibold">
                    {results.products.status === 'success' ? 'Succès' : 'Erreur'}
                  </span>
                </div>
                <p><strong>Status Code:</strong> {results.products.statusCode}</p>
                {results.products.error && (
                  <p><strong>Erreur:</strong> {results.products.error}</p>
                )}
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Voir les données
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(results.products.data, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-gray-500">Test en cours...</p>
            )}
          </div>

          {/* Test Categories API */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              🏷️ Test API Categories
            </h2>
            {results.categories ? (
              <div className={`p-4 rounded-lg ${
                results.categories.status === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  <span className={`text-2xl mr-2 ${
                    results.categories.status === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results.categories.status === 'success' ? '✅' : '❌'}
                  </span>
                  <span className="font-semibold">
                    {results.categories.status === 'success' ? 'Succès' : 'Erreur'}
                  </span>
                </div>
                <p><strong>Status Code:</strong> {results.categories.statusCode}</p>
                {results.categories.error && (
                  <p><strong>Erreur:</strong> {results.categories.error}</p>
                )}
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Voir les données
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(results.categories.data, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-gray-500">Test en cours...</p>
            )}
          </div>

          {/* Test Fetch API */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              🌐 Test avec Fetch
            </h2>
            {results.fetch ? (
              <div className={`p-4 rounded-lg ${
                results.fetch.status === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  <span className={`text-2xl mr-2 ${
                    results.fetch.status === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results.fetch.status === 'success' ? '✅' : '❌'}
                  </span>
                  <span className="font-semibold">
                    {results.fetch.status === 'success' ? 'Succès' : 'Erreur'}
                  </span>
                </div>
                <p><strong>Status Code:</strong> {results.fetch.statusCode}</p>
                {results.fetch.error && (
                  <p><strong>Erreur:</strong> {results.fetch.error}</p>
                )}
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Voir les données
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(results.fetch.data, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              <p className="text-gray-500">Test en cours...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAPI;
