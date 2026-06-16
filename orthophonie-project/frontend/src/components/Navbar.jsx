import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, User, UserCircle2 } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/boutique' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/90 backdrop-blur-md border-b border-slate-50">
      <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="shrink-0 transition-transform hover:scale-105">
          <Logo className="h-9 w-auto" />
        </Link>

        {/* NAVIGATION CENTRALE */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${
                location.pathname === link.path ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ESPACE PERSONNEL PROFESSIONNEL */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
  <div className="flex items-center gap-3 pl-8 border-l border-slate-200">
    
    {/* BOUTON ESPACE PARENT : Finitions "Premium SaaS" */}
    <Link 
      to="/account" 
      className="group flex items-center gap-2.5 bg-slate-900 text-white px-6 py-2.5 rounded-full shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-[1px] hover:shadow-xl transition-all duration-300 active:scale-95 border border-slate-800"
    >
      <User 
        size={14} 
        strokeWidth={2.5} 
        className="text-slate-300 group-hover:text-white transition-colors" 
      />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-[1px]">
        Espace Parent
      </span>
    </Link>

    {/* BOUTON DÉCONNEXION : Discret et ergonomique */}
    <button 
      onClick={logout} 
      className="p-2.5 ml-2 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
      title="Déconnexion"
    >
      <LogOut size={16} strokeWidth={2} />
    </button>
    
  </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest">
                Connexion
              </Link>
              <Link to="/register" className="bg-slate-900 text-white px-7 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}