// frontend/src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Erreur chargement blog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* --- HEADER --- */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 text-center relative shadow-lg">
        
        {/* Bouton Retour Accueil */}
        <div className="absolute top-6 left-6">
            <Link to="/" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur-sm transition-all text-sm font-bold shadow-sm hover:scale-105">
                <span>🏠</span> 
                <span className="hidden sm:inline">Retour à l'accueil</span>
            </Link>
        </div>

        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">📚 Le Blog & Veille Orthophonique</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto px-4">
          Nos articles experts et une sélection des meilleures ressources du web pour vous accompagner.
        </p>
      </div>

      {/* --- LISTE DES ARTICLES --- */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {[...posts].sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).map((post) => (
              <div key={post.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group border border-gray-100">
                
                {/* Image */}
                <div className="h-52 overflow-hidden relative">
                  {post.image_url ? (
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"/>
                  ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">📰</div>
                  )}
                  
                  {/* Badges */}
                  <span className="absolute top-4 left-4 bg-white/95 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {post.category}
                  </span>
                  {post.is_external && (
                    <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      🌍 Web
                    </span>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                    <span>📅 {new Date(post.published_at).toLocaleDateString()}</span>
                    <span className="font-medium">{post.source_name || "Cabinet"}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                    {post.description}
                  </p>

                  {/* BOUTONS D'ACTION (Restaurés !) */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link 
                    to={`/blog/${post.id}`} 
                    className="block w-full text-center bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all transform active:scale-95"
                    >
                    {post.is_external ? `Lire l'article de ${post.source_name} →` : "En savoir plus →"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;