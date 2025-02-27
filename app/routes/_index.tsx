import { useState, useCallback } from 'react';
import { useNavigate } from '@remix-run/react';
import { MetaFunction } from '@remix-run/node';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const BOOT_SEQUENCE = [
  ["INITIALIZING SYSTEM KERNEL", 400],
  ["LOADING SECURITY PROTOCOLS", 500],
  ["ESTABLISHING SECURE CONNECTION", 600],
  ["AUTHENTICATING USER CREDENTIALS", 700],
  ["ACCESSING CONTROL CENTER", 800],
] as const;

export const meta: MetaFunction = () => [
  { title: "Tugdual de Kerdrel" },
  { name: "description", content: "Portfolio - Tugdual de Kerdrel" },
];

export default function CommandCenter() {
  const [bootStep, setBootStep] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [destination, setDestination] = useState('');
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setIsTransitioning(true);
    setDestination(path);
    
    // Start boot sequence
    setBootStep(0);
    
    // Boot sequence will handle navigation after completion
  };

  // Modified boot sequence to handle both destinations
  const handleBootSequence = useCallback(() => {
    if (bootStep < BOOT_SEQUENCE.length - 1) {
      const timer = setTimeout(() => {
        setBootStep(prev => prev + 1);
      }, BOOT_SEQUENCE[bootStep]?.[1] || 800);

      return () => clearTimeout(timer);
    } else if (bootStep === BOOT_SEQUENCE.length - 1) {
      const timer = setTimeout(() => navigate(destination), 800);
      return () => clearTimeout(timer);
    }
  }, [bootStep, navigate, destination]);

  // Run boot sequence when bootStep changes
  if (bootStep >= 0) {
    handleBootSequence();
  }

  // If transitioning, show boot sequence
  if (isTransitioning) {
    const progress = Math.min(((bootStep + 1) / BOOT_SEQUENCE.length) * 100, 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Matrix Background */}
        <div className="absolute inset-0 text-green-500/5 font-mono text-sm overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div 
              key={i}
              className="whitespace-nowrap animate-slideDown"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        <div className="w-full max-w-2xl space-y-8 relative z-10">
          {/* Terminal */}
          <div className="border border-green-500/20 rounded-t-lg ">
            <div className="px-4 py-2 border-b border-green-500/20 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-2 text-green-500/60 text-sm font-mono">
                terminal@tugdual
              </span>
            </div>
            <div className="p-6 font-mono text-sm space-y-2">
              {BOOT_SEQUENCE.map(([text], index) => (
                index <= bootStep && (
                  <div 
                    key={index}
                    className="text-green-500/80"
                  >
                    <span className="text-green-500/40">{">_ "}</span>
                    {text}
                    {index === bootStep && (
                      <span className="inline-block w-2 h-4 bg-green-500/60 animate-pulse ml-1" />
                    )}
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-green-500/60">
              <span>BOOT SEQUENCE: {Math.round(progress)}%</span>
              <span className="animate-pulse">{">_"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show selection screen
  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4">
      {/* Matrix Background */}
      <div className="absolute inset-0 text-green-500/5 font-mono text-sm overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div 
            key={i}
            className="whitespace-nowrap animate-slideDown"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      
      <Card className="w-full max-w-md bg-gray-900 border border-green-500/30">
        <CardHeader className="text-center border-b border-green-500/20 pb-4">
          <CardTitle className="text-2xl text-green-500">
            Tugdual de Kerdrel
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          <div className="text-center text-gray-400 mb-6">
            Choose how you want to explore my portfolio
          </div>
          
          <Button 
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 mb-4 h-12"
            onClick={() => handleNavigation('/dashboard')}
          >
            Classic Dashboard
          </Button>
          
          <Button 
            className="w-full bg-black hover:bg-gray-900 text-green-500 border border-green-500 h-12"
            onClick={() => handleNavigation('/terminal')}
          >
            Interactive Terminal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
