// frontend/src/pages/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../services/blogService';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await blogService.getPostById(id);
        setPost(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  
  if (!post) return <div className="text-center py-20">Article introuvable 😕 <br/><Link to="/blog" className="text-blue-600">Retour</Link></div>;

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      {/* Hero Image - Inchangée */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        {post.image_url ? (
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-6xl">📚</span></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-4xl">
           <div className="flex gap-3 mb-4">
             <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">{post.category}</span>
             {post.source_name && (
               <span className="bg-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">🌍 {post.source_name}</span>
             )}
           </div>
           <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight font-serif">{post.title}</h1>
           <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest bg-black/30 p-3 rounded-xl backdrop-blur-md inline-flex">
             <span>✍️ {post.author || post.source_name}</span>
             <span>📅 {new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
             <span>⏱️ {post.read_time || '4 min'}</span>
           </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-16 leading-relaxed">
        {/* Fil d'Ariane épuré */}
        <div className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-900 truncate max-w-[200px]">{post.title}</span>
        </div>

        {/* --- LE CONTENU HTML NETTOYÉ --- */}
        <div 
          className="prose prose-lg md:prose-xl prose-slate max-w-none 
                    prose-headings:font-black prose-headings:font-serif prose-headings:text-slate-900
                    prose-p:text-slate-600 prose-p:leading-extra-relaxed
                    prose-strong:text-slate-900 prose-strong:font-black
                    prose-a:text-blue-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-[2rem] prose-img:shadow-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* Bouton de retour élégant */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center">
          <Link to="/blog" className="bg-slate-100 text-slate-600 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
            ← Retour aux articles
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;