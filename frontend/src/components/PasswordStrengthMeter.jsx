import React from 'react';
import { ShieldAlert, ShieldCheck, Check, X } from 'lucide-react';

export const PasswordStrengthMeter = ({ password = '' }) => {
  if (!password) return null;

  const checks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  let score = 0;
  let label = 'Weak';
  let colorClass = 'strength-weak';

  if (password.length >= 8) {
    if (passedCount <= 2) {
      score = 1;
      label = 'Weak';
      colorClass = 'strength-weak';
    } else if (passedCount === 3) {
      score = 2;
      label = 'Fair';
      colorClass = 'strength-fair';
    } else if (passedCount === 4) {
      score = 3;
      label = 'Strong';
      colorClass = 'strength-strong';
    } else if (passedCount === 5) {
      score = 4;
      label = 'Excellent';
      colorClass = 'strength-excellent';
    }
  } else {
    score = 1;
    label = 'Too short';
    colorClass = 'strength-weak';
  }

  return (
    <div className="password-strength-container">
      <div className="strength-header">
        <span className="strength-label">
          Password Strength: <strong className={`strength-text ${colorClass}`}>{label}</strong>
        </span>
        <span className="strength-score">{score}/4</span>
      </div>

      <div className="strength-bar-track">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`strength-bar-segment ${step <= score ? colorClass : ''}`}
          ></div>
        ))}
      </div>

      <div className="strength-checklist">
        <div className={`check-item ${checks.length ? 'valid' : ''}`}>
          {checks.length ? <Check size={12} /> : <X size={12} />}
          <span>Min 8 characters</span>
        </div>
        <div className={`check-item ${checks.hasNumber ? 'valid' : ''}`}>
          {checks.hasNumber ? <Check size={12} /> : <X size={12} />}
          <span>Contains number</span>
        </div>
        <div className={`check-item ${checks.hasUpper && checks.hasLower ? 'valid' : ''}`}>
          {checks.hasUpper && checks.hasLower ? <Check size={12} /> : <X size={12} />}
          <span>Upper & lowercase</span>
        </div>
        <div className={`check-item ${checks.hasSpecial ? 'valid' : ''}`}>
          {checks.hasSpecial ? <Check size={12} /> : <X size={12} />}
          <span>Special character</span>
        </div>
      </div>
    </div>
  );
};
