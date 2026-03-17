import React from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  title = "No results found", 
  message = "Try adjusting your search or filters to find what you're looking for.",
  icon: Icon = Search,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-surface p-4 rounded-full border border-slate-800 mb-4">
        <Icon className="w-8 h-8 text-textMuted" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-textMuted max-w-sm mb-6">{message}</p>
      {actionText && onAction && (
        <Button onClick={onAction}>{actionText}</Button>
      )}
    </div>
  );
};

export default EmptyState;
