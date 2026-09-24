import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const PageHeader = ({
  title,
  subtitle,
  actionText,
  actionLink,
  onAction,
  badgeText,
}) => {
  return (
    <div className="page-header-container">
      <div className="page-header-text">
        {badgeText && <span className="brand-badge mb-2">{badgeText}</span>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {actionText && (
        <div className="page-header-actions">
          {actionLink ? (
            <Link to={actionLink} className="btn btn-primary btn-header-action">
              <Plus size={16} />
              <span>{actionText}</span>
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="btn btn-primary btn-header-action">
              <Plus size={16} />
              <span>{actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
