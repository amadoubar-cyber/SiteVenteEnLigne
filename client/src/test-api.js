// Script de test pour vérifier la connectivité API
const testAPI = async () => {
  try {
    console.log('🧪 Test de connectivité API...');
    
    // Test 1: API Products
    console.log('1. Test API Products...');
    const productsResponse = await fetch('/api/products');
    console.log('Status Products:', productsResponse.status);
    const productsData = await productsResponse.json();
    console.log('Products Data:', productsData);
    
    // Test 2: API Categories
    console.log('2. Test API Categories...');
    const categoriesResponse = await fetch('/api/categories');
    console.log('Status Categories:', categoriesResponse.status);
    const categoriesData = await categoriesResponse.json();
    console.log('Categories Data:', categoriesData);
    
    // Test 3: Test direct avec axios
    console.log('3. Test avec axios...');
    const axios = require('axios');
    const axiosResponse = await axios.get('/api/products');
    console.log('Axios Response:', axiosResponse.data);
    
  } catch (error) {
    console.error('❌ Erreur de test:', error);
  }
};

// Exporter pour utilisation dans la console
window.testAPI = testAPI;
