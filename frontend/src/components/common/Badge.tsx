import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const getStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'CONFIRMED':
      case 'SUCCESSFUL':
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
      case 'FAILED':
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'COMPLETED':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'TOURIST':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SERVICE_PROVIDER':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ADMIN':
        return 'bg-stone-900 text-stone-100 border-stone-800';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle(
        status
      )} ${className}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
};
