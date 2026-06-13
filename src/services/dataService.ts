import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Movie, FanEdit } from '../types';
import { movies as staticMovies } from '../data/movies';
import { fanedits as staticFanedits } from '../data/fanedits';

export interface MovieRequest {
  id: string;
  movieTitle: string;
  year?: number;
  message?: string;
  userEmail?: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

// Helper: Map DB Movie to TypeScript Movie
const mapMovieFromDB = (m: any): Movie => ({
  id: m.id,
  title: m.title,
  year: m.year,
  posterUrl: m.poster_url || '',
  backgroundUrl: m.background_url || '',
  plot: m.plot || '',
  rating: Number(m.rating) || 0,
  downloadLink: m.download_link || '',
  fileName: m.file_name || '',
  fileSize: m.file_size || '',
});

// Helper: Map TypeScript Movie to DB Movie
const mapMovieToDB = (m: Omit<Movie, 'id'> | Movie) => ({
  title: m.title,
  year: m.year,
  poster_url: m.posterUrl,
  background_url: m.backgroundUrl,
  plot: m.plot,
  rating: m.rating,
  download_link: m.downloadLink,
  file_name: m.fileName,
  file_size: m.fileSize,
});

// Helper: Map DB FanEdit to TypeScript FanEdit
const mapFanEditFromDB = (fe: any): FanEdit => ({
  id: fe.id,
  title: fe.title,
  type: fe.type,
  description: fe.description || '',
  downloadLink: fe.download_link || '',
  posterUrl: fe.poster_url || '',
  backgroundUrl: fe.background_url || '',
});

// Helper: Map TypeScript FanEdit to DB FanEdit
const mapFanEditToDB = (fe: Omit<FanEdit, 'id'> | FanEdit) => ({
  title: fe.title,
  type: fe.type,
  description: fe.description,
  download_link: fe.downloadLink,
  poster_url: fe.posterUrl,
  background_url: fe.backgroundUrl,
});

// Helper: Map DB Request to MovieRequest
const mapRequestFromDB = (r: any): MovieRequest => ({
  id: r.id,
  movieTitle: r.movie_title,
  year: r.year,
  message: r.message || '',
  userEmail: r.user_email || '',
  status: r.status,
  createdAt: r.created_at,
});

// ==========================================
// MOVIES SERVICE
// ==========================================

export const getMovies = async (): Promise<Movie[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      
      // If table is empty, return static movies (and let admin seed it later)
      if (!data || data.length === 0) {
        return staticMovies;
      }
      
      return data.map(mapMovieFromDB);
    } catch (error) {
      console.warn('Supabase fetch movies error, falling back to static data:', error);
      return staticMovies;
    }
  }
  return staticMovies;
};

export const getMovieById = async (id: string): Promise<Movie | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapMovieFromDB(data) : null;
    } catch (error) {
      console.warn(`Supabase fetch movie ${id} error, searching static data:`, error);
      const found = staticMovies.find(m => m.id === id);
      return found || null;
    }
  }
  const found = staticMovies.find(m => m.id === id);
  return found || null;
};

export const addMovie = async (movie: Omit<Movie, 'id'> & { id?: string }): Promise<Movie> => {
  const generatedId = movie.id || movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  if (isSupabaseConfigured() && supabase) {
    const dbData = {
      id: generatedId,
      ...mapMovieToDB(movie)
    };

    const { data, error } = await supabase
      .from('movies')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return mapMovieFromDB(data);
  }

  // Local fallback: simulate add by creating structure
  const newMovie = { id: generatedId, ...movie };
  // Add to temporary in-memory list (will reset on reload in mock mode, but useful for testing UI)
  staticMovies.push(newMovie);
  return newMovie;
};

export const updateMovie = async (id: string, movie: Partial<Movie>): Promise<Movie> => {
  if (isSupabaseConfigured() && supabase) {
    const dbData = mapMovieToDB(movie as Movie);
    // Remove undefined fields to avoid overwriting them
    Object.keys(dbData).forEach(key => {
      if ((dbData as any)[key] === undefined) {
        delete (dbData as any)[key];
      }
    });

    const { data, error } = await supabase
      .from('movies')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapMovieFromDB(data);
  }

  // Local fallback
  const index = staticMovies.findIndex(m => m.id === id);
  if (index !== -1) {
    staticMovies[index] = { ...staticMovies[index], ...movie };
    return staticMovies[index];
  }
  throw new Error('Movie not found for update');
};

export const deleteMovie = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // Local fallback
  const index = staticMovies.findIndex(m => m.id === id);
  if (index !== -1) {
    staticMovies.splice(index, 1);
    return true;
  }
  return false;
};

// ==========================================
// FANEDITS SERVICE
// ==========================================

