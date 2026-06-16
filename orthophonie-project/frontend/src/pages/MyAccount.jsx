import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
// 👇 On a bien ajouté updateChild ici
import { getChildren, createChild, deleteChild, updateChild } from '../services/childService';
// 👇 On a bien ajouté Edit2, X, Save ici
import { PlusCircle, Trash2, Calendar, Users, CheckCircle2, AlertCircle, FileText, TrendingUp, ArrowRight, Edit2, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import ChildTestHistory from '../components/ChildTestHistory';

export default function MyAccount() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [tests, setTests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ first_name: '', last_name: '', birth_date: '', gender: 'F', notes: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ==========================================
  // 👇 C'EST CE BLOC LÀ QUI TE MANQUAIT 👇
  // ==========================================
  const [editingChildId, setEditingChildId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEditing = (child) => {
    setEditingChildId(child.id);
    setEditForm({
      first_name: child.first_name,
      last_name: child.last_name,
      birth_date: child.birth_date,
      gender: child.gender,
      notes: child.notes || ''
    });
  };

  const cancelEditing = () => {
    setEditingChildId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (childId) => {
    try {
      await updateChild(childId, editForm);
      setSuccess('Profil mis à jour avec succès !');
      setEditingChildId(null);
      fetchData(); // On recharge les données pour afficher le nouveau prénom
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil.');
    }
  };
  // ==========================================
  // 👆 FIN DU BLOC MANQUANT 👆
  // ==========================================

  const fetchData = async () => {
    try {
      const childrenData = await getChildren();
      setChildren(childrenData);

      const testsResponse = await api.get('/orientation/tests/');
      const completedTests = testsResponse.data.filter(t => t.completed === true);
      setTests(completedTests);
    } catch (err) {
      setError('Impossible de charger les données du compte.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await createChild(form);
      setSuccess('Profil ajouté avec succès !');
      setForm({ first_name: '', last_name: '', birth_date: '', gender: 'F', notes: '' });
      fetchData();
    } catch (err) { setError("Erreur lors de l'enregistrement."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce profil définitif ? Tous les tests associés seront perdus.')) return;
    try {
      await deleteChild(id);
      setSuccess('Profil supprimé.');
      fetchData();
    } catch (err) { setError('Erreur de suppression.'); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-[0.3em]">Espace Premium Parent</span>
            <h1 className="text-4xl font-serif italic text-slate-900 mt-2">
              Bonjour, {user?.first_name || user?.email?.split('@')[0]}
            </h1>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        {(success || error) && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-fade-in ${
            success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <p className="text-sm font-bold">{success || error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10 items-start">
          
          {/* LISTE DES ENFANTS */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <Users size={16} /> Famille ({children.length})
            </h2>

            {children.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
                <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">Aucun profil enregistré pour le moment.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {children.map((child) => {
                  return (
                    <div key={child.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
                      
                      {/* === MODE ÉDITION VS MODE LECTURE === */}
                      {editingChildId === child.id ? (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-blue-100 mb-6 animate-fade-in">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-blue-800">Modifier le profil</h4>
                            <button onClick={cancelEditing} className="text-slate-400 hover:text-slate-600 transition-colors">
                              <X size={18}/>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <input name="first_name" value={editForm.first_name} onChange={handleEditChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Prénom" />
                            <input name="last_name" value={editForm.last_name} onChange={handleEditChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nom" />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <input type="date" name="birth_date" value={editForm.birth_date} onChange={handleEditChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            <select name="gender" value={editForm.gender} onChange={handleEditChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all">
                              <option value="F">Fille</option>
                              <option value="M">Garçon</option>
                            </select>
                          </div>
                          
                          <div className="flex justify-end gap-3 mt-6">
                            <button onClick={cancelEditing} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all uppercase tracking-wider">
                              Annuler
                            </button>
                            <button onClick={() => handleEditSubmit(child.id)} className="px-5 py-2.5 flex items-center gap-2 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 uppercase tracking-wider active:scale-95">
                              <Save size={14} /> Enregistrer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
                              child.gender === 'M' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'
                            }`}>
                              {child.first_name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-800">{child.first_name} {child.last_name}</h3>
                              <div className="flex items-center gap-2 mt-1 text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                                <Calendar size={13} className="text-emerald-500" /> 
                                {new Date(child.birth_date).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                          
                          {/* Boutons d'action (Modifier & Supprimer) */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button onClick={() => startEditing(child)} className="p-2.5 hover:bg-blue-50 rounded-full text-blue-400 hover:text-blue-600 transition-colors" title="Modifier le profil">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(child.id)} className="p-2.5 hover:bg-red-50 rounded-full text-red-400 hover:text-red-600 transition-colors" title="Supprimer le profil">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 📈 SECTION SUIVI ET HISTORIQUE */}
                      <div className="mt-6 pt-6 border-t border-slate-50">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <TrendingUp size={14} className="text-blue-500" /> Suivi de l'évolution & Rapports AI
                        </h4>

                        {/* COMPOSANT HISTORIQUE */}
                        <ChildTestHistory childId={child.id} childName={child.first_name} />
                      </div>

                      {/* Bouton pour lancer un nouveau test */}
                      <button 
                        onClick={() => navigate('/test', { state: { child: child } })} 
                        className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-lg shadow-slate-100 flex justify-center items-center gap-2"
                      >
                        ⚡ Lancer un nouveau test IA
                      </button>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FORMULAIRE DROITE (AJOUT ENFANT) */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/40 lg:sticky lg:top-32 border border-white/50">
             <h2 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                <PlusCircle className="text-emerald-500" /> Ajouter un profil
             </h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                <input name="first_name" placeholder="Prénom" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none" onChange={handleChange} value={form.first_name} required />
                <input name="last_name" placeholder="Nom" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-emerald-500/10 transition-all outline-none" onChange={handleChange} value={form.last_name} required />
                <input type="date" name="birth_date" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none text-sm text-slate-500 outline-none" onChange={handleChange} value={form.birth_date} required />
                
                <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                  <button type="button" onClick={() => setForm({...form, gender: 'M'})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${form.gender === 'M' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>Garçon</button>
                  <button type="button" onClick={() => setForm({...form, gender: 'F'})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${form.gender === 'F' ? 'bg-white shadow-sm text-pink-600' : 'text-slate-400'}`}>Fille</button>
                </div>

                <button type="submit" className="w-full mt-4 py-5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                  Enregistrer l'enfant
                </button>
             </form>
          </div>

        </div>
      </div>
    </div>
  );
}