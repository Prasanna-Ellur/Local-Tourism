import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-stone-200/80 shadow-sm max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-full bg-forest-50 text-forest flex items-center justify-center mb-4">
        {icon || <Compass className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-bold text-stone-800 mb-1.5">{title}</h3>
      <p className="text-sm text-stone-500 mb-6 max-w-sm">{description}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-forest text-white font-medium hover:bg-forest-700 transition shadow-sm text-sm"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
