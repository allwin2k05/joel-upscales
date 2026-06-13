import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { Movie } from '../types';

interface HeroProps {
  movies: Movie[];
}

const Hero: React.FC<HeroProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter for higher rated movies to feature
  const featuredMovies = movies.filter(movie => movie.rating >= 7.5);
  const movie = featuredMovies[currentIndex] || movies[0];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        <img 
          src={movie.backgroundUrl} 
          alt={`${movie.title} background`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <div className="flex items-center mb-4">
              <span className="text-purple-400 font-semibold mr-3">Featured</span>
              <div className="flex items-center bg-black/40 rounded-full px-2 py-1">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                <span className="text-xs text-white">{movie.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              {movie.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-2">
              {movie.year}
            </p>
            
            <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4 max-w-xl">
              {movie.plot}
            </p>
            
            <Link 
              to={`/movie/${movie.id}`}
              className="inline-flex items-center bg-purple-600 text-white font-medium py-3 px-6 rounded-full hover:bg-purple-700 transition-colors"
            >
              More Details
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-purple-500 w-6' : 'bg-gray-400/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;