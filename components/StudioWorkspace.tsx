import React, { useState } from "react";
import { Zap, Play, RefreshCw } from "lucide-react";

interface StudioWorkspaceProps {
  onTrigger: () => void;
  isExecuting: boolean;
}

export default function StudioWorkspace({ onTrigger, isExecuting }: StudioWorkspaceProps) {
  const [promptInput, setPromptInput] = useState("");
  const nodes = [
  {
    "id": 1,
    "title": "VisionAgent • Detect facial landmarks and apply AR overlays",
    "badge": "AUTONOMOUS_AI",
    "latency": "14ms",
    "status": "ONLINE",
    "description": "Inputs: Live video frame, user consent → Outputs: Landmark coordinates, AR mesh data",
    "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": 2,
    "title": "SkinInsightAgent • Analyze skin metrics and generate health score",
    "badge": "MULTI_AGENT",
    "latency": "8ms",
    "status": "STREAMING",
    "description": "Inputs: Cropped face image, landmark data → Outputs: Skin type, concerns, product suggestions",
    "imageUrl": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80"
  },
  {
    "id": 3,
    "title": "StyleComposerAgent • Combine skin insights, user preferences, and inventory to compose makeup & outfit ensembles",
    "badge": "ENTERPRISE",
    "latency": "22ms",
    "status": "ACTIVE",
    "description": "Inputs: Skin analysis results, user style questionnaire, product catalog → Outputs: Personalized look recommendation, AR assets",
    "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
  }
];

  return (
    <div className="space-y-6 font-sans text-gray-100 bg-[#0a0d14] p-6 rounded-3xl border border-white/[0.08] shadow-2xl">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-[#101424] to-purple-950/80 border border-indigo-500/40 relative overflow-hidden">
        <h2 className="text-xl font-extrabold text-white tracking-wide">MirrorMuse AI</h2>
        <p className="text-xs text-gray-300 max-w-2xl leading-relaxed mb-6">Your personal AR beauty & style concierge, instantly.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Enter production directive for MirrorMuse AI..."
            className="flex-1 px-4 py-3 rounded-xl bg-black/80 border border-indigo-500/40 text-sm text-white focus:outline-none"
          />
          <button onClick={onTrigger} disabled={isExecuting} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-2">
            {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>EXECUTE DIRECTIVE</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nodes.map((node: any) => (
          <div key={node.id} className="p-4 rounded-2xl bg-[#0d111a] border border-white/[0.08] space-y-3">
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{node.badge}</span>
            <h4 className="text-sm font-bold text-white">{node.title}</h4>
            <p className="text-xs text-gray-400 line-clamp-2">{node.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}