import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, Activity, Film, Database, LogIn, Search, LogOut } from 'lucide-react';
import GrainyDotsBackground from './GrainyDotsBackground';
import { getMovies, getFanedits } from '../services/dataService';
import { useAuth } from '../context/AuthContext';

const UpwardsTab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [moviesCount, setMoviesCount] = useState(0);
  const [faneditsCount, setFaneditsCount] = useState(0);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [allFanedits, setAllFanedits] = useState<any[]>([]);
  const { isLoggedIn, user, signOut } = useAuth();
  const navigate = useNavigate();

  // Load counts and search index dynamically
  useEffect(() => {
    const loadData = async () => {
      try {
        const moviesList = await getMovies();
        const faneditsList = await getFanedits();
        setMoviesCount(moviesList.length);
        setFaneditsCount(faneditsList.length);
        setAllMovies(moviesList);
        setAllFanedits(faneditsList);
      } catch (err) {
        console.error('Failed to load data for UpwardsTab:', err);
      }
    };
    loadData();
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  // Perform a live search in the movie/fanedit databases
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const movieMatches = allMovies
      .filter((m) => m.title.toLowerCase().includes(query))
      .slice(0, 3)
      .map((m) => ({ ...m, type: 'movie' }));

    const faneditMatches = allFanedits
      .filter((fe) => fe.title.toLowerCase().includes(query))
      .slice(0, 2)
      .map((fe) => ({ ...fe, type: 'fanedit' }));

    setSearchResults([...movieMatches, ...faneditMatches]);
  }, [searchQuery, allMovies, allFanedits]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ease-out transform ${
        isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'
      }`}
    >
      {/* Upwards Tab Button Trigger */}
      <div className="flex justify-center w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-gradient-to-t from-gray-900/90 to-red-950/90 border-t border-x border-red-500/30 px-6 py-3 rounded-t-2xl shadow-[0_-8px_30px_rgba(239,68,68,0.15)] backdrop-blur-md text-white font-medium hover:text-red-400 focus:outline-none transition-all duration-300 group hover:border-red-500/50"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-red-500 animate-bounce" />
          ) : (
            <ChevronUp className="h-4 w-4 text-red-500 animate-bounce" />
          )}
          <span className="text-xs uppercase tracking-widest font-bold">
            {isOpen ? 'Close Panel' : 'Quick Dashboard'}
          </span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
        </button>
      </div>

      {/* Main Drawer Panel Content */}
      <div className="relative bg-black/95 border-t border-white/10 h-[380px] shadow-[0_-20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl overflow-hidden flex flex-col">
        {/* Grainy Dots Background embedded in the drawer panel, reacting to mouse movements */}
        <GrainyDotsBackground 
          dotColor="rgba(168, 85, 247, 0.3)" // Purple dot styling for contrast
          interactionRadius={120} 
          density={32}
          grainIntensity={0.08}
        />

        <div className="container mx-auto px-6 py-8 relative z-10 flex-grow grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto">
          {/* Section 1: Server Stats & Metrics */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Node Diagnostics
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:bg-white/[0.05] transition-colors">
                <span className="text-xs text-gray-400">Total Upscales</span>
                <span className="text-2xl font-black text-white mt-1 flex items-baseline">
                  {moviesCount} <Film className="h-3.5 w-3.5 text-gray-500 ml-2" />
                </span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:bg-white/[0.05] transition-colors">
                <span className="text-xs text-gray-400">Active Fan Edits</span>
                <span className="text-2xl font-black text-white mt-1 flex items-baseline">
                  {faneditsCount} <Film className="h-3.5 w-3.5 text-gray-500 ml-2" />
                </span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:bg-white/[0.05] transition-colors">
                <span className="text-xs text-gray-400">Queue Load</span>
                <span className="text-2xl font-black text-white mt-1">12 <span className="text-xs text-yellow-500 font-semibold">Active</span></span>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col justify-between hover:bg-white/[0.05] transition-colors">
                <span className="text-xs text-gray-400">Storage Cluster</span>
                <span className="text-2xl font-black text-white mt-1">4.8 TB</span>
              </div>
            </div>
          </div>

          {/* Section 2: Quick live search inside the panel */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Quick Database Lookup
            </h3>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search upscales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 px-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 text-sm transition-colors"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
            </div>

            {/* Live Search Suggestions */}
            {searchResults.length > 0 ? (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    to={item.type === 'movie' ? `/movie/${item.id}` : `/movies`}
                    onClick={() => setIsOpen(false)}
                    className="flex justify-between items-center bg-white/[0.02] hover:bg-purple-950/20 border border-white/5 hover:border-purple-500/30 p-2.5 rounded-lg text-xs transition-all duration-200"
                  >
                    <span className="font-semibold text-gray-200 truncate max-w-[170px]">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-purple-400 bg-purple-950/40 border border-purple-800/30 px-1.5 py-0.5 rounded">
                      {item.type === 'movie' ? 'Upscale' : 'Fan Edit'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <p className="text-xs text-gray-500 italic">No matches found</p>
            ) : (
              <p className="text-xs text-gray-500 italic">
                Start typing to instantly query the index.
              </p>
            )}
          </div>

          {/* Section 3: Auth Actions / Profile Control */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center mb-3">
                <Database className="h-4 w-4 mr-2" />
                Administrative Node
              </h3>

              {isLoggedIn ? (
                <div className="bg-gradient-to-r from-red-950/30 to-purple-950/30 border border-red-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                      {user?.name?.[0].toUpperCase() || 'J'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white truncate max-w-[120px]">{user?.name || 'Joel'}</h4>
                      <p className="text-xs text-green-400 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                        Root Access
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center bg-red-600/15 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white rounded-lg py-2 text-xs font-semibold transition-all duration-300"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2" />
                    Terminate Root Session
                  </button>
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    You are currently running in Read-Only Guest Mode. Administrative functions require authentication clearance.
                  </p>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded-lg py-2.5 text-xs font-semibold shadow-md transition-all duration-300"
                  >
                    <LogIn className="h-3.5 w-3.5 mr-2 animate-pulse" />
                    Admin Login Gateway
                  </Link>
                </div>
              )}
            </div>

            <div className="text-[10px] text-gray-500 flex justify-between items-center border-t border-white/5 pt-2">
              <span>Security Protocols: ACTIVE</span>
              <span>v1.2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpwardsTab;
