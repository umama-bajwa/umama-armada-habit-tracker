import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

export const AlertMessage = ({ message, type = 'error', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`alert-banner alert-${type}`} role="alert">
      <div className="alert-icon">
        {isSuccess ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
      </div>
      <div className="alert-message">{message}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="alert-close-btn"
          aria-label="Dismiss message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
