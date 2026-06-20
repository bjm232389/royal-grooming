import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductIllustration } from './ProductIllustration';
import { ShoppingCart, Star, Sparkles, Check, Lock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
  const { pricingMode, addToCart, cart } = useCart();

  // Format currency helper
  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0
    }).format(val);
  };

  // Check if quantity in cart already fulfills the wholesale requirement
  const cartItem = cart.find(item => item.product.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;
  const isWholesaleRequirementMet = qtyInCart >= product.minWholesaleQty;

  return (
    <article 
      className="glass-card glass-card-hover group relative flex flex-col overflow-hidden rounded-2xl h-full"
      style={{
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Product Image / Illustration Header */}
      <div className="relative aspect-square w-full overflow-hidden p-4 bg-neutral-900/60 flex items-center justify-center">
        
        {/* Absolute Ribbon labels for Stock Status or Wholesale Benefits */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
          {!product.inStock ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-950/80 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-900/40">
              Agotado
            </span>
          ) : product.featured ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-550 text-neutral-950 text-[10px] font-bold uppercase tracking-widest leading-none glow-gold bg-gradient-to-r from-gold-400 via-gold-550 to-gold-600">
              🦁 Destacado
            </span>
          ) : null}

          {/* Quick Wholesale Flag */}
          {pricingMode === 'wholesale' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-cyan text-neutral-950 text-[10px] font-bold uppercase tracking-wider leading-none">
              <Sparkles className="w-3 h-3 text-neutral-950 animate-pulse" />
              Precios Mayoristas
            </span>
          )}
        </div>

        {/* Absolute Admin control trigger */}
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onEdit(product);
            }}
            className="absolute top-4 right-4 z-40 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-950/95 border border-neutral-800 hover:border-gold-500 hover:text-gold-400 text-[10px] text-neutral-300 font-bold uppercase tracking-wider backdrop-blur-md shadow-2xl transition-all cursor-pointer group/adminbtn"
            title="Administración de Producto"
          >
            <Lock className="w-3 h-3 text-gold-500 group-hover/adminbtn:rotate-12 transition-transform" />
            <span>Gestionar</span>
          </button>
        )}

        {/* Render real uploaded image or video if present; fallback to vector illustration */}
        {product.media_url || product.imageUrl ? (
          product.media_type === "video" ? (
            <video 
              src={product.media_url || product.imageUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl transform group-hover:scale-[1.04] transition-all duration-500 ease-out"
            />
          ) : (
            <img 
              src={product.media_url || product.imageUrl} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl transform group-hover:scale-[1.04] transition-all duration-500 ease-out"
            />
          )
        ) : (
          <ProductIllustration 
            type={product.illustrationType} 
            className="w-full h-full transform group-hover:scale-[1.04] transition-all duration-500 ease-out" 
          />
        )}
        
        {/* Star Rating Overlay */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 rounded-md bg-neutral-950/85 border border-neutral-900/60 px-2 py-1 text-[11px] font-bold text-gold-400">
          <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
          {product.rating.toFixed(1)}
        </div>
      </div>

      {/* Product Metadata & Action Section */}
      <div className="flex flex-1 flex-col p-6 bg-neutral-950/30">
        
        {/* Category Badge & Code */}
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
            {product.category === 'beard' && 'Barba Premium'}
            {product.category === 'hair' && 'Cabello & Estilo'}
            {product.category === 'tools' && 'Herramientas de Acero'}
            {product.category === 'wholesale' && 'Mayorista Lotes'}
          </span>
          <span className="font-mono text-[9px] text-neutral-600">
            #{product.id.toUpperCase()}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-display text-lg font-bold text-neutral-200 group-hover:text-gold-400 transition-colors duration-300 tracking-wide line-clamp-1 mb-2">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Key Features Bullet List */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-[10.5px] text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500/50 flex-shrink-0"></span>
              <span className="line-clamp-1 font-light">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Interactive Pricing and CTA block */}
        <div className="border-t border-neutral-900/60 pt-4 mt-auto">
          
          {/* Dynamic Price Display */}
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wide font-medium leading-none mb-1">
                {pricingMode === 'wholesale' ? 'Precio Distribuidor (Por Ud.)' : 'Precio Estándar'}
              </p>
              
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-extrabold text-neutral-100">
                  {pricingMode === 'wholesale' 
                    ? formatCOP(product.priceWholesaleMin) 
                    : formatCOP(product.priceRetail)
                  }
                </span>

                {pricingMode === 'wholesale' && (
                  <span className="text-[10px] text-brand-cyan font-bold leading-none py-0.5 px-1.5 rounded bg-brand-cyan/10 border border-brand-cyan/20">
                    -{Math.round((1 - product.priceWholesaleMin / product.priceRetail) * 100)}% Off
                  </span>
                )}
              </div>
            </div>

            {/* Price helper subtext */}
            <div className="text-right">
              {pricingMode === 'wholesale' ? (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-neutral-300 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                    {product.wholesaleUnitDesc}
                  </span>
                  
                  {qtyInCart > 0 && (
                    <span className={`text-[9px] mt-1 font-medium ${isWholesaleRequirementMet ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                      {isWholesaleRequirementMet ? '✓ Mínimo alcanzado' : `Llevas ${qtyInCart}/${product.minWholesaleQty}`}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[10px] text-neutral-500">Surtido Unitario</span>
              )}
            </div>
          </div>

          {/* Quick Buy ADD TO CART Button */}
          <button
            onClick={() => addToCart(product, pricingMode === 'wholesale' && qtyInCart === 0 ? product.minWholesaleQty : 1)}
            disabled={!product.inStock}
            className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              !product.inStock
                ? 'bg-neutral-900 text-neutral-600 border border-neutral-950/40 cursor-not-allowed'
                : pricingMode === 'wholesale'
                  ? 'bg-neutral-900 border border-brand-cyan text-brand-cyan hover:bg-brand-cyan hover:text-neutral-950 focus:outline-none focus:ring-1 focus:ring-brand-cyan'
                  : 'bg-neutral-900 border border-gold-500/20 text-gold-500 hover:bg-gold-500 hover:text-neutral-950 focus:outline-none focus:ring-1 focus:ring-gold-500'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {pricingMode === 'wholesale' && qtyInCart === 0 
              ? `Llevar Pack Mínimo (${product.minWholesaleQty} un.)` 
              : 'Añadir al Carrito'
            }
          </button>
        </div>

      </div>
    </article>
  );
};
