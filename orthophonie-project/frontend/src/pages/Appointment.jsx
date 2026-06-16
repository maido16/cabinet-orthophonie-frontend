// src/pages/Appointment.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Optionnel pour le SEO

const API_BASE = 'http://localhost:8000/api/appointments';

const Appointment = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  
  // ✅ Modification 1 : Ajout des champs dans le state du formulaire
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motif: '',
    serviceType: '', // Nouveau champ
    bilanType: ''    // Nouveau champ (conditionnel)
  });

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // --- Listes des options (basées sur vos images) ---
  const serviceOptions = [
    "Bilan orthophonique",
    "Consultation orthophoniste",
    "Prévention et conseils en orthophonie"
  ];

  const bilanOptions = [
    "Bilan de langage écrit",
    "Bilan de langage oral",
    "Bilan logico-mathématique",
    "AUTRE"
  ];

  const fetchSlots = async (targetDate) => {
    if (!targetDate) return;
    try {
      setLoadingSlots(true);
      setError(null);
      setSlots([]);
      setSelectedSlotId('');

      const res = await fetch(`${API_BASE}/available-slots/${targetDate}/`);
      if (!res.ok) throw new Error("Impossible de charger les créneaux");

      const data = await res.json();
      setSlots(data.available_slots || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (e) => {
    const d = e.target.value;
    setDate(d);
    fetchSlots(d);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation simple
    if (!date || !selectedSlotId) {
      setError("Veuillez choisir une date et un créneau horaire.");
      return;
    }
    if (!form.serviceType) {
        setError("Veuillez sélectionner un type de rendez-vous.");
        return;
    }
    if (form.serviceType === "Bilan orthophonique" && !form.bilanType) {
        setError("Veuillez préciser le type de bilan.");
        return;
    }

    const chosenSlot = slots.find(s => String(s.id) === String(selectedSlotId));
    if (!chosenSlot) {
      setError("Créneau sélectionné invalide.");
      return;
    }

    // ✅ Modification 2 : Construction intelligente du motif
    // On combine les choix + le message du patient pour tout envoyer dans le champ 'motif' du backend
    let finalMotif = `[${form.serviceType}]`;
    if (form.serviceType === "Bilan orthophonique" && form.bilanType) {
        finalMotif += ` - [${form.bilanType}]`;
    }
    if (form.motif) {
        finalMotif += ` : ${form.motif}`;
    }

    const payload = {
      date: chosenSlot.date,
      heure: chosenSlot.start_time,
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      telephone: form.telephone,
      motif: finalMotif, // On envoie le motif combiné
    };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de la réservation.");
        return;
      }

      navigate('/confirm');
    } catch (err) {
      setError("Erreur réseau, veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <Helmet>
        <title>Prendre Rendez-vous | Cabinet Nassima Fetouh</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 mb-4">
          Prendre rendez-vous
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Remplissez le formulaire ci-dessous pour réserver votre créneau.
        </p>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-800 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-6">
          
          {/* --- SECTION 1 : CHOIX DU SERVICE (NOUVEAU) --- */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-6">
            <h3 className="text-blue-800 font-bold flex items-center gap-2">
                📂 Type de demande
            </h3>
            
            {/* Menu Déroulant 1 : Type de Service */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Objet du rendez-vous *
                </label>
                <select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white"
                    required
                >
                    <option value="">-- Sélectionnez une option --</option>
                    {serviceOptions.map((opt, index) => (
                        <option key={index} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            {/* Menu Déroulant 2 : Type de Bilan (Conditionnel) */}
            {form.serviceType === "Bilan orthophonique" && (
                <div className="animate-fade-in-up">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Précisez le type de bilan *
                    </label>
                    <select
                        name="bilanType"
                        value={form.bilanType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 bg-white"
                        required
                    >
                        <option value="">-- Sélectionnez le type de bilan --</option>
                        {bilanOptions.map((opt, index) => (
                            <option key={index} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            )}
          </div>

          {/* --- SECTION 2 : DATE ET CRÉNEAUX --- */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date souhaitée *
              </label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                required
              />
              {loadingSlots && (
                <p className="text-sm text-blue-600 mt-2 font-medium animate-pulse">Recherche des disponibilités...</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Créneau horaire *
              </label>
              <select
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 disabled:bg-gray-100"
                disabled={!date || loadingSlots || slots.length === 0}
                required
              >
                <option value="">
                  {date
                    ? (slots.length > 0 ? "Choisissez une heure" : "Aucun créneau ce jour-là")
                    : "Choisissez d'abord une date"}
                </option>
                {slots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {slot.start_time.substring(0,5)} – {slot.end_time.substring(0,5)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --- SECTION 3 : INFORMATIONS PATIENT --- */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-gray-800 font-bold mb-4">Informations personnelles</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                type="text"
                name="prenom"
                placeholder="Prénom *"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                value={form.prenom}
                onChange={handleInputChange}
                required
                />
                <input
                type="text"
                name="nom"
                placeholder="Nom *"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                value={form.nom}
                onChange={handleInputChange}
                required
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                type="email"
                name="email"
                placeholder="Email *"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                value={form.email}
                onChange={handleInputChange}
                required
                />
                <input
                type="tel"
                name="telephone"
                placeholder="Téléphone *"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                value={form.telephone}
                onChange={handleInputChange}
                required
                />
            </div>

            <textarea
                name="motif"
                placeholder="Message supplémentaire ou précisions (facultatif)"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                value={form.motif}
                onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
          >
            {submitting ? "⏳ Enregistrement..." : "✅ Confirmer le rendez-vous"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;