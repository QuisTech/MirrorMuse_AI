# 🪞 MirrorMuse AI
> **Your Personal AI & AR Beauty Concierge**  
> *Built for DevNetwork [API + Cloud + AI] Hackathon 2026 — Perfect Corp Sponsor Challenge Entry*

---

## 🌟 Overview

**MirrorMuse AI** is an immersive, multi-agent AI & AR consumer experience designed to revolutionize personal care and e-commerce shopping. By bridging computer vision, generative AI, and real-time virtual try-on technology powered by **Perfect Corp**, MirrorMuse AI delivers an interactive digital mirror that diagnoses skin health, renders real-time lipstick and eyewear try-ons, and composes personalized fashion & makeup ensembles.

---

## ✨ Key Features

- 💋 **Interactive AR Virtual Try-On Studio**: Real-time shade rendering for Lipsticks, Blush, Eyeshadow, Foundation, and Glasses with simulated 108 facial landmark tracking, pigment opacity sliders, and split-view before/after comparison.
- 🔬 **AI Skin Diagnostic & Health Lab**: Multi-spectral neural skin scanner measuring 6 key dermatological metrics (Texture, Wrinkles, Spots, Hydration, Elasticity, Dark Circles) to output a composite 0–100 Skin Health Score (e.g. 83/100 A+) and targeted product recommendations.
- 🎨 **GenAI Style & Look Composer**: Text-to-image style generator translating aesthetic prompts (*"Golden Hour Sunset Glam"*, *"Cyberpunk Neon Glow"*) into high-fashion visual ensembles and matched physical product bundles.
- 🛠️ **Perfect Corp & Partner API Console**: Live REST API payload debugger allowing judges to test raw request/response JSONs for Perfect Corp's YCE APIs (`/skin-analysis`, `/virtual-tryon`), Xano backend workflows, and SerpApi product searches.
- 📊 **Executive Telemetry & SLA Dashboard**: Real-time performance monitoring tracking sub-14ms landmark alignment, 60 FPS rendering, and multi-sponsor API health.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, Vite, TypeScript
- **Styling & UI**: Tailwind CSS, Lucide React Icons, Custom Glassmorphism Theme
- **AI & AR Integrations**: Perfect Corp YCE API Suite (AI Skin Analysis, AR Try-On, Gen AI Text-to-Image)
- **Partner Services**: Xano Backend Workflows, SerpApi Shopping Search, Nutrient PDF Export

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js (v18.x or higher)
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/MirrorMuse_AI.git
   cd MirrorMuse_AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🏆 DevNetwork 2026 Hackathon Alignment

- **Sponsor Challenge**: Perfect Corp: Building the Next Generation of AI-Driven Consumer Experiences ($2,500 Cash)
- **API Integration**: Integrates and showcases Perfect Corp AI Skin Analysis, AR Virtual Try-On, and Gen AI APIs.
- **Consumer & Retail Value**: Elevates e-commerce conversion through personalized diagnostic scoring and direct-to-cart shade recommendations.

---

## 📄 License
MIT License. Crafted for DevNetwork Hackathon 2026.