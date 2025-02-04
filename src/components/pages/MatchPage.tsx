import React, { useState } from 'react';
import { useDogs } from '../../contexts/DogsContext';
import { Dog } from '../../services/api/dogs';
import { DogCard } from '../dogs/DogCard';

export function MatchPage() {
  const { favorites, generateMatch } = useDogs();
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMatch = async () => {
    try {
      setLoading(true);
      setError(null);
      const dog = await generateMatch();
      setMatchedDog(dog);
    } catch (err) {
      setError('Failed to generate match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (favorites.size === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Find My Match</h2>
        <p>Please add some dogs to your favorites first to get a match.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Find My Match</h2>
      {!matchedDog ? (
        <div className="text-center">
          <p className="mb-4">Ready to find your perfect match? 
            We'll help you choose from {favorites.size} favorite dogs.</p>
          <button
            onClick={handleGenerateMatch}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            {loading ? 'Finding your match...' : 'Generate Match'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <div>
          <p className="mb-4">We found your perfect match!</p>
          <DogCard dog={matchedDog} />
          <button
            onClick={() => setMatchedDog(null)}
            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            Find Another Match
          </button>
        </div>
      )}
    </div>
  );
}
