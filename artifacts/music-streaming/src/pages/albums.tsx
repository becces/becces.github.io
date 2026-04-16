import { useListAlbums } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Play } from "lucide-react";

export default function Albums() {
  const { data: albums, isLoading } = useListAlbums();

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Albums</h1>
        <p className="text-muted-foreground text-lg">Browse by release.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square bg-muted/30 rounded-xl animate-pulse" />
              <div className="h-4 w-2/3 bg-muted/30 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-muted/30 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums?.map((album, idx) => (
            <Link 
              key={album.id} 
              href={`/albums/${album.id}`}
              className="group block"
            >
              <div 
                className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-muted/30 shadow-lg transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-primary/20"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {album.coverUrl ? (
                  <img 
                    src={album.coverUrl} 
                    alt={album.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Cover
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Play className="h-6 w-6 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                {album.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {album.releaseYear} • {album.genre || "Album"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
