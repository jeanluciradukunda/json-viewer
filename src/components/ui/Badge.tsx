import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

const variantClasses: Record<string, string> = {
  default: 'bg-surface text-text-secondary',
  success: 'bg-diff-added-bg text-diff-added-text',
  danger: 'bg-diff-removed-bg text-diff-removed-text',
  warning: 'bg-diff-modified-bg text-diff-modified-text',
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  return (
    <span className={`inline-block px-1.5 py-0.5 text-xs rounded-btn font-mono ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;