export const getFanedits = async (): Promise<FanEdit[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('fanedits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return staticFanedits;
      }
      
      return data.map(mapFanEditFromDB);
    } catch (error) {
      console.warn('Supabase fetch fanedits error, falling back to static data:', error);
      return staticFanedits;
    }
  }
  return staticFanedits;
};

export const addFanedit = async (fanedit: Omit<FanEdit, 'id'> & { id?: string }): Promise<FanEdit> => {
  const generatedId = fanedit.id || fanedit.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  if (isSupabaseConfigured() && supabase) {
    const dbData = {
      id: generatedId,
      ...mapFanEditToDB(fanedit)
    };

    const { data, error } = await supabase
      .from('fanedits')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    return mapFanEditFromDB(data);
  }

  const newFanedit = { id: generatedId, ...fanedit };
  staticFanedits.push(newFanedit);
  return newFanedit;
};

export const updateFanedit = async (id: string, fanedit: Partial<FanEdit>): Promise<FanEdit> => {
  if (isSupabaseConfigured() && supabase) {
    const dbData = mapFanEditToDB(fanedit as FanEdit);
    Object.keys(dbData).forEach(key => {
      if ((dbData as any)[key] === undefined) {
        delete (dbData as any)[key];
      }
    });

    const { data, error } = await supabase
      .from('fanedits')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapFanEditFromDB(data);
  }

  const index = staticFanedits.findIndex(fe => fe.id === id);
  if (index !== -1) {
    staticFanedits[index] = { ...staticFanedits[index], ...fanedit };
    return staticFanedits[index];
  }
  throw new Error('Fan edit not found for update');
};

export const deleteFanedit = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('fanedits')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  const index = staticFanedits.findIndex(fe => fe.id === id);
  if (index !== -1) {
    staticFanedits.splice(index, 1);
    return true;
  }
  return false;
};

// ==========================================
// REQUESTS SERVICE
// ==========================================

export const submitRequest = async (request: {
  movieTitle: string;
  year?: number;
  message?: string;
  userEmail?: string;
}): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    const dbData = {
      movie_title: request.movieTitle,
      year: request.year || null,
      message: request.message || null,
      user_email: request.userEmail || null,
      status: 'pending'
    };

    const { error } = await supabase
      .from('requests')
      .insert([dbData]);

    if (error) throw error;
    return true;
  }
  
  // Local fallback: just log and return true
  console.log('Mock submitting request:', request);
  return true;
};

export const getRequests = async (): Promise<MovieRequest[]> => {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ? data.map(mapRequestFromDB) : [];
  }
  
  // Return empty list in mock mode (since we don't store requests persistently locally)
  return [];
};

export const updateRequestStatus = async (id: string, status: 'pending' | 'approved' | 'declined'): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  }
  return false;
};

// ==========================================
// FILE STORAGE SERVICE
// ==========================================

export const uploadAsset = async (file: File, folder: 'posters' | 'backgrounds'): Promise<string> => {
  if (isSupabaseConfigured() && supabase) {
    // Generate clean file name to avoid path issue characters
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(data.path);

    return publicUrl;
  }

  // Local fallback: Create Object URL so it displays in-session
  return URL.createObjectURL(file);
};

// ==========================================
// DATABASE SEEDER UTILITY
// ==========================================

export const seedDatabase = async (): Promise<{ moviesSeeded: number; faneditsSeeded: number }> => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Cannot seed.');
  }

  let moviesSeeded = 0;
  let faneditsSeeded = 0;

  // 1. Seed Movies
  const { data: existingMovies } = await supabase.from('movies').select('id');
  const existingMovieIds = new Set((existingMovies || []).map(m => m.id));
  
  const moviesToInsert = staticMovies
    .filter(m => !existingMovieIds.has(m.id))
    .map(m => ({
      id: m.id,
      ...mapMovieToDB(m)
    }));

  if (moviesToInsert.length > 0) {
    const { error: movieErr } = await supabase.from('movies').insert(moviesToInsert);
    if (movieErr) throw movieErr;
    moviesSeeded = moviesToInsert.length;
  }

  // 2. Seed FanEdits
  const { data: existingFanedits } = await supabase.from('fanedits').select('id');
  const existingFaneditIds = new Set((existingFanedits || []).map(fe => fe.id));

  const faneditsToInsert = staticFanedits
    .filter(fe => !existingFaneditIds.has(fe.id))
    .map(fe => ({
      id: fe.id,
      ...mapFanEditToDB(fe)
    }));

  if (faneditsToInsert.length > 0) {
    const { error: feErr } = await supabase.from('fanedits').insert(faneditsToInsert);
    if (feErr) throw feErr;
    faneditsSeeded = faneditsToInsert.length;
  }

  return { moviesSeeded, faneditsSeeded };
};
