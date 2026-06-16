import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToAnchor = () => {
  const location = useLocation();

  useEffect(() => {
    // Si l’URL contient un hash, ex: /#contact
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // petit délai pour laisser le rendu se faire
      }
    } else {
      // sinon, remonte en haut de page
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
};

export default ScrollToAnchor;
