import React, { useState, useRef, useEffect } from "react";
import {
  Camera, Check, ShoppingCart, Sliders, Eye, Layers,
  ShieldCheck, Heart, Upload, Video, VideoOff
} from "lucide-react";
import { executeVirtualTryOn } from "../src/services/perfectCorp";

interface ProductShade {
  name: string;
  hex: string;
  finish: string;
  sku: string;
  price: string;
}

interface VirtualTryOnStudioProps {
  onAddToCart?: (item?: { title: string; price: string; category: string; image?: string }) => void;
}

const SHADES: Record<string, ProductShade[]> = {
  lipstick: [
    { name: "Velvet Rose #402", hex: "#be123c", finish: "Matte Satin", sku: "PC-LIP-402", price: "$34.00" },
    { name: "Crimson Empress #501", hex: "#9f1239", finish: "High Velvet", sku: "PC-LIP-501", price: "$36.00" },
    { name: "Coral Sunset #108", hex: "#f43f5e", finish: "Glossy Nude", sku: "PC-LIP-108", price: "$32.00" },
    { name: "Plum Noir #809", hex: "#701a75", finish: "Deep Satin", sku: "PC-LIP-809", price: "$38.00" },
    { name: "Nude Elegance #004", hex: "#e11d48", finish: "Hydrating Sheer", sku: "PC-LIP-004", price: "$30.00" },
  ],
  blush: [
    { name: "Peach Blossom #201", hex: "#fb923c", finish: "Radiant Sheer", sku: "PC-BLU-201", price: "$28.00" },
    { name: "Rosy Radiance #204", hex: "#f472b6", finish: "Luminous Matte", sku: "PC-BLU-204", price: "$30.00" },
    { name: "Warm Amber #209", hex: "#ea580c", finish: "Satin Glow", sku: "PC-BLU-209", price: "$29.00" },
  ],
  eyeshadow: [
    { name: "Celestial Gold #301", hex: "#eab308", finish: "Shimmer Metallic", sku: "PC-EYE-301", price: "$42.00" },
    { name: "Smoky Onyx #305", hex: "#334155", finish: "Matte Velvet", sku: "PC-EYE-305", price: "$40.00" },
    { name: "Violet Nebula #309", hex: "#9333ea", finish: "Duochrome Sparkle", sku: "PC-EYE-309", price: "$45.00" },
  ],
  foundation: [
    { name: "Warm Honey Shade 24W", hex: "#d97706", finish: "Natural Dewy", sku: "PC-FND-024", price: "$48.00" },
    { name: "Cool Porcelain Shade 04C", hex: "#fde68a", finish: "Velvet Matte", sku: "PC-FND-004", price: "$48.00" },
    { name: "Neutral Warmth Shade 18N", hex: "#b45309", finish: "Skin-Like Satin", sku: "PC-FND-018", price: "$48.00" },
  ],
  eyewear: [
    { name: "Cat-Eye Gold Aviators", hex: "#ca8a04", finish: "Titanium Frame", sku: "PC-EYE-801", price: "$185.00" },
    { name: "Cyberpunk Tinted Shield", hex: "#0284c7", finish: "UV400 Polarized", sku: "PC-EYE-902", price: "$210.00" },
  ],
};

function getResultImageUrl(res: any): string | null {
  if (!res) return null;
  return (
    res.result_image_url ||
    res.output_url ||
    res.image_url ||
    res.data?.result_image_url ||
    res.data?.output_url ||
    null
  );
}

