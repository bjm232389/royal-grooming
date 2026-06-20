import React from 'react';

interface ProductIllustrationProps {
  type: 'oil' | 'balm' | 'pomade' | 'spray' | 'razor' | 'comb' | 'clipper' | 'pack';
  className?: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({ type, className = "w-full h-full" }) => {
  return (
    <div className={`relative flex items-center justify-center bg-radial from-neutral-800 to-neutral-950/80 rounded-2xl overflow-hidden select-none border border-neutral-800/60 p-6 ${className}`}>
      {/* Decorative Golden Ambient Backlight */}
      <div className="absolute -inset-10 bg-gold-500/5 blur-3xl rounded-full opacity-60"></div>
      
      {/* Dynamic Glow Reflector for the logo accents */}
      <div className="absolute bottom-4 right-4 w-12 h-12 bg-sky-400/5 blur-xl rounded-full"></div>

      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[140px] drop-shadow-[0_15px_15px_rgba(0,0,0,0.65)]"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9D976" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A67C1E" />
          </linearGradient>
          <linearGradient id="darkGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A2A28" />
            <stop offset="60%" stopColor="#141413" />
            <stop offset="100%" stopColor="#0B0B0A" />
          </linearGradient>
          <linearGradient id="neonBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <radialGradient id="glassShine" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {type === 'oil' && (
          <>
            {/* Dropper Rubber Bulb */}
            <path d="M85,30 C85,22 115,22 115,30 L110,48 L90,48 Z" fill="#1A1A1A" />
            
            {/* Gold Locking Band */}
            <rect x="80" y="48" width="40" height="14" rx="2" fill="url(#goldGrad)" />
            <line x1="85" y1="55" x2="115" y2="55" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="1" />

            {/* Dropper Glass Body */}
            <path d="M60,62 L140,62 C145,62 148,66 148,72 L138,165 C138,172 132,178 125,178 L75,178 C68,178 62,172 62,165 L52,72 C52,66 55,62 60,62 Z" fill="url(#darkGlass)" stroke="url(#goldGrad)" strokeWidth="1.5" />
            
            {/* Ambient Highlights and Droplets */}
            <path d="M56,75 L64,165" stroke="url(#glassShine)" strokeWidth="3" strokeLinecap="round" />
            
            {/* Elegant Crown Crest inside labels */}
            <rect x="75" y="90" width="50" height="50" rx="4" fill="#131312" stroke="url(#goldGrad)" strokeWidth="1" />
            
            {/* Mini Crown */}
            <path d="M85,118 L89,105 L100,113 L111,105 L115,118 Z" fill="url(#goldGrad)" />
            {/* Accent Spark */}
            <circle cx="100" cy="125" r="2.5" fill="url(#neonBlue)" />
          </>
        )}

        {type === 'balm' && (
          <>
            {/* Round metal tin can body shadow */}
            <ellipse cx="100" cy="115" rx="75" ry="55" fill="#000000" fillOpacity="0.4" />
            
            {/* Tin Bottom */}
            <ellipse cx="100" cy="110" rx="72" ry="50" fill="url(#darkGlass)" stroke="url(#goldGrad)" strokeWidth="1.5" />

            {/* Tin Lid (slightly angled overlay) */}
            <ellipse cx="100" cy="98" rx="72" ry="50" fill="url(#goldGrad)" />
            <ellipse cx="100" cy="98" rx="66" ry="45" fill="#161615" />
            <ellipse cx="100" cy="98" rx="63" ry="42" fill="url(#darkGlass)" stroke="url(#goldGrad)" strokeWidth="1" />
            
            {/* Embossed Lion Crest inside top */}
            {/* Head Silhouette */}
            <path d="M85,92 L93,76 L100,82 L107,76 L115,92 L109,102 L100,118 L91,102 Z" fill="url(#goldGrad)" />
            {/* Crown above logo */}
            <path d="M92,72 L100,65 L108,72 L105,75 L95,75 Z" fill="url(#goldGrad)" />
            {/* Mini sparkle */}
            <path d="M100,98 C102,98 103,96 103,94 C103,96 104,98 106,98 C104,98 103,99 103,101 C103,99 102,98 100,98 Z" fill="url(#neonBlue)" />
          </>
        )}

