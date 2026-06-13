import React, { useState, useEffect } from 'react';
import MovieGrid from '../components/MovieGrid';
import FanEditCard from '../components/FanEditCard';
import { getMovies, getFanedits } from '../services/dataService';
import { Movie, FanEdit } from '../types';
import { SlidersHorizontal, SortDesc, Star, Film, Clapperboard } from 'lucide-react';

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [fanedits, setFanedits] = useState<FanEdit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'year' | 'rating' | 'title'>('year');
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'upscales' | 'fanedits'>('upscales');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [moviesList, faneditsList] = await Promise.all([
          getMovies(),
          getFanedits()
        ]);
        setMovies(moviesList);
        setFanedits(faneditsList);
      } catch (err) {
        console.error('Error loading movies data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }
  
  const years = Array.from(new Set(movies.map(movie => movie.year))).sort((a, b) => b - a);

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'year') return b.year - a.year;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.title.localeCompare(b.title);
  });

  const filteredMovies = filterYear 
    ? sortedMovies.filter(movie => movie.year === filterYear)
    : sortedMovies;

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('upscales')}
            className={`flex items-center px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'upscales'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Film className="h-5 w-5 mr-2" />
            AI Upscales
          </button>
          <button
            onClick={() => setActiveTab('fanedits')}
            className={`flex items-center px-6 py-3 rounded-full font-medium transition-colors ${
              activeTab === 'fanedits'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Clapperboard className="h-5 w-5 mr-2" />
            Fan Edits
          </button>
        </div>

        {activeTab === 'upscales' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
                AI Upscaled Movies
              </h1>
              
              <div className="flex flex-wrap gap-4">
                {/* Filter by Year */}
                <div className="relative">
                  <select 
                    value={filterYear || ''}
                    onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : null)}
                    className="appearance-none bg-gray-800 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">All Years</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <SlidersHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                
                {/* Sort By */}
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'year' | 'rating' | 'title')}
                    className="appearance-none bg-gray-800 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="year">Sort by Year</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="title">Sort by Title</option>
                  </select>
                  <SortDesc className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {filteredMovies.length > 0 ? (
              <>
                <div className="mb-6 text-gray-400">
                  Showing {filteredMovies.length} movies
                  {filterYear && ` from ${filterYear}`}
                </div>
                <MovieGrid movies={filteredMovies} />
              </>
            ) : (
              <div className="text-center py-16">
                <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-4">No movies found</h2>
                <p className="text-gray-400">
                  Try changing your filters to see more results
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">
                Fan Edits by V.Allwin Joel
              </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fanedits.map(fanEdit => (
                <FanEditCard key={fanEdit.id} fanEdit={fanEdit} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;