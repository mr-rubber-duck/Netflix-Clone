// TMDB API Configuration
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMB_API_KEY;

// Helper function for consistent error handling
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
};

// Helper function for building URLs with parameters
const buildUrl = (endpoint: string, params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams({ 
        api_key: API_KEY || '', 
        ...params 
    });
    return `${BASE_URL}${endpoint}?${searchParams}`;
};

// Main API object with all endpoints
export const api = {
    // Get trending movies
    getTrending: (timeWindow: 'day' | 'week' = 'week') => 
        fetch(buildUrl(`/trending/movie/${timeWindow}`)).then(handleResponse),
    
    // Get popular movies
    getPopular: () => 
        fetch(buildUrl('/movie/popular')).then(handleResponse),
    
    // Get top rated movies
    getTopRated: () => 
        fetch(buildUrl('/movie/top_rated')).then(handleResponse),
    
    // Get upcoming movies
    getUpcoming: () => 
        fetch(buildUrl('/movie/upcoming')).then(handleResponse),
    
    // Get movie details
    getMovieDetails: (id: number) => 
        fetch(buildUrl(`/movie/${id}`)).then(handleResponse),
    
    // Get movie videos (trailers)
    getMovieVideos: (id: number) => 
        fetch(buildUrl(`/movie/${id}/videos`)).then(handleResponse),
    
    // Search movies
    searchMovies: (query: string, page: number = 1) => 
        fetch(buildUrl('/search/movie', { query, page })).then(handleResponse),
    
    // Get movie genres
    getMovieGenres: () => 
        fetch(buildUrl('/genre/movie/list')).then(handleResponse),
    
    // Get movies by genre
    getMoviesByGenre: (genreId: number, page: number = 1) => 
        fetch(buildUrl('/discover/movie', { 
            with_genres: genreId, 
            page 
        })).then(handleResponse),
    
    // Get similar movies
    getSimilarMovies: (id: number) => 
        fetch(buildUrl(`/movie/${id}/similar`)).then(handleResponse),
    
    // Get movie credits
    getMovieCredits: (id: number) => 
        fetch(buildUrl(`/movie/${id}/credits`)).then(handleResponse),
};

// Convenience function for featured movie with videos
export const getFeaturedMovie = async () => {
    try {
        // Get trending movies
        const trendingResponse = await api.getTrending();
        const featuredMovie = trendingResponse.results[0];
        
        // Get videos for the featured movie
        const videosResponse = await api.getMovieVideos(featuredMovie.id);
        
        return {
            movie: featuredMovie,
            videos: videosResponse.results
        };
    } catch (error) {
        console.error('Error getting featured movie:', error);
        throw error;
    }
};