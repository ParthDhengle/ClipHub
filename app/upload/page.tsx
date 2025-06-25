import { UploadForm } from "@/components/upload-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <UploadForm />
      </main>
      <Footer />
    </div>
  )
}