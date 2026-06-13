import React, { useState, useRef } from 'react';
import { Gift, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const DonatePage: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [movieTitle, setMovieTitle] = useState('');
  const [format, setFormat] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_834pmqd',
        'template_8kqvp5j',
        {
          from_name: 'DVD Donation Form',
          to_name: 'V.Allwin Joel',
          movie_title: movieTitle,
          format: format,
          message: message,
          to_email: 'allwinjoel2k05@gmail.com',
        },
        '4sIIkMnAX6yJAnr3o'
      );
      
      setSubmitStatus('success');
      setMovieTitle('');
      setFormat('');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Gift className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Donate a DVD</h1>
            <p className="text-gray-300">
              Help us preserve Tamil cinema by donating your DVD collection. Your contribution will help us create high-quality upscaled versions.
            </p>
          </div>

          <form ref={form} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="movieTitle" className="block text-sm font-medium text-gray-300 mb-2">
                Movie Title *
              </label>
              <input
                type="text"
                id="movieTitle"
                value={movieTitle}
                onChange={(e) => setMovieTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter the movie title"
              />
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-300 mb-2">
                DVD Format *
              </label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select format</option>
                <option value="DVD5">DVD5 (4.7GB)</option>
                <option value="DVD9">DVD9 (8.5GB)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Additional Information
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Any additional information about the DVD..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-300"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Submit Donation
                </>
              )}
            </button>
          </form>

          {submitStatus === 'success' && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 text-green-400">
              Thank you for your contribution! We'll contact you soon with further details.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-6 p-4 rounded-lg bg-red-500/10 text-red-400">
              There was an error submitting your donation information. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonatePage;