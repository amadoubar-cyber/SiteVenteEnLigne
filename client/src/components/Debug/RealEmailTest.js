import React, { useState } from 'react';
import { Mail, Server, TestTube, CheckCircle, XCircle } from 'lucide-react';
import realEmailService from '../../services/realEmailService';

const RealEmailTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [email, setEmail] = useState('test@bowoye.gn');
  const [firstName, setFirstName] = useState('Amadou');
  const [lastName, setLastName] = useState('Diallo');

  const handleTestRealEmail = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const result = await realEmailService.sendVerificationEmail(
        email,
        firstName,
        lastName,
        verificationCode
      );
      
      setTestResult({
        success: result.success,
        message: result.message,
        code: verificationCode,
        fallback: result.fallback
      });
      
    } catch (error) {
      setTestResult({
        success: false,
        message: error.message,
        error: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestServerConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/email/test');
      const result = await response.json();
      
      setTestResult({
        success: response.ok,
        message: result.message,
        serverTest: true
      });
      
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Serveur email inaccessible: ' + error.message,
        error: true,
        serverTest: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-20 right-4 bg-white border-2 border-green-500 rounded-lg shadow-lg p-4 z-50 max-w-sm">
      <div className="flex items-center space-x-2 mb-3">
        <Server className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-gray-900">Test Email Réel</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="test@bowoye.gn"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleTestServerConnection}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <Server className="h-3 w-3" />
            <span>Test Serveur</span>
          </button>

          <button
            onClick={handleTestRealEmail}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              <Mail className="h-3 w-3" />
            )}
            <span>Test Email</span>
          </button>
        </div>

        {testResult && (
          <div className={`p-3 rounded border ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.serverTest ? 'Test Serveur' : 'Test Email'}
              </span>
            </div>
            
            <p className={`text-xs ${
              testResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {testResult.message}
            </p>

            {testResult.code && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-800 font-medium">Code généré:</p>
                <p className="text-lg font-mono font-bold text-blue-900">{testResult.code}</p>
              </div>
            )}

            {testResult.fallback && (
              <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  ⚠️ Mode fallback activé (service email indisponible)
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>• Teste la connexion au serveur email</p>
          <p>• Envoie un email de vérification réel</p>
          <p>• Affiche le code généré</p>
        </div>
      </div>
    </div>
  );
};

export default RealEmailTest;
