import React from 'react';

export const ProgressCard = ({
  icon: Icon,
  iconTheme = "indigo", // "indigo" | "cyan" | "violet" | "green" | "blush"
  title,
  value,
  subtitle,
  progressPercentage,
}) => {
  return (
    <div className="dash-card glass-panel">
      <div className="card-header">
        {Icon && (
          <div className={`card-icon ${iconTheme}`}>
            <Icon size={20} />
          </div>
        )}
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        <div className="big-stat-number">{value}</div>
        
        {progressPercentage !== undefined && (
          <div className="summary-progress-bar-track">
            <div
              className="summary-progress-bar-fill"
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            ></div>
          </div>
        )}

        {subtitle && <p className="stat-description">{subtitle}</p>}
      </div>
    </div>
  );
};
