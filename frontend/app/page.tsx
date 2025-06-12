import { Hero } from "@/components/hero"
import { Header } from "@/components/header"
import { Categories } from "@/components/categories"
import { MediaGallery } from "@/components/media-gallery"
import { InteractiveStats } from "@/components/interactive-stats"
import { InteractiveFeatures } from "@/components/interactive-features"
import { CreatorSpotlight } from "@/components/creator-spotlight"
import { Footer } from "@/components/footer"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClipHub - Free Stock Photos, Videos & Music',
  description: 'The best free stock photos, royalty free images & videos shared by creators.',
  keywords: ['stock photos', 'free images', 'royalty free', 'stock videos', 'creators', 'free music'],
  authors: [{ name: 'ClipHub Team' }],
  viewport: 'width=device-width, initial-scale=1',
  generator: 'v0.dev',
}

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
