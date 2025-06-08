import { Hero } from "@/components/hero"
import { Header } from "@/components/header"
import { Categories } from "@/components/categories"
import { MediaGallery } from "@/components/media-gallery"
import { InteractiveStats } from "@/components/interactive-stats"
import { InteractiveFeatures } from "@/components/interactive-features"
import { CreatorSpotlight } from "@/components/creator-spotlight"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Categories />
        <MediaGallery />
        <InteractiveStats />
        <InteractiveFeatures />
        <CreatorSpotlight />
      </main>
      <Footer />
    </div>
  )
}
