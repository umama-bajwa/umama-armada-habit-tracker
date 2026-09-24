import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '../components/AppLayout';
import { PageHeader } from '../components/PageHeader';
import { HabitCard } from '../components/HabitCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { AlertMessage } from '../components/AlertMessage';
import { ConfirmModal } from '../components/ConfirmModal';
import { getHabits, deleteHabit as apiDeleteHabit } from '../api/habits';
import { useToast } from '../context/ToastContext';
import { Filter } from 'lucide-react';

export const Habits = () => {
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Deletion Modal state
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHabits = useCallback(async (filter) => {
    setLoading(true);
    setError('');
    try {
      const data = await getHabits(filter);
      setHabits(data.habits || []);
    } catch (err) {
      setError('Failed to load habits. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits(statusFilter);
  }, [statusFilter, fetchHabits]);

  const handleFilterChange = (newFilter) => {
    if (newFilter !== statusFilter) {
      setStatusFilter(newFilter);
    }
  };

  const handleStatusChange = (habitId, newCompleted) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, completed: newCompleted } : h))
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHabit) return;
    setIsDeleting(true);
    try {
      await apiDeleteHabit(deletingHabit.id);
      setHabits((prev) => prev.filter((h) => h.id !== deletingHabit.id));
      addToast(`"${deletingHabit.title}" has been deleted.`, 'info');
      setDeletingHabit(null);
    } catch (err) {
      addToast('Failed to delete habit. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AppLayout>
      <div className="habits-page animate-fade-in">
        <PageHeader
          title="Your Habits"
          subtitle="Manage the routines you want to build."
          actionText="Add Habit"
          actionLink="/habits/new"
        />

        {/* Filter Controls & Habit Count Bar */}
        <div className="filter-bar glass-panel mb-6">
          <div className="filter-tabs-group">
            <span className="filter-label">
              <Filter size={14} />
              <span>Status:</span>
            </span>
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              className={`filter-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('active')}
              className={`filter-tab-btn ${statusFilter === 'active' ? 'active' : ''}`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('inactive')}
              className={`filter-tab-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
            >
              Inactive
            </button>
          </div>

          <div className="habits-count-badge">
            {habits.length} {habits.length === 1 ? 'habit' : 'habits'}
          </div>
        </div>

        {/* Error Alert */}
        <AlertMessage message={error} type="error" />

        {/* Habits List / Loading / Empty State */}
        {loading ? (
          <LoadingState message="Loading your habits..." />
        ) : habits.length === 0 ? (
          <EmptyState
            title={
              statusFilter === 'all'
                ? 'No habits yet'
                : `No ${statusFilter} habits found`
            }
            description={
              statusFilter === 'all'
                ? 'Create your first habit and start building a better routine.'
                : `You don't have any habits currently marked as ${statusFilter}.`
            }
            actionText="Create Habit"
            actionLink="/habits/new"
          />
        ) : (
          <div className="habit-cards-list">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onStatusChange={handleStatusChange}
                onDelete={(h) => setDeletingHabit(h)}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!deletingHabit}
          title="Delete this habit?"
          message={`Are you sure you want to delete "${deletingHabit?.title}"? This action cannot be undone.`}
          confirmText="Delete Habit"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingHabit(null)}
          isConfirming={isDeleting}
        />
      </div>
    </AppLayout>
  );
};
