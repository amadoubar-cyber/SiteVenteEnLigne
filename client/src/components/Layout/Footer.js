import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <span className="text-primary-500 font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold font-heading">Bowoye Multi Services</span>
            </div>
            <p className="text-gray-300 text-sm">
              Votre plateforme de vente en ligne de confiance en Guinée. 
              Découvrez une large gamme de produits de qualité.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tous les Produits
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Produits Vedettes
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Électronique
                </Link>
              </li>
              <li>
                <Link to="/products?category=fashion" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Mode
                </Link>
              </li>
              <li>
                <Link to="/products?category=home" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Maison & Jardin
                </Link>
              </li>
            </ul>
          </div>

          {/* Mon compte */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mon Compte</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Créer un Compte
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Mes Commandes
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Mon Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span className="text-gray-300 text-sm">
                  Labé, Guinée
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-500" />
                <a href="tel:+224626991318" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +224 626 99 13 18
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-500" />
                <a href="mailto:amadoubowoye@gmail.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                  amadoubowoye@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © 2024 Bowoye Multi Services. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-secondary-400 hover:text-white transition-colors text-sm">
                Politique de Confidentialité
              </Link>
              <Link to="/terms" className="text-secondary-400 hover:text-white transition-colors text-sm">
                Conditions d'Utilisation
              </Link>
              <Link to="/shipping" className="text-secondary-400 hover:text-white transition-colors text-sm">
                Livraison
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
