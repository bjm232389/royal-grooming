import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, MessageSquareShare, Truck, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    pricingMode,
    setPricingMode,
    updateQuantity,
    removeFromCart,
    shippingRequired,
    setShippingRequired,
    clearCart,
    showToast
  } = useCart();

  // Helper helper to check if item quantity is eligible for Wholesale price
  const isWholesaleEligible = (item: any) => {
    return item.quantity >= item.product.minWholesaleQty;
  };

  // Helper helper to format currencies
  const formatCost = (val: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0
    }).format(val);
  };

  // Calculate pricing breakdown per item in cart
  // If in wholesale mode but min qty is not reached, fall back to retail price gracefully
  const calculatedCartItems = cart.map((item) => {
    const useWholesalePrice = pricingMode === 'wholesale' && isWholesaleEligible(item);
    const pricePerUnit = useWholesalePrice ? item.product.priceWholesaleMin : item.product.priceRetail;
    const itemTotal = pricePerUnit * item.quantity;
    
    return {
      ...item,
      useWholesalePrice,
      pricePerUnit,
      itemTotal
    };
  });

  // Calculate Overall Grand Total
  const grandTotal = calculatedCartItems.reduce((acc, item) => acc + item.itemTotal, 0);

  // Helper helper to adjust item directly to its minimum wholesale threshold
  const setMinWholesaleQty = (productId: string, minQty: number) => {
    updateQuantity(productId, minQty);
    showToast('Cantidad actualizada al mínimo mayorista para desbloquear descuento!', 'success');
  };

  // Checkout Handler: Formats messages and redirects directly to WhatsApp
  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Formatting products list
    let productsListText = '';
    calculatedCartItems.forEach((item) => {
      const priceText = formatCost(item.pricePerUnit);
      const wholesaleSuf = item.useWholesalePrice ? ' (Mayorista)' : '';
      productsListText += `• ${item.quantity} x ${item.product.name}${wholesaleSuf} - ${priceText} ud.\n`;
    });

    const isWholesaleModeActive = pricingMode === 'wholesale';

    // Constructing the final WhatsApp text template as strictly requested in the schema
    const whatsAppText = 
