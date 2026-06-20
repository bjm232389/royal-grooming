import React from 'react';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Truck, Users, MessageCircle, Star, Sparkles } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const { pricingMode, setPricingMode } = useCart();

  return (
    <section className="bg-neutral-900/40 border-y border-neutral-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/10 bg-gold-500/5 px-3 py-1 text-xs font-semibold text-gold-400 uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
            ¿Por Qué Elegir Royal Grooming?
          </div>
          <h3 className="font-display text-3xl font-extrabold tracking-tight text-neutral-100 sm:text-4xl">
            Soluciones Premium adaptadas a tu negocio
          </h3>
          <p className="mt-4 text-neutral-400 font-light text-sm sm:text-base leading-relaxed">
            Abastecemos a las barberías más exigentes, garantizando stock constante, frescura en las fórmulas de cuidado y entrega veloz.
          </p>
        </div>

        {/* Bento-Grid Visual Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Wholesale & Retail dual systems */}
          <div className="relative group overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 p-8 transition-all duration-300 hover:border-gold-500/30 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Users className="w-36 h-36 text-gold-500" />
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-bold text-neutral-150 tracking-wide">
                Ventas al Por Mayor y Detalle
              </h4>
              <p className="mt-3 text-sm text-neutral-400 font-light leading-relaxed">
                Ofrecemos precios flexibles. Adquiere productos individuales para uso personal (Retail) o activa nuestra tarifa de Distribuidor (Wholesale) para maximizar los márgenes e ingresos de tu barbería.
              </p>
            </div>
            
            <div className="mt-6 pt-5 border-t border-neutral-900/60 flex items-center justify-between">
              <span className="text-xs text-neutral-500">¿Eres dueño de barbería o revendedor?</span>
              <button
                onClick={() => setPricingMode(pricingMode === 'retail' ? 'wholesale' : 'retail')}
                className="text-xs font-bold text-gold-500 hover:text-gold-400 flex items-center gap-1 hover:underline transition-all cursor-pointer"
              >
                Activar Mayorista
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: National Logistics */}
          <div className="relative group overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 p-8 transition-all duration-300 hover:border-gold-500/30 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Truck className="w-36 h-36 text-brand-cyan" />
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-bold text-neutral-150 tracking-wide">
                Envíos Seguros a Todo el País
              </h4>
              <p className="mt-3 text-sm text-neutral-400 font-light leading-relaxed">
                Hacemos despachos directos rápidos a todas las provincias de la República Dominicana (Santo Domingo, Santiago, Zona Este, Zona Sur y el Cibao), a través de las agencias de transporte más confiables o envío privado express.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-900/60 flex items-center gap-3">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-cyan/10 text-brand-cyan text-[10px] font-bold uppercase uppercase tracking-wider">
                Rápido & Seguro
              </span>
              <span className="text-xs text-neutral-500">Despachos en menos de 24 horas</span>
            </div>
          </div>

          {/* Card 3: VIP WhatsApp Support */}
          <div className="relative group overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 p-8 transition-all duration-300 hover:border-gold-500/30 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <MessageCircle className="w-36 h-36 text-emerald-500" />
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl font-bold text-neutral-150 tracking-wide">
                Soporte VIP vía WhatsApp
              </h4>
              <p className="mt-3 text-sm text-neutral-400 font-light leading-relaxed">
                Nuestros agentes de ventas atienden de forma personalizada. Consigue asistencia directa sobre modos de uso, combinaciones aromáticas del producto, plazos de entrega y cotizaciones personalizadas de alto volumen.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-900/60 flex items-center justify-between">
              <span className="text-xs text-neutral-500">Atención Uno-a-Uno</span>
              <a
                href="https://wa.me/18096466462"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline transition-all"
              >
                Iniciar Chat Royal
                <MessageCircle className="w-3 h-3 fill-emerald-500/20" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
