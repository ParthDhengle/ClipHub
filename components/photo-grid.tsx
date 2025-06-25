"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Heart, Bookmark, MoreHorizontal, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function PhotoGrid() {
  const [photos] = useState([
    {
      id: 1,
      src: "/placeholder.svg?height=400&width=600",
      alt: "City skyline",
      photographer: "Jane Smith",
      avatar: "/a11.jpg?height=40&width=40",
    },
    {
      id: 2,
      src: "/placeholder.svg?height=600&width=400",
      alt: "Beach scene",
      photographer: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      src: "/placeholder.svg?height=500&width=500",
      alt: "Mountain landscape",
      photographer: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      src: "/placeholder.svg?height=450&width=600",
      alt: "Forest path",
      photographer: "Sam Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      src: "/placeholder.svg?height=600&width=450",
      alt: "Desert sunset",
      photographer: "Taylor Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      src: "/placeholder.svg?height=400&width=600",
      alt: "Ocean waves",
      photographer: "Morgan Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Free Stock Photos</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Trending
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Trending</DropdownMenuItem>
              <DropdownMenuItem>New</DropdownMenuItem>
              <DropdownMenuItem>Popular</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group relative">
              <div className="relative">
             <img
  src={photo.src || "a11.jpg"}

  alt={photo.alt}
  className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
/>


                {/* Overlay with actions - visible on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="icon" className="text-white">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={photo.avatar || "/a11.jpg"} />
                        <AvatarFallback>{photo.photographer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-white text-sm font-medium">{photo.photographer}</span>
                    </div>

                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="text-white">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white">
                        <Bookmark className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white">
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      </div>
    </section>
  )
}
