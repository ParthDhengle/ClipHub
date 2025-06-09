import { Metadata } from "next"
import { MusicLibrary } from "@/components/music-library"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Music - ClipHub",
  description: "Royalty-free music and audio tracks for your creative projects.",
}

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Royalty-Free Music</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enhance your projects with our curated collection of music tracks. 
              From ambient soundscapes to energetic beats, find the perfect soundtrack.
            </p>
          </div>
          <MusicLibrary />
        </div>
      </main>
      <Footer />
    </div>
  )
}