import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Player } from "@/components/player";
import { Home, Library, Disc, User, PlayCircle } from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { currentTrack } = usePlayer();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/listen", label: "Listen", icon: PlayCircle },
    { href: "/albums", label: "Albums", icon: Disc },
    { href: "/about", label: "About", icon: User },
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row pb-24 md:pb-0 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className={cn(
        "fixed z-40 bg-card/80 backdrop-blur-xl border-border",
        "md:w-64 md:h-screen md:border-r md:sticky md:top-0",
        "bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around px-4",
        currentTrack ? "bottom-24 md:bottom-0" : "bottom-0"
      )}>
        <ul className="flex md:flex-col gap-2 md:px-4 w-full md:w-auto justify-around md:justify-start">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col md:flex-row items-center gap-1 md:gap-4 px-4 py-2 md:py-3 rounded-lg transition-all duration-300",
                    isActive 
                      ? "text-primary bg-primary/10 font-medium" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                  <span className="text-[10px] md:text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full">
        <div className={cn("w-full h-full", currentTrack && "pb-24")}>
          {children}
        </div>
      </main>

      <Player />
    </div>
  );
}
