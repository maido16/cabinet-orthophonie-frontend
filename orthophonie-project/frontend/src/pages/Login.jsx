import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Ajout pour le côté premium

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white p-10">
        
        <header className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Portail Sécurisé
          </span>
          <h1 className="text-4xl font-serif text-slate-800 mb-3 italic">Bienvenue</h1>
          <p className="text-slate-400 text-sm font-light leading-relaxed">
            Connectez-vous à l'espace parent du <br/>
            <span className="font-medium text-slate-600">Cabinet d'Orthophonie</span>
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Adresse Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white focus:ring-0 transition-all duration-300 text-slate-700 placeholder:text-slate-300 shadow-sm"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Mot de passe
              </label>
              <a href="#" className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Oublié ?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white focus:ring-0 transition-all duration-300 text-slate-700 shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 hover:bg-emerald-800 text-white rounded-2xl font-semibold shadow-xl shadow-slate-200 transition-all duration-300 active:scale-[0.98] mt-4 flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Connexion en cours...</span>
              </span>
            ) : (
              <span>Se connecter</span>
            )}
          </button>
        </form>

        <footer className="mt-10 text-center border-t border-slate-50 pt-8">
          <p className="text-slate-400 text-sm">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors ml-1">
              Créer un accès
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}