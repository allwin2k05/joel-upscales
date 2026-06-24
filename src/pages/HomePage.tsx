import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import FanEditCard from '../components/FanEditCard';
import UpwardsTab from '../components/UpwardsTab';
import { getMovies, getFanedits } from '../services/dataService';
import { Movie, FanEdit } from '../types';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [fanedits, setFanedits] = useState<FanEdit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites } = useAuth();

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
        console.error('Error loading home data:', err);
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

  // Sort movies by rating for the "Top Rated" section
  const topRatedMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5);
  
  // Get recent movies (based on year)
  const recentMovies = [...movies].sort((a, b) => b.year - a.year).slice(0, 5);

  // Filter movies that are in user's favorites list
  const favoriteMovies = movies.filter(movie => favorites.includes(movie.id));

  // Get featured fan edits
  const featuredFanEdits = fanedits.slice(0, 3);

  return (
    <div className="bg-transparent min-h-screen">
      <Hero movies={movies} />
            
      {/* My List / Favorites Row */}
      {favoriteMovies.length > 0 && (
        <div className="pt-8">
          <MovieGrid movies={favoriteMovies} title="My List" />
        </div>
      )}

      <div className="pt-8">
        <MovieGrid movies={topRatedMovies} title="Top Rated Upscales" />
      </div>
      
      <div className="py-8">
        <MovieGrid movies={recentMovies} title="Recent Upscales" />
      </div>

      {/* Fan Edits Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Featured Fan Edits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredFanEdits.map(fanEdit => (
            <FanEditCard key={fanEdit.id} fanEdit={fanEdit} />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-red-900/40 to-red-800/40 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">About Joel's Upscales</h2>
          <p className="text-gray-300 mb-6 max-w-3xl">
            Hi,I'm Allwin Joel. Welcome to my collection of AI-upscaled Tamil cinema classics and reimagined Hollywood fan edits. 
            Using cutting-edge AI technology, I restore legendary Tamil films while also crafting streamlined 
            versions of popular Hollywood movies and series. My mission is to enhance these cinematic treasures 
            for both longtime fans and new audiences alike.
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 md:flex-1">
              <h3 className="text-lg font-semibold text-red-400 mb-2">AI Upscaling</h3>
              <p className="text-gray-400 text-sm">
                Each Tamil film undergoes meticulous restoration using Topaz AI and custom enhancement 
                techniques to achieve the highest possible quality while preserving the director's original vision.
              </p>
            </div>
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 md:flex-1">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Fan Edits</h3>
              <p className="text-gray-400 text-sm">
                Experience your favorite Hollywood films and series in a new light through carefully crafted 
                edits that enhance narrative flow and provide fresh perspectives on familiar stories.
              </p>
            </div>
          </div>
        </div>
      </div>
      <UpwardsTab />
    </div>
  );
};

export default HomePage;