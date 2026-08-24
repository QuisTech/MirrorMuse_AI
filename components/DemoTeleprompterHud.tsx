import React, { useState, useEffect } from "react";
import { Mic, ChevronRight, ChevronLeft, X, Play, Pause, RotateCcw, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";

interface ScriptAct {
  id: number;
  actTitle: string;
  moduleTarget: "tryon" | "skin" | "genai" | "apiconsole";
  actionPrompt: string;
  lines: string[];
}

const SCRIPT_ACTS: ScriptAct[] = [
  {
    id: 1,
    actTitle: "Act 1: The Problem & Solution",
    moduleTarget: "tryon",
    actionPrompt: "👉 INTRODUCE PROJECT ON TRY-ON SCREEN",
    lines: [
      "In beauty e-commerce, over 30% of online cosmetics purchases are returned because customers cannot preview shades on their own skin.",
      "Today, we present MirrorMuse AI — an enterprise luxury studio powered by Perfect Corp YCE S2S APIs, WebRTC camera tracking, and AI skincare matching."
    ]
  },
  {
    id: 2,
    actTitle: "Act 2: Interactive AR Virtual Try-On",
    moduleTarget: "tryon",
    actionPrompt: "👉 CLICK: 'Enable Live Camera' & Click shades (Velvet Rose #402, Plum Noir #809)",
    lines: [
      "Our Virtual Try-On Studio streams 60 FPS video directly in browser via WebRTC.",
      "Notice how seamlessly we can cycle between lipstick shades, finishes, and opacities in real time with zero button delay.",
      "Clicking 'Snap Look' -> 'Download Photo' exports a high-resolution JPEG with shade pigment composited directly into the image file."
    ]
  },
  {
    id: 3,
    actTitle: "Act 3: Clinical Skin Analysis",
    moduleTarget: "skin",
    actionPrompt: "👉 SWITCH TO 'SKIN ANALYSIS' & CLICK 'Run Full Diagnostic Scan'",
    lines: [
      "Our Clinical Skin Analysis Lab dispatches face portraits to Perfect Corp YCE S2S API.",
      "It returns authentic, un-modified diagnostic scores across 6 key metrics: Texture, Wrinkles, Pores, Redness, Moisture, and Firmness.",
      "MirrorMuse AI automatically generates a personalized skincare regimen matching the shopper's detected concerns."
    ]
  },
  {
    id: 4,
    actTitle: "Act 4: GenAI Look & Live Shopping",
    moduleTarget: "genai",
    actionPrompt: "👉 SWITCH TO 'GENAI LOOK' & TYPE 'Golden Hour Glam'",
    lines: [
      "Shoppers can type natural prompts like 'Golden Hour Glam', and our GenAI agent composes a complete multi-product beauty look.",
      "Our Live Price Search integrates with SerpApi Google Shopping to fetch real-time retail pricing and stock availability."
    ]
  },
  {
    id: 5,
    actTitle: "Act 5: Technical Summary & Wrap-up",
    moduleTarget: "tryon",
    actionPrompt: "👉 SUMMARY & SHOW LIVE URL",
    lines: [
      "MirrorMuse AI secures API keys behind Vercel Serverless Proxies (/api/perfect/tryon).",
      "Deploys production-ready at mirrormuse-ai.vercel.app with 0-error TypeScript compilation.",
      "Thank you! We invite you to test MirrorMuse AI live right now!"
    ]
  }
];

interface DemoTeleprompterHudProps {
  onClose: () => void;
  onNavigateModule?: (module: "tryon" | "skin" | "genai" | "apiconsole") => void;
}

export default function DemoTeleprompterHud({ onClose, onNavigateModule }: DemoTeleprompterHudProps) {
  const [currentActIdx, setCurrentActIdx] = useState(0);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const act = SCRIPT_ACTS[currentActIdx];

  useEffect(() => {
    if (onNavigateModule && act.moduleTarget) {
      onNavigateModule(act.moduleTarget);
    }
  }, [currentActIdx]);

  useEffect(() => {
    let timer: any;
    if (autoPlay) {
      timer = setInterval(() => {
        handleNext();
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [autoPlay, currentActIdx, currentLineIdx]);

  const handleNext = () => {
    if (currentLineIdx < act.lines.length - 1) {
      setCurrentLineIdx((prev) => prev + 1);
    } else if (currentActIdx < SCRIPT_ACTS.length - 1) {
      setCurrentActIdx((prev) => prev + 1);
      setCurrentLineIdx(0);
    } else {
      setAutoPlay(false);
    }
  };

  const handlePrev = () => {
    if (currentLineIdx > 0) {
      setCurrentLineIdx((prev) => prev - 1);
    } else if (currentActIdx > 0) {
      setCurrentActIdx((prev) => prev - 1);
      setCurrentLineIdx(SCRIPT_ACTS[currentActIdx - 1].lines.length - 1);
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-pink-600 to-indigo-600 border border-pink-400/50 text-white font-bold text-xs flex items-center gap-2 shadow-2xl cursor-pointer hover:scale-105 transition-all"
        >
          <Mic className="w-4 h-4 text-pink-300 animate-pulse" />
          <span>Pitch Cue HUD ({currentActIdx + 1}/5)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-lg bg-[#0a0d14]/95 backdrop-blur-2xl border-2 border-pink-500/50 rounded-3xl p-5 shadow-2xl space-y-4 animate-fadeIn text-white">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300">
            <Mic className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
              <span>DEMO PRESENTER HUD</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">
                ACT {act.id} / 5
              </span>
            </h4>
            <p className="text-xs font-bold text-white">{act.actTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              autoPlay ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-white/5 border-white/10 text-gray-300"
            }`}
            title={autoPlay ? "Pause Auto Scroll" : "Start Auto Scroll (7s)"}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs cursor-pointer"
            title="Minimize HUD"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-rose-400 text-xs cursor-pointer"
            title="Close Teleprompter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Click Cue Action Prompt Banner */}
      <div className="p-2.5 rounded-2xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/40 text-pink-300 text-xs font-bold flex items-center gap-2 shadow-inner">
        <Sparkles className="w-4 h-4 text-pink-400 shrink-0 animate-bounce" />
        <span>{act.actionPrompt}</span>
      </div>

      {/* Active Teleprompter Line Card */}
      <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/10 min-h-[90px] flex items-center shadow-md">
        <p className="text-sm font-medium leading-relaxed text-gray-100">
          "{act.lines[currentLineIdx]}"
        </p>
      </div>

      {/* Progress Dots & Nav Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {SCRIPT_ACTS.map((a, idx) => (
            <button
              key={a.id}
              onClick={() => {
                setCurrentActIdx(idx);
                setCurrentLineIdx(0);
              }}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                idx === currentActIdx
                  ? "bg-pink-500 scale-125 ring-2 ring-pink-400/50"
                  : idx < currentActIdx
                  ? "bg-emerald-400"
                  : "bg-gray-700"
              }`}
              title={a.actTitle}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentActIdx === 0 && currentLineIdx === 0}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            onClick={handleNext}
            disabled={currentActIdx === SCRIPT_ACTS.length - 1 && currentLineIdx === act.lines.length - 1}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-xs font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed hover:from-pink-400 hover:to-indigo-500 flex items-center gap-1 cursor-pointer shadow-lg"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
