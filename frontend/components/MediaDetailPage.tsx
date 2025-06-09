"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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

interface MediaItem {
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
  type: "photo" | "video" | "music" | "collection"
  duration?: string
  itemCount?: number
}

const sampleMedia: MediaItem[] = [
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
    isPremium: false,
    type: "photo"
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
    isPremium: true,
    type: "photo"
  },
  {
    id: "3",
    title: "Chill Lo-Fi Track",
    url: "https://example.com/audio/lofi.mp3",
    thumbnail: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=400&h=300&fit=crop",
    tags: ["lofi", "chill", "music", "relax"],
    likes: 134,
    views: 672,
    downloads: 43,
    creator: { name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
    category: "Music",
    isPremium: false,
    type: "music",
    duration: "3:45"
  },
  {
    id: "4",
    title: "Nature Collection",
    url: "https://example.com/collection/nature",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    tags: ["nature", "photos", "videos", "outdoors"],
    likes: 298,
    views: 1456,
    downloads: 112,
    creator: { name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" },
    category: "Nature",
    isPremium: true,
    type: "collection",
    itemCount: 12
  }
]

export function MediaDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [media, setMedia] = useState<MediaItem | null>(null)
  const [liked, setLiked] = useState(false)
  const [suggestedMedia, setSuggestedMedia] = useState<MediaItem[]>([])

  useEffect(() => {
    const item = sampleMedia.find(m => m.id === id)
    setMedia(item || null)
    if (item) {
      const suggestions = sampleMedia
        .filter(m => m.category === item.category && m.id !== item.id)
        .slice(0, 4)
      setSuggestedMedia(suggestions)
    }
  }, [id])

  const handleLike = () => {
    setLiked(prev => !prev)
  }

  if (!media) {
    return <div className="p-6 text-center">Media not found</div>
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative aspect-[16/9] max-h-[80vh]">
          {media.type === "photo" && (
            <img
              src={media.url}
              alt={media.title}
              className="w-full h-full object-contain"
            />
          )}
          {media.type === "video" && (
            <video
              src={media.url}
              controls
              className="w-full h-full object-contain"
            />
          )}
          {media.type === "music" && (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <img src={media.thumbnail} alt={media.title} className="w-1/2 h-auto object-cover rounded-md mb-4" />
              <audio src={media.url} controls className="w-full max-w-md" />
            </div>
          )}
          {media.type === "collection" && (
            <div className="p-4">
              <img src={media.thumbnail} alt={media.title} className="w-full h-auto object-cover rounded-md mb-4" />
              <p className="text-lg">Collection of {media.itemCount} items</p>
            </div>
          )}
          {media.isPremium && (
            <Badge className="absolute top-4 left-4 bg-yellow-500">
              Premium
            </Badge>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{media.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={media.creator.avatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{media.creator.name}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {media.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleLike}
              className="flex items-center gap-2"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
              {media.likes + (liked ? 1 : 0)}
            </Button>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              {media.views}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              {media.downloads}
            </span>
            {media.duration && (
              <span className="text-sm text-muted-foreground">
                Duration: {media.duration}
              </span>
            )}
            {media.itemCount && (
              <span className="text-sm text-muted-foreground">
                Items: {media.itemCount}
              </span>
            )}
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            Back to Gallery
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold">Suggested {media.type === "collection" ? "Collections" : `${media.type.charAt(0).toUpperCase() + media.type.slice(1)}s`}</h2>
       フォーム
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suggestedMedia.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.isPremium && (
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
                      onClick={() => setLiked(prev => !prev)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2 line-clamp-1">{item.title}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={item.creator.avatar} />
                    <AvatarFallback>
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{item.creator.name}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {item.views}
                    </span>
                  </div>
                  <span>{item.downloads} downloads</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}