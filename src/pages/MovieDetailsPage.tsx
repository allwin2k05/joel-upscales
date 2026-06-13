import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, Download, FileText, Film } from 'lucide-react';
import { Movie } from '../types';
import { getMovieById, getMovies } from '../services/dataService';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      setIsLoading(true);
      
      try {
        const foundMovie = await getMovieById(id);
        setMovie(foundMovie);
        
        // Get related movies
        if (foundMovie) {
          const allMovies = await getMovies();
          const related = allMovies
            .filter(m => m.id !== foundMovie.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          setRelatedMovies(related);
        }
      } catch (err) {
        console.error('Error loading movie details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieData();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Film className="h-16 w-16 text-purple-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-4">Movie Not Found</h1>
        <p className="text-gray-400 mb-8 text-center">
          We couldn't find the movie you're looking for.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center bg-purple-600 text-white font-medium py-2 px-4 rounded-full hover:bg-purple-700 transition-colors"
        >
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-16">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Background Image */}
        <img 
          src={movie.backgroundUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        
        {/* Back Button */}
        <Link 
          to="/"
          className="absolute top-4 left-4 inline-flex items-center bg-black/50 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-full hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back
        </Link>
      </div>
      
      {/* Movie Info */}
      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-gray-800">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="flex items-center mb-2">
              <span className="text-purple-400 font-semibold mr-3">AI Upscaled</span>
              <div className="flex items-center bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-white">{movie.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              {movie.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              {movie.year}
            </p>
            
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">About This Movie</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {movie.plot}
              </p>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-3">Restoration Details</h3>
                <p className="text-gray-400 leading-relaxed">
                  This film has been meticulously upscaled using advanced AI technology to enhance the 
                  visual quality while preserving the original cinematic experience. The restoration 
                  process uses Topaz and custom AI algorithms to bring this classic Tamil film to 
                  modern standards without compromising its authentic look and feel.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 bg-black/40 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-purple-400 mb-1">File Format</h4>
                  <p className="text-white text-sm">High Quality HEVC MKV</p>
                </div>
                <div className="flex-1 bg-black/40 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-purple-400 mb-1">Resolution</h4>
                  <p className="text-white text-sm">1080p AI Upscaled</p>
                </div>
                <div className="flex-1 bg-black/40 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-purple-400 mb-1">File Size</h4>
                  <p className="text-white text-sm">{movie.fileSize}</p>
                </div>
              </div>
            </div>
            
            {/* Download Section */}
            <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl p-6 backdrop-blur-sm mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Download Movie
              </h2>
              
              <div className="bg-black/50 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-purple-400 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-200 font-medium break-all">
                      {movie.fileName}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {movie.fileSize}
                    </p>
                  </div>
                </div>
              </div>
              
              <a 
                href={movie.downloadLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors duration-300"
              >
                Download Now
              </a>
              
              <p className="text-xs text-gray-400 mt-3 text-center">
                By downloading, you agree to use this content for personal viewing only.
              </p>
            </div>
          </div>
        </div>
        
        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div className="py-12">
            <h2 className="text-2xl font-bold mb-6 text-white">
              More Upscaled Movies
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedMovies.map(relatedMovie => (
                <Link 
                  key={relatedMovie.id}
                  to={`/movie/${relatedMovie.id}`}
                  className="group relative overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
                >
                  <div className="aspect-[2/3] relative bg-gray-900 overflow-hidden">
                    <img 
                      src={relatedMovie.posterUrl} 
                      alt={relatedMovie.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-sm font-bold text-white">{relatedMovie.title}</h3>
                      <p className="text-xs text-gray-300">{relatedMovie.year}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;