import React from 'react';
import { AlertCircle } from 'lucide-react';

export const AuthInput = ({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon: Icon,
  required = false,
  autoComplete,
  children,
  disabled = false,
}) => {
  return (
    <div className={`auth-input-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={id} className="auth-input-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className="auth-input-wrapper">
        {Icon && (
          <div className="input-icon-prefix">
            <Icon size={18} />
          </div>
        )}

        <input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`auth-input-field ${Icon ? 'with-prefix' : ''} ${children ? 'with-suffix' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {children}
      </div>

      {error && (
        <div id={`${id}-error`} className="auth-input-error" role="alert">
          <AlertCircle size={14} className="error-icon" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
