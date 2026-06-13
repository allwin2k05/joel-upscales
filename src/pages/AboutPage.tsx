import React, { useState, useEffect } from 'react';
import { Film, Monitor, Zap, Trophy, ArrowRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Delay state change slightly to ensure transitions trigger cleanly on mount
    const timer = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16 overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Title with Slide-left animation */}
          <h1 className={`text-4xl md:text-5xl font-extrabold text-white mb-4 text-center ${
            animate ? 'animate-slide-left' : 'opacity-0'
          }`}>
            About V.Allwin Joel's Upscales
          </h1>
          
          {/* Subtitle with Slide-right animation */}
          <div className={`mb-12 text-center ${
            animate ? 'animate-slide-right' : 'opacity-0'
          }`} style={{ animationDelay: '100ms' }}>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
              Preserving classic Tamil cinema through AI restoration and crafting Hollywood fan edits
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          </div>
          
          {/* Premium Glassmorphic "Our Mission" card */}
          <div className={`glass-panel glass-panel-hover rounded-2xl p-6 md:p-8 mb-12 ${
            animate ? 'animate-slide-up' : 'opacity-0'
          }`} style={{ animationDelay: '250ms' }}>
            <h2 className={`text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 ${
              animate ? 'animate-slide-left' : 'opacity-0'
            }`} style={{ animationDelay: '400ms' }}>
              Our Mission
            </h2>
            <p className={`text-gray-300 leading-relaxed mb-6 font-light ${
              animate ? 'animate-slide-up' : 'opacity-0'
            }`} style={{ animationDelay: '500ms' }}>
              Like a master painter restoring a timeless masterpiece, I breathe new life into classic Tamil cinema 
              through AI upscaling. But my passion doesn't stop there - I'm also a storyteller who reimagines 
              beloved Hollywood films, crafting streamlined experiences that capture their essence in fresh, 
              compelling ways.
            </p>
            <p className={`text-gray-300 leading-relaxed font-light ${
              animate ? 'animate-slide-up' : 'opacity-0'
            }`} style={{ animationDelay: '600ms' }}>
              Just as a sculptor sees the statue within the marble, I see the potential for more focused, 
              impactful narratives within expansive series and films. Each edit is a labor of love, 
              carefully crafted to enhance the viewing experience while preserving the heart of the story.
            </p>
          </div>
          
          {/* Grid section with colorful glows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            
            {/* Red glow glassmorphic card */}
            <div className={`glass-panel-red glass-panel-red-hover rounded-2xl p-6 ${
              animate ? 'animate-slide-left' : 'opacity-0'
            }`} style={{ animationDelay: '700ms' }}>
              <Film className="h-10 w-10 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Upscaling Process</h3>
              <p className="text-gray-300 font-light mb-4">
                Each film undergoes a meticulous multi-stage process:
              </p>
              <ul className="list-inside text-gray-300 space-y-2 font-light">
                {[
                  "Source assessment and preparation",
                  "Initial AI upscaling using Topaz",
                  "Frame-by-frame quality enhancement",
                  "Color correction and grading",
                  "Final quality assurance"
                ].map((item, index) => (
                  <li key={index} 
                      className={`flex items-center ${animate ? 'animate-slide-left' : 'opacity-0'}`}
                      style={{ animationDelay: `${800 + index * 80}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2.5" /> 
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Purple glow glassmorphic card */}
            <div className={`glass-panel-purple glass-panel-purple-hover rounded-2xl p-6 ${
              animate ? 'animate-slide-right' : 'opacity-0'
            }`} style={{ animationDelay: '700ms' }}>
              <Zap className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Fan Edit Philosophy</h3>
              <p className="text-gray-300 font-light mb-4">
                Narrative restructuring to craft:
              </p>
              <ul className="list-inside text-gray-300 space-y-2 font-light">
                {[
                  "Streamlined viewing experiences",
                  "Enhanced narrative flow",
                  "Focused character arcs",
                  "Accessible entry points for new viewers",
                  "Fresh perspectives on familiar stories"
                ].map((item, index) => (
                  <li key={index} 
                      className={`flex items-center ${animate ? 'animate-slide-right' : 'opacity-0'}`}
                      style={{ animationDelay: `${800 + index * 80}ms` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2.5" /> 
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Glassmorphic Fan Edits List */}
          <div className={`glass-panel glass-panel-hover rounded-2xl p-6 md:p-8 mb-12 ${
            animate ? 'animate-slide-up' : 'opacity-0'
          }`} style={{ animationDelay: '1100ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Monitor className="h-6 w-6 mr-3 text-red-500 animate-pulse" />
              Featured Fan Edits
            </h2>
            <div className="grid grid-cols-1 gap-5">
              
              {/* Fan edit item 1 */}
              <div className={`glass-panel glass-panel-hover rounded-xl p-5 ${
                animate ? 'animate-slide-up' : 'opacity-0'
              }`} style={{ animationDelay: '1200ms' }}>
                <h3 className="text-lg font-bold text-white mb-1.5">John Wick: The Complete Cut</h3>
                <p className="text-gray-400 mb-3 text-sm font-light">
                  A seamless blend of the trilogy into a single, linear narrative that maintains the 
                  intensity while streamlining the story.
                </p>
                <a href="https://drive.google.com/file/d/1kEcmLlyTUHveY_xVYXycK4nLGPVUSspM/view?usp=drive_link" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors">
                  Watch Now <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
              
              {/* Fan edit item 2 */}
              <div className={`glass-panel glass-panel-hover rounded-xl p-5 ${
                animate ? 'animate-slide-up' : 'opacity-0'
              }`} style={{ animationDelay: '1300ms' }}>
                <h3 className="text-lg font-bold text-white mb-1.5">Avengers: Infinity Endgame</h3>
                <p className="text-gray-400 mb-3 text-sm font-light">
                  Two epic films combined into one cohesive story, available in both extended and 
                  condensed versions.
                </p>
                <div className="flex gap-4">
                  <a href="https://drive.google.com/file/d/1YChYJFjNDF0km_Lps0IotIB65ti_k03Y/view?usp=drive_link" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors">
                    Extended Cut <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                  <a href="https://drive.google.com/file/d/1arM6XJV-WeEl-eMqabihBGqUQRknceCW/view?usp=drive_link" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors">
                    Condensed Cut <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
              
              {/* Fan edit item 3 */}
              <div className={`glass-panel glass-panel-hover rounded-xl p-5 ${
                animate ? 'animate-slide-up' : 'opacity-0'
              }`} style={{ animationDelay: '1400ms' }}>
                <h3 className="text-lg font-bold text-white mb-1.5">Tenet Uninverted</h3>
                <p className="text-gray-400 mb-3 text-sm font-light">
                  A more accessible version of Christopher Nolan's complex masterpiece, perfect for 
                  first-time viewers.
                </p>
                <a href="https://drive.google.com/file/d/1CZIqIDH9_Myz7V1QIGU8mrB6Pn9Eo8dh/view?usp=drive_link" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors">
                  Watch Now <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
              
              {/* Fan edit item 4 */}
              <div className={`glass-panel glass-panel-hover rounded-xl p-5 ${
                animate ? 'animate-slide-up' : 'opacity-0'
              }`} style={{ animationDelay: '1500ms' }}>
                <h3 className="text-lg font-bold text-white mb-1.5">Marvel Series as Movies</h3>
                <p className="text-gray-400 mb-3 text-sm font-light">
                  Popular Marvel series condensed into feature-length films for a more focused experience.
                </p>
                <div className="flex gap-4">
                  <a href="https://drive.google.com/file/d/1ZileordBytyztKplZaeV9zwyiezsECZS/view?usp=drive_link" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors">
                    Loki <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                  <a href="https://drive.google.com/file/d/19QggA1rohZ8FpkFdJu9dsyQbdCmoLZ1s/view?usp=drive_link" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors">
                    Hawkeye <ArrowRight className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Call-out with Slide-up */}
          <div className={`text-center mb-12 ${
            animate ? 'animate-slide-up' : 'opacity-0'
          }`} style={{ animationDelay: '1700ms' }}>
            <Trophy className="h-16 w-16 text-red-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Mission</h2>
            <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Whether it's through upscaled Tamil classics or reimagined Hollywood narratives,
              I'm dedicated to creating unique cinematic experiences. Your suggestions and 
              contributions help make this possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;