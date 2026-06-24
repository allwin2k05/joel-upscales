import React, { useState, useEffect } from 'react';
import { Menu, Search, Film, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-red-500 animate-pulse" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              Joel Upscales
            </span>
          </Link>

          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/' ? 'text-red-400' : 'text-white'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/movies' ? 'text-red-400' : 'text-white'
                }`}
              >
                Movies
              </Link>
              <Link 
                to="/favorites" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/favorites' ? 'text-red-400' : 'text-white'
                }`}
              >
                My List
              </Link>
              <Link 
                to="/request" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/request' ? 'text-red-400' : 'text-white'
                }`}
              >
                Request
              </Link>
              <Link 
                to="/donate" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/donate' ? 'text-red-400' : 'text-white'
                }`}
              >
                Donate
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/about' ? 'text-red-400' : 'text-white'
                }`}
              >
                About
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`text-sm font-medium transition-colors hover:text-red-400 ${
                    location.pathname === '/admin' ? 'text-red-400' : 'text-white'
                  }`}
                >
                  Dashboard
                </Link>
              )}

              {user && (
                <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
                  <span className="flex items-center text-sm font-semibold text-white bg-gradient-to-r from-red-600/30 to-purple-600/30 border border-red-500/20 px-3.5 py-1.5 rounded-full shadow-md">
                    <User className="h-3.5 w-3.5 mr-1.5 text-red-400" />
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </nav>
          )}

          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 py-2 px-4 pr-10 rounded-full bg-gray-800/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white hover:text-red-500"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && isLoggedIn && (
        <div className="md:hidden bg-black/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/' ? 'text-red-400' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/movies' ? 'text-red-400' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                to="/favorites" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/favorites' ? 'text-red-400' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My List
              </Link>
              <Link 
                to="/request" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/request' ? 'text-red-400' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Request
              </Link>
              <Link 
                to="/donate" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/donate' ? 'text-red-400' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Donate
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors hover:text-red-400 ${
                  location.pathname === '/about' ? 'text-red-400' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`text-sm font-medium transition-colors hover:text-red-400 ${
                    location.pathname === '/admin' ? 'text-red-400' : 'text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              {isLoggedIn && user ? (
                <div className="flex flex-col space-y-3 pt-2 border-t border-white/5">
                  <span className="flex items-center text-sm font-semibold text-white bg-gradient-to-r from-red-600/35 to-purple-600/35 border border-red-500/30 px-3 py-1.5 rounded-lg w-max">
                    <User className="h-3.5 w-3.5 mr-1.5 text-red-400" />
                    {user.name}
                  </span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-sm font-semibold text-center py-2.5 px-4 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 px-4 pr-10 rounded-full bg-gray-800/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button 
                  type="submit" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;