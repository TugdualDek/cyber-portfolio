import { memo, useCallback, useEffect, useRef } from 'react';

interface Detection {
  col: number;
  row: number;
  life: number;
}

// Configuration constante
const GRID_SIZE = 30;
const DETECTION_CHANCE = 0.01;
const LIFE_DECREASE = 0.02;
const DETECTION_ALPHA = 0.3;
// Ajout d'une marge pour éviter les espaces blancs lors du scroll
const OVERFLOW_MARGIN = 50; // en pixels

const DynamicBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionsRef = useRef<Detection[]>([]);
  const animationFrameRef = useRef<number>();
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Initialisation du canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ajout d'une marge supplémentaire à la taille du canvas
    canvas.width = window.innerWidth + (OVERFLOW_MARGIN * 2);
    canvas.height = window.innerHeight + (OVERFLOW_MARGIN * 2);
    
    contextRef.current = canvas.getContext('2d');
    if (!contextRef.current) return;
  }, []);

  // Dessin de la grille
  const drawGrid = useCallback(() => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    // Nettoyage et fond
    context.fillStyle = '#0A192F';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Configuration de la grille
    context.strokeStyle = 'rgba(0, 255, 136, 0.05)';
    context.lineWidth = 1;
    context.beginPath();

    // Optimisation du rendu de la grille
    const cols = Math.ceil(canvas.width / GRID_SIZE);
    const rows = Math.ceil(canvas.height / GRID_SIZE);

    // Lignes verticales et horizontales
    for (let x = 0; x <= cols; x++) {
      context.moveTo(x * GRID_SIZE, 0);
      context.lineTo(x * GRID_SIZE, canvas.height);
    }
    for (let y = 0; y <= rows; y++) {
      context.moveTo(0, y * GRID_SIZE);
      context.lineTo(canvas.width, y * GRID_SIZE);
    }
    context.stroke();

    return { cols, rows };
  }, []);

  // Gestion des détections
  const updateDetections = useCallback((cols: number, rows: number) => {
    const context = contextRef.current;
    if (!context) return;

    // Ajout aléatoire de détections
    if (Math.random() < DETECTION_CHANCE) {
      detectionsRef.current.push({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
        life: 1
      });
    }

    // Mise à jour et rendu des détections
    detectionsRef.current = detectionsRef.current.filter(detection => {
      detection.life -= LIFE_DECREASE;
      if (detection.life <= 0) return false;

      context.fillStyle = '#00ff88';
      context.globalAlpha = detection.life * DETECTION_ALPHA;
      context.fillRect(
        detection.col * GRID_SIZE,
        detection.row * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE
      );
      context.globalAlpha = 1;
      return true;
    });
  }, []);

  // Boucle d'animation
  const animate = useCallback(() => {
    const dimensions = drawGrid();
    if (dimensions) {
      updateDetections(dimensions.cols, dimensions.rows);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [drawGrid, updateDetections]);

  useEffect(() => {
    setupCanvas();
    animate();

    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [setupCanvas, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed w-[calc(100%+100px)] h-[calc(100%+100px)]"
      style={{ 
        zIndex: 0,
        left: '-50px',
        top: '-50px'
      }}
    />
  );
});

DynamicBackground.displayName = 'DynamicBackground';

export { DynamicBackground };
