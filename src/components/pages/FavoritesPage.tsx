import React, { useState, useMemo } from 'react';
import { useDogs } from '../../contexts/DogsContext';
import { DogCard } from '../dogs/DogCard';
import { Pagination } from '../dogs/Pagination';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface FavoritesPageProps {
  onNavigate?: (page: 'search' | 'favorites' | 'match') => void;
}

export function FavoritesPage({ onNavigate }: FavoritesPageProps) {
  const { dogs, favorites, favoriteDogs, error, loading, clearError } = useDogs();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const favoritedDogs = useMemo(() => {
    try {
      return Array.from(favorites).map(id => {
        // First check current dogs array
        const dogInCurrent = dogs.find(d => d.id === id);
        // If not in current dogs, get from favoriteDogs Map
        return dogInCurrent || favoriteDogs.get(id);
      }).filter(Boolean);
    } catch (error) {
      console.error('Error filtering favorites:', error);
      return [];
    }
  }, [dogs, favorites, favoriteDogs]);

  // Rest of your component stays exactly the same...
  const startIndex = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(favoritedDogs.length / pageSize);
  const currentDogs = favoritedDogs.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (error) {
    return <ErrorDisplay error={error} onDismiss={clearError} />;
  }

  if (favoritedDogs.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">My Favorites</h2>
        <p className="text-gray-600 mb-4">You haven't added any dogs to your favorites yet.</p>
        <button 
          onClick={() => onNavigate?.('search')}
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg 
                   hover:bg-blue-600 transition-colors"
        >
          Find Dogs to Favorite
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          My Favorites ({favoritedDogs.length})
        </h2>
      </div>

      <div className="mb-4">
        Showing {startIndex + 1} - {Math.min(startIndex + pageSize, favoritedDogs.length)} of {favoritedDogs.length} favorites
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentDogs.map(dog => (
          <DogCard 
            key={dog.id} 
            dog={dog}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
