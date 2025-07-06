'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { getFeaturedMovie } from '@/app/utils/api';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
}

interface Video {
  key: string;
  type: string;
  site: string;
}

export default function Hero() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { movie, videos } = await getFeaturedMovie();
        setMovie(movie);

        const trailer = videos.find(
          (vid: Video) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );

        if (trailer) {
          setVideoKey(trailer.key);
        }
      } catch (err) {
        console.error('Error loading featured movie:', err);
        setError('Failed to load featured content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlay = () => {
    console.log('Playing movie:', movie?.title || movie?.name);
    // TODO: Implement video player
  };

  const handleMoreInfo = () => {
    console.log('More info for movie:', movie?.title || movie?.name);
    // TODO: Navigate to movie details page
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (loading) {
    return (
      <section className="relative h-[80vh] w-full bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading featured content...</div>
      </section>
    );
  }

  if (error || !movie) {
    return (
      <section className="relative h-[80vh] w-full bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{error || 'Unable to load featured content'}</div>
      </section>
    );
  }

  return (
    <section className="relative h-[80vh] w-full text-white overflow-hidden">
      {/* Fallback image if no trailer */}
      {!videoKey && (
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title || movie.name || 'Featured Movie'}
          fill
          className="object-cover brightness-50"
          priority
        />
      )}

      {/* Trailer video as background */}
      {videoKey && isVideoPlaying && (
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoKey}`}
          title="Movie Trailer"
          allow="autoplay; fullscreen"
          frameBorder="0"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Video Controls */}
      {videoKey && (
        <div className="absolute top-4 right-4 z-20 flex space-x-2">
          <button
            onClick={toggleVideo}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
            aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
          >
            {isVideoPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={toggleMute}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      )}

      {/* Overlay text and buttons */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 flex flex-col justify-center px-4 py-10 sm:px-8 md:px-16">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in">
          {movie.title || movie.name}
        </h1>
        <p className="max-w-2xl text-sm sm:text-base md:text-lg mb-6 line-clamp-5 text-gray-200 animate-fade-in animation-delay-200">
          {movie.overview}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-400">
          <button 
            onClick={handlePlay}
            className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Play size={20} />
            <span>Play</span>
          </button>
          <button 
            onClick={handleMoreInfo}
            className="bg-gray-700 bg-opacity-70 px-6 py-3 rounded hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Info size={20} />
            <span>More Info</span>
          </button>
        </div>
      </div>
    </section>
  );
}
