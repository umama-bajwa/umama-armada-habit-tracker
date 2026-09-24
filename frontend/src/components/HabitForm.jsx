import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from './LoadingButton';
import { AlertMessage } from './AlertMessage';

export const HabitForm = ({
  initialValues = { title: '', description: '', is_active: true },
  onSubmit,
  submitText = 'Create Habit',
  isSubmitting = false,
  apiError = '',
  fieldErrors = {},
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    is_active: initialValues.is_active !== undefined ? initialValues.is_active : true,
  });

  const [localErrors, setLocalErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (localErrors[name]) {
      setLocalErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Habit name is required.';
    } else if (formData.title.trim().length > 255) {
      errs.title = 'Habit name must not exceed 255 characters.';
    }
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      is_active: !!formData.is_active,
    });
  };

  const titleError = localErrors.title || fieldErrors.title;
  const descError = localErrors.description || fieldErrors.description;

  return (
    <form onSubmit={handleSubmit} noValidate className="habit-form-card glass-panel">
      <AlertMessage message={apiError} type="error" />

      {/* Habit Name */}
      <div className={`auth-input-group ${titleError ? 'has-error' : ''}`}>
        <label htmlFor="habit-title" className="auth-input-label">
          Habit name <span className="required-star">*</span>
        </label>
        <input
          id="habit-title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Read for 20 minutes"
          className="auth-input-field"
          disabled={isSubmitting}
          maxLength={255}
          required
        />
        {titleError && (
          <div className="auth-input-error" role="alert">
            <span>{Array.isArray(titleError) ? titleError[0] : titleError}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className={`auth-input-group ${descError ? 'has-error' : ''}`}>
        <label htmlFor="habit-description" className="auth-input-label">
          Description <span className="text-muted font-normal">(Optional)</span>
        </label>
        <textarea
          id="habit-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What does this habit involve?"
          className="auth-input-field form-textarea"
          rows={3}
          disabled={isSubmitting}
        />
        {descError && (
          <div className="auth-input-error" role="alert">
            <span>{Array.isArray(descError) ? descError[0] : descError}</span>
          </div>
        )}
      </div>

      {/* Active Status Toggle */}
      <div className="form-toggle-row">
        <label className="checkbox-label cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            disabled={isSubmitting}
            className="custom-checkbox"
          />
          <div className="toggle-text-area">
            <span className="toggle-title">Active habit</span>
            <span className="toggle-subtitle">
              Active habits show on your daily dashboard for tracking
            </span>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="form-actions-row">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <LoadingButton
          type="submit"
          isLoading={isSubmitting}
          loadingText="Saving..."
          disabled={isSubmitting}
          variant="primary"
        >
          {submitText}
        </LoadingButton>
      </div>
    </form>
  );
};
