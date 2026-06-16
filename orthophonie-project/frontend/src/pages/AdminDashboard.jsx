import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cabinetData } from '../data/constants';

const AdminDashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // Simulation de données (remplace par ta vraie base de données)
  useEffect(() => {
    // Simuler un appel API
    const mockTests = [
      {
        id: 1,
        name: 'Yassine B.',
        age: 5,
        score: 78,
        level: 'Bien',
        date: '2025-12-30 14:23',
        phone: '+212 6 12 34 56 78',
        categories: { articulation: 85, vocabulaire: 70, comprehension: 80, memoire: 65 },
        answers: [
          { question: 'Identifiez le son /r/', correct: false },
          { question: 'Nommez 3 animaux', correct: true }
        ]
      },
      {
        id: 2,
        name: 'Amina L.',
        age: 7,
        score: 42,
        level: 'À surveiller',
        date: '2025-12-30 15:10',
        phone: '+212 6 98 76 54 32',
        categories: { articulation: 50, vocabulaire: 40, comprehension: 45, memoire: 35 },
        answers: [
          { question: 'Répétez: maison', correct: true },
          { question: 'Comptez jusqu’à 10', correct: false }
        ]
      },
      {
        id: 3,
        name: 'Omar K.',
        age: 4,
        score: 25,
        level: 'Consultation urgente',
        date: '2025-12-30 16:45',
        phone: '+212 6 55 44 33 22',
        categories: { articulation: 20, vocabulaire: 30, comprehension: 25, memoire: 20 },
        answers: [
          { question: 'Dites bonjour', correct: false },
          { question: 'Montrez le nez', correct: false }
        ]
      }
    ];
    
    setTests(mockTests);
    setLoading(false);
  }, []);

  const filteredTests = tests.filter(test => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return test.level === 'Consultation urgente';
    if (filter === 'high') return test.level === 'À surveiller';
    return test.level === filter;
  });

  const exportToCSV = () => {
    const csv = [
      ['ID', 'Nom', 'Âge', 'Score', 'Niveau', 'Date', 'Téléphone'],
      ...tests.map(t => [t.id, t.name, t.age, t.score, t.level, t.date, t.phone])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tests-orthophonie-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Admin */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🩺 Admin - Résultats Tests Orthophonie</h1>
              <p className="text-gray-600 mt-1">{tests.length} tests analysés aujourd'hui</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg"
              >
                📊 Exporter CSV
              </button>
              <Link
                to="/"
                className="px-6 py-2 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all shadow-lg"
              >
                ← Accueil Public
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filtres */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filtres</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'all', label: 'Tous', color: 'gray' },
              { value: 'excellent', label: 'Excellent', color: 'green' },
              { value: 'bien', label: 'Bien', color: 'blue' },
              { value: 'high', label: 'À surveiller', color: 'orange' },
              { value: 'urgent', label: 'URGENT', color: 'red' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  filter === f.value
                    ? `bg-${f.color}-600 text-white shadow-lg`
                    : `bg-${f.color}-100 text-${f.color}-800 hover:bg-${f.color}-200`
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau des résultats */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
              <p>Chargement des résultats...</p>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              Aucun résultat pour ce filtre
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <tr>
                    <th className="p-6 text-left font-bold">Patient</th>
                    <th className="p-6 text-left font-bold">Score</th>
                    <th className="p-6 text-left font-bold">Niveau</th>
                    <th className="p-6 text-left font-bold">Date</th>
                    <th className="p-6 text-left font-bold">Téléphone</th>
                    <th className="p-6 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6 font-semibold text-gray-900">
                        <div>{test.name}</div>
                        <div className="text-sm text-gray-500">{test.age} ans</div>
                      </td>
                      <td className="p-6">
                        <div className="w-24 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                          {test.score}%
                        </div>
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          test.level === 'Consultation urgente' ? 'bg-red-100 text-red-800' :
                          test.level === 'À surveiller' ? 'bg-orange-100 text-orange-800' :
                          test.level === 'Bien' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {test.level}
                        </span>
                      </td>
                      <td className="p-6 text-sm text-gray-600">{test.date}</td>
                      <td className="p-6">
                        <a href={`tel:${test.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {test.phone}
                        </a>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all">
                            👁️ Détails
                          </button>
                          <a href={`https://wa.me/${test.phone.replace('+', '')}`} 
                             className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all"
                             target="_blank" rel="noopener noreferrer">
                            💬 WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistiques rapides */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-blue-600">{tests.length}</div>
            <div className="text-gray-600">Tests totaux</div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-green-600">
              {tests.filter(t => t.score >= 80).length}
            </div>
            <div className="text-gray-600">Excellent</div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-orange-600">
              {tests.filter(t => t.score < 50).length}
            </div>
            <div className="text-gray-600">À suivre</div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-red-600">
              {tests.filter(t => t.level === 'Consultation urgente').length}
            </div>
            <div className="text-gray-600">URGENT</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
