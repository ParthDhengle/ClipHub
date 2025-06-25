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
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import api from "@/lib/api"

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

export function MediaDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [media, setMedia] = useState<MediaItem | null>(null)
  const [suggestedMedia, setSuggestedMedia] = useState<MediaItem[]>([])
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [user, userLoading] = useAuthState(auth)

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true)
      try {
        const idToken = user ? await user.getIdToken() : null
        const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {}
        const response = await api.get(`/api/media/${id}`, { headers })
        setMedia(response.data)

        // Fetch suggested media
        const suggestedResponse = await api.get(`/api/media?category=${response.data.category}&excludeId=${id}`, { headers })
        setSuggestedMedia(suggestedResponse.data.items.slice(0, 4))
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Media not found",
          variant: "destructive",
        })
        setMedia(null)
      } finally {
        setLoading(false)
      }
    }

    if (!userLoading) fetchMedia()
  }, [id, user, userLoading, toast])

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Please log in to like media",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    try {
      const idToken = await user.getIdToken()
      if (liked) {
        await api.post(`/api/media/${id}/unlike`, {}, {
          headers: { Authorization: `Bearer ${idToken}` }
        })
      } else {
        await api.post(`/api/media/${id}/like`, {}, {
          headers: { Authorization: `Bearer ${idToken}` }
        })
      }
      setLiked(prev => !prev)
      setMedia(prev => prev ? { ...prev, likes: prev.likes + (liked ? -1 : 1) } : prev)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update like",
        variant: "destructive",
      })
    }
  }

  if (loading || userLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
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
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike()
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
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