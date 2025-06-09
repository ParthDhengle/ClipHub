import { Metadata } from "next"
import { CollectionsGrid } from "@/components/collections-grid"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Collections - ClipHub",
  description: "Curated collections of photos, videos, and audio organized by theme and style.",
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Curated Collections</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover carefully curated collections of premium content. 
              Organized by theme, mood, and style to help you find exactly what you need.
            </p>
          </div>
          <CollectionsGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}