import { useGetArtist, useGetStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram, Twitter, Youtube, MapPin, Music } from "lucide-react";

export default function About() {
  const { data: artist, isLoading: isLoadingArtist } = useGetArtist();
  const { data: stats, isLoading: isLoadingStats } = useGetStats();

  if (isLoadingArtist) {
    return (
      <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-8 animate-in fade-in">
        <Skeleton className="w-full h-64 rounded-2xl" />
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!artist) return null;

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto animate-in fade-in duration-700">
      
      <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative">
        {artist.avatarUrl ? (
          <div className="aspect-[21/9] w-full relative">
            <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        ) : (
          <div className="aspect-[21/9] w-full bg-muted" />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-white">{artist.name}</h1>
          
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            {artist.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{artist.location}</span>
              </div>
            )}
            {artist.genre && (
              <div className="flex items-center gap-1">
                <Music className="h-4 w-4 text-primary" />
                <span>{artist.genre}</span>
              </div>
            )}
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-white/80">
              {artist.bio}
            </p>
          </div>

          {artist.socialLinks && (
            <div className="flex gap-4 pt-6 border-t border-border">
              {artist.socialLinks.instagram && (
                <a href={artist.socialLinks.instagram} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {artist.socialLinks.twitter && (
                <a href={artist.socialLinks.twitter} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {artist.socialLinks.youtube && (
                <a href={artist.socialLinks.youtube} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-muted/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="md:w-64 space-y-6">
          <h3 className="font-semibold text-lg border-b border-border pb-2">By the Numbers</h3>
          
          {isLoadingStats ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : stats ? (
            <div className="grid gap-4">
              <div className="bg-card/20 p-4 rounded-xl border border-white/5">
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalTracks}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Tracks Released</div>
              </div>
              <div className="bg-card/20 p-4 rounded-xl border border-white/5">
                <div className="text-3xl font-bold text-foreground mb-1">{stats.totalAlbums}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Albums</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

    </div>
  );
}
