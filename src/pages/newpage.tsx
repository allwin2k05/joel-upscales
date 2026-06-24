import React, { useState, useRef } from 'react';
import { Film, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { submitRequest } from '../services/dataService';

const RequestPage: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [movieTitle, setMovieTitle] = useState('');
  const [year, setYear] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // 1. Save request in Supabase Database
      await submitRequest({
        movieTitle,
        year: year ? Number(year) : undefined,
        message,
        userEmail: 'visitor@joelupscales.com'
      });

      // 2. Dispatch email notification via EmailJS (optional / helper)
      try {
        await emailjs.send(
          'service_834pmqd',
          'template_sx6tu7v',
          {
            from_name: 'Movie Request Form',
            to_name: 'V.Allwin Joel',
            movie_title: movieTitle || 'Test Movie',
            year: year || 'N/A',
            message: message || 'N/A',
            reply_to: 'allwinjoel2k05@gmail.com',
          },
          '4sIIkMnAX6yJAnr3o'
        );
      } catch (emailErr) {
        console.warn('EmailJS notification failed but database request was successfully saved:', emailErr);
      }
      
      setSubmitStatus('success');
      setMovieTitle('');
      setYear('');
      setMessage('');
    } catch (error) {
      console.error('Database Request Submission Error:', error);
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Film className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Request a Movie</h1>
            <p className="text-gray-300">
              Want to see a specific Tamil movie upscaled? Let us know which film you'd like to see restored to high quality.
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
              <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-2">
                Release Year
              </label>
              <input
                type="number"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter the release year"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Additional Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Any additional information about the movie..."
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
                  Submit Request
                </>
              )}
            </button>
          </form>

          {submitStatus === 'success' && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 text-green-400">
              Your request has been submitted successfully!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mt-6 p-4 rounded-lg bg-red-500/10 text-red-400">
              There was an error submitting your request. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestPage;