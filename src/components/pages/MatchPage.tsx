import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDogs } from '../../contexts/DogsContext';
import { Dog } from '../../services/api/dogs';
import { DogCard } from '../dogs/DogCard';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function MatchPage() {
  const { favorites, error, loading, clearError, generateMatch } = useDogs();
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const handleGenerateMatch = async () => {
    try {
      setIsGenerating(true);
      setMatchError(null);
      const dog = await generateMatch();
      if (dog) {
        setMatchedDog(dog);
      }
    } catch (err) {
      setMatchError(err instanceof Error ? err.message : 'Failed to generate match');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  if (error || matchError) {
    return <ErrorDisplay error={error || matchError!} onDismiss={clearError} />;
  }

  if (favorites.size === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Find Your Match</h2>
        <p className="text-gray-600 mb-4">
          Add some dogs to your favorites first to get matched!
        </p>
        <Link
          to="/search"
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg 
                     hover:bg-blue-600 transition-colors"
        >
          Search Dogs
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Find Your Perfect Match</h2>
      
      {!matchedDog ? (
        <div className="text-center py-8">
          <p className="mb-6">
            Ready to find your perfect match from {favorites.size} favorite dogs?
          </p>
          <button
            onClick={handleGenerateMatch}
            disabled={isGenerating}
            className="px-6 py-3 bg-green-500 text-white rounded-lg 
                     hover:bg-green-600 disabled:bg-green-300 
                     disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="small" />
                <span className="ml-2">Finding your match...</span>
              </span>
            ) : (
              'Generate Match'
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold mb-2">
              We found your perfect match!
            </h3>
            <p className="text-gray-600">
              Meet your new potential best friend:
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <DogCard dog={matchedDog} />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setMatchedDog(null)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg 
                       hover:bg-blue-600 transition-colors"
            >
              Try Another Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
