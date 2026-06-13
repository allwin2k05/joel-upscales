import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { getMovies } from '../services/dataService';
import { Movie } from '../types';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const list = await getMovies();
        setAllMovies(list);
      } catch (err) {
        console.error('Error loading search movies:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  useEffect(() => {
    if (query && allMovies.length > 0) {
      performSearch(query);
    } else {
      setSearchResults([]);
    }
  }, [query, allMovies]);

  const performSearch = (term: string) => {
    setIsSearching(true);
    
    const results = allMovies.filter(movie => 
      movie.title.toLowerCase().includes(term.toLowerCase()) ||
      movie.plot.toLowerCase().includes(term.toLowerCase()) ||
      movie.year.toString().includes(term)
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.history.pushState(
        null, 
        '', 
        `/search?q=${encodeURIComponent(searchTerm)}`
      );
      performSearch(searchTerm);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          {query ? `Search Results for "${query}"` : 'Search Movies'}
        </h1>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for movies by title, year, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-5 pr-12 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {isSearching ? (
          <div className="flex justify-center my-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            {query ? (
              <>
                {searchResults.length > 0 ? (
                  <MovieGrid movies={searchResults} />
                ) : (
                  <div className="text-center py-16">
                    <h2 className="text-xl font-semibold text-white mb-4">No results found</h2>
                    <p className="text-gray-400 mb-8">
                      We couldn't find any movies matching "{query}"
                    </p>
                    <Link 
                      to="/"
                      className="inline-flex items-center bg-purple-600 text-white font-medium py-2 px-4 rounded-full hover:bg-purple-700 transition-colors"
                    >
                      Browse All Movies
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
                {allMovies.map(movie => (
                  <Link 
                    key={movie.id}
                    to={`/movie/${movie.id}`}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/80 transition-colors p-4 flex flex-col items-center text-center group"
                  >
                    <h3 className="text-white font-medium mb-1 group-hover:text-purple-400 transition-colors">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{movie.year}</p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;