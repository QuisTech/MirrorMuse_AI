import asyncio
import os
import edge_tts

SCRIPT_TEXT = """Welcome to MirrorMuse AI, your autonomous AR beauty and style concierge powered by Perfect Corp, Groq, Xano, and SerpApi.

Starting in the Interactive AR Virtual Try-On Studio, our vision engine performs 108 landmark facial mesh tracking in under 14 milliseconds at 60 frames per second. Users can switch between high-pigment lipstick shades like Velvet Rose and Plum Noir, adjust opacity in real time, snap look captures, toggle favorited wishlist items, and add individual swatches directly into the unified shopping cart.

Moving to the AI Skin Diagnostic Lab, our 6-layer dermatological neural model analyzes cropped face imagery to evaluate composite health scores, hydration levels, oil balance, and texture metrics—instantly matching personalized skincare regimens with one-click SKU purchasing.

In the GenAI Look Composer, custom style prompts synthesize high-fashion aesthetic ensembles using Pollinations Flux.1 models. Perfect Corp's YCE pigment matching maps digital colors to physical cosmetic SKUs like Celestial Gold Shimmer Palette and Sun-Kissed Bronzing Nectar, available as itemized products or complete look bundles.

Our Storefront Marketplace features a live SerpApi Google Shopping engine, searching real-time cosmetics market prices across Sephora, Target, and Ulta with instant buy links.

For personalized consultations, the AI Copilot powered by Groq Llama 3.3 70B delivers instant skincare recommendations.

Every product added across all modules updates our itemized global shopping cart drawer. Upon checkout, a glassmorphic order receipt generates a Xano-persisted reference ID, streaming live multi-sponsor API dispatch logs into our Executive Telemetry & SLA Dashboard.

MirrorMuse AI: Bridging computer vision, generative AI, and real-time commerce."""

DOWNLOADS_DIR = r"C:\Users\Administrator\Downloads"

async def generate_audio():
    # Female Voice 1
    f1 = os.path.join(DOWNLOADS_DIR, "full_app_tour_female.mp3")
    await edge_tts.Communicate(SCRIPT_TEXT, "en-US-AvaNeural").save(f1)
    
    # Female Voice 2
    f2 = os.path.join(DOWNLOADS_DIR, "realistic_narration.mp3")
    await edge_tts.Communicate(SCRIPT_TEXT, "en-US-AvaNeural").save(f2)
    print(f"Saved female audio files to {f1} and {f2}")

    # Male Voice 1
    m1 = os.path.join(DOWNLOADS_DIR, "full_app_tour_male.mp3")
    await edge_tts.Communicate(SCRIPT_TEXT, "en-US-AndrewNeural").save(m1)

    # Male Voice 2
    m2 = os.path.join(DOWNLOADS_DIR, "realistic_narration_male.mp3")
    await edge_tts.Communicate(SCRIPT_TEXT, "en-US-AndrewNeural").save(m2)
    print(f"Saved male audio files to {m1} and {m2}")

if __name__ == "__main__":
    asyncio.run(generate_audio())
