import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Events from './pages/Events';
import News from './pages/News';
import Market from './pages/Market';
import Programs from './pages/Programs';
import About from './pages/About';
import Admin from './pages/Admin';
import { RADIO_STREAM_URL } from './constants';
import { DataProvider } from './context/DataContext';
import InstallPrompt from './components/InstallPrompt';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio
    if (!audioRef.current) {
      audioRef.current = new Audio(RADIO_STREAM_URL);
      audioRef.current.preload = "none"; // Save data until requested
      // Enable background audio on iOS/Android WebViews where supported
      audioRef.current.setAttribute('playsinline', 'true');
      audioRef.current.setAttribute('webkit-playsinline', 'true');
    }
    
    const audio = audioRef.current;

    // Media Session API (Lock Screen & Background Controls)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Adonai Radio Live',
        artist: 'The Heartbeat of the City',
        album: 'Live Stream',
        artwork: [
          { src: 'https://cdn-icons-png.flaticon.com/512/8201/8201777.png', sizes: '96x96', type: 'image/png' },
          { src: 'https://cdn-icons-png.flaticon.com/512/8201/8201777.png', sizes: '128x128', type: 'image/png' },
          { src: 'https://cdn-icons-png.flaticon.com/512/8201/8201777.png', sizes: '192x192', type: 'image/png' },
          { src: 'https://cdn-icons-png.flaticon.com/512/8201/8201777.png', sizes: '512x512', type: 'image/png' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('stop', () => setIsPlaying(false));
    }

    // Handle Play/Pause
    if (isPlaying) {
      // Reload the source if it was stopped to ensure live edge
      if (audio.paused && audio.currentTime > 0) {
         audio.src = RADIO_STREAM_URL; 
         audio.load();
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
      
      // Update playback state for Media Session
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = "playing";
      }

    } else {
      audio.pause();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <DataProvider>
      <InstallPrompt />
      <HashRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                volume={volume} 
                setVolume={setVolume}
              />
            }
          >
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="events" element={<Events />} />
            <Route path="news" element={<News />} />
            <Route path="market" element={<Market />} />
            <Route path="programs" element={<Programs />} />
            <Route path="about" element={<About />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </DataProvider>
  );
};

export default App;