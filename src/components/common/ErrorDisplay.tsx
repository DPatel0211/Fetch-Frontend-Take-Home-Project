import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-red-700">{error}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <span className="text-xl font-bold">×</span>
          </button>
        )}
      </div>
    </div>
  );
}
