import { Link, useLocation } from "@remix-run/react";
import { Button } from "../ui/button"
import { NAV_ITEMS } from "../../constants/profile"

export function Navbar() {
  const location = useLocation();

  return (
    <>
      {/* Version desktop - en haut */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 
                      hidden md:block
                      max-w-[90%] w-fit
                      bg-navy-800/80 backdrop-blur-md 
                      rounded-full border border-cyber-primary/20
                      z-50 px-2 py-1">
        <div className="flex items-center space-x-2">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={`rounded-full font-mono text-sm
                        transition-all duration-300 ${
                          location.pathname === item.href
                            ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/40'
                            : 'text-cyber-primary/60 hover:text-cyber-primary hover:bg-cyber-primary/10'
                        }`}
              asChild
            >
              <Link to={item.href}>{item.text}</Link>
            </Button>
          ))}
        </div>
      </nav>

      {/* Version mobile - en bas */}
      <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 
                      md:hidden
                      max-w-[90%] w-fit
                      bg-navy-800/80 backdrop-blur-md 
                      rounded-full border border-cyber-primary/20
                      z-50 px-2 py-1">
        <div className="flex items-center space-x-2">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={`rounded-full font-mono text-sm
                        transition-all duration-300 ${
                          location.pathname === item.href
                            ? 'bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/40'
                            : 'text-cyber-primary/60 hover:text-cyber-primary hover:bg-cyber-primary/10'
                        }`}
              asChild
            >
              <Link to={item.href}>{item.text}</Link>
            </Button>
          ))}
        </div>
      </nav>
    </>
  );
}