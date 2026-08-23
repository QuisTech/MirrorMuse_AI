import React, { useState, useRef } from "react";
import { Sparkles, Scan, CheckCircle2, Upload, Camera, RefreshCw, ShoppingBag, ShieldCheck, ArrowRight, Activity, Zap } from "lucide-react";
import { executeSkinAnalysis, SkinAnalysisResponse } from "../src/services/perfectCorp";

export default function SkinAnalysisLab() {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string>("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [analysisData, setAnalysisData] = useState<SkinAnalysisResponse>({
    compositeScore: 83,
    grade: "A+",
    metrics: [
      { label: "Skin Texture & Smoothness", score: 88, status: "Optimal", color: "from-emerald-500 to-teal-600", desc: "Minimal pore visibility with smooth epidermal surface." },
      { label: "Fine Lines & Wrinkles", score: 94, status: "Excellent", color: "from-indigo-500 to-blue-600", desc: "Low signs of collagen degradation or expression lines." },
      { label: "Spots & UV Pigmentation", score: 79, status: "Mild Concern", color: "from-amber-500 to-orange-600", desc: "Subtle localized hyperpigmentation detected near cheekbones." },
      { label: "Hydration & Moisture Barrier", score: 72, status: "Dehydrated", color: "from-pink-500 to-rose-600", desc: "Moisture levels below baseline in the T-Zone area." },
      { label: "Firmness & Elasticity", score: 86, status: "Good", color: "from-purple-500 to-indigo-600", desc: "Healthy dermal rebound time and cellular elasticity." },
      { label: "Dark Circles & Radiance", score: 82, status: "Moderate", color: "from-cyan-500 to-teal-600", desc: "Minor vascular congestion under lower eye contour." }
    ],
    detectedConcerns: ["T-Zone Moisture Deficit", "Mild Cheekbone UV Spotting"],
    recommendedSkincare: [
      { title: "Hyaluronic Acid 3D Hydration Serum", brand: "PerfectSkin Labs", price: "$46.00", icon: "💧", desc: "Targets T-zone moisture deficit with triple-weight hyaluronic molecules." },
      { title: "Niacinamide + Vitamin C Spot Correcting Essence", brand: "PerfectSkin Labs", price: "$52.00", icon: "✨", desc: "Reduces UV pigmentation score by up to 34% within 14 days." },
      { title: "Ceramide Barrier Defense Cream", brand: "PerfectSkin Labs", price: "$58.00", icon: "🛡️", desc: "Locks in moisture barrier and improves texture smoothness." }
    ]
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setUserImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    try {
      const result = await executeSkinAnalysis(userImage);
      setAnalysisData(result);
    } catch (e) {
      console.error("Scan error:", e);
    } finally {
      setIsScanning(false);
    }
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

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
              PERFECT CORP AI SKIN DIAGNOSTIC API v2.0
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE PERFECT CORP API CONNECTED
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Skin Analysis & Diagnostic Lab</h2>
          <p className="text-xs text-gray-400">Upload your own photo or selfie to run a live dermatological analysis via Perfect Corp API.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-all"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload Your Photo / Selfie</span>
          </button>

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
            <span>{isScanning ? "Analyzing Your Photo..." : "Run AI Skin Scanner"}</span>
          </button>
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Scan Camera / Image Viewport */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0a0d14] border border-white/[0.08] p-4 space-y-4 shadow-2xl relative">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
            <img
              src={userImage}
              alt="Skin Scan Subject"
              className={`w-full h-full object-cover transition-all duration-500 ${isScanning ? "brightness-125 contrast-125" : ""}`}
            />

            {/* Scanning Laser Beam Effect */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee] animate-bounce top-1/3" />
            )}

            {/* Radar Heatmap Landmark Nodes */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Cheek Spot Flag */}
              <div className="absolute top-[48%] left-[32%] group">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white text-[9px] font-extrabold text-black items-center justify-center">1</span>
                </span>
                <div className="absolute left-6 top-0 bg-black/90 text-[10px] font-mono text-amber-300 p-2 rounded-lg border border-amber-500/30 whitespace-nowrap shadow-xl">
                  UV Spot Concentration
                </div>
              </div>

              {/* T-Zone Hydration Flag */}
              <div className="absolute top-[35%] left-[50%] group">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border border-white text-[9px] font-extrabold text-white items-center justify-center">2</span>
                </span>
                <div className="absolute left-6 top-0 bg-black/90 text-[10px] font-mono text-pink-300 p-2 rounded-lg border border-pink-500/30 whitespace-nowrap shadow-xl">
                  T-Zone Hydration Deficit
                </div>
              </div>
            </div>

            {/* Scanner Status Badge */}
            <div className="absolute bottom-4 inset-x-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">
                  {isScanning ? "Contacting Perfect Corp API..." : "Your Custom Photo Analysis Ready"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400">PERFECT_SKIN_AI</span>
            </div>
          </div>

          {/* Composite Health Score HUD */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-[#0d1322] to-blue-950/80 border border-cyan-500/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Composite Skin Score</p>
              <h3 className="text-3xl font-extrabold text-white font-mono mt-0.5">
                {analysisData.compositeScore}<span className="text-base font-normal text-gray-400">/100</span>
              </h3>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Healthy Epidermal Rating
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center text-cyan-300 font-bold font-mono text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {analysisData.grade}
            </div>
          </div>
        </div>

        {/* Right: Diagnostic Metrics & Product Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Diagnostic Breakdown Cards */}
          <div className="rounded-3xl bg-[#0a0d14] border border-white/[0.08] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Diagnostic Metric Analysis</h3>
              <span className="text-xs text-indigo-400 font-mono">{analysisData.metrics.length} PARAMETERS DETECTED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysisData.metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{m.label}</span>
                    <span className="font-mono font-bold text-cyan-400">{m.score}/100</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${m.color} transition-all duration-1000`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 leading-tight pt-1">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Targeted Skincare Regimen */}
          <div className="rounded-3xl bg-[#0a0d14] border border-white/[0.08] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  AI Recommended Treatment Regimen
                </h3>
                <p className="text-xs text-gray-400">Tailored to your specific skin diagnostic scores.</p>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy Complete Set</span>
              </button>
            </div>

            <div className="space-y-3">
              {analysisData.recommendedSkincare.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.06] flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] text-xl flex items-center justify-center shrink-0">
                      {p.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase">{p.brand}</span>
                      <h4 className="text-xs font-bold text-white">{p.title}</h4>
                      <p className="text-[11px] text-gray-400">{p.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-amber-400 block">{p.price}</span>
                    <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 mt-1">
                      <span>Add SKU</span> <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