        {type === 'pomade' && (
          <>
            {/* Hexagonal/octagonal thick heavy cosmetics dark jar */}
            <rect x="42" y="80" width="116" height="88" rx="14" fill="url(#darkGlass)" stroke="#333" strokeWidth="2" />
            {/* Golden Heavy Thread Top */}
            <rect x="40" y="58" width="120" height="24" rx="6" fill="url(#goldGrad)" />
            <rect x="45" y="62" width="110" height="5" rx="1" fill="#FFFFFF" fillOpacity="0.3" />

            {/* Label design */}
            <rect x="52" y="92" width="96" height="55" rx="2" fill="#131312" stroke="url(#goldGrad)" strokeWidth="1" />
            
            {/* Matte Crown & Brand text */}
            <path d="M90,112 L93,105 L100,109 L107,105 L110,112 Z" fill="url(#goldGrad)" />
            <text x="100" y="132" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="2">MATTE</text>
            <text x="100" y="141" fill="url(#goldGrad)" fontSize="8" fontFamily="sans-serif" textAnchor="middle">GOLD CLAY</text>
            
            {/* Spark Cyan */}
            <circle cx="100" cy="100" r="1.5" fill="url(#neonBlue)" />
          </>
        )}

        {type === 'spray' && (
          <>
            {/* Aluminum cylindrical tall bottle body */}
            <rect x="62" y="65" width="76" height="118" rx="12" fill="url(#darkGlass)" stroke="url(#goldGrad)" strokeWidth="1.5" />
            <path d="M68,65 C68,52 132,52 132,65 Z" fill="#222" />

            {/* Mist Spray Nozzle mechanism */}
            <rect x="90" y="40" width="20" height="20" fill="#1A1A1A" />
            <path d="M100,40 L100,28 L94,28 L94,22 L106,22 L106,32 M90,32 L94,32" stroke="#1A1A1A" strokeWidth="3" />
            
            {/* Royal Gold Crest on Spray body */}
            <rect x="70" y="85" width="60" height="80" fill="#121211" stroke="url(#goldGrad)" strokeWidth="1" />
            
            {/* Logo elements */}
            <path d="M85,115 L100,95 L115,115 H85Z" fill="url(#goldGrad)" fillOpacity="0.25" />
            <circle cx="100" cy="120" r="12" fill="url(#goldGrad)" />
            <path d="M94,120 L100,114 L106,120 L100,126 Z" fill="#0D0D0C" />
            
            {/* Spray Vapor Particles */}
            <circle cx="82" cy="18" r="2.5" fill="url(#neonBlue)" fillOpacity="0.6" />
            <circle cx="70" cy="12" r="1.5" fill="url(#neonBlue)" fillOpacity="0.4" />
            <circle cx="60" cy="18" r="2" fill="url(#neonBlue)" fillOpacity="0.5" />
          </>
        )}

