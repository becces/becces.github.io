import { useGetFeatured, useGetArtist } from "@workspace/api-client-react";
import { TrackList } from "@/components/track-list";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredTracks, isLoading: isLoadingFeatured } = useGetFeatured();
  const { data: artist, isLoading: isLoadingArtist } = useGetArtist();
  const { playTrack } = usePlayer();

  return (
    <div className="w-full pb-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-end">
        {artist?.avatarUrl ? (
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${artist.avatarUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-muted/20">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        )}

        <div className="relative z-10 w-full p-8 md:p-12 max-w-6xl mx-auto flex flex-col items-start gap-4">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
            Latest Release
          </div>
          
          {isLoadingArtist ? (
            <Skeleton className="h-16 w-2/3 max-w-md bg-white/10" />
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-xl">
              {artist?.name || "The Artist"}
            </h1>
          )}

          {featuredTracks && featuredTracks.length > 0 && (
            <Button 
              size="lg" 
              className="mt-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-xl shadow-primary/20 transition-all hover:scale-105"
              onClick={() => playTrack(featuredTracks[0], featuredTracks)}
            >
              <Play className="mr-2 h-5 w-5 fill-current" />
              Listen Now
            </Button>
          )}
        </div>
      </section>

      {/* Featured Tracks */}
      <section className="p-8 md:p-12 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Featured Tracks
        </h2>
        
        {isLoadingFeatured ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : featuredTracks ? (
          <div className="bg-card/30 rounded-xl p-4 backdrop-blur-sm border border-white/5">
            <TrackList tracks={featuredTracks} showAlbum />
          </div>
        ) : null}
      </section>

    </div>
  );
}
