import React from 'react';

const TestButtons = () => {
  const testButton = (name) => {
    console.log(`${name} button clicked!`);
    alert(`Bouton ${name} cliqué avec succès !`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Test des Boutons</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Test 1 - Bouton simple */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Test 1 - Bouton Simple</h3>
            <button
              onClick={() => testButton('Simple')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              🧪 Test Simple
            </button>
          </div>

          {/* Test 2 - Bouton avec console.log */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Test 2 - Console Log</h3>
            <button
              onClick={() => {
                console.log('Test 2 clicked!');
                alert('Test 2 réussi !');
              }}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              🔍 Test Console
            </button>
          </div>

          {/* Test 3 - Bouton avec fonction externe */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Test 3 - Fonction Externe</h3>
            <button
              onClick={() => testButton('Externe')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              ⚡ Test Externe
            </button>
          </div>

          {/* Test 4 - Bouton avec window.alert */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Test 4 - Window Alert</h3>
            <button
              onClick={() => window.alert('Test 4 avec window.alert !')}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              🌟 Test Window
            </button>
          </div>

          {/* Test 5 - Bouton avec confirm */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Test 5 - Confirm</h3>
            <button
              onClick={() => {
                const result = window.confirm('Voulez-vous continuer ?');
                alert(`Résultat: ${result ? 'Oui' : 'Non'}`);
              }}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              ❓ Test Confirm
            </button>
          </div>

          {/* Test 6 - Bouton avec prompt */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Test 6 - Prompt</h3>
            <button
              onClick={() => {
                const name = window.prompt('Entrez votre nom:');
                if (name) {
                  alert(`Bonjour ${name} !`);
                }
              }}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              ✏️ Test Prompt
            </button>
          </div>

        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions de Test</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Cliquez sur chaque bouton</li>
            <li>Vérifiez que les popups s'affichent</li>
            <li>Ouvrez la console (F12) pour voir les logs</li>
            <li>Notez quels boutons fonctionnent et lesquels ne fonctionnent pas</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestButtons;
