import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '../components/AppLayout';
import { PageHeader } from '../components/PageHeader';
import { ProgressCard } from '../components/ProgressCard';
import { LoadingState } from '../components/LoadingState';
import { AlertMessage } from '../components/AlertMessage';
import { EmptyState } from '../components/EmptyState';
import { getHabits, completeHabit, incompleteHabit } from '../api/habits';
import { useToast } from '../context/ToastContext';
import {
  TrendingUp,
  Target,
  Flame,
  CheckCircle2,
  Circle,
  Calendar,
  Info,
} from 'lucide-react';

export const Progress = () => {
  const { addToast } = useToast();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProgressData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getHabits('all');
      setHabits(data.habits || []);
    } catch (err) {
      setError('Unable to load progress data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  const handleToggleHabit = async (habit) => {
    const newStatus = !habit.completed;
    // Optimistic state update
    setHabits((prev) =>
      prev.map((h) => (h.id === habit.id ? { ...h, completed: newStatus } : h))
    );

    try {
      if (newStatus) {
        await completeHabit(habit.id);
        addToast(`"${habit.title}" completed!`, 'success');
      } else {
        await incompleteHabit(habit.id);
        addToast(`"${habit.title}" marked incomplete.`, 'info');
      }
    } catch (err) {
      // Revert optimistic update
      setHabits((prev) =>
        prev.map((h) => (h.id === habit.id ? { ...h, completed: !newStatus } : h))
      );
      addToast('Failed to update habit status.', 'error');
    }
  };

  const activeHabits = habits.filter((h) => h.is_active);
  const totalActive = activeHabits.length;
  const completedCount = activeHabits.filter((h) => h.completed).length;
  const completionPercentage =
    totalActive > 0 ? Math.round((completedCount / totalActive) * 100) : 0;

  return (
    <AppLayout>
      <div className="progress-page animate-fade-in">
        <PageHeader
          title="Your Progress"
          subtitle="See how consistently you're showing up."
          actionText="Add Habit"
          actionLink="/habits/new"
        />

        <AlertMessage message={error} type="error" />

        {loading ? (
          <LoadingState message="Calculating your progress..." />
        ) : (
          <>
            {/* Top Summary Cards Grid */}
            <div className="dashboard-grid mb-8">
              <ProgressCard
                icon={TrendingUp}
                iconTheme="indigo"
                title="Overall Completion"
                value={`${completionPercentage}%`}
                progressPercentage={completionPercentage}
                subtitle="Daily completion rate"
              />

              <ProgressCard
                icon={Flame}
                iconTheme="blush"
                title="Current Momentum"
                value={`${completedCount} active`}
                subtitle="Habits logged today"
              />

              <ProgressCard
                icon={Target}
                iconTheme="cyan"
                title="Total Active Habits"
                value={`${totalActive} habits`}
                subtitle="Daily target routines"
              />

              <ProgressCard
                icon={CheckCircle2}
                iconTheme="green"
                title="Completed Today"
                value={`${completedCount} / ${totalActive}`}
                progressPercentage={completionPercentage}
                subtitle="Routines finished today"
              />
            </div>

            {/* Today's Progress Bar Box */}
            <div className="progress-breakdown-card glass-panel mt-10 mb-10">
              <div className="progress-breakdown-header">
                <div>
                  <h3 className="section-title">Today's Progress</h3>
                  <p className="section-subtitle">
                    {completedCount} of {totalActive} daily habits completed
                  </p>
                </div>
                <span className="big-stat-number">{completionPercentage}%</span>
              </div>

              <div className="large-progress-track">
                <div
                  className="large-progress-fill"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Your Habits Completion List */}
            <div className="content-section mt-10 mb-10">
              <h2 className="section-title mb-4">Your Habits</h2>
              {habits.length === 0 ? (
                <EmptyState
                  title="No habits to track yet"
                  description="Add habits to start visualizing your daily progress."
                  actionText="Create Habit"
                  actionLink="/habits/new"
                />
              ) : (
                <div className="progress-habits-list glass-panel">
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      className={`progress-habit-item ${
                        habit.completed ? 'completed' : ''
                      }`}
                      onClick={() => handleToggleHabit(habit)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="progress-habit-info">
                        <div className="check-icon-wrapper">
                          {habit.completed ? (
                            <CheckCircle2 size={20} className="text-emerald" />
                          ) : (
                            <Circle size={20} className="text-muted" />
                          )}
                        </div>
                        <div>
                          <h4 className="progress-habit-title">{habit.title}</h4>
                          {habit.description && (
                            <p className="progress-habit-desc">{habit.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="progress-habit-status">
                        <span
                          className={`status-badge-pill ${
                            habit.completed ? 'active-badge' : 'pending-badge'
                          }`}
                        >
                          {habit.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subtle Analytics Notice */}
            <div className="analytics-placeholder-card glass-panel mt-10">
              <div className="placeholder-icon">
                <Info size={18} className="text-indigo" />
              </div>
              <p className="placeholder-text">
                Detailed history will appear here as more completion data becomes available.
              </p>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};
