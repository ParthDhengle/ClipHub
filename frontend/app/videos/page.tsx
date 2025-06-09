import { Metadata } from "next"
import { VideosGallery } from "@/components/videos-gallery"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Videos - ClipHub",
  description: "Professional stock videos and footage for your creative projects.",
}

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Premium Stock Videos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect video content for your projects. High-quality footage 
              from cinematic shots to motion graphics, all created by professional videographers.
            </p>
          </div>
          <VideosGallery />
        </div>
      </main>
      <Footer />
    </div>
  )
}