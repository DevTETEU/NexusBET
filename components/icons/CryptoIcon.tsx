
import React from 'react';

export const CryptoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 2l-2 4h4zM4.93 4.93l-1.42 1.42 3.54 3.54 1.42-1.42zm14.14 0l1.42 1.42-3.54 3.54-1.42-1.42zM12 12a6 6 0 100-12 6 6 0 000 12z" />
    <path d="M12 22l2-4h-4zM4.93 19.07l-1.42-1.42 3.54-3.54 1.42 1.42zm14.14 0l1.42-1.42-3.54-3.54-1.42 1.42z" />
  </svg>
);
