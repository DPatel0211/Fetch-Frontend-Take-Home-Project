import React, { createContext, useContext, useState } from 'react';
import { Dog, SearchParams, dogService } from '../services/api/dogs';

interface DogsContextType {
  dogs: Dog[];
  breeds: string[];
  favorites: Set<string>;
  loading: boolean;
  currentPage: number;
  totalResults: number;
  fetchDogs: (params: SearchParams) => Promise<void>;
  fetchBreeds: () => Promise<void>;
  toggleFavorite: (dogId: string) => void;
  generateMatch: () => Promise<Dog | null>;
}

const DogsContext = createContext<DogsContextType | undefined>(undefined);

export function DogsProvider({ children }: { children: React.ReactNode }) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchDogs = async (params: SearchParams) => {
    try {
      setLoading(true);
      console.log('Starting dog fetch with params:', params);
      const searchResult = await dogService.searchDogs(params);
      
      if (searchResult.resultIds.length === 0) {
        setDogs([]);
        setTotalResults(0);
        return;
      }
      
      const dogsData = await dogService.getDogs(searchResult.resultIds);
      console.log('Dogs data received:', dogsData);
      setDogs(dogsData);
      setTotalResults(searchResult.total);
    } catch (error) {
      console.error('Error in fetchDogs:', error);
      setDogs([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreeds = async () => {
    try {
      const breedsData = await dogService.getBreeds();
      setBreeds(breedsData);
    } catch (error) {
      console.error('Error fetching breeds:', error);
      setBreeds([]);
    }
  };

  const toggleFavorite = (dogId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
      } else {
        newFavorites.add(dogId);
      }
      return newFavorites;
    });
  };

  const generateMatch = async () => {
    if (favorites.size === 0) return null;
    try {
      const matchId = await dogService.getMatch([...favorites]);
      const [matchedDog] = await dogService.getDogs([matchId]);
      return matchedDog;
    } catch (error) {
      console.error('Error generating match:', error);
      return null;
    }
  };

  return (
    <DogsContext.Provider
      value={{
        dogs,
        breeds,
        favorites,
        loading,
        currentPage,
        totalResults,
        fetchDogs,
        fetchBreeds,
        toggleFavorite,
        generateMatch
      }}
    >
      {children}
    </DogsContext.Provider>
  );
}

export const useDogs = () => {
  const context = useContext(DogsContext);
  if (!context) {
    throw new Error('useDogs must be used within a DogsProvider');
  }
  return context;
};