        {type === 'razor' && (
          <>
            {/* Razor Head / Spine */}
            <path d="M50,90 L135,50 C140,48 146,51 148,56 L155,71 C157,75 155,81 150,83 L65,123 Z" fill="url(#metalSilver)" stroke="url(#goldGrad)" strokeWidth="1" />
            {/* Steel Pivot Point and screw */}
            <circle cx="60" cy="115" r="5" fill="url(#goldGrad)" />
            <circle cx="60" cy="115" r="2" fill="#1A1A1A" />

            {/* Carbon Fiber Handle */}
            <path d="M60,115 L130,165 C135,168 141,166 144,161 L152,148 C155,143 153,137 148,134 L78,84 Z" fill="#1F2022" stroke="#444" strokeWidth="2" />
            
            {/* Gold accents on the handle */}
            <line x1="85" y1="105" x2="135" y2="140" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Decorative Stars */}
            <path d="M110,65 Q115,65 115,60 Q115,65 120,65 Q115,65 115,70 Q115,65 110,65 Z" fill="url(#neonBlue)" />
          </>
        )}

        {type === 'comb' && (
          <>
            {/* Long horizontal bar barber comb */}
            <path d="M25,85 C25,80 175,80 175,85 L170,120 C170,123 167,125 164,125 L36,125 C33,125 30,123 30,120 Z" fill="#121211" stroke="url(#goldGrad)" strokeWidth="1.5" />
            
            {/* Comb Teeth */}
            {Array.from({ length: 28 }).map((_, i) => (
              <line
                key={i}
                x1={35 + i * 5}
                y1={95}
                x2={35 + i * 5}
                y2={122}
                stroke="url(#goldGrad)"
                strokeWidth={1.5}
              />
            ))}

            {/* Comb hollow slot branding logo */}
            <rect x="55" y="85" width="90" height="8" rx="2" fill="#0D0D0C" stroke="#222" />
            <circle cx="100" cy="89" r="2" fill="url(#neonBlue)" />
          </>
        )}

        {type === 'clipper' && (
          <>
            {/* Solid Clipper Heavy Base Body */}
            <path d="M75,180 L125,180 C128,180 131,176 130,172 L115,65 C115,60 110,55 105,55 L95,55 C90,55 85,60 85,65 L70,172 C69,176 72,180 75,180 Z" fill="url(#darkGlass)" stroke="#333" strokeWidth="2" />
            
            {/* Golden Core Sheathing Plate */}
            <path d="M85,150 L115,150 L108,70 L92,70 Z" fill="url(#goldGrad)" />
            
            {/* Steel Sharp Cutting Blades (T-Blade) */}
            <path d="M74,52 L126,52 L122,35 C122,33 120,31 118,31 L82,31 C80,31 78,33 78,35 Z" fill="url(#metalSilver)" stroke="#475569" strokeWidth="1" />
            {/* Blade teeth slots */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={i}
                x1={78 + i * 4.4}
                y1={31}
                x2={78 + i * 4.4}
                y2={38}
                stroke="#334155"
                strokeWidth={1.2}
              />
            ))}

            {/* Engraved Lion Shield Accent */}
            <circle cx="100" cy="110" r="14" fill="#0D0D0C" stroke="url(#goldGrad)" strokeWidth="1" />
            <path d="M96,110 L100,103 L104,110 L100,116 Z" fill="url(#goldGrad)" />
            
            {/* Light indicator Cyan */}
            <circle cx="100" cy="165" r="2" fill="url(#neonBlue)" />
          </>
        )}

        {type === 'pack' && (
          <>
            {/* Heavy Luxury Black Ribbon Hex Box */}
            <rect x="45" y="70" width="110" height="100" rx="14" fill="url(#darkGlass)" stroke="url(#goldGrad)" strokeWidth="2" />
            
            {/* Gold Wrapping Belt Cross Ribbon Vertical */}
            <rect x="90" y="70" width="20" height="100" fill="url(#goldGrad)" />
            {/* Horizontal Ribbon */}
            <rect x="45" y="110" width="110" height="20" fill="url(#goldGrad)" />

            {/* Giant beautiful ribbon knot on top */}
            <path d="M100,70 C100,50 80,45 85,60 C90,75 100,70 100,70 Z" fill="url(#goldGrad)" stroke="#A67C1E" strokeWidth="1" />
            <path d="M100,70 C100,50 120,45 115,60 C110,75 100,70 100,70 Z" fill="url(#goldGrad)" stroke="#A67C1E" strokeWidth="1" />
            <circle cx="100" cy="70" r="7" fill="url(#goldGrad)" />
            <circle cx="100" cy="70" r="3" fill="url(#neonBlue)" />

            {/* Special Pack Text Overlay */}
            <rect x="55" y="112" width="90" height="16" rx="2" fill="#0D0D0C" stroke="url(#goldGrad)" strokeWidth="1" />
            <text x="100" y="124" fill="url(#goldGrad)" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle" letterSpacing="1">MEGA ROYAL</text>
          </>
        )}
      </svg>
    </div>
  );
};
