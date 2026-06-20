import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Sparkles, SwitchCamera, Info } from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { cart, pricingMode, setPricingMode } = useCart();

  // Calculate total items in the cart
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Artistic Brand Logo Matching User's Real Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative h-10 w-10 sm:h-14 sm:w-14 flex items-center justify-center">
            {/* Soft Cyan Ambient Glow */}
            <div className="absolute inset-0 bg-brand-cyan/15 blur-md rounded-full"></div>
            
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9 sm:h-12 sm:w-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            >
              <defs>
                <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F9D976" />
                  <stop offset="100%" stopColor="#D4AF37" />
                </linearGradient>
                <linearGradient id="logoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
              </defs>
              
              {/* Golden Crown */}
              <path d="M35,34 L40,22 L50,29 L60,22 L65,34 L60,38 L40,38 Z" fill="url(#logoGold)" />
              <circle cx="50" cy="29" r="1.5" fill="#38BDF8" />
              <circle cx="40" cy="22" r="1" fill="#38BDF8" />
              <circle cx="60" cy="22" r="1" fill="#38BDF8" />

              {/* Lion Face Silhouette */}
              <path 
                d="M32,40 C28,40 26,45 28,52 C30,60 36,65 38,70 L50,86 L62,70 C64,65 70,60 72,52 C74,45 72,40 68,40 L60,44 L50,42 L40,44 Z" 
                fill="#222" 
                stroke="url(#logoGold)" 
                strokeWidth="1.5" 
              />
              
              {/* Lion Mane Stylization details */}
              <path d="M38,44 L32,54 M45,43 L40,56 M62,44 L68,54 M55,43 L60,56" stroke="url(#logoGold)" strokeWidth="1" strokeLinecap="round" />
              
              {/* Royal Blue Crown Diamonds */}
              <polygon points="46,31 50,26 54,31 50,33" fill="url(#logoBlue)" />
              <circle cx="43" cy="31" r="1" fill="url(#logoBlue)" />
              <circle cx="57" cy="31" r="1" fill="url(#logoBlue)" />

              {/* Lion Eyes (Cyan spark) */}
              <circle cx="43" cy="51" r="1.5" fill="#38BDF8" />
              <circle cx="57" cy="51" r="1.5" fill="#38BDF8" />
              
              {/* Lion Chin Beard */}
              <path d="M46,65 L50,75 L54,65 Z" fill="url(#logoGold)" />
            </svg>
          </div>
          
          <div className="flex flex-col">
            <span className="font-serif text-sm sm:text-lg font-bold italic tracking-wide text-brand-cyan leading-none">
              Royal
            </span>
            <span className="font-display text-[10px] sm:text-sm font-extrabold tracking-widest text-[#F9D976] leading-none uppercase">
              Grooming
            </span>
            <span className="text-[6px] sm:text-[7.5px] font-mono tracking-widest text-neutral-400 uppercase leading-none mt-0.5">
              Premium Quality
            </span>
          </div>
        </div>

        {/* Action Controls Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* Dual Pricing Mode Toggle Selector — hidden on mobile to save space */}
          <div className="hidden sm:flex items-center rounded-full bg-neutral-900 border border-neutral-800 p-1 select-none">
            <button
              onClick={() => setPricingMode('retail')}
              className={`relative z-10 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-300 ${
                pricingMode === 'retail'
                  ? 'text-neutral-900 bg-gold-500 shadow-md font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Retail
            </button>
            <button
              onClick={() => setPricingMode('wholesale')}
              className={`relative z-10 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-full transition-all duration-300 flex items-center gap-1 ${
                pricingMode === 'wholesale'
                  ? 'text-neutral-950 bg-brand-cyan shadow-md font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Wholesale
              <Sparkles className={`w-3 h-3 ${pricingMode === 'wholesale' ? 'text-neutral-950 animate-pulse' : 'text-neutral-500'}`} />
            </button>
          </div>

          {/* Luxury Shopping Bag Icon Trigger */}
          <button
            onClick={onOpenCart}
            id="shopping-bag-btn"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/60 transition-all duration-300 hover:border-gold-500/40 hover:bg-neutral-900 focus:outline-none"
          >
            <ShoppingBag className="h-5 w-5 text-neutral-300 transition-colors duration-300 group-hover:text-gold-500" />
            
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-neutral-950 glow-gold animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
