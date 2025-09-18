import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Crown, 
  Users, 
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { useState } from 'react';

const TestAccounts = () => {
  const [copiedAccount, setCopiedAccount] = useState(null);

  const accounts = [
    {
      type: 'admin',
      title: 'Compte Administrateur',
      icon: Crown,
      color: 'bg-red-500',
      accounts: [
        {
          email: 'admin@koula.gn',
          password: 'admin123',
          name: 'Admin Koula',
          role: 'Administrateur',
          description: 'Accès complet à toutes les fonctionnalités'
        }
      ]
    },
    {
      type: 'user',
      title: 'Comptes Clients',
      icon: Users,
      color: 'bg-blue-500',
      accounts: [
        {
          email: 'client@koula.gn',
          password: 'password123',
          name: 'Client Test',
          role: 'Client',
          description: 'Compte client standard'
        },
        {
          email: 'marie@koula.gn',
          password: 'password123',
          name: 'Marie Diallo',
          role: 'Client',
          description: 'Compte client exemple'
        }
      ]
    }
  ];

  const copyToClipboard = (text, accountType) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(accountType);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comptes de Test Disponibles
          </h1>
          <p className="text-xl text-gray-600">
            Utilisez ces comptes pour tester l'application
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {accounts.map((group, groupIndex) => {
            const IconComponent = group.icon;
            return (
              <div key={groupIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`${group.color} px-6 py-4`}>
                  <div className="flex items-center">
                    <IconComponent className="h-8 w-8 text-white mr-3" />
                    <h2 className="text-xl font-bold text-white">{group.title}</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  {group.accounts.map((account, accountIndex) => (
                    <div key={accountIndex} className="mb-6 last:mb-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                          <p className="text-sm text-gray-600">{account.description}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {account.role}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Email */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Email:</span>
                          </div>
                          <div className="flex items-center">
                            <code className="text-sm text-gray-900 mr-2">{account.email}</code>
                            <button
                              onClick={() => copyToClipboard(account.email, `${group.type}-${accountIndex}-email`)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedAccount === `${group.type}-${accountIndex}-email` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Password */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Mot de passe:</span>
                          </div>
                          <div className="flex items-center">
                            <code className="text-sm text-gray-900 mr-2">{account.password}</code>
                            <button
                              onClick={() => copyToClipboard(account.password, `${group.type}-${accountIndex}-password`)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              {copiedAccount === `${group.type}-${accountIndex}-password` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link
                          to="/login"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Se connecter avec ce compte
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Comment utiliser ces comptes
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Cliquez sur "Se connecter avec ce compte" pour être redirigé vers la page de connexion</li>
            <li>• Les identifiants sont automatiquement remplis</li>
            <li>• Vous pouvez copier les identifiants en cliquant sur l'icône de copie</li>
            <li>• Le compte admin donne accès à l'interface d'administration</li>
            <li>• Les comptes clients permettent de tester les fonctionnalités utilisateur</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestAccounts;
