import React, { useState, useMemo } from 'react';
import { SearchParams } from '../../services/api/dogs';

interface SearchFiltersProps {
  breeds: string[];
  onFilterChange: (params: Partial<SearchParams>) => void;
  currentFilters: SearchParams;
}

export function SearchFilters({ breeds, onFilterChange, currentFilters }: SearchFiltersProps) {
  const [breedSearch, setBreedSearch] = useState('');
  const [maxAge, setMaxAge] = useState(20);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null); // Only one breed
  const maxAgeLimit = 20;

  const filteredBreeds = useMemo(
    () =>
      breeds.filter((breed) =>
        breed.toLowerCase().startsWith(breedSearch.toLowerCase())
      ),
    [breeds, breedSearch]
  );

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaxAge = parseInt(e.target.value, 10);
    setMaxAge(newMaxAge);
    onFilterChange({ ageMax: newMaxAge });
  };

  const handleBreedSelect = (breed: string) => {
    setSelectedBreed(breed); // Update the selected breed
    setBreedSearch(''); // Clear the search bar
    onFilterChange({ breeds: [breed] }); // Pass as a single-element array
  };

  const clearSelectedBreed = () => {
    setSelectedBreed(null);
    onFilterChange({ breeds: undefined });
  };

  const resetFilters = () => {
    setBreedSearch('');
    setSelectedBreed(null);
    setMaxAge(20);
    onFilterChange({ ageMax: 20, breeds: undefined, sort: 'breed:asc' }); // Reset sort to default
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg mb-6 bg-white shadow-sm">
      <div>
        <label className="block mb-2 font-medium">Sort by:</label>
        <select
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          value={currentFilters.sort || 'breed:asc'} // Default to breed (A-Z)
          className="w-full p-2 border rounded bg-white"
        >
          {!selectedBreed && (
            <>
              <option value="breed:asc">Breed (A-Z)</option>
              <option value="breed:desc">Breed (Z-A)</option>
            </>
          )}
          <option value="name:asc">Name (A-Z)</option>
          <option value="name:desc">Name (Z-A)</option>
          <option value="age:asc">Age by Youngest</option>
          <option value="age:desc">Age by Oldest</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">Up to {maxAge} years</label>
        <input
          type="range"
          min="0"
          max={maxAgeLimit}
          value={maxAge}
          onChange={handleAgeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>0</span>
          <span>{maxAgeLimit} years</span>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">Search Breeds:</label>
        <div className="relative">
          <input
            type="text"
            value={breedSearch}
            onChange={(e) => setBreedSearch(e.target.value)}
            placeholder="Type to search breeds..."
            className="w-full p-2 border rounded"
          />
          {breedSearch && (
            <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
              {filteredBreeds.map((breed) => (
                <li key={breed} className="border-b last:border-b-0">
                  <button
                    onClick={() => handleBreedSelect(breed)}
                    className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors ${
                      selectedBreed === breed ? 'bg-blue-100' : ''
                    }`}
                  >
                    {breed}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedBreed && (
          <div className="mt-2">
            <h4 className="text-sm font-medium">Selected Breed:</h4>
            <div className="flex items-center space-x-2 mt-1 bg-gray-100 px-3 py-1 rounded-lg">
              <span>{selectedBreed}</span>
              <button onClick={clearSelectedBreed} className="text-red-500">
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reset Filters Button */}
      <div className="flex justify-end">
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 rounded text-sm font-medium hover:bg-gray-300 transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
