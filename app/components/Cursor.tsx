import { useEffect, useState } from 'react';

export function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="cursor-container">
      <div 
        className={`cursor-line vertical ${isClicking ? 'clicking' : ''}`}
        style={{ 
          left: `${position.x}px`,
          transform: 'translateX(-50%)'
        }}
      />
      <div 
        className={`cursor-line horizontal ${isClicking ? 'clicking' : ''}`}
        style={{ 
          top: `${position.y}px`,
          transform: 'translateY(-50%)'
        }}
      />
      
      <div 
        className={`cursor-center ${isClicking ? 'clicking' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="cursor-ring ring-1" />
        <div className="cursor-ring ring-2" />
        <div className="cursor-ring ring-3" />
        <div className="cursor-dot" />
      </div>
    </div>
  );
}
