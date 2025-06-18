"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Heart, Eye, Filter, Grid3X3, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

interface Photo {
  id: string
  title: string
  url: string
  thumbnail: string
  creator: string
  downloads: string
  likes: string
  views: string
  avatar: string
  category: string
}

export function PhotosGallery() {
  const [viewMode, setViewMode] = useState("grid")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [user, userLoading] = useAuthState(auth)
  const router = useRouter()

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/media?type=photo')
      setPhotos(response.data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        thumbnail: item.thumbnail,
        creator: item.creator?.name || 'Unknown',
        downloads: item.downloads.toLocaleString(),
        likes: item.likes.toLocaleString(),
        views: item.views.toLocaleString(),
        avatar: item.creator?.avatar || "/placeholder.svg",
        category: item.category,
      })))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to load photos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userLoading) return
    fetchPhotos()
  }, [userLoading])

  const handleLike = async (id: string) => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Please log in to like photos",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    try {
      const idToken = await user.getIdToken()
      await api.post(`/api/media/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${idToken}` }
      })
      setPhotos(prev => prev.map(item =>
        item.id === id ? { ...item, likes: (parseInt(item.likes.replace(/,/g, '')) + 1).toLocaleString() } : item
      ))
      toast({ title: "Success", description: "Photo liked" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to like photo",
        variant: "destructive",
      })
    }
  }

  if (loading || userLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Free Stock Photos</h2>
            <p className="text-muted-foreground">Discover millions of high-quality photos</p>
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

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              className="break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => router.push(`/photos/${photo.id}`)}
            >
              <div className="relative">
                <img
                  src={photo.thumbnail || "/placeholder.svg"}
                  alt={photo.title}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                    hoveredItem === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between items-center text-white text-sm mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {photo.views}
                        </span>
                        <span className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {photo.downloads}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {photo.likes}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6 border border-white">
                          <AvatarImage src={photo.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{photo.creator?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm font-medium">{photo.creator}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Free
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {photo.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLike(photo.id)
                      }}
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-sm line-clamp-2">{photo.title}</h3>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Photos
          </Button>
        </div>
      </div>
    </section>
  )
}