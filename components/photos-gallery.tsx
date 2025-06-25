"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, Filter, Download, Heart, Eye, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Photo {
  id: string
  title: string
  url: string
  thumbnail: string
  tags: string[]
  likes: number
  views: number
  downloads: number
  creator: {
    name: string
    avatar?: string
  }
  category: string
  isPremium: boolean
}

const samplePhotos: Photo[] = [
  {
    id: "1",
    title: "Mountain Landscape at Sunset",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    tags: ["nature", "landscape", "sunset", "mountains"],
    likes: 245,
    views: 1250,
    downloads: 89,
    creator: { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" },
    category: "Nature",
    isPremium: false
  },
  {
    id: "2",
    title: "Modern Office Space",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    tags: ["business", "office", "modern", "workspace"],
    likes: 167,
    views: 890,
    downloads: 56,
    creator: { name: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" },
    category: "Business",
    isPremium: true
  },
  {
    id: "3",
    title: "Coffee and Notebook",
    url: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a",
    thumbnail: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=400&h=300&fit=crop",
    tags: ["coffee", "notebook", "lifestyle", "work"],
    likes: 134,
    views: 672,
    downloads: 43,
    creator: { name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
    category: "Lifestyle",
    isPremium: false
  },
  {
    id: "4",
    title: "Abstract Geometric Pattern",
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    tags: ["abstract", "geometric", "pattern", "design"],
    likes: 298,
    views: 1456,
    downloads: 112,
    creator: { name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" },
    category: "Abstract",
    isPremium: true
  },
  {
    id: "5",
    title: "Fresh Vegetables",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999",
    thumbnail: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
    tags: ["food", "vegetables", "healthy", "fresh"],
    likes: 187,
    views: 934,
    downloads: 67,
    creator: { name: "Lisa Wong", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face" },
    category: "Food",
    isPremium: false
  },
  {
    id: "6",
    title: "Urban Architecture",
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    tags: ["architecture", "urban", "building", "city"],
    likes: 223,
    views: 1124,
    downloads: 78,
    creator: { name: "David Lee", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face" },
    category: "Architecture",
    isPremium: false
  }
]

export function PhotosGallery() {
  const router = useRouter()
  const [photos, setPhotos] = useState<Photo[]>(samplePhotos)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set())

  const categories = ["All", "Nature", "Business", "Lifestyle", "Abstract", "Food", "Architecture"]

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || photo.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleLike = (photoId: string) => {
    const newLikedPhotos = new Set(likedPhotos)
    if (newLikedPhotos.has(photoId)) {
      newLikedPhotos.delete(photoId)
    } else {
      newLikedPhotos.add(photoId)
    }
    setLikedPhotos(newLikedPhotos)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPhotos.length} photos
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <Card 
            key={photo.id} 
            className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/photos/${photo.id}`)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={photo.thumbnail}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {photo.isPremium && (
                <Badge className="absolute top-2 left-2 bg-yellow-500">
                  Premium
                </Badge>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike(photo.id)
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${likedPhotos.has(photo.id) ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 line-clamp-1">{photo.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={photo.creator.avatar} />
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{photo.creator.name}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {photo.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {photo.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {photo.views}
                  </span>
                </div>
                <span>{photo.downloads} downloads</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Photos
        </Button>
      </div>
    </div>
  )
}