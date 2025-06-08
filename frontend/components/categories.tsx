import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Camera, Video, Music, Users, ImageIcon, Bookmark } from "lucide-react"

export function Categories() {
  const categories = [
    { name: "Home", icon: Camera, active: true },
    { name: "Videos", icon: Video },
    { name: "Music", icon: Music },
    { name: "Creators", icon: Users },
    { name: "Collections", icon: Bookmark },
    { name: "Leaderboard", icon: Users },
    { name: "Challenges", icon: ImageIcon },
  ]

  return (
    <div className="border-b sticky top-16 bg-background/80 backdrop-blur-md z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 py-4">
            {categories.map((category) => (
              <Button key={category.name} variant={category.active ? "default" : "ghost"} className="flex items-center">
                {/* @ts-expect-error */}
                <category.icon className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
