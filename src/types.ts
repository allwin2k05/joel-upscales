export interface Movie {
  id: string;
  title: string;
  year: number;
  posterUrl: string;
  backgroundUrl: string;
  plot: string;
  rating: number;
  downloadLink: string;
  fileName: string;
  fileSize: string;
  type?: 'upscale' | 'fanedit';
}

export interface FanEdit {
  id: string;
  title: string;
  type: 'movie' | 'series';
  description: string;
  downloadLink: string;
  posterUrl: string;
  backgroundUrl: string;
}