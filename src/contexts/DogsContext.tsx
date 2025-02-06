import React, { createContext, useContext, useState, useCallback } from 'react';
import { Dog, SearchParams, dogService } from '../services/api/dogs';
import { APIError, ErrorMessages } from '../utils/ErrorHandling';

interface DogsState {
  dogs: Dog[];
  breeds: string[];
  favorites: Set<string>;
  loading: boolean;
  error: string | null;
  totalResults: number;
}

interface DogsContextType extends DogsState {
  fetchDogs: (params: SearchParams) => Promise<void>;
  fetchBreeds: () => Promise<void>;
  toggleFavorite: (dogId: string) => void;
  generateMatch: () => Promise<Dog | null>;
  clearError: () => void;
}

const DogsContext = createContext<DogsContextType | undefined>(undefined);

export function DogsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DogsState>({
    dogs: [],
    breeds: [],
    favorites: new Set<string>(),
    loading: false,
    error: null,
    totalResults: 0
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const fetchDogs = async (params: SearchParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      console.log('Fetching dogs with params:', params);
      
      const searchResult = await dogService.searchDogs(params);
      
      if (searchResult.resultIds.length === 0) {
        setState(prev => ({
          ...prev,
          dogs: [],
          totalResults: 0,
          loading: false,
          error: ErrorMessages.DOGS.NO_RESULTS
        }));
        return;
      }

      const dogsData = await dogService.getDogs(searchResult.resultIds);
      setState(prev => {
        // Preserve dogs that are in favorites
        const favoriteDogs = prev.dogs.filter(dog => prev.favorites.has(dog.id));
        const newDogs = dogsData.filter(dog => !prev.favorites.has(dog.id));
        return {
          ...prev,
          dogs: [...favoriteDogs, ...newDogs],
          totalResults: searchResult.total,
          loading: false,
          error: null
        };
      });
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof APIError ? error.message : ErrorMessages.DOGS.FETCH_FAILED
      }));
    }
  };

  const fetchBreeds = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const breedsData = await dogService.getBreeds();
      setState(prev => ({
        ...prev,
        breeds: breedsData,
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching breeds:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof APIError ? error.message : 'Failed to fetch breeds'
      }));
    }
  };

  const toggleFavorite = useCallback((dogId: string) => {
    setState(prev => {
      const newFavorites = new Set(prev.favorites);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
      } else {
        newFavorites.add(dogId);
      }
      return {
        ...prev,
        favorites: newFavorites
      };
    });
  }, []);

  const generateMatch = async () => {
    if (state.favorites.size === 0) {
      setState(prev => ({
        ...prev,
        error: 'Please add some dogs to your favorites first'
      }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const matchId = await dogService.getMatch([...state.favorites]);
      const [matchedDog] = await dogService.getDogs([matchId]);
      setState(prev => ({ ...prev, loading: false }));
      return matchedDog;
    } catch (error) {
      console.error('Error generating match:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof APIError ? error.message : ErrorMessages.DOGS.MATCH_FAILED
      }));
      return null;
    }
  };

  const value = {
    ...state,
    fetchDogs,
    fetchBreeds,
    toggleFavorite,
    generateMatch,
    clearError
  };

  return (
    <DogsContext.Provider value={value}>
      {children}
    </DogsContext.Provider>
  );
}

export function useDogs() {
  const context = useContext(DogsContext);
  if (!context) {
    throw new Error('useDogs must be used within a DogsProvider');
  }
  return context;
}

export { DogsContext };
