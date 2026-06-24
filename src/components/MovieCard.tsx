import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { Movie } from '../types';
import { useAuth } from '../context/AuthContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { toggleFavorite, isFavorite } = useAuth();
  const isFav = isFavorite(movie.id);
  const navigate = useNavigate();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie.id);
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-[1.03] hover:z-10 cursor-pointer"
    >
      <div className="aspect-[2/3] relative bg-gray-900 overflow-hidden">
        {/* Poster Image */}
        <img 
          src={movie.posterUrl} 
          alt={`${movie.title} (${movie.year}) poster`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
        
        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center bg-black/70 rounded-full px-2 py-1 text-xs">
          <Star className="h-3 w-3 text-yellow-400 mr-1" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-lg font-bold line-clamp-2 text-white">{movie.title}</h3>
          <p className="text-sm text-gray-300">{movie.year}</p>
        </div>
      </div>
      
      {/* Hover Info Panel */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
        <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
        <p className="text-gray-300 text-sm mb-2">{movie.year}</p>
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-white">{movie.rating.toFixed(1)}</span>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`h-4.5 w-4.5 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'}`} />
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center line-clamp-3 mb-4">{movie.plot}</p>
        <span className="bg-purple-600 text-white text-xs font-medium py-1.5 px-3 rounded-full">
          View Details
        </span>
      </div>
    </div>
  );
};

export default MovieCard;