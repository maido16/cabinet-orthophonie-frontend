import React, { useState, useEffect } from 'react';
import { Download, Activity, Calendar, ChevronRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../services/api';

const ChildTestHistory = ({ childId, childName }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/orientation/tests/by-name/?name=${encodeURIComponent(childName)}`);
        setTests(response.data);
      } catch (error) {
        console.error("Erreur API:", error);
      } finally {
        setLoading(false);
      }
    };

    if (childName) {
      fetchHistory();
    }
  }, [childName]);

  const handleDownloadPdf = (testId) => {
    window.open(`http://localhost:8000/api/orientation/tests/${testId}/pdf/`, '_blank');
  };

  const getRecommendationStyle = (recommendation) => {
    switch (recommendation?.toLowerCase()) {
      case 'orthophonie': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'psychomotricite': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mixte': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'surveillance': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-500 animate-pulse border border-gray-100">Chargement des données AI...</div>;
  }

  if (tests.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-500 italic border border-gray-100">
        Aucun test passé pour {childName}. Les rapports apparaîtront ici après analyse.
      </div>
    );
  }

  const latestTest = tests[0];
  const aiAnalysis = latestTest.ai_analysis;

  const chartData = [
    { subject: 'Langage', A: aiAnalysis?.scores?.langage || 0, fullMark: 10 },
    { subject: 'Motricité', A: aiAnalysis?.scores?.motricite || 0, fullMark: 10 },
    { subject: 'Social', A: aiAnalysis?.scores?.social || 0, fullMark: 10 },
    { subject: 'Attention', A: aiAnalysis?.scores?.attention || 0, fullMark: 10 },
  ];

  return (
    <>
      <div className="mb-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity size={16} className="text-[#1e3a8a]" />
                Dernier Bilan IA
              </h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar size={12} />
                {new Date(latestTest.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRecommendationStyle(aiAnalysis?.recommendation)}`}>
              {aiAnalysis?.recommendation?.toUpperCase() || 'ANALYSE TERMINÉE'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 h-48 bg-gray-50 rounded-lg p-2 flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1 text-center">
                Niveau de difficulté
              </span>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                    <Tooltip wrapperStyle={{ fontSize: '12px' }} />
                    <Radar name="Score" dataKey="A" stroke="#1e3a8a" fill="#3b82f6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-800 mb-2">Synthèse :</p>
                <ul className="space-y-2">
                  {(aiAnalysis?.observations || []).slice(0, 2).map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                      <ChevronRight size={14} className="text-[#2563eb] shrink-0 mt-0.5" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleDownloadPdf(latestTest.id)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <Download size={16} />
                Télécharger le rapport PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {tests.length > 1 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Historique précédent</p>
          <div className="space-y-2">
            {tests.slice(1).map((test) => (
              <div
                key={test.id}
                onClick={() => handleDownloadPdf(test.id)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200">
                    <Calendar size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Test du {new Date(test.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">Orientation : {test.ai_analysis?.recommendation}</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400 group-hover:text-[#2563eb] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ChildTestHistory;