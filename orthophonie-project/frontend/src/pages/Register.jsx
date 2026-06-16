import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
// 🚀 On importe directement les services pour contourner le bug du Context
import { register as apiRegister } from '../services/authService';

export default function Register() {
  const { login } = useAuth(); // On récupère login pour la connexion automatique
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    role: 'parent',
    first_name: '',
    last_name: '',
    phone: '',
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
  
    if (formData.password !== formData.password_confirm) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    try {
      // 1. Création du compte en direct (Bypasse le bug de AuthContext)
      await apiRegister(formData);

      // 2. Connexion automatique immédiate avec les mêmes identifiants
      await login(formData.email, formData.password); 
      
      // 3. Redirection directe vers la page d'accueil
      navigate('/'); 
      
    } catch (err) {
      setError("Erreur lors de l'inscription. Cet email est peut-être déjà utilisé.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
        
        {error && <p className="text-red-600 mb-4 font-medium text-center bg-red-50 p-2 rounded">{error}</p>}
        
        {/* PRÉNOM */}
        <div className="mb-4">
          <label className="block text-gray-700">Prénom</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* NOM DE FAMILLE */}
        <div className="mb-4">
          <label className="block text-gray-700">Nom de famille</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

        {/* MOT DE PASSE */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        {/* CONFIRMATION */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Confirmer le mot de passe</label>
          <input
            type="password" 
            name="password_confirm"
            value={formData.password_confirm}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        {/* RÔLE */}
        <div className="mb-4">
          <label className="block text-gray-700">Vous êtes</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="parent">Parent</option>
            <option value="praticien">Praticien</option>
          </select>
        </div>

        {/* TÉLÉPHONE */}
        <div className="mb-6">
          <label className="block text-gray-700">Téléphone (optionnel)</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold shadow-md hover:bg-green-700 transition-colors">
          Créer mon compte
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Déjà un compte ? <Link to="/login" className="text-blue-600 font-bold hover:underline">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}