import React from 'react';
import Logo from './Logo';

const LogoText = ({ showLogo = true, size = 'medium', className = '' }) => {
  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl',
    xlarge: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showLogo && <Logo size={size} />}
      <div className="flex flex-col">
        <div className={`font-bold text-gray-900 leading-tight ${textSizeClasses[size]}`}>
          <div className="italic">BOWOYE</div>
          <div className="italic">MULTI</div>
          <div className="italic">SERVICES</div>
          <div className="text-xs font-normal text-gray-600 mt-1">[BMS]</div>
        </div>
      </div>
    </div>
  );
};

export default LogoText;
