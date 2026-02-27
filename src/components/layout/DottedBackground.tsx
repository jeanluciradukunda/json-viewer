import React from 'react';

interface DottedBackgroundProps {
  children: React.ReactNode;
}

const DottedBackground: React.FC<DottedBackgroundProps> = ({ children }) => {
  return (
    <div className="dotted-grid min-h-full">
      {children}
    </div>
  );
};

export default DottedBackground;
