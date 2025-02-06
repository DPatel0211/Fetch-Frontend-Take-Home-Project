export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const ErrorMessages = {
  AUTH: {
    LOGIN_FAILED: 'Login failed. Please check your credentials and try again.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  },
  DOGS: {
    FETCH_FAILED: 'Unable to fetch dogs. Please try again.',
    SEARCH_FAILED: 'Search failed. Please modify your search criteria and try again.',
    MATCH_FAILED: 'Unable to generate match. Please try again.',
    NO_RESULTS: 'No dogs found matching your criteria.',
  },
  FAVORITES: {
    ADD_FAILED: 'Failed to add dog to favorites.',
    REMOVE_FAILED: 'Failed to remove dog from favorites.',
    SYNC_FAILED: 'Unable to sync favorites.',
  }
};
