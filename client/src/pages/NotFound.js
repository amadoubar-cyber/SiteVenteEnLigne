import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Page non trouvée
          </h2>
          <p className="text-lg text-secondary-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn btn-primary btn-lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline btn-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
