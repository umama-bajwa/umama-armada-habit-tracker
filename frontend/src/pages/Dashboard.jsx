import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHabits } from '../api/habits';
import { AppLayout } from '../components/AppLayout';
import { ProgressCard } from '../components/ProgressCard';
import { HabitCard } from '../components/HabitCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingState } from '../components/LoadingState';
import { AlertMessage } from '../components/AlertMessage';
import { ConfirmModal } from '../components/ConfirmModal';
import { deleteHabit as apiDeleteHabit } from '../api/habits';
import { useToast } from '../context/ToastContext';
import {
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  Plus,
  List,
  Sparkles,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Deletion Modal state
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Time-based greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch active habits for today
      const data = await getHabits('active');
      setHabits(data.habits || []);
    } catch (err) {
      setError('Unable to load habits. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleHabitStatusChange = (habitId, newCompleted) => {
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

  // Calculations from actual habits data
  const totalActive = habits.length;
  const completedCount = habits.filter((h) => h.completed).length;
  const completionRate = totalActive > 0 ? Math.round((completedCount / totalActive) * 100) : 0;
  
  // Estimate streak (total completed today + streak representation)
  const currentStreak = completedCount > 0 ? `${completedCount} active` : '0 days';

  return (
    <AppLayout>
      <div className="dashboard-page animate-fade-in">
        {/* Header Greeting */}
        <div className="welcome-banner glass-panel mb-8">
          <div className="banner-text-area">
            <span className="brand-badge mb-2">DAILY OVERVIEW</span>
            <h1 className="welcome-heading">
              {getGreeting()}, {user?.name || 'Habit Builder'} 👋
            </h1>
            <p className="welcome-subtext">
              Build small habits. Make steady progress.
            </p>
          </div>

          <div className="banner-action-area">
            <Link to="/habits/new" className="btn btn-primary banner-add-habit-btn">
              <Plus size={18} />
              <span>Add Habit</span>
            </Link>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="dashboard-grid mb-10">
          <ProgressCard
            icon={Target}
            iconTheme="indigo"
            title="Today's Progress"
            value={`${completedCount} / ${totalActive} completed`}
            progressPercentage={completionRate}
            subtitle={totalActive > 0 ? `${completionRate}% of daily habits complete` : 'No active habits today'}
          />

          <ProgressCard
            icon={Flame}
            iconTheme="blush"
            title="Current Momentum"
            value={currentStreak}
            subtitle={completedCount > 0 ? 'Keep logging back in every day!' : 'Complete a habit to build streak'}
          />

          <ProgressCard
            icon={CheckCircle2}
            iconTheme="cyan"
            title="Active Habits"
            value={`${totalActive} habits`}
            subtitle="Routines being tracked"
          />

          <ProgressCard
            icon={TrendingUp}
            iconTheme="green"
            title="Completion Rate"
            value={`${completionRate}%`}
            progressPercentage={completionRate}
            subtitle="Overall daily performance"
          />
        </div>

        {/* Today's Habits Section */}
        <div className="content-section mt-10 mb-10">
          <div className="section-header-row mb-4">
            <div>
              <h2 className="section-title">Today's Habits</h2>
              <p className="section-subtitle">Focus on completing these core routines today.</p>
            </div>
            {totalActive > 0 && (
              <span className="live-pill">
                {completedCount} of {totalActive} Done
              </span>
            )}
          </div>

          <AlertMessage message={error} type="error" />

          {loading ? (
            <LoadingState message="Loading today's habits..." />
          ) : habits.length === 0 ? (
            <EmptyState
              title="No active habits for today"
              description="Start building your routine by adding your first daily habit."
              actionText="Create Habit"
              actionLink="/habits/new"
            />
          ) : (
            <div className="habit-cards-list">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onStatusChange={handleHabitStatusChange}
                  onDelete={(h) => setDeletingHabit(h)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="content-section mt-10 mb-10">
          <h2 className="section-title mb-3">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/habits/new" className="quick-action-card glass-panel">
              <div className="card-icon indigo">
                <Plus size={20} />
              </div>
              <div className="quick-action-info">
                <h4>Add Habit</h4>
                <p>Create a new daily routine</p>
              </div>
            </Link>

            <Link to="/habits" className="quick-action-card glass-panel">
              <div className="card-icon cyan">
                <List size={20} />
              </div>
              <div className="quick-action-info">
                <h4>View All Habits</h4>
                <p>Manage all active & inactive routines</p>
              </div>
            </Link>

            <Link to="/progress" className="quick-action-card glass-panel">
              <div className="card-icon violet">
                <TrendingUp size={20} />
              </div>
              <div className="quick-action-info">
                <h4>View Progress</h4>
                <p>See your consistency metrics</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="motivational-card glass-panel mt-10">
          <div className="motivational-icon">
            <Sparkles size={20} className="text-violet" />
          </div>
          <p className="motivational-text">
            "Small steps every day add up."
          </p>
        </div>

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
