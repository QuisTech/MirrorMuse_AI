import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Camera, Check, ShoppingCart, Sliders, Eye, RefreshCw, Layers, ShieldCheck, Heart, Upload, Video, VideoOff } from "lucide-react";

interface ProductShade {
  name: string;
  hex: string;
  finish: string;
  sku: string;
  price: string;
}

export default function VirtualTryOnStudio() {
  const [activeCategory, setActiveCategory] = useState<"lipstick" | "blush" | "eyeshadow" | "foundation" | "eyewear">("lipstick");
  const [userImage, setUserImage] = useState<string>("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80");
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedShade, setSelectedShade] = useState<ProductShade>({
    name: "Velvet Rose #402",
    hex: "#be123c",
    finish: "Matte Satin",
    sku: "PC-LIP-402",
    price: "$34.00"
  });
  const [opacity, setOpacity] = useState<number>(85);
  const [showMesh, setShowMesh] = useState<boolean>(true);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const shades: Record<string, ProductShade[]> = {
    lipstick: [
      { name: "Velvet Rose #402", hex: "#be123c", finish: "Matte Satin", sku: "PC-LIP-402", price: "$34.00" },
      { name: "Crimson Empress #501", hex: "#9f1239", finish: "High Velvet", sku: "PC-LIP-501", price: "$36.00" },
      { name: "Coral Sunset #108", hex: "#f43f5e", finish: "Glossy Nude", sku: "PC-LIP-108", price: "$32.00" },
      { name: "Plum Noir #809", hex: "#701a75", finish: "Deep Satin", sku: "PC-LIP-809", price: "$38.00" },
      { name: "Nude Elegance #004", hex: "#e11d48", finish: "Hydrating Sheer", sku: "PC-LIP-004", price: "$30.00" }
    ],
    blush: [
      { name: "Peach Blossom #201", hex: "#fb923c", finish: "Radiant Sheer", sku: "PC-BLU-201", price: "$28.00" },
      { name: "Rosy Radiance #204", hex: "#f472b6", finish: "Luminous Matte", sku: "PC-BLU-204", price: "$30.00" },
      { name: "Warm Amber #209", hex: "#ea580c", finish: "Satin Glow", sku: "PC-BLU-209", price: "$29.00" }
    ],
    eyeshadow: [
      { name: "Celestial Gold #301", hex: "#eab308", finish: "Shimmer Metallic", sku: "PC-EYE-301", price: "$42.00" },
      { name: "Smoky Onyx #305", hex: "#334155", finish: "Matte Velvet", sku: "PC-EYE-305", price: "$40.00" },
      { name: "Violet Nebula #309", hex: "#9333ea", finish: "Duochrome Sparkle", sku: "PC-EYE-309", price: "$45.00" }
    ],
    foundation: [
      { name: "Warm Honey Shade 24W", hex: "#d97706", finish: "Natural Dewy", sku: "PC-FND-024", price: "$48.00" },
      { name: "Cool Porcelain Shade 04C", hex: "#fde68a", finish: "Velvet Matte", sku: "PC-FND-004", price: "$48.00" },
      { name: "Neutral Warmth Shade 18N", hex: "#b45309", finish: "Skin-Like Satin", sku: "PC-FND-018", price: "$48.00" }
    ],
    eyewear: [
      { name: "Cat-Eye Gold Aviators", hex: "#ca8a04", finish: "Titanium Frame", sku: "PC-EYE-801", price: "$185.00" },
      { name: "Cyberpunk Tinted Shield", hex: "#0284c7", finish: "UV400 Polarized", sku: "PC-EYE-902", price: "$210.00" }
    ]
  };

  // Toggle Live Webcam Streaming
  const toggleLiveCamera = async () => {
    if (isLiveCamera) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsLiveCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLiveCamera(true);
      } catch (e) {
        alert("Camera permission denied or camera not available.");
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isLiveCamera) toggleLiveCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUserImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
              PERFECT CORP AR TRY-ON ENGINE v4.2
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              60 FPS GPU ACCELERATED
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Interactive AR Virtual Try-On Studio</h2>
          <p className="text-xs text-gray-400">Experience real-time webcam AR try-on, upload your photo, or test with sample models.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLiveCamera}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer shadow-lg ${
              isLiveCamera
                ? "bg-rose-600 border-rose-500 text-white animate-pulse"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white hover:opacity-90"
            }`}
          >
            {isLiveCamera ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            <span>{isLiveCamera ? "Turn Off Live Camera" : "Enable Live Laptop Camera"}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20 flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              comparisonMode
                ? "bg-purple-600 border-purple-500 text-white shadow-lg"
                : "bg-white/[0.05] border-white/[0.1] text-gray-300 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{comparisonMode ? "Split View Active" : "Before / After Split"}</span>
          </button>

          <button
            onClick={() => setShowMesh(!showMesh)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              showMesh
                ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300"
                : "bg-white/[0.05] border-white/[0.1] text-gray-400"
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showMesh ? "Mesh Visible" : "Hide Mesh"}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive AR Camera Viewport */}
        <div className="lg:col-span-8 rounded-3xl bg-[#0a0d14] border border-white/[0.08] p-4 relative overflow-hidden shadow-2xl space-y-4">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center group">
            {/* Live Camera Video Feed or Base Portrait Image */}
            {isLiveCamera ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <img
                src={userImage}
                alt="Live AR Viewport"
                className="w-full h-full object-cover"
              />
            )}

            {/* Simulated Live AR Overlay Shading */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(ellipse at 50% 65%, ${selectedShade.hex}${Math.round((opacity / 100) * 255).toString(16).padStart(2, '0')} 0%, transparent 45%)`,
                mixBlendMode: activeCategory === "lipstick" ? "multiply" : "soft-light"
              }}
            />

            {/* Landmark Radar Grid Overlay */}
            {showMesh && (
              <div className="absolute inset-0 pointer-events-none border border-indigo-500/20 flex items-center justify-center">
                <svg className="w-full h-full text-indigo-400/40" viewBox="0 0 400 300">
                  {/* Face Mesh Contour Lines */}
                  <ellipse cx="200" cy="150" rx="90" ry="115" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                  <path d="M 150 140 Q 200 120 250 140" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  {/* Eye Landmarks */}
                  <circle cx="165" cy="135" r="14" fill="none" stroke="#a855f7" strokeWidth="0.8" />
                  <circle cx="235" cy="135" r="14" fill="none" stroke="#a855f7" strokeWidth="0.8" />
                  {/* Nose Mesh */}
                  <path d="M 200 135 L 195 170 L 205 170 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  {/* Lip Landmarks */}
                  <path d="M 170 195 Q 200 180 230 195 Q 200 215 170 195 Z" fill="none" stroke="#ec4899" strokeWidth="1.2" />
                  {/* Landmark Points */}
                  {[
                    [165, 135], [235, 135], [200, 170], [170, 195], [230, 195], [200, 185], [200, 205],
                    [145, 150], [255, 150], [180, 100], [220, 100]
                  ].map(([x, y], idx) => (
                    <circle key={idx} cx={x} cy={y} r="2.5" fill="#38bdf8" />
                  ))}
                </svg>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-indigo-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isLiveCamera ? "WEBRTC_CAMERA: LIVE STREAMING 60FPS" : "PERFECT_AR_TRACKING: 108 LANDMARKS ACTIVE"}</span>
                </div>
              </div>
            )}

            {/* Split Comparison View */}
            {comparisonMode && !isLiveCamera && (
              <div className="absolute inset-y-0 left-0 w-1/2 border-r-2 border-white/80 overflow-hidden bg-black">
                <img
                  src={userImage}
                  alt="Original Unmodified View"
                  className="w-[200%] h-full object-cover max-w-none"
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/80 text-[10px] font-bold text-gray-300">
                  ORIGINAL
                </span>
              </div>
            )}

            {/* Active Shade Badge Indicator */}
            <div className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-3 text-xs">
              <span className="w-4 h-4 rounded-full border border-white/40" style={{ backgroundColor: selectedShade.hex }} />
              <div>
                <p className="font-bold text-white leading-tight">{selectedShade.name}</p>
                <p className="text-[10px] text-gray-400">{selectedShade.finish} • {selectedShade.price}</p>
              </div>
            </div>
          </div>

          {/* Quick HUD Controls */}
          <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-[240px]">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400 font-medium">Shade Pigment Opacity</span>
                  <span className="text-indigo-400 font-bold font-mono">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCapturing(true)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-all"
              >
                <Camera className="w-4 h-4 text-pink-400" />
                <span>Snap Look</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-pink-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                <span>{addedToCart ? "Added to Cart!" : "Add Shade to Cart"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Category Tabs & Color Selector */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0a0d14] border border-white/[0.08] p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Select AR Category</h3>
            <p className="text-xs text-gray-400">Choose cosmetic product type for instant rendering.</p>
          </div>

          {/* Category Switcher */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/60 border border-white/[0.08] text-xs">
            {[
              { id: "lipstick", label: "Lipstick" },
              { id: "blush", label: "Blush" },
              { id: "eyeshadow", label: "Eyeshadow" },
              { id: "foundation", label: "Foundation" },
              { id: "eyewear", label: "Eyewear" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setSelectedShade(shades[cat.id][0]);
                }}
                className={`py-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Color Swatch Selector Grid */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
              <span>Color Swatches ({shades[activeCategory].length})</span>
              <span className="text-[10px] text-indigo-400 font-mono">PERFECT_SHADE_MATCH</span>
            </label>

            <div className="space-y-2">
              {shades[activeCategory].map((shade) => {
                const isSelected = selectedShade.sku === shade.sku;
                return (
                  <button
                    key={shade.sku}
                    onClick={() => setSelectedShade(shade)}
                    className={`w-full p-3 rounded-2xl transition-all cursor-pointer border flex items-center justify-between text-left ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/60 shadow-lg"
                        : "bg-[#0d1017] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-xl border border-white/30 shadow-inner flex items-center justify-center shrink-0"
                        style={{ backgroundColor: shade.hex }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </span>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-300"}`}>
                          {shade.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">{shade.finish} • SKU: {shade.sku}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">{shade.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Product Details Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-[#0e121d] to-purple-950/60 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> PERFECT CORP VERIFIED
              </span>
              <button className="text-xs text-gray-400 hover:text-pink-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> Favorite
              </button>
            </div>
            <div>
              <p className="text-xs font-bold text-white">{selectedShade.name}</p>
              <p className="text-[11px] text-gray-300 leading-relaxed mt-1">
                Formulated with ultra-hydrating hyaluronic spheres and dynamic micro-pigments for 12-hour high-impact wear.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
