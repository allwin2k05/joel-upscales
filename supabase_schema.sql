-- 1. Create Movies Table
CREATE TABLE IF NOT EXISTS public.movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    poster_url TEXT,
    background_url TEXT,
    plot TEXT,
    rating NUMERIC(3, 1),
    download_link TEXT,
    file_name TEXT,
    file_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create FanEdits Table
CREATE TABLE IF NOT EXISTS public.fanedits (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT CHECK (type IN ('movie', 'series')) NOT NULL,
    description TEXT,
    download_link TEXT,
    poster_url TEXT,
    background_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_title TEXT NOT NULL,
    year INTEGER,
    message TEXT,
    user_email TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'declined')) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fanedits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Movies
CREATE POLICY "Allow public read access to movies" 
ON public.movies FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert movies" 
ON public.movies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update movies" 
ON public.movies FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete movies" 
ON public.movies FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Policies for FanEdits
CREATE POLICY "Allow public read access to fanedits" 
ON public.fanedits FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert fanedits" 
ON public.fanedits FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update fanedits" 
ON public.fanedits FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete fanedits" 
ON public.fanedits FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Policies for Requests
CREATE POLICY "Allow public insert requests" 
ON public.requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users read access to requests" 
ON public.requests FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update requests" 
ON public.requests FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete requests" 
ON public.requests FOR DELETE USING (auth.role() = 'authenticated');

-- 8. Storage Buckets (Execute this if you want to upload cover art/images)
-- Note: Buckets can also be created manually via the Supabase Dashboard under Storage.
-- Target bucket name: "assets"
-- Make sure the bucket "assets" is set to PUBLIC.

-- 9. Create User Favorites Table
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    movie_id TEXT REFERENCES public.movies(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, movie_id)
);

-- Enable RLS for User Favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for User Favorites
CREATE POLICY "Allow users to view their own favorites" 
ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own favorites" 
ON public.user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own favorites" 
ON public.user_favorites FOR DELETE USING (auth.uid() = user_id);
