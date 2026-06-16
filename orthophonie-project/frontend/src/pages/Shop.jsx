import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shopService } from '../services/shopService';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' par défaut
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // On charge les produits ET les catégories en parallèle
        const [productsData, categoriesData] = await Promise.all([
          shopService.getProducts(),
          shopService.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur boutique:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Logique de filtrage
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* --- HERO SECTION --- */}
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">La Sélection de Nassima</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4">
            Des outils pour <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">grandir</span>
          </h1>
          <p className="text-slate-500 mt-6 max-w-xl mx-auto italic">
            "En tant qu'orthophoniste, j'ai sélectionné ces outils pour leur efficacité thérapeutique et leur côté ludique."
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* --- BARRE DE FILTRES --- */}
        {!loading && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-slate-500 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              Tous les outils
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-slate-500 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* --- GRILLE DES PRODUITS --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className={`bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-blue-100 flex flex-col ${product.stock === 0 ? 'opacity-80' : ''}`}>
                
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-gray-100">
                  <img src={product.image_url} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${product.stock > 0 ? 'group-hover:scale-105' : 'grayscale'}`} />
                  
                  {/* Badge Sélection Expert */}
                  {product.is_expert_selection && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                      <span className="text-[10px] font-black text-blue-700">SÉLECTION NASSIMA ✨</span>
                    </div>
                  )}

                  {/* Badge Rupture de Stock */}
                  {product.stock === 0 && (
                    <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur px-3 py-1 rounded-full shadow-sm z-10 border border-red-400">
                      <span className="text-[10px] font-black text-white uppercase">Épuisé</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">{product.name}</h2>
                    <span className="text-xl font-black text-blue-900 whitespace-nowrap">{product.price} DH</span>
                  </div>
                  
                  <p className="text-xs text-slate-400 mb-4 font-bold">🎯 Objectif : {product.target_age}</p>

                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 mb-6">
                    <p className="text-xs italic text-blue-800 leading-relaxed line-clamp-3">
                      "{product.nassima_note}"
                    </p>
                  </div>

                  {/* Bouton Dynamique selon le stock */}
                  <Link 
                    to={`/boutique/${product.id}`}
                    className={`w-full mt-auto text-center font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg block ${
                      product.stock > 0 
                        ? 'bg-slate-900 text-white hover:bg-blue-600' 
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                  >
                    {product.stock > 0 ? "Détails du produit" : "Voir (Indisponible)"}
                  </Link>
                </div>

              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 font-medium">
                Aucun outil ne correspond à cette catégorie pour le moment.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;