import { apiClient } from './client';

export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}

export interface SearchResult {
  resultIds: string[];
  total: number;
  next: string | null;
  prev: string | null;
}

export const dogService = {
  async searchDogs(params: SearchParams): Promise<SearchResult> {
    console.log('Initiating dog search with params:', params);
    const searchParams = {
      ...params,
      breeds: params.breeds?.length ? params.breeds.join(',') : undefined,
      sort: params.sort || 'breed:asc'
    };
    console.log('Formatted search parameters:', searchParams);
    
    const response = await apiClient.get('/dogs/search', { params: searchParams });
    return response.data;
  },

  async getBreeds(): Promise<string[]> {
    console.log('Fetching breed list');
    const response = await apiClient.get('/dogs/breeds');
    return response.data;
  },

  async getDogs(dogIds: string[]): Promise<Dog[]> {
    if (!dogIds.length) {
      console.log('No dog IDs provided for fetching');
      return [];
    }
    
    console.log(`Fetching details for ${dogIds.length} dogs`);
    const response = await apiClient.post('/dogs', dogIds);
    return response.data;
  },

  async getMatch(dogIds: string[]): Promise<string> {
    console.log('Generating match from favorites:', dogIds);
    const response = await apiClient.post('/dogs/match', dogIds);
    return response.data.match;
  }
};
