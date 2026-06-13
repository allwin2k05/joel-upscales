import React from 'react';
import { Film } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/90 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Film className="h-8 w-8 text-red-500 mr-2" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
              Joel Upscales
            </span>
          </div>
          
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-gray-300 max-w-md">
              Restoring Tamil cinema heritage through AI upscaling, 
              bringing legendary films to life with enhanced quality for a superior cinematic experience.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Joel Upscales. All rights reserved.</p>
          <p className="mt-2">Created with passion for preserving cinema history.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;