export default function VirtualTryOnStudio({ onAddToCart }: VirtualTryOnStudioProps = {}) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof SHADES>("lipstick");
  const [userImage, setUserImage] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
  );
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [selectedShade, setSelectedShade] = useState(SHADES.lipstick[0]);
  const [opacity, setOpacity] = useState(85);
  const [showMesh, setShowMesh] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [tryOnResult, setTryOnResult] = useState<any>(null);
  const [isExecutingTryOn, setIsExecutingTryOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedSnapImage, setCapturedSnapImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasApiImage = Boolean(getResultImageUrl(tryOnResult));
  const displayImage = getResultImageUrl(tryOnResult) || userImage;

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => { });
    }
  }, [cameraStream]);

  const toggleLiveCamera = async () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
      setCameraError(null);
      return;
    }
    setCameraError(null);
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      setCameraStream(stream);
    } catch {
      setCameraError(
        "Camera blocked. Allow access in the browser address bar, or use Upload Photo / sample portrait."
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setUserImage(reader.result);
        setTryOnResult(null); // new photo → clear previous API result
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectShade = async (shade: ProductShade) => {
    setSelectedShade(shade);
    setIsExecutingTryOn(true);
    try {
      const res = await executeVirtualTryOn({
        imageUrl: userImage,
        shadeSku: shade.sku,
        shadeHex: shade.hex,
        category: activeCategory,
      });
      if (res) {
        setTryOnResult(res);
        const url = getResultImageUrl(res);
        if (url) setUserImage(url);
      }
    } finally {
      setIsExecutingTryOn(false);
    }
  };

  const handleSnapLook = () => {
    // Prefer API image; otherwise snapshot current view source
    if (cameraStream && videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0);
          setCapturedSnapImage(canvas.toDataURL("image/jpeg", 0.92));
        } else {
          setCapturedSnapImage(displayImage);
        }
      } catch {
        setCapturedSnapImage(displayImage);
      }
    } else {
      setCapturedSnapImage(displayImage);
    }
    setIsCapturing(true);
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    onAddToCart?.({
      title: selectedShade.name,
      price: selectedShade.price,
      category: "AR Cosmetic Shade",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=200&q=80",
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
              Perfect Corp AR Try-On
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Virtual Try-On Studio</h2>
          <p className="text-xs text-gray-400">Webcam, upload, or sample — shade try-on via Perfect Corp when available.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={toggleLiveCamera}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer ${cameraStream
                ? "bg-rose-600 border-rose-500 text-white"
                : "bg-indigo-600 border-indigo-500 text-white"
              }`}
          >
            {cameraStream ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            {cameraStream ? "Stop Camera" : "Live Camera"}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-pink-500/40 bg-pink-500/10 text-pink-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload
          </button>
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${comparisonMode ? "bg-purple-600 border-purple-500 text-white" : "border-white/10 text-gray-300"
              }`}
          >
            <Layers className="w-4 h-4" /> Split
          </button>
          <button
            onClick={() => setShowMesh(!showMesh)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${showMesh ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300" : "border-white/10 text-gray-400"
              }`}
          >
            <Eye className="w-4 h-4" /> Mesh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Viewport */}
        <div className="lg:col-span-8 rounded-3xl bg-[#0a0d14] border border-white/[0.08] p-4 space-y-4">
          {cameraError && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex justify-between gap-2">
              <span>{cameraError}</span>
              <button onClick={() => setCameraError(null)} className="font-bold underline cursor-pointer shrink-0">
                Dismiss
              </button>
            </div>
          )}

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
            {cameraStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover -scale-x-100"
              />
            ) : (
              <img src={displayImage} alt="Try-on viewport" className="w-full h-full object-cover" />
            )}

            {/* Simple tint only when no real Perfect Corp image */}
            {!hasApiImage && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 62%, ${selectedShade.hex}${Math.round(
                    (opacity / 100) * 180
                  )
                    .toString(16)
                    .padStart(2, "0")} 0%, transparent 42%)`,
                  mixBlendMode: activeCategory === "lipstick" ? "multiply" : "soft-light",
                }}
              />
            )}

            {/* Optional light mesh guide — only without API image */}
            {showMesh && !hasApiImage && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 border border-white/10 text-[10px] font-mono text-indigo-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {cameraStream ? "CAMERA LIVE" : "PREVIEW MODE"}
              </div>
            )}

            {comparisonMode && !cameraStream && (
              <div className="absolute inset-y-0 left-0 w-1/2 border-r-2 border-white/80 overflow-hidden bg-black">
                <img src={userImage} alt="Original" className="w-[200%] h-full object-cover max-w-none" />
                <span className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/80 text-[10px] font-bold text-gray-300">
                  ORIGINAL
                </span>
              </div>
            )}

            <div className="absolute bottom-3 right-3 px-3 py-2 rounded-xl bg-black/80 border border-white/10 flex items-center gap-2 text-xs">
              <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: selectedShade.hex }} />
              <div>
                <p className="font-bold text-white leading-tight">{selectedShade.name}</p>
                <p className="text-[10px] text-gray-400">{selectedShade.finish}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Opacity</span>
                  <span className="text-indigo-400 font-mono">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleSnapLook}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-pink-400" /> Snap
            </button>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              {addedToCart ? "Added" : "Add to Cart"}
            </button>

            <div className="w-full p-2.5 rounded-xl bg-black/40 border border-indigo-500/30 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${isExecutingTryOn ? "bg-amber-400 animate-ping" : "bg-emerald-400"
                    }`}
                />
                <span className="text-gray-400">YCE:</span>
                <span className="text-emerald-400">
                  {isExecutingTryOn
                    ? "Dispatching…"
                    : tryOnResult
                      ? hasApiImage
                        ? "Live render"
                        : "Response OK"
                      : "Ready"}
                </span>
              </div>
              {tryOnResult?.task_id && (
                <span className="text-indigo-300 truncate max-w-[140px]">
                  {String(tryOnResult.task_id).slice(0, 16)}…
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Shade panel */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0a0d14] border border-white/[0.08] p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Category</h3>
            <p className="text-xs text-gray-400">Pick a product type, then a shade.</p>
          </div>

          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/60 border border-white/[0.08] text-[11px]">
            {(Object.keys(SHADES) as (keyof typeof SHADES)[]).map((id) => (
              <button
                key={id}
                onClick={() => {
                  setActiveCategory(id);
                  setSelectedShade(SHADES[id][0]);
                  setTryOnResult(null);
                }}
                className={`py-2 rounded-lg font-bold capitalize cursor-pointer ${activeCategory === id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {id}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {SHADES[activeCategory].map((shade) => {
              const selected = selectedShade.sku === shade.sku;
              return (
                <button
                  key={shade.sku}
                  onClick={() => handleSelectShade(shade)}
                  disabled={isExecutingTryOn}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 cursor-pointer transition-all ${selected
                      ? "border-indigo-500/60 bg-indigo-900/30"
                      : "border-white/[0.06] bg-[#0d1017] hover:border-white/20"
                    }`}
                >
                  <span
                    className="w-7 h-7 rounded-xl border border-white/30 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: shade.hex }}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-white" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${selected ? "text-white" : "text-gray-300"}`}>
                      {shade.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">{shade.finish}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 shrink-0">{shade.price}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Perfect Corp
              </span>
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`text-xs flex items-center gap-1 cursor-pointer ${isFavorited ? "text-pink-400" : "text-gray-400"
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? "fill-pink-400" : ""}`} />
                {isFavorited ? "Saved" : "Save"}
              </button>
            </div>
            <p className="text-xs font-bold text-white">{selectedShade.name}</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Select a shade to dispatch try-on. Live render appears when the API returns an image.
            </p>
          </div>
        </div>
      </div>

      {/* Snap modal */}
      {isCapturing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0d1017] border border-pink-500/40 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-400" /> Snapshot
              </h3>
              <button
                onClick={() => setIsCapturing(false)}
                className="text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10">
              <img
                src={capturedSnapImage || displayImage}
                alt="Snapshot"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-gray-400">
              {selectedShade.name} · {selectedShade.finish}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.download = `MirrorMuse_${selectedShade.sku}.jpg`;
                  a.href = capturedSnapImage || displayImage;
                  a.click();
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold cursor-pointer"
              >
                Download
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                  setIsCapturing(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}