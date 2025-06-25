import { Metadata } from "next"
import { PhotosGallery } from "@/components/photos-gallery"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Photos - ClipHub",
  description: "Discover stunning stock photos from talented creators around the world.",
}

export default function PhotosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Stunning Stock Photos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover high-quality images perfect for your projects. From landscapes to portraits, 
              find the perfect shot from our community of talented photographers.
            </p>
          </div>
          <PhotosGallery />
        </div>
      </main>
      <Footer />
    </div>
  )
}