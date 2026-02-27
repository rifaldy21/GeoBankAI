import React, { useState } from 'react';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const GeoMap: React.FC = () => {
  const [layers, setLayers] = useState({
    acquired: true,
    potential: true,
    branches: true,
  });
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative h-full min-h-[400px]">
      {/* Map Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200 pointer-events-auto flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Jakarta Pusat</h3>
            <p className="text-[10px] text-slate-500 font-medium">Interactive Territory Map</p>
          </div>
        </div>
        
        <div className="flex gap-2 pointer-events-auto relative">
          <div className="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><ZoomIn className="w-4 h-4" /></button>
            <div className="h-px bg-slate-100 mx-1" />
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"><ZoomOut className="w-4 h-4" /></button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className={cn(
                "bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border transition-all duration-200",
                showLayerPanel ? "border-indigo-500 text-indigo-600 ring-2 ring-indigo-500/20" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Layers className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showLayerPanel && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Map Layers</p>
                  <div className="space-y-1">
                    {[
                      { id: 'acquired', label: 'Acquired Merchants', color: 'bg-indigo-600' },
                      { id: 'potential', label: 'Potential TAM', color: 'bg-orange-500' },
                      { id: 'branches', label: 'Bank Branches', color: 'bg-purple-600' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleLayer(item.id as keyof typeof layers)}
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-2 h-2 rounded-full", item.color)} />
                          <span className="text-xs font-bold text-slate-700">{item.label}</span>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                          layers[item.id as keyof typeof layers] 
                            ? "bg-indigo-600 border-indigo-600 text-white" 
                            : "border-slate-200 bg-white"
                        )}>
                          {layers[item.id as keyof typeof layers] && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Map Search Overlay */}
      <div className="absolute top-20 left-4 z-10 w-64 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input 
            type="text" 
            placeholder="Search merchant or POI..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Mock Map Background (SVG) */}
      <div className="w-full h-full bg-slate-50 relative overflow-hidden">
        <svg viewBox="0 0 800 600" className="w-full h-full opacity-40">
          <path d="M100,100 L200,150 L300,100 L400,200 L500,150 L600,250 L700,200" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M50,300 L150,350 L250,300 L350,400 L450,350 L550,450 L650,400" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M200,50 L250,150 L200,250 L300,350 L250,450 L350,550" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M500,50 L550,150 L500,250 L600,350 L550,450 L650,550" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          
          {/* Grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <React.Fragment key={i}>
              <line x1={i * 80} y1="0" x2={i * 80} y2="600" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1={i * 60} x2="800" y2={i * 60} stroke="#e2e8f0" strokeWidth="1" />
            </React.Fragment>
          ))}
        </svg>

        {/* Map Markers */}
        <div className="absolute inset-0">
          <AnimatePresence>
            {/* Existing Merchants (Indigo) */}
            {layers.acquired && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <div className="absolute top-[20%] left-[30%] group cursor-pointer">
                  <div className="relative">
                    <MapPin className="w-6 h-6 text-indigo-600 drop-shadow-md" />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      Merchant: Toko Berkah (Acquired)
                    </div>
                  </div>
                </div>
                <div className="absolute top-[45%] left-[55%] group cursor-pointer">
                  <MapPin className="w-6 h-6 text-indigo-600 drop-shadow-md" />
                </div>
                <div className="absolute top-[70%] left-[25%] group cursor-pointer">
                  <MapPin className="w-6 h-6 text-indigo-600 drop-shadow-md" />
                </div>
              </motion.div>
            )}

            {/* Potential Merchants (Orange) */}
            {layers.potential && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <div className="absolute top-[35%] left-[70%] group cursor-pointer">
                  <div className="relative">
                    <MapPin className="w-6 h-6 text-orange-500 drop-shadow-md" />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      Potential: Warung Kita (TAM)
                    </div>
                  </div>
                </div>
                <div className="absolute top-[60%] left-[40%] group cursor-pointer">
                  <MapPin className="w-6 h-6 text-orange-500 drop-shadow-md" />
                </div>
                <div className="absolute top-[15%] left-[80%] group cursor-pointer">
                  <MapPin className="w-6 h-6 text-orange-500 drop-shadow-md" />
                </div>
              </motion.div>
            )}

            {/* Bank Branch (Purple) */}
            {layers.branches && (
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping scale-150" />
                  <div className="relative bg-purple-600 p-2 rounded-xl shadow-xl border-2 border-white">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border border-slate-200 whitespace-nowrap">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Branch: Jakarta Pusat Main</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-200">
        <div className="space-y-2">
          <div className={cn("flex items-center gap-2 transition-opacity", !layers.acquired && "opacity-30")}>
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Acquired Merchants</span>
          </div>
          <div className={cn("flex items-center gap-2 transition-opacity", !layers.potential && "opacity-30")}>
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Potential TAM</span>
          </div>
          <div className={cn("flex items-center gap-2 transition-opacity", !layers.branches && "opacity-30")}>
            <div className="w-3 h-3 rounded-full bg-purple-600" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Bank Branch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeoMap;
