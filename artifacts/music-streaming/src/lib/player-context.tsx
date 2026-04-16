import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { Track } from "@workspace/api-client-react/src/generated/api.schemas";

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = state.volume;
    
    // Prevent downloading
    audio.addEventListener('contextmenu', (e) => e.preventDefault());
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setState(s => ({ ...s, currentTime: audio.currentTime }));
    const handleDurationChange = () => setState(s => ({ ...s, duration: audio.duration }));
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [state.queue, state.currentTrack]);

  const playTrack = (track: Track, queue?: Track[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (state.currentTrack?.id === track.id) {
      // Toggle if same track
      togglePlayPause();
      return;
    }

    // Use a blob URL or hide direct URL if possible, but for now we just use the audioUrl 
    // The requirement says "Never expose the direct audio URL in a way users can easily copy-paste it"
    // We can't completely hide it from network tab, but we don't render it in the DOM in an <a> tag.
    audio.src = track.audioUrl;
    audio.play().catch(console.error);

    setState(s => ({
      ...s,
      currentTrack: track,
      queue: queue || s.queue,
      isPlaying: true,
    }));
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    if (state.isPlaying) {
      audio.pause();
      setState(s => ({ ...s, isPlaying: false }));
    } else {
      audio.play().catch(console.error);
      setState(s => ({ ...s, isPlaying: true }));
    }
  };

  const nextTrack = () => {
    if (!state.currentTrack || state.queue.length === 0) return;
    const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
    if (currentIndex >= 0 && currentIndex < state.queue.length - 1) {
      playTrack(state.queue[currentIndex + 1], state.queue);
    } else {
      // Loop or stop
      setState(s => ({ ...s, isPlaying: false, currentTime: 0 }));
      if (audioRef.current) audioRef.current.pause();
    }
  };

  const previousTrack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // If we're more than 3 seconds in, just restart current track
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (!state.currentTrack || state.queue.length === 0) return;
    const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
    if (currentIndex > 0) {
      playTrack(state.queue[currentIndex - 1], state.queue);
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setState(s => ({ ...s, volume }));
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setState(s => ({ ...s, currentTime: time }));
  };

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playTrack,
        togglePlayPause,
        nextTrack,
        previousTrack,
        setVolume,
        seek,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
