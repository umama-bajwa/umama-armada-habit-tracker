import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Shield, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthHero } from '../components/AuthHero';
import { AuthInput } from '../components/AuthInput';
import { PasswordInput } from '../components/PasswordInput';
import { LoadingButton } from '../components/LoadingButton';
import { AlertMessage } from '../components/AlertMessage';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || '',
    password: '',
    rememberMe: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    // Clear field-specific error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Client-side validation check
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGeneralError('');
    setSuccessMessage('');

    const result = await login({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (result.success) {
      setSuccessMessage('Login successful! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } else {
      setIsSubmitting(false);

      if (result.errors && Object.keys(result.errors).length > 0) {
        // Map backend validation errors (e.g. 422)
        const mapped = {};
        Object.keys(result.errors).forEach((key) => {
          mapped[key] = Array.isArray(result.errors[key])
            ? result.errors[key][0]
            : result.errors[key];
        });
        setFieldErrors(mapped);
        setGeneralError(result.message || 'Please fix the highlighted fields.');
      } else {
        // General error (401 invalid credentials, 500, or network connection failure)
        setGeneralError(result.message || 'Invalid email or password.');
      }
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Column: Visual Hero Section */}
      <AuthHero subtitle="Welcome back! Track habits, sustain momentum, and achieve your goals." />

      {/* Right Column: Authentication Form Card */}
      <div className="auth-form-container">
        <div className="auth-card glass-panel-dark animate-fade-in">
          {/* Card Header */}
          <div className="auth-card-header">
            <div className="mobile-brand">
              <span className="brand-title">ARMADA</span>
            </div>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">
              Sign in to your Armada account to continue your habit journey.
            </p>
          </div>

          {/* Feedback Messages */}
          <AlertMessage
            message={generalError}
            type="error"
            onClose={() => setGeneralError('')}
          />
          <AlertMessage message={successMessage} type="success" />

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <AuthInput
              id="email"
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              error={fieldErrors.email}
              icon={Mail}
              required
              autoComplete="email"
              disabled={isSubmitting}
            />

            <PasswordInput
              id="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={fieldErrors.password}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            {/* Remember Me & Forgot Password Row */}
            <div className="auth-options-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="custom-checkbox"
                />
                <span className="checkbox-text">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="link-btn"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Logging in..."
              disabled={isSubmitting}
              variant="primary"
            >
              Log In
            </LoadingButton>
          </form>

          {/* Card Footer Switch Route */}
          <div className="auth-card-footer">
            <p className="switch-text">
              Don't have an account?{' '}
              <Link to="/register" className="auth-switch-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div
            className="modal-content glass-panel-dark"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-icon indigo">
                <Shield size={24} />
              </div>
              <h3 className="modal-title">Password Reset</h3>
            </div>
            <p className="modal-body">
              Password reset links are managed via account security settings. If you forgot your password, please contact system administration or log in with your credentials.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowForgotModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
