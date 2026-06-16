// frontend/src/components/CartDrawer.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { cabinetData } from '../data/constants'; // 👈 NOUVEAU : Pour récupérer le numéro

const CartDrawer = () => {
  const { cart, removeFromCart, addToCart, decreaseQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const handleWhatsAppCheckout = () => {
    // 1. On fabrique l'en-tête du message
    let message = "Bonjour ! 👋 Je souhaite passer cette commande depuis votre boutique en ligne :\n\n";

    // 2. On boucle sur le panier pour lister les articles
    cart.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name} (${item.price * item.quantity} DH)\n`;
    });

    // 3. On ajoute le total et un petit mot de fin
    message += `\n*Total à payer : ${cartTotal.toFixed(2)} DH*\n\n`;
    message += "Merci de m'indiquer la marche à suivre pour la confirmation et la livraison. 🚚";

    // 4. On nettoie le numéro (enlève les espaces et le '+' pour l'URL WhatsApp)
    const phone = cabinetData.telephone.replace(/\s+/g, '').replace('+', '');

    // 5. On ouvre WhatsApp dans un nouvel onglet avec le message pré-rempli !
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* L'arrière-plan flou (Overlay) */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Le Panneau coulissant */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-fade-in-right">
        
        {/* Header du panier */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span>🛒</span> Votre Panier
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full shadow-sm"
          >
            ❌
          </button>
        </div>

        {/* Liste des produits */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center text-slate-500 mt-20">
              <span className="text-4xl block mb-4">💨</span>
              Votre panier est vide pour le moment.
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                        <p className="text-blue-600 font-black text-sm mt-1">{item.price} DH</p>
                        
                        {/* 👇 NOUVEAUX BOUTONS DE QUANTITÉ 👇 */}
                        <div className="flex items-center gap-3 mt-3">
                        <button 
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-slate-600 transition-colors"
                        >
                            -
                        </button>
                        <span className="font-bold text-slate-700 text-sm">{item.quantity}</span>
                        <button 
                            onClick={() => addToCart(item)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-slate-600 transition-colors ${
                            item.quantity >= item.stock ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-100'
                            }`}
                            disabled={item.quantity >= item.stock}
                        >
                            +
                        </button>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-red-500 p-2 transition-colors"
                    >
                        🗑️
                    </button>
                    </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Total et Paiement) */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-[#F8FAFC]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-bold">Total à payer</span>
              <span className="text-2xl font-black text-blue-900">{cartTotal.toFixed(2)} DH</span>
            </div>
            {/* Remplacez l'ancien bouton par celui-ci : */}
            <button 
            onClick={handleWhatsAppCheckout}
            className="w-full bg-[#25D366] text-white font-black py-4 rounded-2xl hover:bg-[#128C7E] transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-2"
            >
            <i className="fab fa-whatsapp text-xl"></i> Commander via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;