import React, { useState, useMemo } from 'react';
import { useDogs } from '../../contexts/DogsContext';
import { DogCard } from '../dogs/DogCard';
import { Pagination } from '../dogs/Pagination';

export function FavoritesPage() {
  const { dogs, favorites } = useDogs();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Get all favorited dogs
  const favoriteDogs = useMemo(() => {
    return dogs.filter(dog => favorites.has(dog.id));
  }, [dogs, favorites]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(favoriteDogs.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentDogs = favoriteDogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        My Favorite Dogs ({favoriteDogs.length})
      </h2>
      
      {favoriteDogs.length === 0 ? (
        <div className="text-center py-8">
          <p>You haven't added any dogs to your favorites yet.</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            Showing {startIndex + 1} - {Math.min(endIndex, favoriteDogs.length)} of {favoriteDogs.length} favorites
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
        </>
      )}
    </div>
  );
}
