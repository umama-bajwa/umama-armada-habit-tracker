import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { PageHeader } from '../components/PageHeader';
import { HabitForm } from '../components/HabitForm';
import { createHabit } from '../api/habits';
import { useToast } from '../context/ToastContext';

export const AddHabit = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError('');
    setFieldErrors({});

    try {
      const response = await createHabit(formData);
      addToast(`Habit "${response.habit?.title || formData.title}" created successfully!`, 'success');
      navigate('/habits');
    } catch (err) {
      setIsSubmitting(false);

      if (err.response && err.response.status === 422) {
        const errors = err.response.data?.errors || {};
        setFieldErrors(errors);
        setApiError(err.response.data?.message || 'Please fix the highlighted fields.');
      } else if (err.response && err.response.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('Unable to create habit. Please check your network connection.');
      }
    }
  };

  return (
    <AppLayout>
      <div className="add-habit-page max-w-2xl mx-auto animate-fade-in">
        <PageHeader
          title="Create a New Habit"
          subtitle="Start with something small and achievable."
        />

        <HabitForm
          onSubmit={handleSubmit}
          submitText="Create Habit"
          isSubmitting={isSubmitting}
          apiError={apiError}
          fieldErrors={fieldErrors}
        />
      </div>
    </AppLayout>
  );
};
