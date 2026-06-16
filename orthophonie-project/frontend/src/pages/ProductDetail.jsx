import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shopService } from '../services/shopService';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams(); // Récupère l'ID du produit dans l'URL
  const { addToCart } = useCart(); // 👈 On récupère la fonction magique
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await shopService.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error("Erreur de chargement du produit:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
    </div>
  );

  if (!product) return <div className="text-center py-20 text-xl font-bold">Produit introuvable.</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Fil d'Ariane (Breadcrumb) */}
        <div className="mb-8 flex items-center text-sm text-slate-500 font-medium">
          <Link to="/boutique" className="hover:text-blue-600 transition-colors">🎁 Boutique</Link>
          <span className="mx-3">/</span>
          <span className="text-slate-800">{product.name}</span>
        </div>

        {/* Layout Principal : Image à gauche, Infos à droite */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* IMAGE SECTION */}
          <div className="md:w-1/2 p-4">
            <div className="relative w-full h-[400px] md:h-full bg-gray-50 rounded-[2.5rem] overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              {product.is_expert_selection && (
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white">
                  <span className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                    <span>✨</span> Sélection de Nassima
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* INFOS SECTION */}
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category_name || "Outil Clinique"}
              </span>
              <span className="ml-3 text-slate-400 text-sm font-bold">Âge : {product.target_age}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="text-4xl font-black text-blue-600 mb-8">
              {product.price} <span className="text-lg text-blue-400">DH</span>
            </div>

            {/* L'Avis de l'Expert */}
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">N</div>
                <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-widest">L'avis de l'orthophoniste</h3>
              </div>
              <p className="text-indigo-800 italic font-medium leading-relaxed">
                "{product.nassima_note}"
              </p>
            </div>

            {/* Description Globale */}
            <h3 className="font-bold text-slate-800 mb-2">Description du produit :</h3>
            <p className="text-slate-600 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Logique de Stock : Si stock > 0 on affiche le bouton normal, sinon un bouton gris désactivé */}
            {product.stock > 0 ? (
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-amber-400 text-amber-900 font-black text-lg py-5 rounded-2xl hover:bg-amber-500 transition-all transform active:scale-95 shadow-xl shadow-amber-200 flex items-center justify-center gap-3"
              >
                <span>🛒</span> Ajouter au panier
              </button>
            ) : (
              <button 
                disabled
                className="w-full bg-gray-200 text-gray-500 font-black text-lg py-5 rounded-2xl cursor-not-allowed flex items-center justify-center gap-3"
              >
                <span>🚫</span> Rupture de stock
              </button>
            )}

            {/* Mise à jour du texte de disponibilité */}
            <p className={`text-center text-sm mt-4 font-medium flex items-center justify-center gap-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 
                ? <><span>✅</span> En stock ({product.stock} disponibles)</>
                : <><span>❌</span> Indisponible pour le moment</>
              }
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;