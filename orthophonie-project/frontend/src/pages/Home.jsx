import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cabinetData } from '../data/constants';
import { blogService } from '../services/blogService';
import { Helmet } from 'react-helmet-async';
import Logo from '../components/Logo';
import axios from 'axios';





const Home = () => {
  // --- 1. HOOKS ET STATES ---
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('orthophonie');
  const [email, setEmail] = useState(''); 
  const [loading, setLoading] = useState(false); 
  // 👇 AJOUTE CETTE LIGNE 👇
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [dbPosts, setDbPosts] = useState([]);
  // États pour le formulaire de contact "Conciergerie"
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false)


  // 👇 AJOUTE TOUT CE BLOC ICI 👇
  
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerDuration = 8000; // 8 secondes par onglet
 // --- 2. CHARGEMENT DU BLOG ---


;



// Timer pour la barre de progression et le changement d'onglet
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveTab((current) => current === 'orthophonie' ? 'psychomotricite' : 'orthophonie');
            return 0;
          }
          return prev + 1.25; 
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPaused, activeTab]);

  // Fonction pour changer d'onglet manuellement
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setProgress(0);
  };

  // --- 3. CHARGEMENT DU BLOG (DANS SON PROPRE EFFECT) ---
  useEffect(() => {
    const fetchRealPosts = async () => {
      try {
        const data = await blogService.getAllPosts();
        setDbPosts(data);
      } catch (error) {
        console.error("Erreur chargement liens blog", error);
      }
    };
    fetchRealPosts();
  }, []); // [] signifie que ça ne s'exécute qu'une fois au chargement

  const getLinkByKeyword = (keyword) => {
      const foundPost = dbPosts.find(post => post.title.toLowerCase().includes(keyword.toLowerCase()));
      return foundPost ? `/blog/${foundPost.id}` : '/blog';
  };

  const whatsappMessage = "Bonjour Nassima, je souhaite des informations sur la télé-orthophonie.";
  const whatsappUrl = `https://wa.me/${cabinetData.telephone.replace('+', '').trim()}?text=${encodeURIComponent(whatsappMessage)}`;

  // --- DONNÉES SERVICES ---
  const servicesOrthophonie = [
    { 
      image: '/services/blog1.webp',
      title: "Articulation & Parole", 
      description: "Rééducation précise des troubles articulatoires, efficace en visio-consultation.", 
      category: 'orthophonie',
      delay: 0.1,
      keyword: "Articulation"
    },
    { 
      image: '/services/blog2.jpg',
      title: "Bégaiement", 
      description: "Thérapies cognitivo-comportementales adaptées au suivi à distance.", 
      category: 'orthophonie',
      delay: 0.2,
      keyword: "Bégaiement"
    },
    { 
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop', 
      title: "Apprentissage (Dys)", 
      description: "Accompagnement expert pour la dyslexie et dysorthographie avec supports numériques.", 
      category: 'orthophonie',
      delay: 0.3,
      keyword: "Apprentissage"
    },
    { 
      image: '/services/blog4.webp', 
      title: "Retard de Langage", 
      description: "Guidance parentale et stimulation du langage oral via télé-soin.", 
      category: 'orthophonie',
      delay: 0.4,
      keyword: "Retard"
    }
  ];

  const servicesPsychomotricite = [
    { 
      image: '/services/blog5.webp',
      title: "Développement Moteur", 
      description: "Conseils en psychomotricité pour harmoniser le développement de l'enfant.", 
      category: 'psychomotricite',
      delay: 0.1,
      keyword: "Psychomotricité"
    },
    { 
      image: '/services/blog6.webp', 
      title: "Graphomotricité", 
      description: "Rééducation de l'écriture : exercices pratiques à reproduire à la maison.", 
      category: 'psychomotricite',
      delay: 0.2,
      keyword: "Graphomotricité"
    },
    { 
      image: '/services/blog7.webp',    
      title: "Troubles de l'Attention", 
      description: "Stratégies TDAH : Organisation et concentration pour l'école et la maison.", 
      category: 'psychomotricite',
      delay: 0.3,
      keyword: "Attention"
    },
    { 
      image: '/services/blog8.jpg', 
      title: "Gestion Émotionnelle", 
      description: "Outils de relaxation et gestion du stress pour enfants et adultes.", 
      category: 'psychomotricite',
      delay: 0.4,
      keyword: "Émotionnelle"
    }
  ];

  // --- 4. LOGIQUE DE FILTRE ---
  const filteredServices = activeTab === 'orthophonie' ? servicesOrthophonie : servicesPsychomotricite;

