import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { orthophonieAIService } from '../services/orthophonieAIService';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // 🚀 AJOUTÉ : useLocation
import { useAuth } from '../context/AuthContext'; // 🚀 AJOUTÉ : useAuth

// =========================================================================
// COMPOSANTS ENFANTS (MÉMOÏSÉS POUR ÉVITER LES RE-RENDERS INUTILES)
// =========================================================================

const Step1Form = memo(({ onSubmit, loading, error, backendConnected, initialData }) => {
  // ✅ CORRIGÉ : On initialise le formulaire avec les données reçues (si elles existent)
  const [form, setForm] = useState({
    first_name: initialData?.first_name || '',
    age: initialData?.age || '',
    parent_email: initialData?.parent_email || ''
  });

  // ✅ AJOUTÉ : Si l'utilisateur ou l'enfant met du temps à charger en tâche de fond,
  // cet effet synchronise proprement les champs du formulaire dès que les données arrivent
  useEffect(() => {
    if (initialData) {
      setForm({
        first_name: initialData.first_name || '',
        age: initialData.age || '',
        parent_email: initialData.parent_email || ''
      });
    }
  }, [initialData]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🤖</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Test d'Orientation Orthophonie</h2>
        <p className="text-gray-600">Analysé par OrthophonieAI Engine - 100% Local</p>
        
        {!backendConnected && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ Serveur backend non connecté</p>
            <p className="text-red-600 text-sm">
              Lancez dans le terminal backend:<br/>
              <code className="bg-gray-100 px-2 py-1 rounded">python3 manage.py runserver</code>
            </p>
          </div>
        )}
      </div>
      
      <form onSubmit={handleLocalSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prénom de l'enfant</label>
          <input
            type="text" required
            value={form.first_name}
            onChange={(e) => setForm({...form, first_name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: Yassine"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Âge</label>
          <input
            type="number" min="0" max="18" required
            value={form.age}
            onChange={(e) => setForm({...form, age: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: 5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Votre email</label>
          <input
            type="email" required
            value={form.parent_email}
            onChange={(e) => setForm({...form, parent_email: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="votre@email.com"
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-bold shadow-lg hover:opacity-90 transition-opacity"
        >
          {loading ? 'Création du test...' : '🚀 Commencer le Test AI'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center">
          <span className="text-blue-600 mr-2">🤖</span>
          <p className="text-sm text-blue-800">
            Ce test utilise <strong>OrthophonieAI Engine</strong>, notre moteur AI spécialisé pour analyser les réponses et fournir des recommandations personnalisées.
          </p>
        </div>
      </div>
    </div>
  );
});

const Step2Questions = memo(({ question, currentIndex, totalQuestions, onAnswer, onPrev, progress, answeredCount, isAnalyzing }) => {
  if (!question) return null;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentIndex + 1} sur {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {question.category}
          </span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.text}</h2>
        
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswer(option.value)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 flex items-center"
            >
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-4 flex-shrink-0"></div>
              <span className="font-medium text-gray-900">{option.text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={`px-4 py-2 rounded-lg ${currentIndex === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          ← Précédent
        </button>
        <div className="text-gray-500">
          {answeredCount} / {totalQuestions} répondues
        </div>
      </div>

      {isAnalyzing && (
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div>
            <span className="text-green-700 font-medium">OrthophonieAI analyse les réponses...</span>
          </div>
          <p className="text-sm text-green-600 text-center mt-2">Notre moteur AI génère une analyse personnalisée</p>
        </div>
      )}
    </div>
  );
});

const Step3Results = memo(({ analysisData, childName, testId, onReset, onHome }) => {
  const analysis = analysisData?.analysis ? analysisData.analysis : analysisData;
  const recommendations = analysisData?.recommendations || [];
  
  if (!analysis) {
    return <div className="text-center py-20"><p className="text-gray-500 font-bold animate-pulse">Génération du rapport clinique...</p></div>;
  }

  const downloadPDF = () => {
    window.open(`http://localhost:8000/api/orientation/tests/${testId}/pdf/`, '_blank');
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="w-full pb-16 animate-fade-in">
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 h-[260px] rounded-b-[60px] flex flex-col items-center justify-center text-white relative">
        <h2 className="text-sm font-black tracking-[4px] uppercase opacity-70">Bilan Clinique AI</h2>
        <div className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-full mt-4 text-xs font-bold border border-white/30 shadow-inner">
          Précision : {analysis.metadata?.confidence_score || '98'}%
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-[90%] bg-white rounded-[35px] p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] -mt-24 relative z-10 border border-gray-50">
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Orientation Préconisée</p>
        <h2 className="text-blue-900 text-4xl md:text-5xl font-black mb-6 font-serif">
          {analysis.recommendation?.toUpperCase()}
        </h2>
        <div className="inline-flex items-center bg-blue-50 px-5 py-2 rounded-full text-blue-600 font-black text-sm">
           <span className="mr-2">🛡️</span> Analyse Certifiée
        </div>
      </div>
      
      <div className="mt-12 px-6 max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-[30px] p-8 shadow-xl border border-gray-50">
          <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
            <span>📊</span> Profil de Développement
          </h3>
          <div className="space-y-6">
            {Object.entries(analysis.scores || {}).map(([domain, score]) => (
              <div key={domain}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-600 capitalize">{domain}</span>
                  <span className="font-black text-lg" style={{ color: getScoreColor(score) }}>{score}/10</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${score * 10}%`, backgroundColor: getScoreColor(score) }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 rounded-[30px] p-8 shadow-sm border border-green-100">
          <h3 className="text-xl font-black text-green-900 mb-8 flex items-center gap-2">
            <span>🔍</span> Recommandations Experts
          </h3>
          <ul className="space-y-6">
            {analysis.conseils_parents?.map((conseil, index) => (
              <li key={index} className="flex items-start group">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center mr-4 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                  <span className="text-lg">✨</span>
                </div>
                <p className="text-green-900 font-medium leading-relaxed">{conseil}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-20 px-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/40 border border-slate-100 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center gap-6 mb-12 border-b border-slate-100 pb-8 relative z-10">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-3xl shadow-inner border border-amber-100">🎁</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-900 font-serif tracking-tight">La Sélection de Nassima</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Outils thérapeutiques recommandés pour <span className="text-blue-600 font-bold">{childName || "votre enfant"}</span>.</p>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
              {recommendations.map(product => (
                <div key={product.id} className="grid md:grid-cols-2 gap-10 bg-slate-50/60 backdrop-blur-sm border border-slate-100 p-8 rounded-[2.5rem] shadow-inner items-center">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative group bg-white">
                    <img src={product.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-2xl font-black text-slate-900 font-serif leading-tight">{product.name}</h4>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative">
                       <span className="absolute -top-3 -left-2 text-4xl text-blue-200 font-serif leading-none">"</span>
                       <p className="text-sm text-slate-600 font-medium leading-relaxed relative z-10 italic">
                         {product.nassima_note}
                       </p>
                    </div>
                    <Link 
                      to={`/boutique/${product.id}`} 
                      className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm"
                    >
                      DÉCOUVRIR L'OUTIL <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 mt-10 px-6 pb-12">
        <button 
          onClick={downloadPDF}
          className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-black text-sm md:text-md shadow-2xl shadow-blue-600/30 hover:bg-slate-900 hover:-translate-y-1 transition-all w-full sm:w-auto justify-center"
        >
          <span className="text-xl">📄</span>Générer le Rapport Officiel
        </button>
        <button 
          onClick={onReset}
          className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-md border border-blue-100 hover:bg-blue-50 transition-all w-full sm:w-auto justify-center shadow-sm hover:shadow-md"
        >
          <span className="text-xl">🔄</span>Refaire un Test
        </button>
        <button 
          onClick={onHome}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-md hover:bg-blue-600 transition-all w-full sm:w-auto justify-center shadow-xl hover:-translate-y-1"
        >
          <span className="text-xl">🏡</span>Accueil
        </button>
      </div>
    </div>
  );
});

// =========================================================================
// COMPOSANT PRINCIPAL (LOGIQUE D'ÉTAT GLOBALE)
// =========================================================================

const OrthophonieAITest = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 🚀 AJOUTÉ : Pour écouter les données de navigation
  const { user } = useAuth();     // 🚀 AJOUTÉ : Pour extraire l'email du parent connecté

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  
  const [testData, setTestData] = useState({
    testId: null,
    childProfile: null,
    answers: {},
    analysis: null
  });

  // 🚀 AJOUTÉ : Calcul de l'âge et structuration propre des données initiales
  const initialData = useMemo(() => {
    const selectedChild = location.state?.child;
    
    if (!selectedChild && !user) return null;

    let calculatedAge = '';
    if (selectedChild?.birth_date) {
      const birth = new Date(selectedChild.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      calculatedAge = age;
    }

    return {
      first_name: selectedChild?.first_name || '',
      age: calculatedAge,
      parent_email: user?.email || ''
    };
  }, [location.state, user]);

  // Check Backend
  useEffect(() => {
    orthophonieAIService.checkBackendHealth().then((isConnected) => {
      setBackendConnected(isConnected);
      if (!isConnected) {
        setError('Le serveur backend n\'est pas accessible.');
      }
    });
  }, []);

  // Load Questions for Step 2
  useEffect(() => {
    if (step === 2 && questions.length === 0) {
      orthophonieAIService.getQuestions()
        .then(setQuestions)
        .catch(() => setError('Erreur lors du chargement des questions'));
    }
  }, [step, questions.length]);

  const handleStartForm = useCallback(async (formData) => {
    if (!backendConnected) {
      setError("Le serveur n'est pas prêt."); return;
    }
    setLoading(true); setError(null);
    try {
      const result = await orthophonieAIService.createTest(formData);
      setTestData(prev => ({ ...prev, testId: result.test_id, childProfile: result.child }));
      setStep(2);
    } catch (err) {
      setError(err.message || 'Erreur création test');
    } finally {
      setLoading(false);
    }
  }, [backendConnected]);

  const handleAnswerSubmit = useCallback(async (value) => {
    const questionId = questions[currentIndex]?.id?.toString();
    if (!questionId) return;

    const newAnswers = { ...testData.answers, [questionId]: value };
    setTestData(prev => ({ ...prev, answers: newAnswers }));

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setAiAnalyzing(true); setError(null);
      try {
        const result = await orthophonieAIService.submitTest(testData.testId, newAnswers);
        setTestData(prev => ({ ...prev, analysis: result })); 
        setStep(3);
      } catch (err) {
        setError(err.message || 'Erreur AI');
      } finally {
        setAiAnalyzing(false);
      }
    }
  }, [currentIndex, questions, testData]);

  const handlePrevQuestion = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setStep(1); setCurrentIndex(0); setQuestions([]);
    setTestData({ testId: null, childProfile: null, answers: {}, analysis: null });
  }, []);

  const handleHome = useCallback(() => navigate('/'), [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header avec logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white">🤖</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">OrthophonieAI</h1>
          </div>
          <div className="text-sm text-gray-600">
            Étape {step} sur 3 • {backendConnected ? '✅ Connecté' : '❌ Déconnecté'}
          </div>
        </div>

        {/* Conteneur Dynamique */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${step !== 3 ? 'p-6 md:p-8' : ''}`}>
          {step === 1 && (
            <Step1Form 
              onSubmit={handleStartForm} 
              loading={loading} 
              error={error} 
              backendConnected={backendConnected} 
              initialData={initialData} // 🚀 TRANSMIS ICI
            />
          )}
          {step === 2 && questions.length === 0 && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}
          {step === 2 && questions.length > 0 && (
            <Step2Questions 
              question={questions[currentIndex]} 
              currentIndex={currentIndex} 
              totalQuestions={questions.length} 
              onAnswer={handleAnswerSubmit} 
              onPrev={handlePrevQuestion}
              progress={((currentIndex + 1) / questions.length) * 100}
              answeredCount={Object.keys(testData.answers).length}
              isAnalyzing={aiAnalyzing}
            />
          )}
          {step === 3 && (
            <Step3Results 
              analysisData={testData.analysis} 
              childName={testData.childProfile?.first_name} 
              testId={testData.testId}
              onReset={handleReset}
              onHome={handleHome}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Cabinet d'Orthophonie • OrthophonieAI Engine v1.0</p>
          <p className="mt-2">Système AI local pour l'orientation orthophonique</p>
        </div>
      </div>
    </div>
  );
};

export default OrthophonieAITest;