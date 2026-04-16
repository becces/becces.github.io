import { useListTracks } from "@workspace/api-client-react";
import { TrackList } from "@/components/track-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export default function Listen() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: tracks, isLoading } = useListTracks({ search: debouncedSearch || undefined });

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Listen</h1>
          <p className="text-muted-foreground text-lg">The complete catalog.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tracks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/30 border-none focus-visible:ring-primary/50 rounded-full"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => <div key={i} className="h-14 w-full bg-muted/30 rounded-md animate-pulse" />)}
        </div>
      ) : tracks && tracks.length > 0 ? (
        <div className="bg-card/20 rounded-xl p-4 backdrop-blur-sm border border-white/5">
          <TrackList tracks={tracks} showAlbum />
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground bg-card/10 rounded-xl border border-dashed border-border">
          No tracks found for "{search}"
        </div>
      )}
    </div>
  );
}
