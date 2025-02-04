import React from 'react';
import { useDogs } from '../../contexts/DogsContext';

interface NavigationProps {
  onNavigate: (page: 'search' | 'favorites' | 'match') => void;
  currentPage: string;
}

export function Navigation({ onNavigate, currentPage }: NavigationProps) {
  const { favorites } = useDogs();
  const hasFavorites = favorites.size > 0;

  return (
    <nav className="w-full border-b mb-6">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xl">Fetch Dog Adoption</div>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('search')}
              className={`px-4 py-2 ${currentPage === 'search' ? 'font-bold' : ''}`}
            >
              Search Dogs
            </button>
            <button 
              onClick={() => onNavigate('favorites')}
              className={`px-4 py-2 ${currentPage === 'favorites' ? 'font-bold' : ''}`}
            >
              Favorites ({favorites.size})
            </button>
            <button 
              onClick={() => onNavigate('match')}
              className={`px-4 py-2 ${currentPage === 'match' ? 'font-bold' : ''}`}
              disabled={!hasFavorites}
            >
              Find My Match
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
