import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="loading-state-container">
      <Loader2 className="spinner-icon text-indigo" size={32} />
      <span className="loading-state-text">{message}</span>
    </div>
  );
};
