import { CreatorsDirectory } from "@/components/creators-directory"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CreatorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <CreatorsDirectory />
      </main>
      <Footer />
    </div>
  )
}
