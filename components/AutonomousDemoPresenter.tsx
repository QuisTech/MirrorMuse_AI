import React, { useState, useRef, useEffect } from "react";
import { Play, Video, Download, CheckCircle2, Sparkles, Volume2, ShieldCheck, Film, Terminal } from "lucide-react";

interface AutonomousDemoPresenterProps {
  onModuleChange: (module: "tryon" | "skin" | "genai" | "apiconsole" | "storefront" | "kanban" | "workspace" | "chat" | "dashboard") => void;
}

export default function AutonomousDemoPresenter({ onModuleChange }: AutonomousDemoPresenterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const scriptSteps = [
    { module: "tryon", title: "1. The Problem & AR Virtual Try-On", duration: 15, text: "Welcome to MirrorMuse AI! We solve static beauty e-commerce using real-time AR try-on and 108 facial landmarks." },
    { module: "skin", title: "2. Perfect Corp AI Skin Diagnostic Lab", duration: 18, text: "Powered by Perfect Corp S2S APIs, we measure skin hydration, wrinkles, firmness, and radiance." },
    { module: "apiconsole", title: "3. Xano Enterprise Backend & SerpApi Search", duration: 20, text: "Every diagnostic record is stored in Xano instance xtgz-thlr-k1v0, while SerpApi searches live prices across Sephora, Ulta, and Target." },
    { module: "chat", title: "4. Groq Llama 3.3 70B AI Concierge", duration: 20, text: "Our AI Beauty Concierge uses Groq's multi-key LLM rotation to orchestrate all 3 sponsors in real time." },
    { module: "dashboard", title: "5. Production Telemetry & Deployment", duration: 12, text: "Live in production on Vercel at mirrormuse-ai.vercel.app!" }
  ];

  const handleStartAutonomousTour = async () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setProgress(0);
    recordedChunksRef.current = [];

    // Attempt HTML5 Screen / Tab Capture for video recording
    try {
      if (navigator.mediaDevices && (navigator.mediaDevices as any).getDisplayMedia) {
        const stream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: { mediaSource: "screen" },
          audio: true
        });
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          setRecordedBlobUrl(url);
        };
        recorder.start(1000);
        mediaRecorderRef.current = recorder;
      }
    } catch (e) {
      console.warn("Screen capture prompt skipped or cancelled:", e);
    }

    // Step through presentation automatically
    let stepIndex = 0;
    const runSteps = () => {
      if (stepIndex < scriptSteps.length) {
        const step = scriptSteps[stepIndex];
        setCurrentStep(stepIndex);
        onModuleChange(step.module as any);

        let elapsed = 0;
        const interval = setInterval(() => {
          elapsed += 1;
          setProgress(Math.min(100, (elapsed / step.duration) * 100));
          if (elapsed >= step.duration) {
            clearInterval(interval);
            stepIndex += 1;
            runSteps();
          }
        }, 1000);
      } else {
        setIsPlaying(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      }
    };

    runSteps();
  };

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#0d1017] to-indigo-950/80 border border-purple-500/30 space-y-4 shadow-2xl animate-fadeIn font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                AUTONOMOUS HACKATHON DEMO ENGINE
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                NARRATION & CAPTURE READY
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">Autonomous Winning Video Presenter & Screen Recorder</h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartAutonomousTour}
            disabled={isPlaying}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isPlaying ? "Running Autonomous Presentation..." : "Start Autonomous Demo Recording"}</span>
          </button>

          {recordedBlobUrl && (
            <a
              href={recordedBlobUrl}
              download="MirrorMuse_AI_Winning_Hackathon_Demo.webm"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" /> Download Demo Video MP4/WebM
            </a>
          )}
        </div>
      </div>

      {/* Progress & Live Script HUD */}
      {isPlaying && (
        <div className="p-4 rounded-2xl bg-black/80 border border-white/[0.08] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-purple-300 font-bold">{scriptSteps[currentStep].title}</span>
            <span className="text-emerald-400 font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[11px] text-gray-300 italic">"{scriptSteps[currentStep].text}"</p>
        </div>
      )}
    </div>
  );
}
