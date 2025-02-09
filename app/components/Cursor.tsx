export function Cursor() {
  // Ne pas afficher sur mobile
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches) {
    return null;
  }

  return null; // Le curseur est géré entièrement en CSS
}