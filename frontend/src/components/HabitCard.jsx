import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Edit2, Trash2, Calendar, Loader2 } from 'lucide-react';
import { completeHabit, incompleteHabit } from '../api/habits';
import { useToast } from '../context/ToastContext';

export const HabitCard = ({ habit, onStatusChange, onDelete }) => {
  const { addToast } = useToast();
  const [isToggling, setIsToggling] = useState(false);
  const [isCompleted, setIsCompleted] = useState(!!habit.completed);

  const handleToggleComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;

    const newStatus = !isCompleted;
    setIsCompleted(newStatus); // Optimistic UI update
    setIsToggling(true);

    try {
      if (newStatus) {
        await completeHabit(habit.id);
        addToast(`"${habit.title}" completed! Great job.`, 'success');
      } else {
        await incompleteHabit(habit.id);
        addToast(`"${habit.title}" marked as incomplete.`, 'info');
      }
      if (onStatusChange) {
        onStatusChange(habit.id, newStatus);
      }
    } catch (err) {
      setIsCompleted(!newStatus); // Revert on failure
      addToast('Failed to update habit completion status. Please try again.', 'error');
    } finally {
      setIsToggling(false);
    }
  };

  const formattedDate = habit.created_at
    ? new Date(habit.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className={`habit-card-item ${isCompleted ? 'completed-habit' : ''}`}>
      <div className="habit-card-left">
        <button
          type="button"
          onClick={handleToggleComplete}
          disabled={isToggling}
          className={`habit-check-btn ${isCompleted ? 'checked' : ''}`}
          aria-label={isCompleted ? `Mark ${habit.title} incomplete` : `Mark ${habit.title} complete`}
        >
          {isToggling ? (
            <Loader2 size={20} className="spinner-icon text-indigo" />
          ) : isCompleted ? (
            <CheckCircle2 size={22} className="check-icon-active" />
          ) : (
            <Circle size={22} className="check-icon-idle" />
          )}
        </button>

        <div className="habit-card-details">
          <div className="habit-title-row">
            <Link to={`/habits/${habit.id}`} className="habit-title-link">
              <h4 className={`habit-card-title ${isCompleted ? 'line-through-text' : ''}`}>
                {habit.title}
              </h4>
            </Link>
            
            <span className={`status-badge-pill ${habit.is_active ? 'active-badge' : 'inactive-badge'}`}>
              {habit.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {habit.description && (
            <p className="habit-card-desc">{habit.description}</p>
          )}

          <div className="habit-card-meta-row">
            <span className={`completion-status-lbl ${isCompleted ? 'completed-lbl' : 'pending-lbl'}`}>
              {isCompleted ? '✓ Completed today' : '• Not completed yet'}
            </span>
            {formattedDate && (
              <span className="habit-created-date">
                <Calendar size={12} />
                <span>Added {formattedDate}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="habit-card-actions">
        <Link
          to={`/habits/${habit.id}`}
          className="habit-action-btn edit-btn"
          aria-label={`Edit ${habit.title}`}
          title="Edit habit details"
        >
          <Edit2 size={16} />
        </Link>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(habit)}
            className="habit-action-btn delete-btn"
            aria-label={`Delete ${habit.title}`}
            title="Delete habit"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
