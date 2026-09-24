import React, { useState } from 'react';
import { AuthInput } from './AuthInput';
import { Lock, Eye, EyeOff } from 'lucide-react';

export const PasswordInput = ({
  id = 'password',
  label = 'Password',
  name = 'password',
  value,
  onChange,
  onBlur,
  placeholder = '••••••••',
  error,
  required = true,
  autoComplete = 'current-password',
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <AuthInput
      id={id}
      label={label}
      type={showPassword ? 'text' : 'password'}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      error={error}
      icon={Lock}
      required={required}
      autoComplete={autoComplete}
      disabled={disabled}
    >
      <button
        type="button"
        onClick={toggleVisibility}
        className="password-toggle-btn"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </AuthInput>
  );
};
