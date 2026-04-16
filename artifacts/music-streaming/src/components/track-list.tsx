import { Track } from "@workspace/api-client-react/src/generated/api.schemas";
import { usePlayer } from "@/lib/player-context";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
}

export function TrackList({ tracks, showAlbum = false }: TrackListProps) {
  const { currentTrack, isPlaying, playTrack } = usePlayer();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!tracks.length) {
    return <div className="text-muted-foreground py-8 text-center">No tracks found.</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_minmax(120px,1fr)_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border/50 mb-2">
        <div className="w-8 text-center">#</div>
        <div>Title</div>
        {showAlbum && <div className="hidden md:block">Album</div>}
        <div className="w-12 text-right">Time</div>
      </div>
      
      <div className="flex flex-col gap-1">
        {tracks.map((track, idx) => {
          const isActive = currentTrack?.id === track.id;
          
          return (
            <div 
              key={track.id}
              onClick={() => playTrack(track, tracks)}
              className={cn(
                "group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_minmax(120px,1fr)_auto] gap-4 px-4 py-2 rounded-md items-center cursor-pointer transition-colors",
                isActive ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
              )}
            >
              <div className="w-8 text-center flex items-center justify-center">
                {isActive ? (
                  isPlaying ? <Pause className="h-4 w-4 animate-pulse text-primary" /> : <Play className="h-4 w-4 text-primary" />
                ) : (
                  <>
                    <span className="group-hover:hidden text-muted-foreground">{idx + 1}</span>
                    <Play className="h-4 w-4 hidden group-hover:block text-foreground" />
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3 min-w-0">
                {showAlbum && track.albumCoverUrl && (
                  <img src={track.albumCoverUrl} alt="" className="h-10 w-10 rounded shadow-sm object-cover hidden sm:block" />
                )}
                <div className="truncate">
                  <div className={cn("font-medium truncate", isActive ? "text-primary" : "text-foreground")}>
                    {track.title}
                  </div>
                </div>
              </div>

              {showAlbum && (
                <div className="hidden md:block truncate text-sm text-muted-foreground">
                  {track.albumTitle}
                </div>
              )}

              <div className="w-12 text-right text-sm tabular-nums text-muted-foreground">
                {formatTime(track.duration)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
