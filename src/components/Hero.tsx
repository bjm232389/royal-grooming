import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, MessageCircle } from 'lucide-react';

interface HeroProps {
  onBrowseCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBrowseCatalog }) => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Absolute Ambient Background Lights resembling a luxurious barber salon */}
      <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-gold-500/5 blur-3xl"></div>
      <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-brand-cyan/5 blur-3xl"></div>
      
      {/* Decorative vertical lines representing classic fine textures */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, #d4af37 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Dominican Republic National Delivery Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-gold-400 uppercase mb-8 animate-pulse shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-gold-500"></span>
            🇩🇴 Envíos Nacionales Rápidos en República Dominicana
          </div>

          {/* Subtitle / Category Label */}
          <h2 className="font-mono text-xs font-bold tracking-widest text-brand-cyan uppercase mb-3 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-cyan animate-spin" style={{ animationDuration: '6s' }} />
            Distribuidora Oficial • Royal Grooming
          </h2>

          {/* Main Statement Title */}
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-neutral-50 sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-tight">
            Premium barber products for{' '}
            <span className="block mt-2 bg-gradient-to-r from-gold-300 via-gold-500 to-amber-600 bg-clip-text text-transparent">
              modern professionals
            </span>
          </h1>

          {/* Supportive Brand Copy */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-neutral-400 leading-relaxed font-sans font-light">
            Elevamos el estándar de las barberías en la República Dominicana con ceras mate de alta fijación, aceites biológicos nutritivos, y herramientas de acero forjado. Ideal tanto para el estilista detallista como para revendedores mayoristas.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBrowseCatalog}
              className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 font-display font-extrabold tracking-wider text-neutral-950 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl cursor-pointer"
              style={{
                boxShadow: '0 8px 30px -4px rgba(212, 175, 55, 0.35)'
              }}
            >
              Ver Catálogo Completo
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="https://wa.me/18096466462?text=Hola%20Royal%20Grooming%21%20Me%20gustar%C3%ADa%20solicitar%20asesor%C3%ADa%20personalizada%20sobre%20tus%20productos%20de%20barber%C3%ADa."
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto h-14 px-8 inline-flex items-center justify-center gap-3 rounded-full border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900 hover:border-neutral-700 font-display font-bold tracking-wider text-neutral-200 transition-all duration-300 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 text-green-500" />
              Soporte VIP WhatsApp
            </a>
          </div>

          {/* High-fidelity Trust factors banner */}
          <div className="mt-16 sm:mt-20 border-t border-neutral-900 pt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-neutral-900/30 border border-neutral-900/60 justify-center sm:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500">
                <Truck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-neutral-200 font-display">Envíos a Todo RD</h4>
                <p className="text-xs text-neutral-500 mt-0.5 font-light">Envíos seguros a nivel nacional.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-neutral-900/30 border border-neutral-900/60 justify-center sm:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-neutral-200 font-display">Garantía Premium</h4>
                <p className="text-xs text-neutral-500 mt-0.5 font-light">Fórmulas testadas hipoalergénicas.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-neutral-900/30 border border-neutral-900/60 justify-center sm:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-neutral-200 font-display">Soporte Express 1-a-1</h4>
                <p className="text-xs text-neutral-500 mt-0.5 font-light">Asesoramiento directo y cotizaciones.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
