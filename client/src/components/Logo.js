import React from 'react';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      {/* Logo BMS avec icône maison stylisée */}
      <div className="relative">
        {/* Maison centrale */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-sm relative">
            {/* Toit bleu */}
            <div className="absolute -top-1 left-0 right-0 h-2 bg-blue-600 transform -skew-y-6"></div>
            {/* Porte bleue */}
            <div className="absolute bottom-0 right-1 w-1.5 h-2 bg-blue-600 rounded-sm">
              <div className="absolute top-0.5 right-0 w-0.5 h-0.5 bg-white rounded-full"></div>
            </div>
            {/* Fenêtre */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border border-gray-400">
              <div className="w-full h-full border-r border-b border-gray-400"></div>
            </div>
          </div>
        </div>
        
        {/* Cadre de construction */}
        <div className="relative">
          {/* Lignes de construction */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-blue-600 transform rotate-45"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-2 border-blue-600 transform rotate-12"></div>
          <div className="absolute top-1 -left-1 w-4 h-4 border-2 border-blue-600 transform -rotate-12"></div>
          
          {/* Éléments de structure */}
          <div className="absolute -top-1 left-1 w-2 h-2 bg-blue-600 transform rotate-45"></div>
          <div className="absolute bottom-0 -right-0.5 w-1.5 h-1.5 bg-blue-600 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
