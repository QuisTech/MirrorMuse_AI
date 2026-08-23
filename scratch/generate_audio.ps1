Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SetOutputToWaveFile("c:\Users\Administrator\Downloads\MirrorMuse_AI\narration.wav")
$synth.Rate = 0
$synth.Volume = 100

$script = @"
Welcome to MirrorMuse AI, the next-generation AI and AR beauty concierge built for the DevPost Hackathon.

Online beauty shopping is outdated. Static product pages fail to show how cosmetics look on your real face, cannot diagnose your skin health, and hide real market prices.

MirrorMuse AI solves this with triple sponsor integration.

First, powered by Perfect Corp's S2S APIs, MirrorMuse AI performs real-time 108 landmark face mesh tracking and multi-spectral skin layer diagnostics right from your browser camera.

Second, for enterprise backend persistence, every skin diagnostic scan and saved shade collection is stored in our Xano database instance xtgz-thlr-k1v0, delivering sub-20 millisecond execution times.

Third, to ensure shoppers get the best deal, we integrated SerpApi's Google Shopping engine, fetching real-time market prices across Sephora, Ulta, and Target.

Finally, our AI Beauty Concierge uses Groq's Llama 3.3 70B model with multi-key rotation to orchestrate all three sponsors in real time.

MirrorMuse AI is live on production at mirrormuse-ai.vercel.app. Thank you for watching!
"@

$synth.Speak($script)
$synth.Dispose()
Write-Host "Full Narration Audio Generated Successfully at c:\Users\Administrator\Downloads\MirrorMuse_AI\narration.wav"
