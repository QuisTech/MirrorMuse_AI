import React, { useState } from "react";
import {
  Sparkles, Zap, Camera, Scan, Wand2, ShoppingBag, Layers, MessageSquare,
  Database, Code, Bot, Play, BarChart3, CheckCircle2, ShoppingCart, User,
  Send, ArrowRight, ShieldCheck, Heart, Terminal, Sliders, Globe
} from "lucide-react";
import StudioWorkspace from "./components/StudioWorkspace";
import VirtualTryOnStudio from "./components/VirtualTryOnStudio";
import SkinAnalysisLab from "./components/SkinAnalysisLab";
import GenAiLookComposer from "./components/GenAiLookComposer";
import PerfectApiConsole from "./components/PerfectApiConsole";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import LivePriceSearch from "./components/LivePriceSearch";

export default function App() {
  const [activeModule, setActiveModule] = useState<
    "tryon" | "skin" | "genai" | "apiconsole" | "storefront" | "kanban" | "workspace" | "chat" | "dashboard"
  >("tryon");

  const [activeDemo, setActiveDemo] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(3);

  // Kanban Tasks
  const [tasks] = useState([
    { id: 1, title: "108 Landmark Face Mesh Tracking", col: "done", assignee: "VisionAgent", tag: "AR ENGINE" },
    { id: 2, title: "Multi-Spectral Skin Layer Diagnostics", col: "progress", assignee: "SkinInsightAgent", tag: "AI COMPUTER VISION" },
    { id: 3, title: "GenAI Style Pigment Synthesis", col: "progress", assignee: "StyleComposerAgent", tag: "GENAI MODEL" },
    { id: 4, title: "Perfect Corp YCE API Proxy Dispatch", col: "done", assignee: "DevOps Sentinel", tag: "REST API" }
  ]);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Welcome to MirrorMuse AI. I am your AR Beauty & Skin Concierge powered by Perfect Corp technology. How can I transform your style today?" }
  ]);
  const [chatInput, setChatInput] = useState<string>("");

  const products = [
    { id: 1, title: "Velvet Rose Lip Shade #402", price: "$34.00", category: "AR Try-On Compatible", rating: "4.9", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "3D Hyaluronic Hydration Serum", price: "$46.00", category: "AI Diagnostic Match", rating: "4.9", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Celestial Gold Eyeshadow Palette", price: "$44.00", category: "GenAI Look Bundle", rating: "5.0", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80" }
  ];

  const codeFiles = [
    "VirtualTryOnStudio.tsx",
    "SkinAnalysisLab.tsx",
    "GenAiLookComposer.tsx",
    "PerfectApiConsole.tsx",
    "StudioWorkspace.tsx"
  ];
  const [activeCodeFile, setActiveCodeFile] = useState<string>("VirtualTryOnStudio.tsx");

  const getAIConciergeResponse = (userText: string): string => {
    const query = userText.toLowerCase();
    if (query.includes("dry") || query.includes("routine") || query.includes("skin")) {
      return "For dry epidermal skin, I recommend: 1) 3D Hyaluronic Acid Serum ($46.00) to restore T-Zone moisture deficit, 2) Ceramide Barrier Defense Cream ($58.00) to rebuild moisture barrier, and 3) Niacinamide Essence ($52.00) for smooth radiance.";
    }
    if (query.includes("lip") || query.includes("shade") || query.includes("lipstick") || query.includes("warm") || query.includes("color")) {
      return "For warm skin undertones, try Velvet Rose #402 (Matte Satin, $34.00) or Coral Sunset #108 (Glossy Nude, $32.00). You can test them live on your laptop camera in the AR Try-On Studio!";
    }
    if (query.includes("price") || query.includes("buy") || query.includes("cost") || query.includes("serp")) {
      return "You can search real-time retail prices from Sephora, Ulta, and Target in our API Console tab powered by SerpApi!";
    }
    return `Great question! Based on Perfect Corp AI Skin Diagnostics, I recommend combining hydrating skincare serums with custom lip shades. You can test your look in real-time in the AR Try-On tab!`;
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");

    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      { role: "assistant", text: "Contacting MirrorMuse AI Reasoning Engine..." }
    ]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || "Thank you! Check our AR Try-On and AI Skin Lab tabs for personalized recommendations.";
        setChatMessages((prev) => [
          ...prev.slice(0, prev.length - 1),
          { role: "assistant", text: replyText }
        ]);
        return;
      }
    } catch (e) {
      console.warn("AI Chat API call error:", e);
    }

    setChatMessages((prev) => [
      ...prev.slice(0, prev.length - 1),
      { role: "assistant", text: "For personalized recommendations, try running a live scan in our AI Skin Lab tab!" }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans selection:bg-pink-500 selection:text-white flex flex-col antialiased">
      {/* Global Top Announcement Bar */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 px-4 py-2 text-center text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg">
        <Sparkles className="w-4 h-4 animate-spin" />
        <span>DEVNETWORK HACKATHON 2026: MirrorMuse AI • Powered by Perfect Corp AI & AR Suite</span>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px]">VERIFIED API INTEGRATION</span>
      </div>

      {/* Global Glassmorphic Header */}
      <header className="border-b border-white/[0.08] bg-[#0b0e14]/90 backdrop-blur-xl px-6 py-3.5 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/25">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              MirrorMuse AI
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] border border-emerald-500/30 font-mono">PERFECT_CORP_READY</span>
            </h1>
            <p className="text-[11px] text-gray-400 font-mono">Your personal AR beauty & style concierge, instantly.</p>
          </div>
        </div>

        {/* Primary Module Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-black/60 border border-white/[0.08] text-xs font-semibold">
          {[
            { id: "tryon", label: "AR Try-On", icon: Camera },
            { id: "skin", label: "AI Skin Lab", icon: Scan },
            { id: "genai", label: "GenAI Look", icon: Wand2 },
            { id: "apiconsole", label: "API Console", icon: Terminal },
            { id: "storefront", label: "Storefront", icon: ShoppingBag },
            { id: "kanban", label: "Agent Sprint", icon: Layers },
            { id: "workspace", label: "Code IDE", icon: Code },
            { id: "chat", label: "AI Copilot", icon: Bot },
            { id: "dashboard", label: "Telemetry", icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold shadow-md shadow-purple-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveDemo(!activeDemo)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{activeDemo ? "Hide Topology HUD" : "Trigger Agent Directive"}</span>
          </button>
        </div>
      </header>

      {/* Live Directive Execution Topology HUD */}
      {activeDemo && (
        <div className="p-6 bg-[#0a0d14] border-b border-purple-500/30 animate-fadeIn max-w-7xl mx-auto w-full my-4 rounded-3xl">
          <StudioWorkspace
            onTrigger={(promptStr) => {
              setActiveDemo(false);
              const q = (promptStr || "").toLowerCase();
              if (q.includes("skin") || q.includes("scan") || q.includes("analysis") || q.includes("diagnostic")) {
                setActiveModule("skin");
              } else if (q.includes("genai") || q.includes("look") || q.includes("style")) {
                setActiveModule("genai");
              } else if (q.includes("price") || q.includes("deal") || q.includes("shopping") || q.includes("serp")) {
                setActiveModule("storefront");
              } else if (q.includes("chat") || q.includes("copilot") || q.includes("groq")) {
                setActiveModule("chat");
              } else {
                setActiveModule("tryon");
              }
            }}
            isExecuting={false}
          />
        </div>
      )}

      {/* Dynamic Module Content View Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

        {/* 1. AR VIRTUAL TRY-ON MODULE */}
        {activeModule === "tryon" && <VirtualTryOnStudio onAddToCart={() => setCartCount(c => c + 1)} />}

        {/* 2. AI SKIN DIAGNOSTIC LAB MODULE */}
        {activeModule === "skin" && <SkinAnalysisLab onAddToCart={() => setCartCount(c => c + 1)} />}

        {/* 3. GENAI LOOK COMPOSER MODULE */}
        {activeModule === "genai" && <GenAiLookComposer onAddToCart={() => setCartCount(c => c + 1)} />}

        {/* 4. PERFECT CORP API CONSOLE MODULE */}
        {activeModule === "apiconsole" && <PerfectApiConsole />}

        {/* 5. STOREFRONT MARKETPLACE MODULE */}
        {activeModule === "storefront" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Live SerpApi Google Shopping Market Price Search Engine */}
            <LivePriceSearch />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 pt-4">
              <div>
                <h2 className="text-lg font-bold text-white">MirrorMuse AI Beauty & Hardware Marketplace</h2>
                <p className="text-xs text-gray-400">Discover AR-compatible cosmetics and AI skin treatment products.</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer">
                <ShoppingCart className="w-4 h-4" /> Cart ({cartCount})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-3 hover:border-pink-500/40 transition-all">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-pink-300 border border-white/10">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold text-sm">{p.price}</span>
                    <button
                      onClick={() => setCartCount(cartCount + 1)}
                      className="px-3.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold cursor-pointer transition-all"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. KANBAN MODULE */}
        {activeModule === "kanban" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4">
              <h2 className="text-lg font-bold text-white">Multi-Agent Development Task Sprint</h2>
              <p className="text-xs text-gray-400">Autonomous reasoning task graph assigned to Perfect Corp specialized sub-agents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {["backlog", "progress", "review", "done"].map((col) => (
                <div key={col} className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>{col}</span>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-purple-400 font-mono">
                      {tasks.filter(t => t.col === col).length}
                    </span>
                  </h3>
                  {tasks.filter(t => t.col === col).map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] space-y-2">
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-mono">{t.tag}</span>
                      <p className="text-xs font-bold text-white">{t.title}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <User className="w-3 h-3 text-pink-400" /> {t.assignee}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. CODE IDE WORKSPACE MODULE */}
        {activeModule === "workspace" && (
          <div className="space-y-4 font-mono animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-pink-400" /> Embedded Code IDE Workspace
              </h2>
              <span className="text-xs text-emerald-400 font-bold">VITE + REACT + TYPESCRIPT</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[420px]">
              <aside className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">Project Explorer</p>
                {codeFiles.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveCodeFile(f)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                      activeCodeFile === f
                        ? "bg-purple-600/20 text-purple-300 font-bold border border-purple-500/40"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </aside>

              <main className="md:col-span-3 p-4 rounded-2xl bg-black border border-white/[0.08] overflow-auto">
                <p className="text-xs text-gray-500 mb-3">// File: components/{activeCodeFile}</p>
                <pre className="text-xs text-emerald-400 font-mono leading-relaxed">
                  {`import React from "react";\n\nexport default function ${activeCodeFile.replace(".tsx", "")}() {\n  // Perfect Corp AI & AR API Module\n  return (\n    <div className="p-4 bg-[#0a0d14] rounded-2xl">\n      <h3>Module Active</h3>\n    </div>\n  );\n}`}
                </pre>
              </main>
            </div>
          </div>
        )}

        {/* 8. AI COPILOT MODULE */}
        {activeModule === "chat" && (
          <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn">
            <div className="border-b border-white/[0.08] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">AI Beauty Concierge & Assistant Portal</h2>
                <p className="text-xs text-gray-400">Autonomous reasoning assistant for style and skincare guidance.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] min-h-[320px] space-y-3">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl text-xs max-w-lg ${
                    m.role === "user"
                      ? "bg-purple-600 text-white ml-auto"
                      : "bg-black/60 border border-white/[0.08] text-gray-200"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder="Ask AI Beauty Concierge e.g. Recommend a routine for dry skin..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#0d1017] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        )}

        {/* 9. TELEMETRY DASHBOARD MODULE */}
        {activeModule === "dashboard" && <AnalyticsDashboard />}

      </main>
    </div>
  );
}