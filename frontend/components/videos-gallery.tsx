"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, Filter, Download, Heart, Eye, User, Play, Clock } from "lucide-react"
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

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
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
  resolution: string
  fps: number
}

const sampleVideos: Video[] = [
  {
    id: "1",
    title: "Ocean Waves in Slow Motion",
    thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop",
    duration: "0:15",
    tags: ["nature", "ocean", "waves", "slow-motion"],
    likes: 342,
    views: 2150,
    downloads: 127,
    creator: { name: "Ocean Films", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" },
    category: "Nature",
    isPremium: false,
    resolution: "4K",
    fps: 60
  },
  {
    id: "2",
    title: "Corporate Team Meeting",
    thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
    duration: "0:30",
    tags: ["business", "meeting", "corporate", "teamwork"],
    likes: 189,
    views: 1456,
    downloads: 78,
    creator: { name: "Biz Content", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" },
    category: "Business",
    isPremium: true,
    resolution: "1080p",
    fps: 30
  },
]

export function VideosGallery() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>(sampleVideos)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set())

  const categories = ["All", "Nature", "Business", "Urban", "Lifestyle", "Abstract", "Adventure"]

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleLike = (videoId: string) => {
    const newLikedVideos = new Set(likedVideos)
    if (newLikedVideos.has(videoId)) {
      newLikedVideos.delete(videoId)
    } else {
      newLikedVideos.add(videoId)
    }
    setLikedVideos(newLikedVideos)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search videos..."
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
        Showing {filteredVideos.length} videos
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card 
            key={video.id} 
            className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/videos/${video.id}`)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {video.isPremium && (
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
                      handleLike(video.id)
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${likedVideos.has(video.id) ? 'fill-red-500 text-red-500' : ''}`} 
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
              <h3 className="font-medium mb-2 line-clamp-1">{video.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={video.creator.avatar} />
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{video.creator.name}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {video.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {video.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views}
                  </span>
                </div>
                <span>{video.downloads} downloads</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        {/* Load More */}
        <div className="text-center mt-6">
            <Button variant="outline" size="lg">
                Load More Videos
            </Button>
        </div>
    </div>
)
}