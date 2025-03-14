import SignatureGenerator from "@/components/signature-generator"
import { WavyBackground } from "@/components/ui/wavy-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <WavyBackground className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto px-4">
          <header className="py-12 md:py-20 text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl md:text-6xl font-cursive text-primary">Sign</span>
                <span className="text-5xl md:text-6xl font-bold text-primary-600">Wave</span>
                <div className="w-8 h-8 rounded-full bg-primary-200 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Create Stunning Signatures in Seconds
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Transform your name into a beautiful, personalized signature with our easy-to-use designer. Perfect for
              documents, emails, or your creative projects.
            </p>
          </header>
          <SignatureGenerator />
        </div>
      </WavyBackground>
    </main>
  )
}

