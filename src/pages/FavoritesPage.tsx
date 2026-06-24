import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import MovieGrid from '../components/MovieGrid';
import { getMovies } from '../services/dataService';
import { Movie } from '../types';
import { useAuth } from '../context/AuthContext';

const FavoritesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const list = await getMovies();
        setMovies(list);
      } catch (err) {
        console.error('Error loading movies for favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const favoriteMovies = movies.filter(movie => favorites.includes(movie.id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          My List
        </h1>

        {favoriteMovies.length > 0 ? (
          <MovieGrid movies={favoriteMovies} title="" />
        ) : (
          <div className="max-w-md mx-auto text-center py-16 px-6 glass-panel rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <Heart className="h-16 w-16 text-gray-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-3">Your list is empty</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Explore our selection of classic AI-upscaled films and add movies to your list by clicking the heart icon on any poster!
            </p>
            <Link 
              to="/movies" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-semibold py-2.5 px-6 rounded-full shadow-[0_4px_15px_rgba(239,68,68,0.25)] transition-all transform hover:scale-[1.02]"
            >
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