const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/blog/newsletter/', { email });
      // 👇 MODIFIE CES LIGNES : On enlève l'alert() et le navigate()
      setIsSubscribed(true); 
    } catch (error) {
      console.error("Erreur inscription:", error);
      alert("Une erreur est survenue ou cet email est déjà inscrit.");
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    { name: "Sophie M. (Paris)", text: "J'étais sceptique sur l'orthophonie en ligne, mais Nassima est incroyable. Mon fils a fait des progrès énormes sans que nous ayons à nous déplacer." },
    { name: "Famille Bensouda", text: "Un cabinet très professionnel. Les outils numériques utilisés pendant les séances rendent la rééducation ludique et efficace." },
    { name: "Marc (Lyon)", text: "Consultation pour un problème de voix. Le diagnostic à distance était d'une précision chirurgicale. Je recommande vivement." },
    { name: "Sarah L.", text: "La flexibilité des horaires en ligne est un vrai plus pour nous qui travaillons tard. Nassima est d'une grande bienveillance." },
    { name: "Mme Dubois", text: "La télé-consultation fonctionne à merveille. C'est pratique et tout aussi efficace qu'en présentiel grâce à l'organisation de Nassima." }
  ];

  // --- COMPOSANTS INTERNES ---
  const TestimonialCard = ({ name, text }) => {
    const colors = [
      { bg: 'from-blue-500 to-blue-600', border: 'border-blue-200' },
      { bg: 'from-green-500 to-green-600', border: 'border-green-200' },
      { bg: 'from-purple-500 to-purple-600', border: 'border-purple-200' },
      { bg: 'from-pink-500 to-pink-600', border: 'border-pink-200' },
      { bg: 'from-orange-500 to-orange-600', border: 'border-orange-200' }
    ];
    const colorIndex = name.length % colors.length;
    const color = colors[colorIndex];
    
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full animate-fade-in hover:shadow-2xl transition-shadow">
        <div className="flex items-start mb-6">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${color.bg} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0 mr-4 ring-4 ${color.border}`}>
            {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-900 text-lg mb-1">{name}</div>
            <div className="flex text-yellow-400 text-sm">{'★'.repeat(5)}</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-2 -left-2 text-blue-200 text-4xl font-serif">"</div>
          <p className="text-gray-700 italic text-base leading-relaxed pl-6">{text}</p>
        </div>
      </div>
    );
  };

  const ContactInfoBox = ({ icon, title, value, link, bgClass }) => (
    <div className={`flex items-start space-x-4 p-6 ${bgClass} rounded-xl shadow-sm hover:shadow-md transition-shadow`}>
      <span className="text-2xl mt-1 flex-shrink-0">{icon}</span>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <a 
          href={link || '#'} 
          className={`text-gray-600 ${link ? 'hover:text-blue-600 underline' : ''} mt-1 block transition-colors`}
          target={link && link.startsWith('http') ? '_blank' : '_self'}
          rel={link && link.startsWith('http') ? 'noopener noreferrer' : ''}
        >
          {value}
        </a>
      </div>
    </div>
  );

  const totalSets = Math.ceil(testimonials.length / 2);
  const maxIndex = (totalSets - 1) * 2;

  const handleNextTestimonial = () => {
    setActiveTestimonialIndex((prevIndex) => {
      const newIndex = prevIndex + 2;
      return newIndex > maxIndex ? 0 : newIndex;
    });
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonialIndex((prevIndex) => {
      const newIndex = prevIndex - 2;
      return newIndex < 0 ? maxIndex : newIndex;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => { handleNextTestimonial(); }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      // Remplace l'URL par ton endpoint API réel si nécessaire
      await axios.post('http://127.0.0.1:8000/api/contact/', contactForm);
      alert("Votre message a bien été envoyé ! Nassima reviendra vers vous très vite.");
      setContactForm({ name: '', phone: '', message: '' }); // Reset du formulaire
    } catch (error) {
      console.error("Erreur envoi contact:", error);
      alert("Une erreur est survenue. Vous pouvez aussi nous contacter via WhatsApp !");
    } finally {
      setContactLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      
      {/* 1. SEO OPTIMISÉ POUR LA FRANCE ET L'ONLINE */}
      <Helmet>
        <title>Orthophoniste en Ligne | Bilan & Consultation Visio | Nassima Fetouh</title>
        <meta name="description" content="Consultation d'orthophonie en ligne pour francophones. Bilan orthophonique, rééducation langage et DYS par visio. Expertise clinique accessible depuis chez vous." />
        <meta name="keywords" content="orthophoniste en ligne, télé-orthophonie, bilan orthophonique visio, orthophoniste français, bégaiement en ligne, dys online" />
      </Helmet>

      {/* BANNIÈRE INNOVATION "ONLINE FIRST" */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-2 text-center text-sm font-bold px-4 relative z-50">
        <span className="animate-pulse">🌍 PATIENTS FRANCOPHONES : </span>
        <span> Accédez à votre pré-diagnostic immédiat via notre IA Clinique. </span>
        <Link to="/test" className="underline text-yellow-300 hover:text-white ml-2">
          Commencer le bilan numérique
        </Link>
      </div>

      
      

      {/* HERO SECTION - REPOSITIONNEMENT "ONLINE PRO" */}
      <section id="accueil" className="pt-32 md:pt-44 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* TEXTE CENTRÉ */}
            <div className="space-y-8 lg:order-1 order-2 animate-fade-in text-center">
              
              {/* Badge Centré - Changement pour "International/Online" */}
              <div className="flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-200">
                 <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                   <span>Expertise Orthophonique en Ligne</span>
                </div>
              </div>
              
              {/* Titre Impactant */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight font-serif">
                Cabinet Nassima Fetouh<br/>
                <span className="text-blue-600">Votre Orthophoniste à Distance</span>
              </h1>
              
              {/* --- DESCRIPTION "BLOGUEUR EXPERT" --- */}
              <div className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                <p className="mb-4">
                  Bénéficiez de l'excellence clinique française, où que vous soyez. Une méthode humaine propulsée par <span className="text-indigo-600 font-bold">l'IA et la Télé-médecine</span> pour des résultats rapides, sans contrainte géographique.
                </p>
                <p className="mb-6">
                  La distance n'est plus un obstacle. <span className="font-semibold text-gray-800">Nos outils digitaux et nos articles experts</span> vous permettent de devenir acteur de la progression de votre enfant au quotidien.
                </p>
                
                {/* --- BLOC INSCRIPTION NEWSLETTER --- */}
                {/* 👇 MODIF : rounded-[2.5rem] pour plus de douceur, p-8 pour aérer */}
                <div className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8 shadow-sm transform transition-all hover:scale-[1.01] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                   <p className="text-blue-900 font-bold mb-3 text-sm uppercase tracking-wide">
                     🌍 Rejoignez notre communauté francophone
                   </p>
                   <p className="text-gray-600 text-sm mb-6">
                     Recevez nos dossiers exclusifs "Spécial Parents" directement par email.
                   </p>
                   
                   <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre email..." 
                        // 👇 MODIF : rounded-full, px-6 py-4
                        className="flex-1 px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                      />
                      <button 
                        type="submit"
                        disabled={loading}
                        // 👇 MODIF : rounded-full, px-8 py-4, text-xs uppercase
                        className="bg-blue-600 text-white px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-md whitespace-nowrap disabled:opacity-70"
                      >
                        {loading ? '...' : "Je m'inscris"}
                      </button>
                   </form>
                </div>
              </div>
              
              {/* BOUTONS D'ACTION - Dimensions Identiques (w-64) */}
              <div className="flex flex-col sm:flex-row gap-5 pt-4 justify-center items-center">
                <Link 
                  to="/test" 
                  className="w-full sm:w-64 py-5 bg-white border border-indigo-100 text-indigo-600 rounded-full font-black text-sm uppercase tracking-widest shadow-md hover:bg-indigo-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <span>🤖</span> Test IA
                </Link>

                <Link 
                  to="/boutique" 
                  className="w-full sm:w-64 py-5 bg-amber-400 text-amber-900 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-400/20 hover:bg-amber-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <span>🎁</span> Boutique
                </Link>
              </div>
            </div>
            
            {/* IMAGE - Restée identique mais le badge change */}
            <div className="relative lg:order-2 order-1 animate-fade-in delay-200">
               <div className="w-full lg:h-[500px] h-96 bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white transition-all duration-500 hover:shadow-blue-400/50 hover:shadow-3xl hover:border-blue-200 hover:scale-[1.02]">
                 <img src="/nassima-main3.png" alt="Nassima Fetouh" className="object-cover w-full h-full" />
               </div>

               {/* Badge Flottant "Expertise" */}
               <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex items-center space-x-4 transition-transform duration-500 hover:scale-105 border border-white/50 w-72 cursor-pointer">
                 <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-600 shadow-md flex-shrink-0">
                   <img src="/nassima-main3.png" alt="Mini portrait" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <p className="font-bold text-gray-900 leading-none">Nassima Fetouh</p>
                   <div className="flex text-yellow-300 text-xs my-0.5">
                     {'★'.repeat(5)}
                   </div>
                   <p className="text-blue-600 text-[10px] font-bold mt-1 uppercase tracking-wide">Expertise Clinique</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION POINTS FORTS - DESIGN "GLASS & GLOW" 2026 */}
      <section className="py-24 bg-slate-50/50 relative overflow-hidden">
        
        {/* Lueur de fond globale */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-blue-50 to-transparent opacity-60 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header de section */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px] border border-green-100/50 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              La qualité sans frontières
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-serif tracking-tight leading-tight">
              L'Excellence Orthophonique,<br className="hidden md:block" /> Directement chez vous
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Nous avons adapté nos protocoles cliniques pour offrir en télé-soin la même efficacité qu'en cabinet.
            </p>
          </div>

          {/* Grille des cartes avec décalage pour le centre */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            
            {/* CARTE 1 : ACCESSIBLE (BLEU) */}
            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
              {/* Lueur d'arrière-plan au survol */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-colors duration-500"></div>
              
              <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] border border-blue-100 flex items-center justify-center text-3xl mb-8 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                🌍
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10 tracking-tight">Accessible<br/>Partout</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10">
                Que vous soyez en France, au Maroc ou ailleurs, accédez à une expertise de pointe sans déplacement.
              </p>
            </div>
            
            {/* CARTE 2 : TÉLÉ-SOIN (INDIGO) - Plus grande et mise en avant */}
            <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] border border-indigo-50 relative overflow-hidden group hover:-translate-y-3 transition-all duration-500 md:-translate-y-4 z-10">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-400 to-blue-500"></div>
              <div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
              
              <div className="w-16 h-16 bg-indigo-50 rounded-[1.5rem] border border-indigo-100 flex items-center justify-center text-3xl mb-8 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                💻
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10 tracking-tight">Télé-Soin<br/>Certifié</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10">
                Plateforme sécurisée, partage d'écran interactif et exercices numériques : la technologie au service du soin.
              </p>
            </div>
            
            {/* CARTE 3 : FLEXIBILITÉ (VERT) */}
            <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-400/10 rounded-full blur-3xl group-hover:bg-green-400/20 transition-colors duration-500"></div>
              
              <div className="w-16 h-16 bg-green-50 rounded-[1.5rem] border border-green-100 flex items-center justify-center text-3xl mb-8 relative z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
                📅
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10 tracking-tight">Flexibilité<br/>Totale</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium relative z-10">
                Des créneaux adaptés à votre fuseau horaire et à votre rythme de vie. L'agenda est ouvert 24/7.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION EXPERTISE DYNAMIQUE & AUTO-SWITCH --- */}
      <section 
        id="services" 
        className="py-24 bg-white relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-[1500px] mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-serif tracking-tight">
              Nos Domaines d'<span className="text-blue-600 italic">Expertise</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Une approche clinique innovante, disponible partout grâce au télé-soin.
            </p>
          </div>

          {/* --- SÉLECTEUR AVEC BARRE DE PROGRESSION STYLE STORY --- */}
          <div className="flex justify-center mb-16">
            <div className="bg-slate-100 p-2 rounded-[2.5rem] inline-flex relative shadow-inner border border-slate-200">
              
              <button
                onClick={() => handleTabChange('orthophonie')}
                className={`relative px-12 py-4 rounded-[2rem] text-xs font-black uppercase tracking-[2px] transition-all duration-500 z-10 overflow-hidden ${
                  activeTab === 'orthophonie' ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                <span className="relative z-20">🗣️ Orthophonie</span>
                {activeTab === 'orthophonie' && (
                  <>
                    <div className="absolute inset-0 bg-white z-10 shadow-md"></div>
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-blue-600 z-30 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </>
                )}
              </button>

              <button
                onClick={() => handleTabChange('psychomotricite')}
                className={`relative px-12 py-4 rounded-[2rem] text-xs font-black uppercase tracking-[2px] transition-all duration-500 z-10 overflow-hidden ${
                  activeTab === 'psychomotricite' ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <span className="relative z-20">🧠 Psychomotricité</span>
                {activeTab === 'psychomotricite' && (
                  <>
                    <div className="absolute inset-0 bg-white z-10 shadow-md"></div>
                    <div 
                      className="absolute bottom-0 left-0 h-1 bg-indigo-600 z-30 transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* --- GRILLE 4 CARTES (FORMAT LUXE COMPACT) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dbPosts && [...dbPosts]
              .sort((a, b) => new Date(b.published_at) - new Date(a.published_at)) // Tri par date (récent d'abord)
              .filter(post => {
                const cat = post.category.toLowerCase();
                return activeTab === 'orthophonie' ? cat.includes('ortho') : cat.includes('psycho');
              })
              .slice(0, 4)
              .map((post) => (
                <Link 
                  to={`/blog/${post.id}`} 
                  key={post.id}
                  className="bg-white rounded-[2.5rem] p-4 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 border border-slate-50 hover:border-blue-100 flex flex-col group hover:-translate-y-2"
                >
                  {/* Image Format h-60 (Équilibré) */}
                  <div className="h-60 w-full bg-slate-50 rounded-[2rem] mb-6 overflow-hidden relative">
                    <img 
                      src={post.image_url || '/services/blog-default.webp'} 
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
                    
                    {/* Badge Nouveau si l'article a moins de 7 jours */}
                    {(new Date() - new Date(post.published_at)) < (7 * 24 * 60 * 60 * 1000) && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                        Nouveau
                      </div>
                    )}
                  </div>

                  <div className="px-2 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300">
                        {new Date(post.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-snug font-serif line-clamp-2 min-h-[2.5rem]">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3 font-medium flex-grow">
                      {post.description}
                    </p>
                    
                    <div className="pt-4 border-t border-slate-50 flex items-center text-blue-600 font-black text-[9px] uppercase tracking-widest gap-2">
                      Lire la suite <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/blog" className="text-slate-400 font-bold hover:text-blue-600 transition-all text-xs underline underline-offset-8 uppercase tracking-widest">
              Accéder à tous les conseils →
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION TÉMOIGNAGES (FULL-WIDTH DARK EDITION) --- */}
      <section id="temoignages" className="py-32 bg-[#0F172A] relative overflow-hidden group">
        
        {/* Décoration : Citation Géante en arrière-plan (fixée aux bords de l'écran) */}
        <div className="absolute -top-10 -left-5 text-[300px] md:text-[400px] font-serif text-white opacity-[0.02] select-none pointer-events-none leading-none">
          “
        </div>
        
        {/* Décoration : Lueur diffuse */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Conteneur central pour aligner le texte avec le reste du site */}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-[5px] mb-4 inline-block">
              Expériences Patients
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white font-serif tracking-tight">
              Ils nous font confiance <br className="hidden md:block" /> à distance.
            </h2>
          </div>

          {/* Slider de témoignages */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 min-h-[280px]">
              
              {/* Carte 1 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/10 transition-all duration-500 shadow-2xl">
                <div>
                  <div className="text-amber-400 text-sm mb-6">★★★★★</div>
                  <p className="text-blue-50/90 italic text-lg leading-relaxed font-medium">
                    "{testimonials[activeTestimonialIndex].text}"
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {testimonials[activeTestimonialIndex].name.charAt(0)}
                  </div>
                  <p className="font-black text-blue-400 uppercase text-[10px] tracking-widest">
                    {testimonials[activeTestimonialIndex].name}
                  </p>
                </div>
              </div>

              {/* Carte 2 (Si disponible) */}
              {activeTestimonialIndex + 1 < testimonials.length && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/10 transition-all duration-500 shadow-2xl hidden md:flex">
                  <div>
                    <div className="text-amber-400 text-sm mb-6">★★★★★</div>
                    <p className="text-blue-50/90 italic text-lg leading-relaxed font-medium">
                      "{testimonials[activeTestimonialIndex + 1].text}"
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                      {testimonials[activeTestimonialIndex + 1].name.charAt(0)}
                    </div>
                    <p className="font-black text-blue-400 uppercase text-[10px] tracking-widest">
                      {testimonials[activeTestimonialIndex + 1].name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation du Slider */}
            <div className="flex justify-center items-center mt-16 gap-6">
              <button 
                onClick={handlePrevTestimonial}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all group"
              >
                <span className="group-hover:-translate-x-1 transition-transform font-bold">←</span>
              </button>
              
              {/* Indicateurs (Dots) */}
              <div className="flex gap-2">
                {Array.from({ length: totalSets }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 transition-all duration-500 rounded-full ${activeTestimonialIndex === i * 2 ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
                  ></div>
                ))}
              </div>

              <button 
                onClick={handleNextTestimonial}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all group"
              >
                <span className="group-hover:translate-x-1 transition-transform font-bold">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- BANNIÈRE PROMOTION APPLICATION MOBILE (iOS & Android) --- */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-white text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">L'expertise dans votre poche</h2>
            <p className="text-blue-100 text-lg max-w-xl">
              Téléchargez notre application pour un suivi simplifié, des notifications de rappel et un accès direct à notre Test IA.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {/* Badge App Store (iPhone) */}
            <div className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-3 border border-gray-700 shadow-xl cursor-pointer hover:bg-gray-900 transition-all">
              <i className="fab fa-apple text-3xl"></i>
              <div className="text-left leading-tight">
                <p className="text-[9px] uppercase opacity-80">Télécharger dans</p>
                <p className="text-sm font-bold font-sans">l'App Store</p>
              </div>
            </div>

            {/* Badge Google Play (Android) */}
            <div className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-3 border border-gray-700 shadow-xl cursor-pointer hover:bg-gray-900 transition-all">
              <i className="fab fa-google-play text-2xl"></i>
              <div className="text-left leading-tight">
                <p className="text-[9px] uppercase opacity-80">DISPONIBLE SUR</p>
                <p className="text-sm font-bold font-sans">Google Play</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION CONTACT : CONCIERGERIE PREMIUM --- */}
      <section id="contact" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        
        {/* Décoration de fond très légère */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-100/30 blur-[120px] rounded-full pointer-events-none -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* CÔTÉ GAUCHE : L'ACCUEIL CONCIERGE */}
            <div className="lg:col-span-5 space-y-12">
              <div className="text-center lg:text-left">
                <span className="bg-white text-blue-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px] border border-blue-100 inline-block mb-6 shadow-sm">
                  Service Prioritaire
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-slate-900 font-serif tracking-tight leading-tight mb-8">
            Commençons votre <br /> <span className="text-blue-600 italic">parcours de soin.</span>
                </h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                  Qu’il s’agisse d’une question ou d’un besoin de bilan complet, notre équipe dédiée est à votre écoute.
                </p>
              </div>

              {/* ACCÈS DIRECTS - STYLE PILLS */}
              <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                <a href={`tel:${cabinetData.telephone}`} className="group flex items-center justify-between p-6 bg-white rounded-full border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <i className="fas fa-phone text-lg"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Ligne Directe</p>
                      <p className="font-black text-slate-800">{cabinetData.telephone}</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-500 transition-colors mr-2">→</span>
                </a>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-6 bg-white rounded-full border border-slate-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                      <i className="fab fa-whatsapp text-xl"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">WhatsApp</p>
                      <p className="font-black text-slate-800">Conciergerie Instantanée</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-green-500 transition-colors mr-2">→</span>
                </a>
              </div>
              
              {/* APPEL À L'AGENDA PREMIUM */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-600/20 max-w-md mx-auto lg:mx-0 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                 <p className="text-blue-100 font-bold text-sm mb-4">Agenda Intelligent (GMT+1)</p>
                 <Link to="/appointment" className="w-full bg-white text-blue-600 py-4 rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all shadow-lg">
                    <span>📅</span> Réserver mon créneau
                 </Link>
              </div>
            </div>

            {/* CÔTÉ DROIT : LE FORMULAIRE DE SOIN */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                <h3 className="text-2xl font-black text-slate-900 mb-8 font-serif">Posez-nous vos questions</h3>
                
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6">Nom Complet</label>
                      <input 
                        type="text" required value={contactForm.name} 
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Ex: Yassine..." 
                        className="w-full px-8 py-4 rounded-full bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6">Téléphone</label>
                      <input 
                        type="tel" required value={contactForm.phone} 
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        placeholder="+212..." 
                        className="w-full px-8 py-4 rounded-full bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-6">Votre Message</label>
                    <textarea 
                      rows="4" required value={contactForm.message} 
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Comment pouvons-nous aider votre enfant ?" 
                      className="w-full px-8 py-6 rounded-[2.5rem] bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={contactLoading}
                    className="w-full py-5 bg-blue-600 text-white rounded-full font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                  >
                    {contactLoading ? 'Envoi en cours...' : 'Envoyer ma demande'} <span>→</span>
                  </button>
                </form>

                <p className="text-center text-slate-400 text-[10px] font-medium mt-8 uppercase tracking-widest">
                  🛡️ Vos données sont protégées et confidentielles
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECTION LEAD MAGNET : FULL WIDTH --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900 py-24 w-full">
        {/* Décorations lumineuses d'arrière-plan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-8">
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-[5px]">
              Offre Exclusive
            </span>
            
            <h2 className="text-4xl md:text-6xl font-black font-serif text-white">
              Récupérez votre <span className="text-blue-400">Kit de Bienvenue</span> Numérique 🎁
            </h2>
            
            <p className="text-blue-100/80 text-xl max-w-3xl mx-auto leading-relaxed">
              Inscrivez-vous pour recevoir immédiatement nos <strong>guides PDF gratuits</strong> pour stimuler le langage et la motricité à la maison.
            </p>

            {/* 🟢 NOUVELLE LOGIQUE UX : Affichage conditionnel */}
            {isSubscribed ? (
              <div className="max-w-xl mx-auto bg-green-500/20 border border-green-400/50 rounded-3xl p-8 backdrop-blur-md animate-fade-in mt-6 shadow-2xl">
                <span className="text-5xl mb-4 block animate-bounce">💌</span>
                <h3 className="text-2xl font-bold text-white mb-2">Félicitations !</h3>
                <p className="text-green-100 font-medium">Votre kit a bien été envoyé. Pensez à vérifier votre boîte de réception (et vos spams au cas où) !</p>
              </div>
            ) : (
              <>
                <form 
                  className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto pt-6" 
                  onSubmit={handleSubscribe}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email..."
                    className="flex-1 px-8 py-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 focus:outline-none focus:bg-white/20 transition-all backdrop-blur-md text-lg"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    // 👇 MODIFIÉ : Couleur Ambre pour un contraste parfait
                    className="bg-amber-400 text-amber-950 px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Envoi...' : 'Recevoir les guides'}
                  </button>
                </form>

                <div className="pt-4">
                  <p className="text-blue-300/50 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-8 h-[1px] bg-blue-300/20"></span>
                    🔒 Vos données sont protégées • Rejoignez +2000 parents
                    <span className="w-8 h-[1px] bg-blue-300/20"></span>
                  </p>
                </div>
              </>
            )}

            
          </div>
        </div>
      </section>
      
      {/* --- FOOTER : SIGNATURE PREMIUM --- */}
      <footer className="bg-slate-900 text-white pt-24 pb-12 relative overflow-hidden">
        
        {/* Lueur subtile pour éviter le noir total et plat */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/5">
            
            {/* Colonne 1 : Identité & Réseaux */}
            <div className="lg:col-span-2 space-y-8">
              <Link to="/" className="inline-block transform hover:scale-105 transition-transform">
                <Logo className="h-12 w-auto" isFooter={true} />
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
                Expertise clinique française & innovation technologique au service du développement de votre enfant. Le soin d'excellence, sans frontières.
              </p>
              
              {/* 👇 SECTION RÉSEAUX SOCIAUX & EMPLACEMENT HARMONISÉE 👇 */}
              <div className="flex gap-3 flex-wrap relative z-50"> 
                {/* On met le z-50 sur le parent pour que TOUS les boutons passent au-dessus des calques invisibles */}

                {/* Emplacement (Rouge Map) */}
                <a 
                  href="https://maps.app.goo.gl/RYdKSnLMaWG195eRA" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <i className="fas fa-map-marker-alt"></i>
                </a>
                
                {/* WhatsApp (Vert) */}
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300 cursor-pointer" 
                  title="WhatsApp"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
                
                {/* Instagram (Rose) */}
                <a 
                  href={cabinetData.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 cursor-pointer" 
                  title="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>

                {/* TikTok (Noir) */}
                <a 
                  href={cabinetData.tiktok || "https://www.tiktok.com"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 cursor-pointer" 
                  title="TikTok"
                >
                  <i className="fab fa-tiktok"></i>
                </a>
              </div>
            </div>

            {/* Colonne 2 : Navigation */}
            <div>
              <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[4px] mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Accueil</Link></li>
                <li><Link to="/test" className="hover:text-blue-400 transition-colors">Test IA</Link></li>
                <li><Link to="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link to="/boutique" className="text-amber-400 hover:text-amber-500 transition-colors">Boutique 🎁</Link></li>
              </ul>
            </div>

            {/* Colonne 3 : Contact */}
            <div>
              <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[4px] mb-8">Cabinet</h4>
              <div className="space-y-4 text-sm font-bold text-slate-300">
                <p className="flex items-center gap-2">🎥 <span className="text-slate-400 font-medium">Télé-Soin Mondial</span></p>
                <a href={`tel:${cabinetData.telephone}`} className="block hover:text-white transition-colors">📞 {cabinetData.telephone}</a>
                <p className="text-slate-500 font-medium text-xs">Lun - Ven : 08h00 - 20h00</p>
              </div>
            </div>

            {/* Colonne 4 : App Mobile */}
            <div className="space-y-6">
              <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[4px] mb-8">Application</h4>
              <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group">
                  <i className="fab fa-apple text-xl text-white"></i>
                  <div className="text-left leading-none">
                    <p className="text-[8px] uppercase text-slate-500 font-black">App Store</p>
                    <p className="text-[10px] font-bold text-white mt-1">iOS Version</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group">
                  <i className="fab fa-google-play text-lg text-white"></i>
                  <div className="text-left leading-none">
                    <p className="text-[8px] uppercase text-slate-500 font-black">Play Store</p>
                    <p className="text-[10px] font-bold text-white mt-1">Android</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright & Légal */}
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} {cabinetData.nom}. <br className="md:hidden" /> Excellence Orthophonique à Distance.
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="hover:text-blue-400 cursor-pointer transition-colors">Mentions Légales</span>
              <span className="hover:text-blue-400 cursor-pointer transition-colors">Confidentialité</span>
            </div>
          </div>

        </div>
      </footer>

      {/* --- BOUTONS FLOTTANTS PREMIUM --- */}
      
      {/* 1. Bouton WhatsApp (Gauche) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-4 md:left-8 z-[100] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:bg-green-600 transition-all transform hover:scale-110 group border-2 border-white"
        title="Discuter sur WhatsApp"
      >
        <i className="fab fa-whatsapp text-2xl md:text-3xl"></i>
        {/* Bulle d'aide visible uniquement sur ordinateur au survol */}
        <span className="absolute left-full ml-4 bg-white text-slate-800 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none hidden lg:block whitespace-nowrap border border-slate-100">
          Assistance Directe
        </span>
      </a>

     {/* 2. Bouton RDV (Droite) - Version Haute Visibilité */}
      <Link
        to="/appointment"
        className="fixed bottom-6 right-4 md:right-8 z-[100] flex items-center gap-3 bg-blue-600 text-white p-2 pr-6 rounded-full shadow-2xl shadow-blue-600/40 hover:bg-slate-900 hover:-translate-y-1 transition-all duration-300 group border-2 border-white"
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <span className="text-lg md:text-xl">📅</span>
        </div>
        <div className="flex flex-col text-left">
           <span className="text-[8px] md:text-[9px] uppercase font-black text-blue-200 group-hover:text-slate-400 tracking-[2px] leading-none mb-1">
             Consultation
           </span>
           <span className="font-bold text-sm leading-none">RDV Visio</span>
        </div>
      </Link>

    </div>
  );
};

export default Home;