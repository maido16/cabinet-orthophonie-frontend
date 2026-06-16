import React from 'react';
import { useCart } from '../context/CartContext';

const FloatingCart = () => {
  const { cartCount, setIsCartOpen } = useCart();

  // Si le panier est vide, le bouton reste invisible
  if (cartCount === 0) return null;

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="fixed top-24 right-6 z-40 bg-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center border-2 border-blue-50 group"
      title="Voir mon panier"
    >
      <span className="text-2xl group-hover:animate-bounce">🛒</span>
      
      {/* La petite pastille rouge pour le nombre d'articles */}
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-7 h-7 flex items-center justify-center rounded-full shadow-md border-2 border-white">
        {cartCount}
      </span>
    </button>
  );
};

export default FloatingCart;