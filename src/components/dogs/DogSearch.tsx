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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchBreeds();
        await fetchDogs(searchParams);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  const handlePageChange = async (newPage: number) => {
    try {
      const from = ((newPage - 1) * searchParams.size!).toString();
      const updatedParams = {
        ...searchParams,
        from
      };
      setCurrentPage(newPage);
      setSearchParams(updatedParams);
      await fetchDogs(updatedParams);
      
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error changing page:', error);
    }
  };

  const handleFilterChange = async (newParams: Partial<SearchParams>) => {
    try {
      const updatedParams = {
        ...searchParams,
        ...newParams,
        from: '0' // Reset to first page when filters change
      };
      setCurrentPage(1);
      setSearchParams(updatedParams);
      await fetchDogs(updatedParams);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const totalPages = Math.ceil(totalResults / searchParams.size!);

  return (
    <div className="container mx-auto p-4">
      <SearchFilters
        breeds={breeds}
        onFilterChange={handleFilterChange}
        currentFilters={searchParams}
      />
      
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div>Loading dogs...</div>
        </div>
      )}
      
      {!loading && dogs.length > 0 && (
        <>
          <div className="mb-4">
            Showing {((currentPage - 1) * searchParams.size!) + 1} - {Math.min(currentPage * searchParams.size!, totalResults)} of {totalResults} dogs
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dogs.map(dog => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              hasNextPage={currentPage < totalPages}
              hasPrevPage={currentPage > 1}
            />
          )}
        </>
      )}
      
      {!loading && dogs.length === 0 && (
        <div>No dogs found matching your criteria</div>
      )}
    </div>
  );
}
