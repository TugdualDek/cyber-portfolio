import { useEffect, useRef } from 'react';

export function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Configuration initiale
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    // Configuration de la grille
    const gridSize = 30; // Petits carrés
    const cols = Math.ceil(canvas.width / gridSize);
    const rows = Math.ceil(canvas.height / gridSize);
    
    // État des détections
    const detections: Array<{ col: number; row: number; life: number }> = [];

    const drawGrid = () => {
      // Fond
      context.fillStyle = '#0A192F';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Grille subtile
      context.strokeStyle = 'rgba(0, 255, 136, 0.05)';
      context.lineWidth = 1;
      context.beginPath();

      // Lignes verticales
      for (let x = 0; x <= canvas.width; x += gridSize) {
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
      }

      // Lignes horizontales
      for (let y = 0; y <= canvas.height; y += gridSize) {
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
      }

      context.stroke();

      // Ajouter une nouvelle détection aléatoire (rarement)
      if (Math.random() < 0.01) {
        detections.push({
          col: Math.floor(Math.random() * cols),
          row: Math.floor(Math.random() * rows),
          life: 1
        });
      }

      // Dessiner les détections
      detections.forEach((detection, index) => {
        detection.life -= 0.02;
        if (detection.life <= 0) {
          detections.splice(index, 1);
        } else {
          context.fillStyle = '#00ff88';
          context.globalAlpha = detection.life * 0.3; // Plus subtil
          const x = detection.col * gridSize;
          const y = detection.row * gridSize;
          context.fillRect(x, y, gridSize, gridSize);
        }
      });

      animationFrameRef.current = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}