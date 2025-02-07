import React from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="dog-card"
    >
      <div className="dog-card-image-container">
        <img 
          src={dog.img} 
          alt={`${dog.name} - ${dog.breed}`}
          className="dog-card-image"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFavoriteClick}
          className={`favorite-button ${
            isFavorite ? 'favorite-button-active' : 'favorite-button-inactive'
          }`}
        >
          <HeartIcon className="w-6 h-6" />
        </motion.button>
      </div>
      
      <div className="dog-card-content">
        <h3 className="dog-card-title">{dog.name}</h3>
        <div className="space-y-1">
          <p className="dog-card-info">
            <span className="font-medium">Breed:</span> {dog.breed}
          </p>
          <p className="dog-card-info">
            <span className="font-medium">Age:</span> {dog.age} years
          </p>
          <p className="dog-card-info">
            <span className="font-medium">Location:</span> {dog.zip_code}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
