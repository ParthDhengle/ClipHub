"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, Filter, Eye,Heart, User } from "lucide-react"
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

interface Collection {
  id: string
  title: string
  thumbnail: string // Cover image for the collection
  themes: string[]
  itemCount: number
  views: number
  creator: {
    name: string
    avatar?: string
  }
  category: string
  isPremium: boolean
}

const sampleCollections: Collection[] = [
  {
    id: "1",
    title: "Nature's Beauty",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    themes: ["nature", "landscapes", "wilderness"],
    itemCount: 25,
    views: 1345,
    creator: { name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" },
    category: "Nature",
    isPremium: false
  },
  {
    id: "2",
    title: "Urban Vibes",
    thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    themes: ["city", "architecture", "urban"],
    itemCount: 18,
    views: 987,
    creator: { name: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" },
    category: "Urban",
    isPremium: true
  },
  {
    id: "3",
    title: "Cinematic Soundscapes",
    thumbnail: "https://images.unsplash.com/photo-1579547945413-497f067239a1?w=400&h=300&fit=crop",
    themes: ["music", "cinematic", "epic"],
    itemCount: 12,
    views: 654,
    creator: { name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
    category: "Music",
    isPremium: false
  },
  {
    id: "4",
    title: "Abstract Art",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    themes: ["abstract", "patterns", "design"],
    itemCount: 20,
    views: 1123,
    creator: { name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" },
    category: "Abstract",
    isPremium: true
  },
  {
    id: "5",
    title: "Food & Cuisine",
    thumbnail: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
    themes: ["food", "cuisine", "cooking"],
    itemCount: 15,
    views: 876,
    creator: { name: "Lisa Wong", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face" },
    category: "Food",
    isPremium: false
  },
  {
    id: "6",
    title: "Travel Adventures",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    themes: ["travel", "adventure", "destinations"],
    itemCount: 22,
    views: 1456,
    creator: { name: "David Lee", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face" },
    category: "Travel",
    isPremium: true
  }
]

const router = useRouter()
const [likedMedia, setLikedMedia] = useState<Set<string>>(new Set())

const handleLike = (id: string) => {
  const newLikedMedia = new Set(likedMedia)
  if (newLikedMedia.has(id)) {
    newLikedMedia.delete(id)
  } else {
    newLikedMedia.add(id)
  }
  setLikedMedia(newLikedMedia)
}

export function CollectionsGrid() {
  const [collections, setCollections] = useState<Collection[]>(sampleCollections)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedCollections, setLikedCollections] = useState<Set<string>>(new Set())

  const categories = ["All", "Nature", "Urban", "Music", "Abstract", "Food", "Travel"]

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || collection.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleLike = (collectionId: string) => {
    const newLikedCollections = new Set(likedCollections)
    if (newLikedCollections.has(collectionId)) {
      newLikedCollections.delete(collectionId)
    } else {
      newLikedCollections.add(collectionId)
    }
    setLikedCollections(newLikedCollections)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search collections..."
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
        Showing {filteredCollections.length} collections
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCollections.map((collection) => (
          <Card 
            key={collection.id} 
            className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/collections/${collection.id}`)}
            >
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                src={collection.thumbnail}
                alt={collection.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {collection.isPremium && (
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
                        handleLike(collection.id)
                    }}
                    >
                    <Heart 
                        className={`h-4 w-4 ${likedMedia.has(collection.id) ? 'fill-red-500 text-red-500' : ''}`} 
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
                <h3 className="font-medium mb-2 line-clamp-1">{collection.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={collection.creator.avatar} />
                    <AvatarFallback>
                    <User className="h-3 w-3" />
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{collection.creator.name}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                {collection.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    </Badge>
                ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {collection.likes}
                    </span>
                    <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {collection.views}
                    </span>
                </div>
                <span>{collection.downloads} downloads</span>
                </div>
            </CardContent>
            </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Collections
        </Button>
      </div>
    </div>
  )
}