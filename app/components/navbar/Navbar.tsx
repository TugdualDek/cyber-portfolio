import { memo, useCallback, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { Button } from "../ui/button";
import { NAV_ITEMS, PROJECT_IMAGES } from "../../constants/constants";

// Hook personnalisé pour le préchargement des images
const useImagePreload = () => {
  return useCallback(() => {
    if (typeof window === "undefined") return;
    
    const imageCache = new Set<string>();
    PROJECT_IMAGES.forEach(src => {
      if (!imageCache.has(src)) {
        const img = new Image();
        img.src = src;
        imageCache.add(src);
      }
    });
  }, []);
};

// Composants mémorisés
const NavButton = memo(({ 
  href, 
  text, 
  isActive 
}: { 
  href: string; 
  text: string; 
  isActive: boolean;
}) => (
  <Button
    variant="ghost"
    className={`rounded-full font-mono text-sm transition-all duration-300 ${
      isActive
        ? "bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/40"
        : "text-cyber-primary/60 hover:text-cyber-primary hover:bg-cyber-primary/10"
    }`}
    asChild
  >
    <Link to={href}>{text}</Link>
  </Button>
));

NavButton.displayName = "NavButton";

const NavContent = memo(({ pathname }: { pathname: string }) => (
  <div className="flex items-center space-x-2">
    {NAV_ITEMS.map((item) => (
      <NavButton
        key={item.href}
        href={item.href}
        text={item.text}
        isActive={pathname === item.href}
      />
    ))}
  </div>
));

NavContent.displayName = "NavContent";

export const Navbar = memo(() => {
  const { pathname } = useLocation();
  const preloadImages = useImagePreload();

  // Préchargement des images au montage du composant
  useClientEffect(preloadImages, []);

  return (
    <nav className="fixed left-1/2 transform -translate-x-1/2 
                    max-w-[90%] w-fit
                    bg-navy-800/80 backdrop-blur-md 
                    rounded-full border border-cyber-primary/20
                    z-50 px-2 py-1
                    md:top-6
                    bottom-10 md:bottom-auto">
      <NavContent pathname={pathname} />
    </nav>
  );
});

Navbar.displayName = "Navbar";

// Hook utilitaire pour les effets côté client
function useClientEffect(effect: () => void | (() => void), deps?: any[]) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      return effect();
    }
  }, deps);
}
