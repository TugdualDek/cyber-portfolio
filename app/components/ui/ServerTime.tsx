import { useState, useEffect } from 'react';

export function ServerTime() {
  const [clientTime, setClientTime] = useState<string | null>(null);

  useEffect(() => {
    setClientTime(new Date().toUTCString());
    
    // Optionnel : mettre à jour chaque seconde
    const interval = setInterval(() => {
      setClientTime(new Date().toUTCString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Ne rien rendre pendant le SSR
  if (!clientTime) {
    return <span className="opacity-0">Loading...</span>; // Placeholder pour éviter le saut
  }

  return <span>{clientTime}</span>;
}