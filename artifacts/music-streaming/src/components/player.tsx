import { usePlayer } from "@/lib/player-context";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Player() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeat,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    seek,
    toggleRepeat,
  } = usePlayer();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-background/95 backdrop-blur border-t border-border flex items-center justify-between px-4 md:px-8 z-50 animate-in slide-in-from-bottom-24 duration-500">
      
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/3 min-w-0">
        {currentTrack.albumCoverUrl && (
          <div className="h-14 w-14 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            <img 
              src={currentTrack.albumCoverUrl} 
              alt={currentTrack.albumTitle || "Album Cover"} 
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="truncate">
          <h4 className="font-semibold text-sm truncate text-foreground">{currentTrack.title}</h4>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.albumTitle}</p>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="flex flex-col items-center justify-center gap-2 w-1/3 max-w-xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={previousTrack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" 
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={nextTrack}>
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 transition-colors ${repeat ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            onClick={toggleRepeat}
            title={repeat ? "Repeat on" : "Repeat off"}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs tabular-nums text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(val) => seek(val[0])}
            className="w-full"
          />
          <span className="text-xs tabular-nums text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-end gap-3 w-1/3">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setVolume(volume === 0 ? 1 : 0)}>
          {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <div className="w-24">
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(val) => setVolume(val[0] / 100)}
          />
        </div>
      </div>

    </div>
  );
}
