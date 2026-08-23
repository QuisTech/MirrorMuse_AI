import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, ExternalLink, RefreshCw, Sparkles, Tag, ShieldCheck } from "lucide-react";

interface PriceResult {
  title: string;
  price: string;
  source: string;
  link: string;
  thumbnail: string;
}

export default function LivePriceSearch() {
  const [query, setQuery] = useState("Hyaluronic Acid Serum");
  const [results, setResults] = useState<PriceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");

  const searchPrices = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchedQuery(searchQuery);

    try {
      const res = await fetch(`/api/serp/shopping?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          setResults(data.results);
        }
      }
    } catch (err) {
      console.warn("SerpApi search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchPrices("Hyaluronic Acid Serum");
  }, []);

  return (
    <div className="space-y-4 p-6 rounded-3xl bg-[#0a0d14] border border-amber-500/30 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
              SERPAPI GOOGLE SHOPPING ENGINE
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE SERPAPI CONNECTED
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Live Market Price Comparison</h3>
          <p className="text-xs text-gray-400">Search real-time cosmetics market prices across Sephora, Target, and Ulta.</p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {["Hyaluronic Acid", "Niacinamide Serum", "Red Lipstick", "Vitamin C"].map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                searchPrices(term);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] font-medium text-gray-300 transition-all cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Live Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchPrices(query)}
            placeholder="Search any cosmetic product for live market pricing..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/80 border border-amber-500/30 text-sm text-white focus:outline-none focus:border-amber-400 transition-all"
          />
        </div>
        <button
          onClick={() => searchPrices(query)}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <Tag className="w-4 h-4" />}
          <span>{loading ? "Fetching SerpApi..." : "Search Live Deals"}</span>
        </button>
      </div>

      {/* Results Display Grid */}
      {searchedQuery && (
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3 font-mono">
            <span>SHOWING SERPAPI RESULTS FOR "{searchedQuery.toUpperCase()}"</span>
            <span>{results.length} DEALS FOUND</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#0d1017] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-amber-500/40 transition-all group">
                <div className="flex items-center gap-3">
                  <img src={item.thumbnail} alt={item.title} className="w-12 h-12 rounded-xl object-cover bg-black shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {item.source}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">{item.title}</h4>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">{item.price}</span>
                  </div>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-amber-500 hover:text-black text-gray-400 transition-all shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
