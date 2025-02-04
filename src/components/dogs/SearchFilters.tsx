import React from 'react';
import { SearchParams } from '../../services/api/dogs';

interface SearchFiltersProps {
  breeds: string[];
  onFilterChange: (params: Partial<SearchParams>) => void;
  currentFilters: SearchParams;
}

export function SearchFilters({ breeds, onFilterChange, currentFilters }: SearchFiltersProps) {
  const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    onFilterChange({ breeds: selectedOptions.length > 0 ? selectedOptions : undefined });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ sort: event.target.value });
  };

  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <div>
          <label className="block mb-2">Sort by:</label>
          <select 
            onChange={handleSortChange} 
            value={currentFilters.sort}
            className="p-2 border rounded"
          >
            <option value="breed:asc">Breed (A-Z)</option>
            <option value="breed:desc">Breed (Z-A)</option>
            <option value="age:asc">Age (Youngest)</option>
            <option value="age:desc">Age (Oldest)</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Filter by breed:</label>
          <select
            multiple
            value={currentFilters.breeds || []}
            onChange={handleBreedChange}
            className="p-2 border rounded"
            size={5}
          >
            {breeds.map(breed => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
