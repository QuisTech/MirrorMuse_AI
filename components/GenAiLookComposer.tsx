import React, { useState } from "react";
import { Sparkles, Wand2, RefreshCw, ShoppingCart, Download, Check, Layers, Image as ImageIcon, Heart } from "lucide-react";

interface LookPreset {
  id: string;
  title: string;
  category: string;
  prompt: string;
  image: string;
  lipShade: string;
  eyeShade: string;
  products: { name: string; price: string }[];
}

export default function GenAiLookComposer() {
  const presets: LookPreset[] = [
    {
      id: "golden-hour",
      title: "Golden Hour Sunset Glam",
      category: "Warm & Radiant",
      prompt: "Warm bronzed skin with shimmering golden eyeshadow, sun-kissed blush, and glossy nude rose lipstick",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
      lipShade: "Nude Sunset #102",
      eyeShade: "Celestial Gold #301",
      products: [
        { name: "Celestial Gold Shimmer Palette", price: "$44.00" },
        { name: "Sun-Kissed Bronzing Nectar", price: "$38.00" },
        { name: "Glossy Nude Rose Elixir", price: "$32.00" }
      ]
    },
    {
      id: "cyber-neon",
      title: "Cyberpunk Neon Glow",
      category: "Futuristic & Metallic",
      prompt: "Electric violet winged liner with metallic chrome lipstick, iridescent highlighter, and sharp contour",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      lipShade: "Plum Metallic #809",
      eyeShade: "Violet Nebula #309",
      products: [
        { name: "Holographic High-Pigment Liner", price: "$29.00" },
        { name: "Chrome Metallic Lip Stain", price: "$36.00" }
      ]
    },
    {
      id: "parisian-classic",
      title: "Parisian Crimson Chic",
      category: "Timeless & Elegant",
      prompt: "Matte classic red lipstick, soft feline wing eyeliner, flawless porcelain skin finish, and groomed brows",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      lipShade: "Velvet Crimson #501",
      eyeShade: "Smoky Onyx #305",
      products: [
        { name: "Crimson Velvet Lip Colour", price: "$36.00" },
        { name: "Liquid Felt-Tip Precision Liner", price: "$26.00" }
      ]
    }
  ];

  const [activeLook, setActiveLook] = useState<LookPreset>(presets[0]);
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const getImageForPrompt = (p: string) => {
    const q = p.toLowerCase();
    if (q.includes("male") || q.includes("man") || q.includes("guy") || q.includes("grooming")) {
      return {
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        lip: "Matte Hydrating Balm #001",
        eye: "Natural Brow Sculpt #101",
        prods: [
          { name: "Matte Hydrating Lip Balm", price: "$24.00" },
          { name: "Precision Brow & Beard Definer", price: "$28.00" },
          { name: "Mattifying Sebum Control Elixir", price: "$42.00" }
        ]
      };
    }
    if (q.includes("dry") || q.includes("hydration") || q.includes("moisture") || q.includes("glass")) {
      return {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
        lip: "Hydrating Dewy Tint #204",
        eye: "Glass Luminizer #101",
        prods: [
          { name: "3D Hyaluronic Hydration Serum", price: "$46.00" },
          { name: "Dewy Glass-Skin Essence", price: "$38.00" }
        ]
      };
    }
    if (q.includes("oil") || q.includes("acne") || q.includes("matte") || q.includes("pore")) {
      return {
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        lip: "Velvet Satin Neutral #405",
        eye: "Soft Focus Matte Nude #202",
        prods: [
          { name: "Oil-Control Salicylic Acid Cleanser", price: "$32.00" },
          { name: "Zero-Shine Mattifying Primer", price: "$36.00" }
        ]
      };
    }
    if (q.includes("neon") || q.includes("cyber") || q.includes("purple") || q.includes("futuristic")) {
      return {
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
        lip: "Plum Chrome Metallic #809",
        eye: "Electric Violet Liner #309",
        prods: [
          { name: "Holographic High-Pigment Liner", price: "$29.00" },
          { name: "Chrome Metallic Lip Stain", price: "$36.00" }
        ]
      };
    }
    return {
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80",
      lip: "Custom Pigment Blend #999",
      eye: "Multi-Reflective Pearl #701",
      prods: [
        { name: "Custom Pigment Blend Kit", price: "$48.00" },
        { name: "Pearl Luminizer Serum", price: "$42.00" }
      ]
    };
  };

  const handleSynthesize = async () => {
    if (!customPrompt) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/perfect/genai-look", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveLook({
          id: "custom-gen-" + Date.now(),
          title: "GenAI Look: " + customPrompt.slice(0, 24) + "...",
          category: "Live Flux.1 AI Model",
          prompt: customPrompt,
          image: data.imageUrl,
          lipShade: data.lipShade,
          eyeShade: data.eyeShade,
          products: data.products
        });
      }
    } catch (e) {
      console.warn("GenAI API Synthesis Note:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
              PERFECT CORP GEN AI TEXT-TO-IMAGE API v3.0
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              1024x1024 LOSSLESS SYNTHESIS
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">GenAI Style & Look Composer Studio</h2>
          <p className="text-xs text-gray-400">Describe any aesthetic or choose a curated style prompt to generate instant high-fashion visual ensembles.</p>
        </div>
      </div>

      {/* Prompt Bar Input */}
      <div className="p-4 rounded-3xl bg-[#0a0d14] border border-white/[0.08] shadow-2xl space-y-3">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span>Generative AI Text Prompt</span>
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. Iridescent opal eyeshadow with glossy berry lipstick and glowing glass skin..."
            className="flex-1 px-4 py-3 rounded-xl bg-black/80 border border-purple-500/30 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-gray-600"
          />
          <button
            onClick={handleSynthesize}
            disabled={isGenerating || !customPrompt}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-current" />}
            <span>{isGenerating ? "Synthesizing Look..." : "Synthesize Look"}</span>
          </button>
        </div>
      </div>

      {/* Preset Look Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {presets.map((p) => {
          const isSelected = activeLook.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setActiveLook(p)}
              className={`p-4 rounded-2xl cursor-pointer border transition-all space-y-3 ${
                isSelected
                  ? "bg-gradient-to-b from-purple-950/40 via-[#0d101a] to-pink-950/40 border-purple-500/60 shadow-xl scale-[1.02]"
                  : "bg-[#0a0d14] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"
              }`}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-purple-300 border border-white/10">
                  {p.category}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{p.title}</h4>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{p.prompt}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active GenAI Render Output Stage */}
      <div className="rounded-3xl bg-[#0a0d14] border border-white/[0.08] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-2xl">
        <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/10 group">
          <img
            src={activeLook.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1024&q=80";
            }}
            alt={activeLook.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-5 text-xs text-white">
            <span className="px-2.5 py-1 rounded-md bg-purple-600/80 backdrop-blur-md text-[10px] font-bold font-mono w-fit mb-2">
              GENAI_MODEL: PERFECT_LOOK_DIFFUSION_v3
            </span>
            <h3 className="text-lg font-bold">{activeLook.title}</h3>
            <p className="text-gray-300 text-[11px] mt-1">{activeLook.prompt}</p>
          </div>
        </div>

        {/* Product Kit Breakdown */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Matched Product Kit</span>
            <h3 className="text-lg font-bold text-white mt-1">Recreate This Look</h3>
            <p className="text-xs text-gray-400">Perfect Corp API matched the synthesized pigments to physical SKUs.</p>
          </div>

          <div className="space-y-2">
            <div className="p-3.5 rounded-xl bg-[#0d1017] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400">Lip Pigment Shade</span>
              <span className="font-bold text-pink-400 font-mono">{activeLook.lipShade}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0d1017] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-400">Eye Shader Accent</span>
              <span className="font-bold text-purple-400 font-mono">{activeLook.eyeShade}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Required Products</label>
            {activeLook.products.map((prod, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/60 border border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-white font-medium">{prod.name}</span>
                <span className="font-bold text-amber-400">{prod.price}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-all">
            <ShoppingCart className="w-4 h-4" />
            <span>Add Complete Look Bundle to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
