import React, { useState, useRef, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { CATEGORIES, PRODUCTS } from './data';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValueProps } from './components/ValueProps';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { 
  Search, 
  X, 
  Tag, 
  Instagram, 
  Phone, 
  MapPin, 
  Clock, 
  Scissors, 
  Sparkles,
  Info,
  ArrowRight,
  Plus,
  Loader2,
  Lock,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  Save
} from 'lucide-react';
import { Product } from './types';

function CatalogApp() {
  const { 
    pricingMode, 
    setPricingMode, 
    categoryFilter, 
    setCategoryFilter, 
    searchQuery, 
    setSearchQuery,
    showToast
  } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);

  // Dynamic Products List state initialized with standard seed data
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  // Admin Form state
  const [showToken, setShowToken] = useState(false);
  const [adminToken, setAdminToken] = useState('royal_admin_secret_token');
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'beard' | 'hair' | 'tools' | 'wholesale'>('beard');
  const [newProductPriceRetail, setNewProductPriceRetail] = useState('');
  const [newProductPriceWholesale, setNewProductPriceWholesale] = useState('');
  const [newProductMinWholesaleQty, setNewProductMinWholesaleQty] = useState('6');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductFeatures, setNewProductFeatures] = useState('');
  const [newProductIllustration, setNewProductIllustration] = useState<'oil' | 'balm' | 'pomade' | 'spray' | 'razor' | 'comb' | 'clipper' | 'pack'>('pomade');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editing individual products states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductCategory, setEditProductCategory] = useState<'beard' | 'hair' | 'tools' | 'wholesale'>('beard');
  const [editProductPriceRetail, setEditProductPriceRetail] = useState('');
  const [editProductPriceWholesale, setEditProductPriceWholesale] = useState('');
  const [editProductMinWholesaleQty, setEditProductMinWholesaleQty] = useState('6');
  const [editProductWholesaleUnitDesc, setEditProductWholesaleUnitDesc] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductFeatures, setEditProductFeatures] = useState('');
  const [editProductRating, setEditProductRating] = useState('5.0');
  const [editProductInStock, setEditProductInStock] = useState(true);
  const [editProductFeatured, setEditProductFeatured] = useState(false);
  const [editProductIllustration, setEditProductIllustration] = useState<'oil' | 'balm' | 'pomade' | 'spray' | 'razor' | 'comb' | 'clipper' | 'pack'>('pomade');
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditProductName(product.name);
    setEditProductCategory(product.category);
    setEditProductPriceRetail(product.priceRetail.toString());
    setEditProductPriceWholesale(product.priceWholesaleMin?.toString() || '');
    setEditProductMinWholesaleQty(product.minWholesaleQty?.toString() || '6');
    setEditProductWholesaleUnitDesc(product.wholesaleUnitDesc || `Mínimo ${product.minWholesaleQty} un.`);
    setEditProductDescription(product.description || '');
    setEditProductFeatures(product.features ? product.features.join(', ') : '');
    setEditProductRating(product.rating ? product.rating.toString() : '5.0');
    setEditProductInStock(product.inStock !== false);
    setEditProductFeatured(product.featured === true);
    setEditProductIllustration(product.illustrationType || 'pomade');
    setEditSelectedFile(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editProductName || !editProductPriceRetail || !editProductCategory) {
      showToast('Por favor completa los campos requeridos para editar el producto.', 'warn');
      return;
    }

    if (editSelectedFile) {
      const isVideo = editSelectedFile.type.startsWith('video/');
      const fileSizeMB = editSelectedFile.size / (1024 * 1024);
      if (isVideo) {
        if (fileSizeMB > 10) {
          showToast('El video de reemplazo supera el límite de 10 MB.', 'warn');
          return;
        }
      } else {
        if (fileSizeMB > 2) {
          showToast('La imagen de reemplazo supera el límite de 2 MB.', 'warn');
          return;
        }
      }
    }

    setIsSavingEdit(true);
    try {
      const formData = new FormData();
      formData.append('name', editProductName);
      formData.append('category', editProductCategory);
      formData.append('priceRetail', editProductPriceRetail);
      formData.append('priceWholesaleMin', editProductPriceWholesale || String(Number(editProductPriceRetail) * 0.65));
      formData.append('minWholesaleQty', editProductMinWholesaleQty);
      formData.append('wholesaleUnitDesc', editProductWholesaleUnitDesc || `Mínimo ${editProductMinWholesaleQty} un.`);
      formData.append('description', editProductDescription);
      formData.append('features', editProductFeatures);
      formData.append('rating', editProductRating);
      formData.append('inStock', String(editProductInStock));
      formData.append('featured', String(editProductFeatured));
      formData.append('illustrationType', editProductIllustration);
      if (editSelectedFile) {
        formData.append('media', editSelectedFile);
      }

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast('¡Producto actualizado exitosamente!', 'success');
          setEditingProduct(null);
          fetchProducts();
        } else {
          showToast(data.message || 'Error al actualizar el producto.', 'error');
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        showToast(errData.message || 'Token de acceso inválido o error del servidor.', 'error');
      }
    } catch (err: any) {
      showToast('Error técnico al conectar con el servidor de catálogo.', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!editingProduct) return;
    const confirmText = `¿Estás completamente seguro de eliminar el producto "${editingProduct.name}" del catálogo definitivo? Esta acción no se puede deshacer.`;
    if (!window.confirm(confirmText)) return;

    setIsDeletingProduct(true);
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          showToast(`¡Producto eliminado exitosamente!`, 'success');
          setEditingProduct(null);
          fetchProducts();
        } else {
          showToast(data.message || 'Error al eliminar el producto.', 'error');
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        showToast(errData.message || 'Token incorrecto o error del servidor.', 'error');
      }
    } catch (err) {
      showToast('Error con la conexión al servidor de catálogo.', 'error');
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Fetch products from server on mount
  const fetchProducts = async () => {
    setIsFetchingProducts(true);
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          // Merge dynamic products with any missing standard ones so it is highly complete
          const fetchedIds = new Set(data.products.map((p: any) => p.id));
          const uniqueSeeds = PRODUCTS.filter(p => !fetchedIds.has(p.id));
          setProductsList([...data.products, ...uniqueSeeds]);
        }
      }
    } catch (error) {
      console.log('Error fetching product catalog list from Express backend:', error);
    } finally {
      setIsFetchingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setAdminMode(prev => {
          const next = !prev;
          if (typeof window !== 'undefined') {
            setTimeout(() => {
              showToast(next ? '🔐 Modo Admin Activado' : '🔒 Modo Admin Desactivado', next ? 'success' : 'info');
            }, 0);
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  // Scroll smoothly down to the catalog section
  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filter products based on search queries and category tags
  const filteredProducts = productsList.filter((product) => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
  };

  // Handle image/video drops and selections
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Clean form input
  const resetAdminForm = () => {
    setNewProductName('');
    setNewProductCategory('beard');
    setNewProductPriceRetail('');
    setNewProductPriceWholesale('');
    setNewProductMinWholesaleQty('6');
    setNewProductDescription('');
    setNewProductFeatures('');
    setNewProductIllustration('pomade');
    setSelectedFile(null);
  };

  // Handle new product submit with Cloudinary optimization
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProductName || !newProductPriceRetail || !newProductCategory) {
      showToast('Por favor completa los campos principales requeridos.', 'warn');
      return;
    }

    // Client-side file size restrictions check exactly as requested:
    if (selectedFile) {
      const isVideo = selectedFile.type.startsWith('video/');
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (isVideo) {
        if (fileSizeMB > 10) {
          showToast('El video demostrativo supera el límite estricto de 10 MB.', 'warn');
          return;
        }
      } else {
        if (fileSizeMB > 2) {
          showToast('La imagen supera el límite estricto de 2 MB.', 'warn');
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', newProductName);
      formData.append('category', newProductCategory);
      formData.append('priceRetail', newProductPriceRetail);
      if (newProductPriceWholesale) {
        formData.append('priceWholesaleMin', newProductPriceWholesale);
      }
      formData.append('minWholesaleQty', newProductMinWholesaleQty);
      formData.append('description', newProductDescription);
      formData.append('features', newProductFeatures);
      formData.append('illustrationType', newProductIllustration);
      if (selectedFile) {
        formData.append('media', selectedFile);
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast('¡Catálogo actualizado con éxito!', 'success');
        resetAdminForm();
        setIsAdminOpen(false);
        // Refresh products list
        await fetchProducts();
      } else {
        showToast(data.message || 'Error administrativo al cargar producto.', 'warn');
      }
    } catch (err: any) {
      showToast('Fallo la conexión con la API del servidor.', 'warn');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-gold-500 selection:text-neutral-900">
      
      {/* Prime Header & Navigation */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* Main Core View Modules */}
      <main className="flex-grow">
        
        {/* Cinematic Brand Marquee */}
        <Hero onBrowseCatalog={scrollToCatalog} />

        {/* Brand visual proposition blocks */}
        <ValueProps />

        {/* Dynamic Catalog Section */}
        <div ref={catalogRef} className="scroll-mt-20 py-16 sm:py-24 bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Catalog header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                    Catálogo de Productos
                  </h3>
                  {adminMode && (
                    <>
                      <span className="px-2 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-[9px] font-bold uppercase tracking-widest animate-pulse">
                        Admin
                      </span>
                      <button 
                        onClick={() => setIsAdminOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/25 text-gold-400 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none"
                      >
                        <Plus className="w-3 h-3" />
                        Cargar Producto
                      </button>
                    </>
                  )}
                </div>
                <p className="mt-2 text-sm text-neutral-400 font-light max-w-xl">
                  Selecciona artículos premium para tu barbería o uso personal. Intercambia entre precios al detalle o activa tarifas de distribuidor al por mayor.
                </p>
              </div>

              {/* Mode switch helper in catalog */}
              <div className="flex items-center gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-900/80 max-w-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500/10 text-gold-500">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider leading-none">Tipo de Compra</p>
                  <p className="text-xs font-semibold mt-0.5 text-neutral-300">
                    Estás viendo precios{' '}
                    <span className={pricingMode === 'wholesale' ? 'text-brand-cyan uppercase font-bold' : 'text-gold-400 uppercase font-bold'}>
                      {pricingMode === 'wholesale' ? 'Por Mayor' : 'Estándar'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Catalog Controls: Category Tags & Input Search Box */}
            <div className="space-y-6 mb-10">
              
              {/* Elastic responsive Categories pills */}
              <div className="flex flex-nowrap overflow-x-auto gap-2.5 pb-3 scrollbar-none justify-start">
                {CATEGORIES.map((cat) => {
                  const isActive = categoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id as any)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex-shrink-0 border ${
                        isActive
                          ? 'bg-gold-500 text-neutral-950 border-gold-500 font-extrabold shadow-lg shadow-gold-500/10'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-850 hover:text-neutral-200 hover:border-neutral-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Advanced Search bar and count status */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Search glass-input */}
                <div className="relative w-full sm:max-w-md">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar pomadas, aceites, navajas..."
                    className="w-full h-11 rounded-xl bg-neutral-900 border border-neutral-850 pl-11 pr-10 text-xs font-medium text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/30 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500 hover:text-neutral-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Inline filter status context */}
                <div className="flex items-center gap-3">
                  {isFetchingProducts && (
                    <Loader2 className="w-3.5 h-3.5 text-gold-500 animate-spin" />
                  )}
                  <div className="text-xs text-neutral-500 font-mono tracking-wider">
                    Resultados: <span className="text-neutral-300 font-bold">{filteredProducts.length}</span> productos
                  </div>
                </div>

              </div>

            </div>

            {/* Catalog Grid */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-neutral-900/60 bg-neutral-900/10 py-16 px-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-850 text-neutral-500 mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="font-display text-base font-bold text-neutral-300">No se encontraron productos</h4>
                <p className="mt-2 text-xs text-neutral-500 max-w-sm mx-auto font-light">
                  No hay coincidencias para tu búsqueda "{searchQuery}" en la categoría seleccionada. Intenta usar otros términos o reiniciar los filtros.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 px-5 py-2.5 rounded-lg border border-neutral-850 hover:border-neutral-700 bg-neutral-900 text-xs font-bold text-neutral-300 uppercase tracking-widest transition-all cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onEdit={adminMode ? handleStartEdit : undefined} />
                ))}
              </div>
            )}

            {/* Dynamic notice about Wholesale validation */}
            {pricingMode === 'wholesale' && (
              <div className="mt-12 bg-neutral-900/30 border border-neutral-900 rounded-xl p-4 flex gap-3 max-w-3xl mx-auto">
                <Info className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                  <strong className="font-semibold text-brand-cyan">💡 Nota de Distribuidor:</strong> El precio al por mayor se activa automáticamente por artículo cuando alcanzas la cantidad mínima especificada en el carrito. Si tienes menos unidades en algún producto en el carrito, se aplicará la tarifa estándar individual para ese artículo en particular.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Instagram CTA & Social Follow Screen */}
        <section className="bg-neutral-950 border-t border-neutral-900 py-16 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative max-w-xl mx-auto px-4 z-10">
            <Instagram className="w-8 h-8 text-gold-500 mx-auto mb-4" />
            <h4 className="font-serif text-2xl font-bold tracking-wide italic text-brand-cyan mb-2">
              @royal_grooming.rd
            </h4>
            <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
              Síguenos en Instagram para ver demos de productos en vivo, reseñas de barberos dominicanos emblemáticos y ofertas exclusivas de fin de mes.
            </p>
            <a
              href="https://instagram.com/royal_grooming.rd"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold tracking-widest text-[#F9D976] uppercase hover:bg-neutral-850 hover:border-gold-500/20 transition-colors"
            >
              Seguir en Instagram
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

      </main>

      {/* Luxury Dark Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-500 py-12 text-xs font-light">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-neutral-900/80">
            
            {/* Col 1: Brand & Bio */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-serif text-md font-bold italic text-brand-cyan">Royal</span>
                <span className="font-display text-xs font-extrabold tracking-widest text-[#F9D976]">Grooming</span>
              </div>
              <p className="leading-relaxed text-neutral-500 text-[11px]">
                Distribuidores mayoristas y minoristas de productos cosméticos de barbería premium en Santo Domingo y toda la República Dominicana.
              </p>
            </div>

            {/* Col 2: Atencion & Contact */}
            <div>
              <h5 className="font-display text-[10px] font-bold tracking-widest text-neutral-300 uppercase mb-4">Atención al Cliente</h5>
              <ul className="space-y-2 text-[11px]">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gold-500" />
                  <a href="tel:+18096466462" className="hover:text-gold-400 font-mono">+1 (809) 646-6462</a>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gold-500" />
                  <span>Lun - Sáb: 8:00 AM - 7:00 PM</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" strokeWidth={1} />
                  <span>Despachos desde Santo Domingo, RD</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Envíos */}
            <div>
              <h5 className="font-display text-[10px] font-bold tracking-widest text-neutral-300 uppercase mb-4">Cobertura de Envío</h5>
              <p className="leading-relaxed text-[11px] mb-2">
                Hacemos entregas a todo el territorio nacional vía agencias de transporte: Metro Pac, Caribe Pack, BM Cargo o envío express privado.
              </p>
              <span className="inline-block px-2.5 py-0.5 rounded bg-neutral-900 text-[9px] uppercase tracking-wider text-amber-500 font-bold border border-neutral-850">
                🇩🇴 Despachos Diarios
              </span>
            </div>

            {/* Col 4: Barber values */}
            <div>
              <h5 className="font-display text-[10px] font-bold tracking-widest text-neutral-300 uppercase mb-4">Inspiración Profesional</h5>
              <p className="leading-relaxed text-[11px]">
                Formulados con aceites prensados en frío e ingredientes hipoalergénicos para un afeitado y estilismo digno de los mejores barberos del mundo.
              </p>
              <div className="flex gap-1.5 mt-3 text-gold-500/60">
                <Scissors className="w-4 h-4" />
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-600">
            <p>© {new Date().getFullYear()} Royal Grooming RD. Todos los derechos reservados. Diseñado para barberos modernos.</p>
            <div className="flex gap-4">
              <span className="hover:text-neutral-500 transition-colors">Terminos de Servicio</span>
              <span className="hover:text-neutral-500 transition-colors">Políticas de Envío</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Cart Slider drawer container */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Toast Alert notifications screen container */}
      <ToastContainer />

      {/* Admin Upload Product Drawer Panel */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="admin-panel-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Dark glass backdrop overlay */}
            <div 
              onClick={() => setIsAdminOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
            ></div>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-500 ease-in-out">
                <div className="flex h-full flex-col justify-between bg-neutral-950 border-l border-neutral-900 shadow-2xl">
                  
                  {/* Card Main content scrollable container */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
                    
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-900/80">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/5 border border-gold-400/20 text-[#F9D976]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold tracking-widest text-[#F9D976] uppercase font-display leading-tight">
                            Portal Administrador
                          </h2>
                          <p className="text-[10px] text-neutral-400 lowercase font-light">
                            publicación directa al catálogo de royal · <kbd className="text-brand-cyan font-mono">Ctrl+Shift+A</kbd>
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setIsAdminOpen(false)}
                        className="rounded-full h-8 w-8 flex items-center justify-center bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Admin Post upload Form */}
                    <form onSubmit={handleAdminSubmit} className="space-y-5 text-xs text-neutral-300">
                      
                      {/* Security Access Token */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                          <span>Token de Seguridad Admin (Obligatorio)</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showToken ? "text" : "password"}
                            required
                            value={adminToken}
                            onChange={(e) => setAdminToken(e.target.value)}
                            placeholder="Token de administrador..."
                            className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-850 pl-3 pr-10 font-mono text-neutral-200 focus:outline-none focus:border-gold-500/40"
                          />
                          <button
                            type="button"
                            onClick={() => setShowToken(!showToken)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 focus:outline-none cursor-pointer"
                          >
                            {showToken ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-1.5 flex items-center gap-1">
                          <Info className="w-3 h-3 text-gold-500" />
                          <span>Ingresa el token administrativo configurado en el servidor</span>
                        </p>
                      </div>

                      {/* Product Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                          Nombre del Producto
                        </label>
                        <input
                          type="text"
                          required
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                          placeholder="Ej: Pomada Arcilla Matte Carbón"
                          className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40"
                        />
                      </div>

                      {/* Category Selector */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                          Categoría Comercial
                        </label>
                        <select
                          value={newProductCategory}
                          onChange={(e: any) => setNewProductCategory(e.target.value)}
                          className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40"
                        >
                          <option value="beard">Barba Premium</option>
                          <option value="hair">Cabello & Estilo</option>
                          <option value="tools">Herramientas & Acero</option>
                          <option value="wholesale">Mayorista Lotes</option>
                        </select>
                      </div>

                      {/* Prices configuration row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                            Precio de Venta (DOP)
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={newProductPriceRetail}
                            onChange={(e) => setNewProductPriceRetail(e.target.value)}
                            placeholder="Ej: 1100"
                            className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                            Precio Mayorista (DOP)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={newProductPriceWholesale}
                            onChange={(e) => setNewProductPriceWholesale(e.target.value)}
                            placeholder="Ej: 650"
                            className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40"
                          />
                        </div>
                      </div>

                      {/* Min quantity and Illustration fallback */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                            Cant Min Por Mayor
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={newProductMinWholesaleQty}
                            onChange={(e) => setNewProductMinWholesaleQty(e.target.value)}
                            className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                            Ilustración Vectorial
                          </label>
                          <select
                            value={newProductIllustration}
                            onChange={(e: any) => setNewProductIllustration(e.target.value)}
                            className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40"
                          >
                            <option value="oil">Aceite Dorado Barba</option>
                            <option value="balm">Bálsamo Tarro</option>
                            <option value="pomade">Pomada Capilar</option>
                            <option value="spray">Laca Spray</option>
                            <option value="razor">Navaja de Fibra</option>
                            <option value="comb">Peine de Madera</option>
                            <option value="clipper">Máquina Recortadora</option>
                            <option value="pack">Pack Lote Caja</option>
                          </select>
                        </div>
                      </div>

                      {/* Short description */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                          Descripción Comercial
                        </label>
                        <textarea
                          rows={2}
                          value={newProductDescription}
                          onChange={(e) => setNewProductDescription(e.target.value)}
                          placeholder="Cera fijadora extrema e hidratación prolongada formulada en..."
                          className="w-full rounded-lg bg-neutral-900 border border-neutral-850 p-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 resize-none"
                        ></textarea>
                      </div>

                      {/* Bullet points features */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                          Características Clave (Separadas por Comas)
                        </label>
                        <input
                          type="text"
                          value={newProductFeatures}
                          onChange={(e) => setNewProductFeatures(e.target.value)}
                          placeholder="Fijación de larga duración, Acabado mate impecable, Lavable con agua"
                          className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40"
                        />
                      </div>

                      {/* Interactive Drag and Drop area for photos/videos */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                          Multimedia (Max Imagen: 2MB, Max Video: 10MB)
                        </label>
                        
                        <div className="relative border-2 border-dashed border-neutral-800 hover:border-gold-500/30 rounded-xl bg-neutral-900/40 p-5 transition-all text-center flex flex-col items-center justify-center group overflow-hidden">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="w-6 h-6 text-neutral-500 group-hover:text-[#F9D976] transition-colors mb-2" />
                          <p className="text-[11px] text-neutral-400 group-hover:text-neutral-200 transition-colors">
                            {selectedFile ? (
                              <span className="text-[#38BDF8] font-bold">✓ {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                            ) : (
                              "Suelte su foto/video aquí o navegue"
                            )}
                          </p>
                          <p className="text-[9px] text-neutral-600 mt-1">Soporta PNG, JPG, MP4 y MOV para el catálogo</p>
                        </div>
                      </div>

                      {/* Submitting Status feedback loader */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-gold-500 via-gold-550 to-gold-600 hover:opacity-90 font-bold uppercase tracking-widest text-[#111] transition-all flex items-center justify-center gap-2 cursor-pointer select-none disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                            Subiendo a Cloudinary...
                          </>
                        ) : (
                          "Publicar Producto Premium"
                        )}
                      </button>

                    </form>

                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Dynamic Product Edit & Update modal (Admin Panel) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-850 bg-neutral-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-850 bg-neutral-950/40">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gold-550/10 border border-gold-500/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gold-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-neutral-100 uppercase tracking-wider">
                    Administrador de Producto
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    ID único: #{editingProduct.id.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setEditingProduct(null)}
                className="h-8 w-8 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-850 flex items-center justify-center text-neutral-400 hover:text-neutral-205 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {/* Dynamic warning about token persistence */}
              <div className="bg-neutral-950/60 rounded-xl border border-neutral-850 p-4 flex gap-3">
                <Info className="w-5 h-5 text-[#F9D976] flex-shrink-0" />
                <div className="text-[11px] leading-relaxed text-neutral-400">
                  <span className="font-bold text-neutral-200 block mb-0.5">Autorización Administrativa Requerida</span>
                  Los cambios se enviarán y persistirán en tiempo real. Se utilizará el token administrativo actual para validar la operación de forma segura.
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Nombre del Producto <span className="text-gold-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Categoría <span className="text-gold-500">*</span>
                  </label>
                  <select
                    value={editProductCategory}
                    onChange={(e: any) => setEditProductCategory(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs"
                  >
                    <option value="beard">Cuidado de Barba</option>
                    <option value="hair">Cabello & Estilo</option>
                    <option value="tools">Herramientas</option>
                    <option value="wholesale">Línea Mayorista</option>
                  </select>
                </div>
              </div>

              {/* Pricing Rules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Precio Detalle (DOP) <span className="text-gold-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editProductPriceRetail}
                    onChange={(e) => setEditProductPriceRetail(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Precio Al Por Mayor (DOP)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editProductPriceWholesale}
                    onChange={(e) => setEditProductPriceWholesale(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Mínimo Mayorista (Un.)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editProductMinWholesaleQty}
                    onChange={(e) => setEditProductMinWholesaleQty(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Descripción Unidades Mayorista
                  </label>
                  <input
                    type="text"
                    value={editProductWholesaleUnitDesc}
                    onChange={(e) => setEditProductWholesaleUnitDesc(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs"
                    placeholder="Ej: Mínimo 6 un."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Valoración Estrellas (1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    placeholder="5.0"
                    value={editProductRating}
                    onChange={(e) => setEditProductRating(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Ilustración Vectorial Fallback
                  </label>
                  <select
                    value={editProductIllustration}
                    onChange={(e: any) => setEditProductIllustration(e.target.value)}
                    className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs"
                  >
                    <option value="oil">Aceite Dorado Barba</option>
                    <option value="balm">Bálsamo Tarro</option>
                    <option value="pomade">Pomada Capilar</option>
                    <option value="spray">Laca Spray</option>
                    <option value="razor">Navaja de Fibra</option>
                    <option value="comb">Peine de Madera</option>
                    <option value="clipper">Máquina Recortadora</option>
                    <option value="pack">Pack Lote Caja</option>
                  </select>
                </div>
              </div>

              {/* Status checkboxes */}
              <div className="grid grid-cols-2 gap-4 py-1">
                <label className="flex items-center gap-3 bg-neutral-950/30 border border-neutral-850 rounded-xl p-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editProductInStock}
                    onChange={(e) => setEditProductInStock(e.target.checked)}
                    className="h-4 w-4 bg-neutral-900 accent-gold-500 rounded border-neutral-800 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-200 block">En Existencia</span>
                    <span className="text-[10px] text-neutral-500">Muestra en stock para el carrito</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 bg-neutral-950/30 border border-neutral-850 rounded-xl p-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editProductFeatured}
                    onChange={(e) => setEditProductFeatured(e.target.checked)}
                    className="h-4 w-4 bg-neutral-900 accent-gold-550 rounded border-neutral-800 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-200 block">Recomendado León</span>
                    <span className="text-[10px] text-neutral-500">Añade insignia brillante premium</span>
                  </div>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Descripción Comercial Especial
                </label>
                <textarea
                  rows={2}
                  value={editProductDescription}
                  onChange={(e) => setEditProductDescription(e.target.value)}
                  className="w-full rounded-lg bg-neutral-950 border border-neutral-850 p-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs resize-none"
                ></textarea>
              </div>

              {/* Features list */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Características (Beneficios del Producto)</span>
                  <span className="text-[9px] text-neutral-500 lowercase">Separadas por comas</span>
                </label>
                <input
                  type="text"
                  value={editProductFeatures}
                  onChange={(e) => setEditProductFeatures(e.target.value)}
                  placeholder="Ej: Ahorro del 45%, Material promocional incluido, Asesoría de ventas"
                  className="w-full h-10 rounded-lg bg-neutral-950 border border-neutral-850 px-3 text-neutral-200 focus:outline-none focus:border-gold-500/40 text-xs"
                />
              </div>

              {/* Multimedia Upload */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Foto / Video del Producto (Max Imagen: 2MB, Max Video: 10MB)
                </label>
                
                <div className="relative border border-dashed border-neutral-800 hover:border-gold-500/30 rounded-xl bg-neutral-950/40 p-4 transition-all text-center flex flex-col items-center justify-center group overflow-hidden">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setEditSelectedFile(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-neutral-500 group-hover:text-gold-400 transition-colors mb-1.5" />
                  <p className="text-[10.5px] text-neutral-400">
                    {editSelectedFile ? (
                      <span className="text-[#38BDF8] font-bold">✓ {editSelectedFile.name} ({(editSelectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                    ) : (
                      "Presiona aquí para elegir una nueva foto/video"
                    )}
                  </p>
                </div>
              </div>

            </form>

            {/* Sticky/Fixed Footer Action buttons */}
            <div className="p-6 border-t border-neutral-850 bg-neutral-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Delete button (danger action) */}
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isDeletingProduct || isSavingEdit}
                className="w-full sm:w-auto h-11 px-4 rounded-xl border border-red-900/60 text-red-400 hover:bg-red-950/30 font-bold uppercase tracking-wider text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {isDeletingProduct ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    Borrando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-red-500" />
                    Eliminar Catálogo
                  </>
                )}
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  disabled={isSavingEdit || isDeletingProduct}
                  className="w-full sm:w-auto h-11 px-5 rounded-xl border border-neutral-800 hover:border-neutral-700 font-bold uppercase tracking-wider text-[10px] text-neutral-400 hover:text-neutral-200 transition-all cursor-pointer disabled:opacity-40"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit || isDeletingProduct}
                  className="w-full sm:w-auto h-11 px-6 rounded-xl bg-gradient-to-r from-gold-550 to-gold-650 text-neutral-950 hover:brightness-105 font-extrabold uppercase tracking-widest text-[10.5px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 shadow-lg shadow-gold-505/10"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <CatalogApp />
    </CartProvider>
  );
}
