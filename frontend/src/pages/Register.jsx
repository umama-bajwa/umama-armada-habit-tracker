import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthHero } from '../components/AuthHero';
import { AuthInput } from '../components/AuthInput';
import { PasswordInput } from '../components/PasswordInput';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { LoadingButton } from '../components/LoadingButton';
import { AlertMessage } from '../components/AlertMessage';

export const Register = () => {
  const navigate = useNavigate();
  const { register, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    termsAccepted: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (formData.name.trim().length > 255) {
      errors.name = 'Full name must not exceed 255 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.password_confirmation) {
      errors.password_confirmation = 'Please confirm your password.';
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match.';
    }

    if (!formData.termsAccepted) {
      errors.terms = 'You must accept the terms & conditions to continue.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (name === 'termsAccepted' && fieldErrors.terms) {
      setFieldErrors((prev) => ({ ...prev, terms: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setGeneralError('');
    setSuccessMessage('');

    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    });

    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting to login...');
      // Clear token to enforce signup -> login -> dashboard flow
      await logout();
      setTimeout(() => {
        navigate('/login', {
          state: {
            registeredEmail: formData.email.trim(),
            message: 'Account created successfully! Please log in with your credentials.',
          },
        });
      }, 700);
    } else {
      setIsSubmitting(false);

      if (result.errors && Object.keys(result.errors).length > 0) {
        const mapped = {};
        Object.keys(result.errors).forEach((key) => {
          mapped[key] = Array.isArray(result.errors[key])
            ? result.errors[key][0]
            : result.errors[key];
        });
        setFieldErrors(mapped);
        setGeneralError(result.message || 'Please fix the highlighted fields.');
      } else {
        setGeneralError(result.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Column: Visual Hero Section */}
      <AuthHero subtitle="Create your Armada account today. Build habits that last a lifetime." />

      {/* Right Column: Registration Card */}
      <div className="auth-form-container">
        <div className="auth-card glass-panel-dark animate-fade-in">
          {/* Card Header */}
          <div className="auth-card-header">
            <div className="mobile-brand">
              <span className="brand-title">ARMADA</span>
            </div>
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">
              Join thousands building positive daily momentum with Armada.
            </p>
          </div>

          {/* Feedback Messages */}
          <AlertMessage
            message={generalError}
            type="error"
            onClose={() => setGeneralError('')}
          />
          <AlertMessage message={successMessage} type="success" />

          {/* Registration Form */}
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <AuthInput
              id="name"
              label="Full name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Morgan"
              error={fieldErrors.name}
              icon={User}
              required
              autoComplete="name"
              disabled={isSubmitting}
            />

            <AuthInput
              id="email"
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
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
              placeholder="At least 8 characters"
              error={fieldErrors.password}
              required
              autoComplete="new-password"
              disabled={isSubmitting}
            />

            {/* Password Strength Feedback */}
            <PasswordStrengthMeter password={formData.password} />

            <PasswordInput
              id="password_confirmation"
              label="Confirm password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Repeat your password"
              error={fieldErrors.password_confirmation}
              required
              autoComplete="new-password"
              disabled={isSubmitting}
            />

            {/* Terms Checkbox */}
            <div className="auth-input-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="custom-checkbox"
                />
                <span className="checkbox-text">
                  I agree to the <span className="text-highlight">Terms of Service</span> and{' '}
                  <span className="text-highlight">Privacy Policy</span>
                </span>
              </label>
              {fieldErrors.terms && (
                <div className="auth-input-error" role="alert">
                  <span>{fieldErrors.terms}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <LoadingButton
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating account..."
              disabled={isSubmitting}
              variant="primary"
            >
              Create Account
            </LoadingButton>
          </form>

          {/* Card Footer Switch Route */}
          <div className="auth-card-footer">
            <p className="switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