`🦁 *¡Hola Royal Grooming!* Quiero realizar el siguiente pedido:
------------------------------------------
${productsListText}------------------------------------------
*Total estimado:* ${formatCost(grandTotal)}
*Tipo de cliente:* ${isWholesaleModeActive ? 'Mayorista (Wholesale)' : 'Detalle (Retail)'}
*¿Requiere envío?:* ${shippingRequired ? 'Sí' : 'No'}`;

    // Final official WhatsApp link integration
    const finalWhatsAppUrl = `https://wa.me/18096466462?text=${encodeURIComponent(whatsAppText)}`;
    
    // Redirect standard behavior
    window.open(finalWhatsAppUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Dark Ambient Backdrop Filter */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Main Sliding White-Glass Panel */}
        <div 
          className="w-screen max-w-md bg-neutral-950 border-l border-neutral-900 flex flex-col shadow-2xl animate-[slideLeft_0.3s_cubic-bezier(0.16,1,0.3,1)]"
          style={{
            boxShadow: '-10px 0 35px -5px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Header Panel */}
          <div className="px-6 py-5 border-b border-neutral-900 bg-neutral-950 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-gold-500" />
              <h3 className="font-display text-lg font-bold text-neutral-100 tracking-wide uppercase">
                Tu Pedido Royal
              </h3>
              {cart.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 font-mono text-[11px] font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-neutral-400 hover:text-neutral-150 transition-colors bg-neutral-900 border border-neutral-850 hover:border-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List Container */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center text-neutral-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-display text-base font-bold text-neutral-300">Tu carrito está vacío</h4>
                <p className="text-xs text-neutral-500 max-w-[240px] mt-2 font-light">
                  Visita nuestro catálogo de productos premium para añadir artículos especiales.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 rounded-xl border border-gold-500/10 hover:border-gold-500/30 bg-gold-500/5 hover:bg-gold-500/10 text-xs font-bold text-gold-500 uppercase tracking-widest transition-all cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                {/* Mode status Banner */}
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  pricingMode === 'wholesale' 
                    ? 'bg-brand-cyan/5 border-brand-cyan/20' 
                    : 'bg-gold-500/5 border-gold-500/10'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${pricingMode === 'wholesale' ? 'bg-brand-cyan animate-pulse' : 'bg-gold-500'}`}></span>
                    <span className="text-xs font-medium text-neutral-300">
                      Precios:{' '}
                      <strong className={pricingMode === 'wholesale' ? 'text-brand-cyan' : 'text-gold-400'}>
                        {pricingMode === 'wholesale' ? 'AL POR MAYOR (DISTRIBUIDOR)' : 'DETALLE (RETAIL)'}
                      </strong>
                    </span>
                  </div>
                  
                  {/* Inline Toggle */}
                  <button
                    onClick={() => setPricingMode(pricingMode === 'retail' ? 'wholesale' : 'retail')}
                    className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-gold-400 underline transition-colors"
                  >
                    Cambiar
                  </button>
                </div>

                {/* Items loop */}
                <div className="divide-y divide-neutral-900/60 pb-4">
                  {calculatedCartItems.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-4">
                      
                      {/* Product Thumbnail / Color block */}
                      <div className="w-16 h-16 bg-neutral-900 border border-neutral-850 rounded-xl overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-md">
                          <rect x="25" y="25" width="50" height="50" rx="8" fill="#141413" stroke="#D4AF37" strokeWidth="1" />
                          <circle cx="50" cy="50" r="10" fill="#D4AF37" fillOpacity="0.2" />
                          <circle cx="50" cy="46" r="3" fill="#D4AF37" />
                        </svg>
                      </div>

                      {/* Product details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h5 className="text-sm font-semibold text-neutral-200 tracking-wide line-clamp-1">
                              {item.product.name}
                            </h5>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-neutral-600 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1.5">
                            <span>Precio ud: {formatCost(item.pricePerUnit)}</span>
                            {item.useWholesalePrice && (
                              <span className="text-[9px] uppercase px-1 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                                Mayorista
                              </span>
                            )}
                          </p>
                        </div>

                        {/* Quantity and sub-adjuster */}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center rounded-lg bg-neutral-900 border border-neutral-850 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-850 rounded"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-mono text-neutral-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-850 rounded"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Item totalized Cost */}
                          <p className="text-sm font-bold text-neutral-200">
                            {formatCost(item.itemTotal)}
                          </p>
                        </div>

                        {/* Wholesale Alert warning if minimum target is missing */}
                        {pricingMode === 'wholesale' && !item.useWholesalePrice && (
                          <div className="mt-2.5 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 flex flex-col gap-1.5">
                            <div className="flex items-start gap-1.5 text-[10px] text-amber-500 leading-tight">
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              <span>
                                Este producto exige un mínimo de{' '}
                                <strong className="font-bold">{item.product.minWholesaleQty} un.</strong> para precio Mayorista (llevas {item.quantity}). Pagando precio Detalle.
                              </span>
                            </div>
                            <button
                              onClick={() => setMinWholesaleQty(item.product.id, item.product.minWholesaleQty)}
                              className="text-[10px] font-bold text-left text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 uppercase tracking-wider"
                            >
                              <Sparkles className="w-3 h-3 text-amber-500 animate-bounce" />
                              Ajustar cantidad al mínimo ({item.product.minWholesaleQty} un.)
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Checkout Footer Panel */}
          {cart.length > 0 && (
            <div className="bg-neutral-950 border-t border-neutral-900 px-6 py-6 space-y-4">
              
              {/* Shipping Logistics Option Selector */}
              <div className="rounded-xl border border-neutral-900 bg-neutral-900/10 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-gold-500" />
                    <div>
                      <h4 className="text-xs font-bold text-neutral-200">¿Requiere Envío Nacional?</h4>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Enviamos a cualquier provincia de RD</p>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <div className="flex items-center rounded-lg bg-neutral-900 border border-neutral-850 p-1">
                    <button
                      onClick={() => setShippingRequired(true)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all duration-200 ${
                        shippingRequired 
                          ? 'bg-gold-500 text-neutral-950' 
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setShippingRequired(false)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all duration-200 ${
                        !shippingRequired 
                          ? 'bg-neutral-800 text-neutral-300' 
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Prices breakdown */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-500">
                  <span>Surtido de productos:</span>
                  <span>{cart.reduce((acc, item) => acc + item.quantity, 0)} unidades</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Logística (Envío):</span>
                  <span className="text-emerald-400">
                    {shippingRequired ? 'Por cobrar (A convenir)' : 'Retiro en almacén'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-900/60">
                  <span className="text-base font-bold text-neutral-200">Total Estimado:</span>
                  <span className="text-2xl font-extrabold text-gold-500 font-display">
                    {formatCost(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Final preorder trigger to WhatsApp */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full h-13 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-500 text-neutral-950 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-lg cursor-pointer"
                  style={{
                    boxShadow: '0 4px 20px -2px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <MessageSquareShare className="w-5 h-5 fill-neutral-950/10" />
                  Finalizar Pedido vía WhatsApp
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full text-center text-[10.5px] font-semibold text-neutral-500 hover:text-neutral-400 transition-colors uppercase tracking-wider py-1.5"
                >
                  Vaciar Bolsa de Compras
                </button>
              </div>

              <p className="text-[10px] text-center text-neutral-600 leading-normal max-w-xs mx-auto">
                *Esto generará un borrador de tu pedido y te redirigirá a WhatsApp para coordinar el pago (transferencia o efectivo) y entrega final.*
              </p>

            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes slideLeft {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
