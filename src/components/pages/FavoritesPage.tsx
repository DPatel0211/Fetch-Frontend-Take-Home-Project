// src/components/pages/FavoritesPage.tsx
export function FavoritesPage() {
  const { dogs, favorites } = useDogs();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Get all favorited dogs
  const favoriteDogs = useMemo(() => 
    dogs.filter(dog => favorites.has(dog.id)), 
    [dogs, favorites]
  );

  console.log('Favorites:', Array.from(favorites));
  console.log('Available dogs:', dogs);
  console.log('Filtered favorite dogs:', favoriteDogs);

  const totalPages = Math.ceil(favoriteDogs.length / pageSize);
  const currentDogs = favoriteDogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        My Favorite Dogs ({favoriteDogs.length})
      </h2>
      
      {favoriteDogs.length === 0 ? (
        <div>No favorite dogs selected yet.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDogs.map(dog => (
              <DogCard 
                key={dog.id} 
                dog={dog}
              />
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
    </div>
  );
}
