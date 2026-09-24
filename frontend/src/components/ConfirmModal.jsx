import React, { useEffect } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = "Delete this habit?",
  message = "This action cannot be undone.",
  confirmText = "Delete Habit",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isConfirming = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isConfirming) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isConfirming, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={!isConfirming ? onCancel : undefined}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="modal-icon blush">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 id="modal-title" className="modal-title">{title}</h3>
          </div>
          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onCancel}
            disabled={isConfirming}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <p className="modal-body">{message}</p>

        <div className="modal-actions gap-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <Loader2 size={16} className="spinner-icon" />
                <span>Deleting...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
