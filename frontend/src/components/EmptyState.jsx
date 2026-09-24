import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = "No habits yet",
  description = "Create your first habit and start building a better routine.",
  actionText = "Create Habit",
  actionLink = "/habits/new",
  onAction,
}) => {
  return (
    <div className="empty-state-card glass-panel">
      <div className="empty-state-icon-bg">
        <Icon size={28} className="text-indigo" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>

      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn btn-primary empty-state-btn">
            <Plus size={16} />
            <span>{actionText}</span>
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="btn btn-primary empty-state-btn">
            <Plus size={16} />
            <span>{actionText}</span>
          </button>
        )
      )}
    </div>
  );
};
