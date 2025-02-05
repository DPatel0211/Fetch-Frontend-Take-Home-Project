// src/contexts/DogsContext.tsx
// Update the fetch dogs functionality to maintain favorites when getting new dogs
const fetchDogs = async (params: SearchParams) => {
  try {
    setLoading(true);
    const searchResult = await dogService.searchDogs(params);
    
    if (searchResult.resultIds.length > 0) {
      const dogsData = await dogService.getDogs(searchResult.resultIds);
      setDogs(prevDogs => {
        // Preserve dogs that are in favorites but not in current results
        const favoriteDogs = prevDogs.filter(dog => favorites.has(dog.id));
        const newDogs = dogsData.filter(dog => !favorites.has(dog.id));
        return [...favoriteDogs, ...newDogs];
      });
      setTotalResults(searchResult.total);
    } else {
      setDogs([]);
      setTotalResults(0);
    }
  } catch (error) {
    console.error('Error in fetchDogs:', error);
    setDogs([]);
    setTotalResults(0);
  } finally {
    setLoading(false);
  }
};
