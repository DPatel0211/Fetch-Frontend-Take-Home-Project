import React from 'react';
import { useDogs } from '../../contexts/DogsContext';
import { DogCard } from '../dogs/DogCard';

export function FavoritesPage() {
  const { dogs, favorites } = useDogs();
  const favoriteDogs = dogs.filter(dog => favorites.has(dog.id));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Favorite Dogs</h2>
      {favoriteDogs.length === 0 ? (
        <p>You haven't added any dogs to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteDogs.map(dog => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}
