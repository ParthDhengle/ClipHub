"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Camera, Video, Music, Users, ImageIcon, Bookmark } from "lucide-react"
import { LucideIcon } from "lucide-react"

// Define the type for category objects
interface Category {
  name: string
  icon: LucideIcon // Type for Lucide icons
  path?: string // Optional path for navigation
}

export function Categories() {
  // Define categories with navigation paths where applicable
  const categories: Category[] = [
    { name: "Home", icon: Camera, path: "/" },
    { name: "Images", icon: Video, path: "/photos" },
    { name: "Videos", icon: Video, path: "/videos" },
    { name: "Music", icon: Music, path: "/music" },
    { name: "Creators", icon: Users, path: "/creators" },
    { name: "Collections", icon: Bookmark, path: "/collections" },
    { name: "Leaderboard", icon: Users }, // No path yet
    { name: "Challenges", icon: ImageIcon }, // No path yet
  ]

  // Get current pathname to determine active category
  const pathname = usePathname()
  
  // State to track the clicked category (fallback if navigation isn't immediate)
  const [activeCategory, setActiveCategory] = useState(() => {
    // Initialize based on current pathname
    const current = categories.find(category => category.path === pathname)
    return current ? current.name : "Home"
  })

  return (
    <div className="border-b sticky top-16 bg-background/80 backdrop-blur-md z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 py-4">
            {categories.map((category) => {
              const isActive = category.name === activeCategory || (category.path && category.path === pathname)
              return (
                <Button
                  key={category.name}
                  variant={isActive ? "default" : "ghost"}
                  className="flex items-center"
                  asChild={!!category.path} // Use asChild for Link if path exists
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.path ? (
                    <Link href={category.path}>
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </Link>
                  ) : (
                    <>
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </>
                  )}
                </Button>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}