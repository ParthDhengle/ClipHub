"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Heart,
  Eye,
  Play,
  ImageIcon,
  Video,
  Music,
  MoreHorizontal,
  Filter,
  Grid3X3,
  List,
} from "lucide-react"

export function MediaGallery() {
  const [viewMode, setViewMode] = useState("grid")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // Generate a large collection of media items
const mediaItems = [
  {
    id: 1,
    type: "photo",
    title: "Mountain Sunset",
    creator: "Alex Johnson",
    downloads: "12.5K",
    likes: "3.2K",
    views: "45K",
    image: "/a11.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Nature",
  },
  {
    id: 2,
    type: "photo",
    title: "City Architecture",
    creator: "Sarah Chen",
    downloads: "8.7K",
    likes: "2.1K",
    views: "32K",
    image: "/a12.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Architecture",
  },
  {
    id: 3,
    type: "photo",
    title: "Coffee Shop",
    creator: "Maria Garcia",
    downloads: "15.2K",
    likes: "4.8K",
    views: "67K",
    image: "/a13.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Food",
  },
  {
    id: 4,
    type: "video",
    title: "Ocean Waves",
    creator: "David Kim",
    downloads: "6.3K",
    likes: "1.9K",
    views: "28K",
    image: "/a14.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Nature",
    duration: "0:45",
  },
  {
    id: 5,
    type: "photo",
    title: "Forest Path",
    creator: "Emma Wilson",
    downloads: "9.8K",
    likes: "2.7K",
    views: "38K",
    image: "/a15.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Nature",
  },
  {
    id: 6,
    type: "photo",
    title: "Modern Office",
    creator: "John Smith",
    downloads: "11.2K",
    likes: "3.5K",
    views: "42K",
    image: "/a16.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Business",
  },
  {
    id: 7,
    type: "video",
    title: "City Traffic",
    creator: "Lisa Brown",
    downloads: "7.1K",
    likes: "2.3K",
    views: "31K",
    image: "/a17.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Urban",
    duration: "1:20",
  },
  {
    id: 8,
    type: "photo",
    title: "Flower Garden",
    creator: "Tom Davis",
    downloads: "13.6K",
    likes: "4.1K",
    views: "52K",
    image: "/a18.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Nature",
  },
  {
    id: 9,
    type: "photo",
    title: "Street Art",
    creator: "Anna Lee",
    downloads: "5.9K",
    likes: "1.8K",
    views: "25K",
    image: "/z16.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Art",
  },
  {
    id: 10,
    type: "video",
    title: "Cooking Process",
    creator: "Chef Marco",
    downloads: "8.4K",
    likes: "2.6K",
    views: "35K",
    image: "/a11.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Food",
    duration: "2:15",
  },
  {
    id: 11,
    type: "photo",
    title: "Beach Sunset",
    creator: "Ocean Lover",
    downloads: "16.8K",
    likes: "5.2K",
    views: "71K",
    image: "/a12.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Nature",
  },
  {
    id: 12,
    type: "photo",
    title: "Technology Setup",
    creator: "Tech Guru",
    downloads: "10.3K",
    likes: "3.1K",
    views: "44K",
    image: "/a13.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Technology",
  },
  {
    id: 13,
    type: "video",
    title: "Workout Session",
    creator: "Fitness Pro",
    downloads: "9.2K",
    likes: "2.8K",
    views: "39K",
    image: "/a14.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Sports",
    duration: "3:30",
  },
  {
    id: 14,
    type: "photo",
    title: "Fashion Portrait",
    creator: "Style Maven",
    downloads: "12.7K",
    likes: "3.9K",
    views: "48K",
    image: "/a15.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Fashion",
  },
  {
    id: 15,
    type: "photo",
    title: "Pet Photography",
    creator: "Animal Friend",
    downloads: "14.1K",
    likes: "4.3K",
    views: "56K",
    image: "/a16.jpg",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Animals",
  },
];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Free Stock Media</h2>
            <p className="text-muted-foreground">Discover millions of high-quality photos, videos, and audio files</p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {mediaItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ height: "auto" }}
                    />

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
                        {item.type === "video" && item.duration && <span className="ml-1">• {item.duration}</span>}
                      </Badge>
                    </div>

                    {/* Video Play Button */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                        hoveredItem === index ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute top-3 right-3">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex justify-between items-center text-white text-sm mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {item.views}
                            </span>
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {item.downloads}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {item.likes}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6 border border-white">
                              <AvatarImage src={item.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{item.creator.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-white text-sm font-medium">{item.creator}</span>
                          </div>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                            <Download className="h-3 w-3 mr-1" />
                            Free
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Heart className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {mediaItems
                .filter((item) => item.type === "photo")
                .map((item, index) => (
                  <Card
                    key={item.id}
                    className="break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6 border border-white">
                                <AvatarImage src={item.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{item.creator.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-white text-sm">{item.creator}</span>
                            </div>
                            <Button size="sm" className="bg-white text-black">
                              <Download className="h-3 w-3 mr-1" />
                              Free
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="text-xs mb-2">
                        {item.category}
                      </Badge>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {mediaItems
                .filter((item) => item.type === "video")
                .map((item, index) => (
                  <Card
                    key={item.id}
                    className="break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-3 left-3 bg-black/70 text-white">
                        <Video className="h-3 w-3 mr-1" />
                        {item.duration}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="text-xs mb-2">
                        {item.category}
                      </Badge>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Audio Content</h3>
              <p className="text-muted-foreground">Discover royalty-free music and sound effects</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Content
          </Button>
        </div>
      </div>
    </section>
  )
}
