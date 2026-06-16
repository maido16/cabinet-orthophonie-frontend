import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SuperAdmin = () => {
  const [stats, setStats] = useState({
    tests: 12,
    rdv: 8,
    users: 45,
    blogViews: 156
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🩺 SUPER ADMIN - Contrôle Total
          </h1>
          <p className="text-xl text-gray-600">Cabinet Orthophonie Nassima - Marrakech</p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all">
            <div className="text-4xl mb-2">📊 {stats.tests}</div>
            <div className="text-gray-600 font-bold">Tests AI</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all">
            <div className="text-4xl mb-2">📅 {stats.rdv}</div>
            <div className="text-gray-600 font-bold">RDV Confirmés</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all">
            <div className="text-4xl mb-2">👥 {stats.users}</div>
            <div className="text-gray-600 font-bold">Visiteurs</div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all">
            <div className="text-4xl mb-2">📖 {stats.blogViews}</div>
            <div className="text-gray-600 font-bold">Vues Blog</div>
          </div>
        </div>

        {/* Menu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Colonne 1 */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">🧪 TESTS ORTHOPHONIE</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/admin/tests" className="p-6 bg-white/20 rounded-2xl backdrop-blur hover:bg-white/30 transition-all">
                  📋 Voir tous les résultats
                </Link>
                <Link to="/admin/tests/export" className="p-6 bg-white/20 rounded-2xl backdrop-blur hover:bg-white/30 transition-all">
                  📥 Exporter CSV
                </Link>
                <Link to="/admin/stats/tests" className="p-6 bg-white/20 rounded-2xl backdrop-blur hover:bg-white/30 transition-all">
                  📈 Statistiques
                </Link>
                <Link to="/admin/alerts" className="p-6 bg-red-500/20 rounded-2xl backdrop-blur hover:bg-red-500/30 transition-all">
                  🚨 Cas urgents (3)
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">📅 RENDEZ-VOUS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/admin/rdv" className="p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  📋 Liste RDV
                </Link>
                <Link to="/admin/calendar" className="p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  🗓️ Planning
                </Link>
                <Link to="/admin/reminders" className="p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  ⏰ Rappels
                </Link>
              </div>
            </div>
          </div>

          {/* Colonne 2 */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">📝 GESTION CONTENU</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/admin/blog" className="p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  ✏️ Articles Blog
                </Link>
                <Link to="/admin/pages" className="p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  📄 Pages site
                </Link>
                <Link to="/admin/media" className="p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  🖼️ Médias
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">⚙️ PARAMÈTRES</h2>
              <div className="space-y-4">
                <Link to="/admin/users" className="block p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  👥 Gestion Users
                </Link>
                <Link to="/admin/settings" className="block p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  ⚙️ Configuration
                </Link>
                <Link to="/admin/analytics" className="block p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  📊 Google Analytics
                </Link>
                <a href="/admin/backup" className="block p-6 bg-white/20 rounded-2xl hover:bg-white/30 transition-all">
                  💾 Sauvegarde
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center p-8 bg-white rounded-3xl shadow-xl">
          <button className="px-12 py-4 bg-red-600 text-white rounded-2xl font-bold text-xl hover:bg-red-700 transition-all shadow-xl">
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
