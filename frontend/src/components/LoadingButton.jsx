import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

export const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = 'Please wait...',
  disabled = false,
  type = 'submit',
  variant = 'primary',
  onClick,
  showArrow = true,
  className = '',
}) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isButtonDisabled}
      className={`btn btn-${variant} ${isLoading ? 'is-loading' : ''} ${className}`}
    >
      <span className="btn-content">
        {isLoading ? (
          <>
            <Loader2 className="spinner-icon" size={18} />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            {showArrow && <ArrowRight className="btn-arrow" size={18} />}
          </>
        )}
      </span>
      <div className="btn-glow"></div>
    </button>
  );
};
