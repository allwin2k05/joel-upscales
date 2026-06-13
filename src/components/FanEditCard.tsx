import React from 'react';
import { Download, Film, Tv } from 'lucide-react';
import { FanEdit } from '../types';

interface FanEditCardProps {
  fanEdit: FanEdit;
}

const FanEditCard: React.FC<FanEditCardProps> = ({ fanEdit }) => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-900/80 transition-all duration-300 group">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={fanEdit.posterUrl} 
          alt={fanEdit.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
        <div className="absolute top-2 right-2">
          {fanEdit.type === 'series' ? (
            <Tv className="h-5 w-5 text-red-500" />
          ) : (
            <Film className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{fanEdit.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {fanEdit.description}
        </p>
        
        <a 
          href={fanEdit.downloadLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </a>
      </div>
    </div>
  );
};

export default FanEditCard;