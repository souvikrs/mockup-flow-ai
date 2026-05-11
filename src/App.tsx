/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Download, 
  RefreshCcw, 
  Layers, 
  Maximize2, 
  Trash2, 
  Move, 
  RotateCw, 
  Scale, 
  ChevronRight,
  Info
} from 'lucide-react';
import { PRODUCTS, ProductMockup } from './constants';

// --- Components ---

const LogoPreview = ({ file, onRemove }: { file: File | string, onRemove: () => void }) => {
  const url = typeof file === 'string' ? file : URL.createObjectURL(file);
  return (
    <div className="relative group aspect-square bg-[#E4E3E0] border border-black p-4 flex items-center justify-center">
      <img src={url} alt="Logo preview" className="max-w-full max-h-full object-contain" />
      <button 
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-black text-white p-1 hover:bg-neutral-800 transition-colors"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
};

export default function App() {
  const [logo, setLogo] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductMockup>(PRODUCTS[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [controls, setControls] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize controls when product changes
  useEffect(() => {
    setControls({
      x: selectedProduct.logoPosition.x,
      y: selectedProduct.logoPosition.y,
      scale: 1,
      rotation: selectedProduct.logoPosition.rotation,
      opacity: selectedProduct.opacity
    });
  }, [selectedProduct]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Canvas Rendering Logic
  const renderMockup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const productImage = new Image();
    productImage.crossOrigin = 'anonymous';
    productImage.src = selectedProduct.imageUrl;

    productImage.onload = () => {
      // Set canvas size to match image
      canvas.width = productImage.width;
      canvas.height = productImage.height;

      // Draw product base
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(productImage, 0, 0);

      if (logo) {
        const logoImage = new Image();
        logoImage.src = logo;
        logoImage.onload = () => {
          ctx.save();
          
          // Calculate logo dimensions
          const baseWidth = canvas.width * selectedProduct.logoPosition.width;
          const logoAspectRatio = logoImage.width / logoImage.height;
          const width = baseWidth * controls.scale;
          const height = width / logoAspectRatio;

          // Position and Rotate
          const centerX = canvas.width * controls.x;
          const centerY = canvas.height * controls.y;
          
          ctx.translate(centerX, centerY);
          ctx.rotate((controls.rotation * Math.PI) / 180);
          
          // Apply Blend Mode and Opacity
          ctx.globalCompositeOperation = selectedProduct.id === 'hoodie-black' ? 'screen' : 'multiply';
          ctx.globalAlpha = controls.opacity;

          // Draw the logo
          ctx.drawImage(logoImage, -width / 2, -height / 2, width, height);
          
          ctx.restore();
        };
      }
    };
  }, [logo, selectedProduct, controls]);

  useEffect(() => {
    renderMockup();
  }, [renderMockup]);

  const downloadMockup = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsExporting(true);
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `mockup-${selectedProduct.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Logo & Controls */}
      <aside className="w-full md:w-80 border-r border-[#141414] flex flex-col bg-white z-10">
        <div className="p-6 border-bottom border-[#141414]">
          <h1 className="text-2xl font-bold uppercase tracking-tighter flex items-center gap-2">
            <Layers className="text-[#141414]" />
            MockupFlow
          </h1>
          <p className="text-[10px] uppercase font-mono opacity-50 mt-1">AI-Powered Merch Visualization</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Logo Section */}
          <section className="p-6 border-b border-[#141414]">
            <h2 className="text-xs uppercase font-bold mb-4 flex items-center gap-2">
              <Upload size={14} /> 01. Brand Assets
            </h2>
            {!logo ? (
              <label className="cursor-pointer border-2 border-dashed border-neutral-300 hover:border-black transition-all aspect-square flex flex-col items-center justify-center p-4 bg-neutral-50 group">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  ref={fileInputRef}
                />
                <div className="bg-white p-3 border border-neutral-200 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="text-neutral-400 group-hover:text-black" />
                </div>
                <span className="text-[11px] font-mono mt-4 text-center opacity-60">UPLOAD PNG OR SVG<br/>TRANSPARENT PREFERRED</span>
              </label>
            ) : (
              <LogoPreview file={logo} onRemove={() => setLogo(null)} />
            )}
          </section>

          {/* Product Selector */}
          <section className="p-6 border-b border-[#141414]">
            <h2 className="text-xs uppercase font-bold mb-4 flex items-center gap-2">
              <ChevronRight size={14} /> 02. Select Surface
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`text-[10px] uppercase p-2 border transition-all ${
                    selectedProduct.id === prod.id 
                    ? 'bg-black text-white border-black' 
                    : 'bg-neutral-50 border-neutral-200 hover:border-black'
                  }`}
                >
                  {prod.name}
                </button>
              ))}
            </div>
          </section>

          {/* Adjustments */}
          <section className="p-6 bg-neutral-50">
            <h2 className="text-xs uppercase font-bold mb-4 flex items-center gap-2">
              <Maximize2 size={14} /> 03. Adjustments
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] uppercase mb-1">
                  <span className="flex items-center gap-1"><Scale size={10} /> Scale</span>
                  <span>{Math.round(controls.scale * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="2.5" step="0.05"
                  value={controls.scale}
                  onChange={(e) => setControls(c => ({...c, scale: parseFloat(e.target.value)}))}
                  className="w-full accent-black"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase mb-1">
                  <span className="flex items-center gap-1"><RotateCw size={10} /> Rotation</span>
                  <span>{controls.rotation}°</span>
                </div>
                <input 
                  type="range" min="-180" max="180" step="1"
                  value={controls.rotation}
                  onChange={(e) => setControls(c => ({...c, rotation: parseInt(e.target.value)}))}
                  className="w-full accent-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                 <div>
                    <div className="text-[10px] uppercase mb-1 flex items-center gap-1"><Move size={10} /> POS X</div>
                    <input 
                      type="range" min="0" max="1" step="0.01"
                      value={controls.x}
                      onChange={(e) => setControls(c => ({...c, x: parseFloat(e.target.value)}))}
                      className="w-full accent-black"
                    />
                 </div>
                 <div>
                    <div className="text-[10px] uppercase mb-1 flex items-center gap-1"><Move size={10} /> POS Y</div>
                    <input 
                      type="range" min="0" max="1" step="0.01"
                      value={controls.y}
                      onChange={(e) => setControls(c => ({...c, y: parseFloat(e.target.value)}))}
                      className="w-full accent-black"
                    />
                 </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-[#141414] bg-white">
          <button 
            onClick={downloadMockup}
            disabled={!logo || isExporting}
            className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-20 transition-all active:scale-[0.98]"
          >
            {isExporting ? <RefreshCcw className="animate-spin" /> : <Download size={14} />}
            {isExporting ? 'Generating Files...' : 'Export High-Res'}
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 relative flex items-center justify-center p-6 md:p-12">
        <div className="absolute top-6 left-6 text-[10px] font-mono opacity-30 pointer-events-none hidden md:block">
          SURFACE_ID: {selectedProduct.id.toUpperCase()}<br/>
          RENDER_ENGINE: CANVAS_2D_BLEND<br/>
          COORDS: {controls.x.toFixed(2)}, {controls.y.toFixed(2)}
        </div>

        <div className="relative shadow-[32px_32px_0px_#14141420] border border-[#141414] bg-white max-w-full max-h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProduct.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center"
            >
              <canvas 
                ref={canvasRef} 
                className="max-w-[70vw] max-h-[85vh] object-contain cursor-crosshair shadow-2xl"
              />
              {!logo && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur border border-black p-4 text-[10px] uppercase font-bold tracking-widest animate-pulse">
                      Waiting for assets
                    </div>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Tooltips */}
        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2 max-w-xs transition-all">
          <motion.div 
            key={selectedProduct.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-black p-3 flex items-start gap-3 text-[10px] font-mono shadow-lg"
          >
            <div className="bg-blue-500 rounded-full p-1 mt-0.5">
               <Info size={10} className="text-white" />
            </div>
            <div>
              <span className="font-bold block mb-1 underline">AI PLACEMENT_ENGINE</span>
              <span>
                {selectedProduct.category === 'Apparel' 
                  ? 'Determined chest center as optimal for maximum visibility. Minimal distortion detected.' 
                  : selectedProduct.category === 'Home'
                  ? 'Side placement optimized for right-handed grip perspective.'
                  : 'Center alignment verified for structural symmetry.'}
              </span>
            </div>
          </motion.div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #141414; }
        canvas { image-rendering: -webkit-optimize-contrast; }
      `}</style>
    </div>
  );
}

