import React, { useEffect } from 'react';

const LoadingSpinner = ({ overlay = false }) => {
  useEffect(() => {
    if (overlay) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [overlay]);

  return (
    <div
      style={{ height: '100%' }}
      className={`${
        overlay
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
          : 'flex items-center justify-center'
      }`}
    >
      <div className="w-12 h-12 border-t-4 border-solid border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
