import React, { useEffect, useState } from 'react';
import { useDogs } from '../../contexts/DogsContext';
import { SearchParams } from '../../services/api/dogs';
import { DogCard } from './DogCard';
import { SearchFilters } from './SearchFilters';
import { Pagination } from './Pagination';

export function DogSearch() {
  const { dogs, breeds, loading, totalResults, fetchDogs, fetchBreeds } = useDogs();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    size: 25,
    sort: 'breed:asc',
    from: '0'
  });

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Loading initial data...');
      try {
        await fetchBreeds();
        console.log('Breeds fetched, fetching dogs...');
        await fetchDogs({
          size: 25,
          sort: 'breed:asc',
          from: '0'
        });
        console.log('Initial dogs fetched');
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array for initial load

  const handleFilterChange = async (newParams: Partial<SearchParams>) => {
    console.log('Filter change:', newParams);
    const updatedParams = {
      ...searchParams,
      ...newParams,
      from: '0'
    };
    setSearchParams(updatedParams);
    await fetchDogs(updatedParams);
  };

  console.log('Current dogs:', dogs);
  console.log('Current breeds:', breeds);

  return (
    <div className="container mx-auto p-4">
      {breeds.length > 0 && (
        <SearchFilters
          breeds={breeds}
          onFilterChange={handleFilterChange}
          currentFilters={searchParams}
        />
      )}
      
      {loading && <div>Loading dogs...</div>}
      
      {!loading && dogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map(dog => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
      
      {!loading && dogs.length === 0 && (
        <div>No dogs found matching your criteria</div>
      )}

      {totalResults > 0 && (
        <Pagination
          currentPage={Math.floor(parseInt(searchParams.from) / searchParams.size!) + 1}
          totalPages={Math.ceil(totalResults / searchParams.size!)}
          onPageChange={(page) => {
            handleFilterChange({
              from: ((page - 1) * searchParams.size!).toString()
            });
          }}
        />
      )}
    </div>
  );
}
