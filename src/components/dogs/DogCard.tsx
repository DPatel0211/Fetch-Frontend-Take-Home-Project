import React from 'react';
import { Dog } from '../../services/api/dogs';
import { useDogs } from '../../contexts/DogsContext';

interface DogCardProps {
  dog: Dog;
}

export function DogCard({ dog }: DogCardProps) {
  const { favorites, toggleFavorite } = useDogs();
  const isFavorite = favorites.has(dog.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(dog.id);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <img 
        src={dog.img} 
        alt={`${dog.name} - ${dog.breed}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{dog.name}</h3>
        <p>Breed: {dog.breed}</p>
        <p>Age: {dog.age} years</p>
        <p>Location: {dog.zip_code}</p>
        <button
          onClick={handleFavoriteClick}
          className={`mt-2 px-4 py-2 rounded ${
            isFavorite ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
}
