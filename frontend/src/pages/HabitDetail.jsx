import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { HabitForm } from '../components/HabitForm';
import { LoadingState } from '../components/LoadingState';
import { AlertMessage } from '../components/AlertMessage';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  getHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  incompleteHabit,
} from '../api/habits';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Loader2,
  Tag,
} from 'lucide-react';

export const HabitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editApiError, setEditApiError] = useState('');
  const [editFieldErrors, setEditFieldErrors] = useState({});

  // Completion toggle loading
  const [isTogglingComplete, setIsTogglingComplete] = useState(false);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHabitDetail = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getHabit(id);
      setHabit(data.habit || null);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Habit not found or has been removed.');
      } else {
        setError('Unable to load habit details. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHabitDetail();
  }, [fetchHabitDetail]);

  const handleToggleCompletion = async () => {
    if (!habit || isTogglingComplete) return;

    const newStatus = !habit.completed;
    setIsTogglingComplete(true);

    try {
      if (newStatus) {
        await completeHabit(habit.id);
        setHabit((prev) => ({ ...prev, completed: true }));
        addToast(`"${habit.title}" marked as complete!`, 'success');
      } else {
        await incompleteHabit(habit.id);
        setHabit((prev) => ({ ...prev, completed: false }));
        addToast(`"${habit.title}" marked as incomplete.`, 'info');
      }
    } catch (err) {
      addToast('Failed to update completion status.', 'error');
    } finally {
      setIsTogglingComplete(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    if (isSaving) return;

    setIsSaving(true);
    setEditApiError('');
    setEditFieldErrors({});

    try {
      const response = await updateHabit(id, formData);
      setHabit((prev) => ({
        ...prev,
        ...response.habit,
      }));
      setIsEditing(false);
      addToast('Habit updated successfully!', 'success');
    } catch (err) {
      setIsSaving(false);
      if (err.response && err.response.status === 422) {
        setEditFieldErrors(err.response.data?.errors || {});
        setEditApiError(err.response.data?.message || 'Validation failed.');
      } else {
        setEditApiError('Failed to save changes. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteHabit(id);
      addToast(`"${habit?.title}" was deleted.`, 'info');
      navigate('/habits');
    } catch (err) {
      addToast('Failed to delete habit.', 'error');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const formattedCreatedDate = habit?.created_at
    ? new Date(habit.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const formattedUpdatedDate = habit?.updated_at
    ? new Date(habit.updated_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <AppLayout>
      <div className="habit-detail-page max-w-3xl mx-auto animate-fade-in">
        {/* Navigation Back Link */}
        <Link to="/habits" className="back-link mb-6 inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          <span>Back to Habits</span>
        </Link>

        {loading ? (
          <LoadingState message="Loading habit details..." />
        ) : error ? (
          <AlertMessage message={error} type="error" />
        ) : !habit ? (
          <AlertMessage message="Habit not found." type="error" />
        ) : isEditing ? (
          /* EDIT MODE */
          <div className="edit-habit-container">
            <div className="section-header-row mb-4">
              <div>
                <h1 className="page-title">Edit Habit</h1>
                <p className="page-subtitle">Update your routine preferences.</p>
              </div>
            </div>

            <HabitForm
              initialValues={{
                title: habit.title,
                description: habit.description,
                is_active: habit.is_active,
              }}
              onSubmit={handleEditSubmit}
              submitText="Save Changes"
              isSubmitting={isSaving}
              apiError={editApiError}
              fieldErrors={editFieldErrors}
            />
          </div>
        ) : (
          /* VIEW MODE */
          <div className="habit-detail-card glass-panel">
            {/* Header */}
            <div className="habit-detail-header mb-6">
              <div className="habit-detail-title-group">
                <h1 className="habit-detail-title">{habit.title}</h1>
                <span
                  className={`status-badge-pill ${
                    habit.is_active ? 'active-badge' : 'inactive-badge'
                  }`}
                >
                  <Tag size={12} />
                  <span>{habit.is_active ? 'Active' : 'Inactive'}</span>
                </span>
              </div>

              <div className="habit-detail-actions">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit3 size={16} />
                  <span>Edit Habit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="btn btn-danger-outline btn-sm"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Completion Status Action Box */}
            <div className={`completion-status-box mt-6 mb-8 ${habit.completed ? 'is-complete' : ''}`}>
              <div className="status-box-info">
                <div className="status-box-icon">
                  {habit.completed ? (
                    <CheckCircle2 size={24} className="text-emerald" />
                  ) : (
                    <Circle size={24} className="text-muted" />
                  )}
                </div>
                <div>
                  <h4 className="status-box-title">
                    {habit.completed ? 'Completed Today' : 'Not Completed Today'}
                  </h4>
                  <p className="status-box-subtitle">
                    {habit.completed
                      ? 'You have logged this habit for today.'
                      : 'Mark this habit complete to keep up your daily streak.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleCompletion}
                disabled={isTogglingComplete}
                className={`btn btn-completion-toggle ${habit.completed ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isTogglingComplete ? (
                  <>
                    <Loader2 size={16} className="spinner-icon" />
                    <span>Updating...</span>
                  </>
                ) : habit.completed ? (
                  'Mark Incomplete'
                ) : (
                  'Mark Complete'
                )}
              </button>
            </div>

            {/* Description */}
            <div className="detail-section mt-8 mb-6">
              <h3 className="detail-section-title">Description</h3>
              <p className="detail-description-text">
                {habit.description || 'No description provided for this habit.'}
              </p>
            </div>

            {/* Metadata Footer */}
            <div className="detail-meta-footer">
              {formattedCreatedDate && (
                <div className="meta-item">
                  <Calendar size={14} className="meta-icon" />
                  <span>Created: {formattedCreatedDate}</span>
                </div>
              )}
              {formattedUpdatedDate && (
                <div className="meta-item">
                  <Clock size={14} className="meta-icon" />
                  <span>Last updated: {formattedUpdatedDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Delete this habit?"
          message={`Are you sure you want to delete "${habit?.title}"? This action cannot be undone.`}
          confirmText="Delete Habit"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          isConfirming={isDeleting}
        />
      </div>
    </AppLayout>
  );
};
