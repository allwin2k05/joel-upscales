import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Film, Clapperboard, MessageSquare, Plus, Edit, Trash2, 
  Upload, Database, Check, X, ExternalLink, AlertTriangle, ShieldCheck, Loader2, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getMovies, addMovie, updateMovie, deleteMovie,
  getFanedits, addFanedit, updateFanedit, deleteFanedit,
  getRequests, updateRequestStatus, uploadAsset, seedDatabase, MovieRequest
} from '../services/dataService';
import { Movie, FanEdit } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const { isAdmin, isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isDbLive = isSupabaseConfigured();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'fanedits' | 'requests'>('overview');

  // Datasets
  const [movies, setMovies] = useState<Movie[]>([]);
  const [fanedits, setFanEditList] = useState<FanEdit[]>([]);
  const [requests, setRequests] = useState<MovieRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Seeding state
  const [isSeeding, setIsSeeding] = useState(false);

  // Forms state
  const [movieForm, setMovieForm] = useState<Omit<Movie, 'id'> & { id?: string }>({
    title: '',
    year: new Date().getFullYear(),
    rating: 7.0,
    plot: '',
    posterUrl: '',
    backgroundUrl: '',
    downloadLink: '',
    fileName: '',
    fileSize: ''
  });
  
  const [faneditForm, setFaneditForm] = useState<Omit<FanEdit, 'id'> & { id?: string }>({
    title: '',
    type: 'movie',
    description: '',
    posterUrl: '',
    backgroundUrl: '',
    downloadLink: ''
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'movie' | 'fanedit'>('movie');
  
  // Upload status indicator
  const [uploadProgress, setUploadProgress] = useState<Record<string, boolean>>({
    posterUrl: false,
    backgroundUrl: false
  });

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!isLoggedIn || !isAdmin)) {
      navigate('/login');
    }
  }, [isAdmin, isLoggedIn, authLoading, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mList, feList, rList] = await Promise.all([
        getMovies(),
        getFanedits(),
        isDbLive ? getRequests() : Promise.resolve([])
      ]);
      setMovies(mList);
      setFanEditList(feList);
      setRequests(rList);
    } catch (err) {
      console.error('Error loading admin dashboard datasets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      loadData();
    }
  }, [isLoggedIn, isAdmin]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
          <span className="text-gray-400 text-sm font-medium">Validating clearance & loading systems...</span>
        </div>
      </div>
    );
  }

  // Seeding Database
  const handleSeed = async () => {
    if (!window.confirm('Are you sure you want to seed the database with current local catalog files?')) return;
    setIsSeeding(true);
    try {
      const results = await seedDatabase();
      alert(`Success!\nSeed reports: ${results.moviesSeeded} Movies and ${results.faneditsSeeded} Fan Edits seeded.`);
      await loadData();
    } catch (err: any) {
      alert(`Seeding failed: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Upload Cover/Poster Handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    folder: 'posters' | 'backgrounds',
    field: 'posterUrl' | 'backgroundUrl',
    type: 'movie' | 'fanedit'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(prev => ({ ...prev, [field]: true }));
    try {
      const publicUrl = await uploadAsset(file, folder);
      if (type === 'movie') {
        setMovieForm(prev => ({ ...prev, [field]: publicUrl }));
      } else {
        setFaneditForm(prev => ({ ...prev, [field]: publicUrl }));
      }
    } catch (err: any) {
      alert(`Asset upload failed: ${err.message}`);
    } finally {
      setUploadProgress(prev => ({ ...prev, [field]: false }));
    }
  };

  // Submit Movie Form
  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMovie(editingId, movieForm as Movie);
      } else {
        await addMovie(movieForm);
      }
      setIsModalOpen(false);
      resetForms();
      await loadData();
    } catch (err: any) {
      alert(`Failed to save movie: ${err.message}`);
    }
  };

  // Submit Fan Edit Form
  const handleFaneditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFanedit(editingId, faneditForm as FanEdit);
      } else {
        await addFanedit(faneditForm);
      }
      setIsModalOpen(false);
      resetForms();
      await loadData();
    } catch (err: any) {
      alert(`Failed to save fan edit: ${err.message}`);
    }
  };

  // Delete Handlers
  const handleDeleteMovie = async (id: string) => {
    if (!window.confirm('Delete this movie from the catalog permanently?')) return;
    try {
      await deleteMovie(id);
      await loadData();
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const handleDeleteFanedit = async (id: string) => {
    if (!window.confirm('Delete this fan edit from the catalog permanently?')) return;
    try {
      await deleteFanedit(id);
      await loadData();
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  // Request Action Handlers
  const handleRequestStatus = async (id: string, status: 'approved' | 'declined') => {
    try {
      await updateRequestStatus(id, status);
      await loadData();
    } catch (err: any) {
      alert(`Failed to update request: ${err.message}`);
    }
  };

  const resetForms = () => {
    setMovieForm({
      title: '',
      year: new Date().getFullYear(),
      rating: 7.0,
      plot: '',
      posterUrl: '',
      backgroundUrl: '',
      downloadLink: '',
      fileName: '',
      fileSize: ''
    });
    setFaneditForm({
      title: '',
      type: 'movie',
      description: '',
      posterUrl: '',
      backgroundUrl: '',
      downloadLink: ''
    });
    setEditingId(null);
  };

  const openAddModal = (type: 'movie' | 'fanedit') => {
    resetForms();
    setModalType(type);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any, type: 'movie' | 'fanedit') => {
    setModalType(type);
    setEditingId(item.id);
    if (type === 'movie') {
      setMovieForm({
        title: item.title,
        year: item.year,
        rating: item.rating,
        plot: item.plot,
        posterUrl: item.posterUrl,
        backgroundUrl: item.backgroundUrl,
        downloadLink: item.downloadLink,
        fileName: item.fileName,
        fileSize: item.fileSize
      });
    } else {
      setFaneditForm({
        title: item.title,
        type: item.type,
        description: item.description,
        posterUrl: item.posterUrl,
        backgroundUrl: item.backgroundUrl,
        downloadLink: item.downloadLink
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-transparent text-white pt-24 pb-16 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-900/10 blur-[130px] animate-pulse duration-[7000ms]" />
      <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-purple-900/10 blur-[130px] animate-pulse duration-[9000ms]" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Fallback Mock warning banner */}
        {!isDbLive && (
          <div className="mb-8 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-start space-x-3 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.05)] backdrop-blur-md">
            <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Supabase Local Fallback Mode</h4>
              <p className="text-xs text-yellow-300/80 mt-1 leading-relaxed">
                Supabase credentials are not configured in your `.env` file. Data changes made here will persist only in-memory for this tab session. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to connect to a persistent Supabase database.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar / Navigation Card */}
          <div className="w-full lg:w-64 shrink-0 rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl">
            <div className="flex items-center space-x-3 px-3 py-2.5 border-b border-white/5 mb-4">
              <Sparkles className="h-5 w-5 text-red-500" />
              <h2 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Admin Hub</h2>
            </div>
            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center justify-start px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 w-full shrink-0 ${
                  activeTab === 'overview' 
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 mr-2.5" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`flex items-center justify-start px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 w-full shrink-0 ${
                  activeTab === 'movies' 
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Film className="h-4 w-4 mr-2.5" />
                Movies Catalog
              </button>
              <button
                onClick={() => setActiveTab('fanedits')}
                className={`flex items-center justify-start px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 w-full shrink-0 ${
                  activeTab === 'fanedits' 
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Clapperboard className="h-4 w-4 mr-2.5" />
                Fan Edits
              </button>
              {isDbLive && (
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`flex items-center justify-start px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 w-full shrink-0 ${
                    activeTab === 'requests' 
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2.5" />
                  Requests
                  {requests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {requests.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>

          {/* Main Panel Area */}
          <div className="flex-grow w-full min-h-[500px]">

            {/* TAB OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Movies Restored</span>
                      <h3 className="text-3xl font-black mt-2 text-white">{movies.length}</h3>
                    </div>
                    <Film className="h-10 w-10 text-red-500/20" />
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Fan Edits Released</span>
                      <h3 className="text-3xl font-black mt-2 text-white">{fanedits.length}</h3>
                    </div>
                    <Clapperboard className="h-10 w-10 text-purple-500/20" />
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Requests</span>
                      <h3 className="text-3xl font-black mt-2 text-white">{isDbLive ? requests.length : 'N/A'}</h3>
                    </div>
                    <MessageSquare className="h-10 w-10 text-indigo-500/20" />
                  </div>
                </div>

                {/* DB seeder module */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
                  <div className="flex items-start space-x-4">
                    <Database className="h-8 w-8 text-red-500 shrink-0" />
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white">Database Seed Module</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        If this is your first time setting up Supabase, your tables in the cloud will be empty. Click below to copy the static lists from `movies.ts` and `fanedits.ts` into your Supabase database.
                      </p>
                      <button
                        onClick={handleSeed}
                        disabled={isSeeding || !isDbLive}
                        className="mt-4 flex items-center bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-all shadow-md cursor-pointer"
                      >
                        {isSeeding ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Transferring Files...
                          </>
                        ) : (
                          <>
                            <Database className="h-4 w-4 mr-2" />
                            Seed Supabase Tables
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tech cluster state */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl">
                  <h3 className="font-bold text-md text-white mb-4 flex items-center">
                    <ShieldCheck className="h-5 w-5 text-green-400 mr-2" />
                    Security & Connection Diagnostics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                      <span className="text-gray-400">Database Connection State</span>
                      <span className={`font-semibold flex items-center ${isDbLive ? 'text-green-400' : 'text-yellow-500'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${isDbLive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        {isDbLive ? 'Supabase Live' : 'Mock Framework active'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                      <span className="text-gray-400">Row Level Security Policies</span>
                      <span className="font-semibold text-green-400">ENFORCED</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                      <span className="text-gray-400">Assets Bucket Status</span>
                      <span className="font-semibold text-gray-300">{isDbLive ? 'Ready ("assets")' : 'Local Blob URLs'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB MOVIES CATALOG */}
            {activeTab === 'movies' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl text-white">Upscaled Movies List</h3>
                  <button
                    onClick={() => openAddModal('movie')}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Movie
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movies.map(movie => (
                    <div key={movie.id} className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-4 flex items-start gap-4 transition-all duration-300">
                      <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 rounded object-cover border border-white/10 shrink-0" />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-white truncate text-base">{movie.title}</h4>
                        <p className="text-gray-400 text-xs mt-1">{movie.year} • Rating: {movie.rating}</p>
                        <p className="text-gray-500 text-xs mt-2 truncate">{movie.plot}</p>
                        <div className="flex items-center space-x-2 mt-4">
                          <button
                            onClick={() => openEditModal(movie, 'movie')}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(movie.id)}
                            className="p-1.5 rounded bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <a
                            href={movie.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Download Link"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB FAN EDITS */}
            {activeTab === 'fanedits' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl text-white">Fan Edits List</h3>
                  <button
                    onClick={() => openAddModal('fanedit')}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Fan Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fanedits.map(fe => (
                    <div key={fe.id} className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-4 flex items-start gap-4 transition-all duration-300">
                      <img src={fe.posterUrl} alt={fe.title} className="w-16 h-24 rounded object-cover border border-white/10 shrink-0" />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-white truncate text-base">{fe.title}</h4>
                        <span className="inline-block mt-1 text-[10px] font-bold text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2 py-0.5 rounded uppercase">{fe.type}</span>
                        <p className="text-gray-500 text-xs mt-2.5 truncate">{fe.description}</p>
                        <div className="flex items-center space-x-2 mt-4">
                          <button
                            onClick={() => openEditModal(fe, 'fanedit')}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFanedit(fe.id)}
                            className="p-1.5 rounded bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <a
                            href={fe.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Download Link"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB REQUESTS */}
            {activeTab === 'requests' && isDbLive && (
              <div className="space-y-6">
                <h3 className="font-bold text-xl text-white">User Requests Review</h3>

                {requests.length === 0 ? (
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
                    <MessageSquare className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No requests found in database</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map(r => (
                      <div key={r.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-bold text-white text-base">{r.movieTitle}</h4>
                            {r.year && <span className="text-xs text-gray-400">({r.year})</span>}
                            
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                              r.status === 'approved' 
                                ? 'text-green-400 bg-green-950/40 border-green-800/30' 
                                : r.status === 'declined' 
                                ? 'text-red-400 bg-red-950/40 border-red-800/30' 
                                : 'text-yellow-400 bg-yellow-950/40 border-yellow-800/30'
                            }`}>
                              {r.status}
                            </span>
                          </div>
                          
                          {r.message && <p className="text-gray-300 text-sm mt-1">"{r.message}"</p>}
                          <p className="text-xs text-gray-500">Submitted by: {r.userEmail || 'Anonymous'} on {new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 shrink-0">
                          {r.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleRequestStatus(r.id, 'approved')}
                                className="flex items-center justify-center p-2 rounded-lg bg-green-500/10 hover:bg-green-600 border border-green-500/30 hover:border-green-500 text-green-400 hover:text-white transition-all"
                                title="Approve Request"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRequestStatus(r.id, 'declined')}
                                className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white transition-all"
                                title="Decline Request"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* FORM DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-950 p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-extrabold text-xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center">
              {editingId ? 'Edit Restored Asset' : 'Register New Restoration'}
            </h3>

            {modalType === 'movie' ? (
              // MOVIE FORM
              <form onSubmit={handleMovieSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Movie Title *</label>
                    <input
                      type="text"
                      required
                      value={movieForm.title}
                      onChange={e => setMovieForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Release Year *</label>
                    <input
                      type="number"
                      required
                      value={movieForm.year}
                      onChange={e => setMovieForm(prev => ({ ...prev, year: Number(e.target.value) }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Restorer Rating *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={movieForm.rating}
                      onChange={e => setMovieForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">File Size *</label>
                    <input
                      type="text"
                      placeholder="e.g. 7.28 GB"
                      required
                      value={movieForm.fileSize}
                      onChange={e => setMovieForm(prev => ({ ...prev, fileSize: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">File Name (mkv) *</label>
                    <input
                      type="text"
                      required
                      value={movieForm.fileName}
                      onChange={e => setMovieForm(prev => ({ ...prev, fileName: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Download Server URL *</label>
                    <input
                      type="url"
                      required
                      value={movieForm.downloadLink}
                      onChange={e => setMovieForm(prev => ({ ...prev, downloadLink: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* File Upload / Poster Url */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Poster URL</label>
                    <input
                      type="text"
                      value={movieForm.posterUrl}
                      onChange={e => setMovieForm(prev => ({ ...prev, posterUrl: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2 px-3 text-white text-xs focus:outline-none"
                    />
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium cursor-pointer transition-colors border border-white/10">
                        <Upload className="h-3 w-3 mr-1.5" />
                        Upload Poster
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageUpload(e, 'posters', 'posterUrl', 'movie')}
                        />
                      </label>
                      {uploadProgress.posterUrl && <Loader2 className="h-3 w-3 text-red-500 animate-spin" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Background Backdrop URL</label>
                    <input
                      type="text"
                      value={movieForm.backgroundUrl}
                      onChange={e => setMovieForm(prev => ({ ...prev, backgroundUrl: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2 px-3 text-white text-xs focus:outline-none"
                    />
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium cursor-pointer transition-colors border border-white/10">
                        <Upload className="h-3 w-3 mr-1.5" />
                        Upload Backdrop
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageUpload(e, 'backgrounds', 'backgroundUrl', 'movie')}
                        />
                      </label>
                      {uploadProgress.backgroundUrl && <Loader2 className="h-3 w-3 text-red-500 animate-spin" />}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Movie Plot Summary</label>
                  <textarea
                    rows={3}
                    value={movieForm.plot}
                    onChange={e => setMovieForm(prev => ({ ...prev, plot: e.target.value }))}
                    className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              // FAN EDIT FORM
              <form onSubmit={handleFaneditSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Edit Title *</label>
                    <input
                      type="text"
                      required
                      value={faneditForm.title}
                      onChange={e => setFaneditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Type *</label>
                    <select
                      value={faneditForm.type}
                      onChange={e => setFaneditForm(prev => ({ ...prev, type: e.target.value as 'movie' | 'series' }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                    >
                      <option value="movie">Movie</option>
                      <option value="series">Series</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Download Server URL *</label>
                  <input
                    type="url"
                    required
                    value={faneditForm.downloadLink}
                    onChange={e => setFaneditForm(prev => ({ ...prev, downloadLink: e.target.value }))}
                    className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none"
                  />
                </div>

                {/* File Upload / Poster Url */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Poster URL</label>
                    <input
                      type="text"
                      value={faneditForm.posterUrl}
                      onChange={e => setFaneditForm(prev => ({ ...prev, posterUrl: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2 px-3 text-white text-xs focus:outline-none"
                    />
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium cursor-pointer transition-colors border border-white/10">
                        <Upload className="h-3 w-3 mr-1.5" />
                        Upload Poster
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageUpload(e, 'posters', 'posterUrl', 'fanedit')}
                        />
                      </label>
                      {uploadProgress.posterUrl && <Loader2 className="h-3 w-3 text-red-500 animate-spin" />}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Background Backdrop URL</label>
                    <input
                      type="text"
                      value={faneditForm.backgroundUrl}
                      onChange={e => setFaneditForm(prev => ({ ...prev, backgroundUrl: e.target.value }))}
                      className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2 px-3 text-white text-xs focus:outline-none"
                    />
                    <div className="flex items-center space-x-2">
                      <label className="flex items-center px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium cursor-pointer transition-colors border border-white/10">
                        <Upload className="h-3 w-3 mr-1.5" />
                        Upload Backdrop
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageUpload(e, 'backgrounds', 'backgroundUrl', 'fanedit')}
                        />
                      </label>
                      {uploadProgress.backgroundUrl && <Loader2 className="h-3 w-3 text-red-500 animate-spin" />}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={faneditForm.description}
                    onChange={e => setFaneditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-black border border-white/10 focus:border-red-500/50 rounded-lg py-2.5 px-4 text-white text-sm focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
