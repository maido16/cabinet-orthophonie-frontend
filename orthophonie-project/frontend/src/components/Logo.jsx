import React from 'react';

const Logo = ({ className = "h-12 w-auto", isFooter = false, onlyIcon = false }) => {
  // Couleurs de la charte (Toujours Bleu/Indigo car le fond du logo est maintenant Blanc)
  const siteBlue = "#2563eb";  
  const siteIndigo = "#4338ca"; 
  const siteDark = "#111827";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* --- LE SYMBOLE --- */}
      <div className={`relative flex-shrink-0 ${onlyIcon ? "w-full h-full" : "w-14 h-14"}`}>
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md" /* Ombre pour le relief */
        >
          <defs>
            <linearGradient id="tech_wave_gradient" x1="0" y1="32" x2="64" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor={siteBlue} />
              <stop offset="1" stopColor={siteIndigo} />
            </linearGradient>
          </defs>

          {/* CERCLE DE FOND : REMPLI EN BLANC (Comme le lait) */}
          <circle 
            cx="32" cy="32" r="30" 
            fill="#FFFFFF" 
            stroke="none"
          />

          {/* RÉSEAU NEURONAL (Lignes fines) */}
          <g stroke="url(#tech_wave_gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
            <path d="M8 36 L20 18 L32 32 L44 20 L56 38" />
            <path d="M20 18 L32 10" />
            <path d="M32 32 L32 54" />
            <path d="M44 20 L56 12" />
          </g>

          {/* ONDE VOCALE (Ligne épaisse) */}
          <path 
            d="M4 36 C 12 36, 16 18, 24 18 C 32 18, 36 42, 44 32 C 52 22, 56 38, 60 38" 
            stroke="url(#tech_wave_gradient)" 
            strokeWidth="3" 
            strokeLinecap="round"
            fill="none"
          />

          {/* POINTS (Noeuds) */}
          <g fill={siteIndigo}>
            <circle cx="8" cy="36" r="2" />
            <circle cx="20" cy="18" r="2" />
            <circle cx="32" cy="32" r="3" />
            <circle cx="44" cy="20" r="2" />
            <circle cx="56" cy="38" r="2" />
          </g>
        </svg>
      </div>

      {/* --- LE TEXTE (Caché si onlyIcon est vrai) --- */}
      {!onlyIcon && (
        <div className="flex flex-col justify-center -mt-1">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-none font-sans" style={{ color: isFooter ? "#ffffff" : siteDark }}>
            CABINET <span style={{ color: isFooter ? "#60a5fa" : siteBlue }}>NASSIMA FETOUH</span>
          </h1>
          
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex gap-1">
               <div className="h-1 w-1 rounded-full bg-blue-600 animate-pulse"></div>
               <div className="h-1 w-4 rounded-full bg-indigo-100 overflow-hidden">
                  <div className="h-full w-full bg-indigo-600 origin-left animate-[grow_2s_ease-in-out_infinite]"></div>
               </div>
            </div>
            <p className="text-[11px] md:text-xs uppercase tracking-widest font-bold" style={{ color: isFooter ? "#93c5fd" : siteIndigo }}>
              Orthophonie & Innovation
            </p>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes grow {
          0%, 100% { transform: scaleX(0.3); opacity: 0.5; }
          50% { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Logo;