import { useGetAlbum } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { TrackList } from "@/components/track-list";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlbumDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { data: album, isLoading } = useGetAlbum(id, { query: { enabled: !!id } });
  const { playTrack } = usePlayer();

  if (isLoading) {
    return (
      <div className="p-8 md:p-12 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 animate-in fade-in">
        <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-xl" />
        <div className="flex-1 space-y-4 mt-8">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
    );
  }

  if (!album) {
    return <div className="p-12 text-center text-muted-foreground">Album not found.</div>;
  }

  const handlePlayAll = () => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0], album.tracks);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="p-8 md:p-12 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-end relative">
        
        {/* Background Blur Effect */}
        {album.coverUrl && (
          <div 
            className="absolute inset-0 z-[-1] opacity-20 blur-3xl pointer-events-none"
            style={{ 
              backgroundImage: `url(${album.coverUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 shadow-2xl rounded-xl overflow-hidden border border-white/10">
          {album.coverUrl ? (
            <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
              No Cover
            </div>
          )}
        </div>

        <div className="flex-1 pb-2">
          <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-2">Album</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-white drop-shadow-md">
            {album.title}
          </h1>
          <p className="text-lg text-white/80 font-medium mb-6">
            {album.releaseYear} • {album.trackCount} tracks
          </p>

          <Button 
            size="lg" 
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-xl shadow-primary/20 transition-all hover:scale-105"
            onClick={handlePlayAll}
            disabled={album.tracks.length === 0}
          >
            <Play className="mr-2 h-5 w-5 fill-current" />
            Play All
          </Button>
        </div>
      </div>

      <div className="p-8 md:p-12 max-w-6xl mx-auto pt-0">
        <div className="bg-card/20 rounded-xl p-4 backdrop-blur-sm border border-white/5">
          <TrackList tracks={album.tracks} />
        </div>
      </div>
    </div>
  );
}
