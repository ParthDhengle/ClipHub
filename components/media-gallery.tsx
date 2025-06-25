"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { auth, db } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import api from "@/lib/api"
import { collection, onSnapshot } from "firebase/firestore"
import { useRouter } from "next/navigation"

interface MediaItem {
  id: string
  title: string
  url: string
  thumbnail: string
  type: string
  creator: string
  downloads: number
  likes: number
  views: number
  avatar: string
  category: string
  duration?: string
}

export function MediaGallery() {
  const [viewMode, setViewMode] = useState("grid")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [likedMediaIds, setLikedMediaIds] = useState<string[]>([]) // Added state
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [user, userLoading] = useAuthState(auth)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const fetchMedia = async (type?: string) => {
    setLoading(true)
    try {
      const queryParams = type && type !== "all" ? `?type=${type}` : ''
      const response = await api.get(`/api/media${queryParams}`)
      setMediaItems(response.data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        thumbnail: item.thumbnail_url,
        type: item.type,
        creator: item.creator.name,
        downloads: item.downloads,
        likes: item.likes,
        views: item.views,
        avatar: item.creator.avatar||'',
        category: item.category,
        duration: item.duration,
      })))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to load media",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch liked media IDs when user changes
  useEffect(() => {
    if (userLoading) return

    if (user) {
      const fetchLikedMediaIds = async () => {
          try {
            const idToken = await user.getIdToken()
            console.log('Fetching liked media IDs...') // Debug log
            
            const response = await api.get('/api/media/liked', {
              headers: { Authorization: `Bearer ${idToken}` }
            })
            
            console.log('Liked media response:', response.data) // Debug log
            setLikedMediaIds(response.data.likedMediaIds || response.data || [])
          } catch (error: any) {
            console.error('Failed to fetch liked media IDs', {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              message: error.message
            })
            
            // If endpoint doesn't exist (404) or other client errors, silently continue
            if (error.response?.status === 404 || error.response?.status === 501) {
              console.warn('Liked media endpoint not implemented yet')
            } else {
              // Only show toast for actual server errors
              toast({
                title: "Warning",
                description: "Could not load liked media status",
                variant: "default", // Changed from destructive to default
              })
            }
            
            setLikedMediaIds([])
          }
        }
      fetchLikedMediaIds()
    } else {
      setLikedMediaIds([])
    }

    const unsubscribe = onSnapshot(collection(db, "media"), (snapshot) => {
      const fetchedMedia = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          url: data.url,
          thumbnail: data.thumbnail_url || data.thumbnail, // Handle both property names
          type: data.type,
          creator: data.creator?.name || data.creator || 'Unknown',
          downloads: data.downloads || 0,
          likes: data.likes || 0,
          views: data.views || 0,
          avatar: data.creator?.avatar || data.avatar || '',
          category: data.category_id || data.category || '',
          duration: data.duration,
        } as MediaItem
      })
      setMediaItems(fetchedMedia)
      setLoading(false)
    }, (error) => {
      toast({
        title: "Error",
        description: "Failed to load media",
        variant: "destructive",
      })
      setLoading(false)
    })

    fetchMedia(activeTab)

    return () => unsubscribe()
  }, [userLoading, activeTab, toast, user])

  const handleLike = async (id: string) => {
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
      await api.post(`/api/media/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${idToken}` }
      })
      setMediaItems(prev => prev.map(item =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      ))
      setLikedMediaIds(prev => [...prev, id]) // Update likedMediaIds
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to like media",
        variant: "destructive",
      })
    }
  }

  const handleUnlike = async (id: string) => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Please log in to unlike media",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    try {
      await api.post(`/api/media/${id}/unlike`, {}, {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` }
      })
      setMediaItems(prev => prev.map(item =>
        item.id === id ? { ...item, likes: item.likes - 1 } : item
      ))
      setLikedMediaIds(prev => prev.filter(mediaId => mediaId !== id)) // Update likedMediaIds
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to unlike media",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (id: string, url: string, title: string) => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Please log in to download media",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    try {
      await api.post(`/api/media/${id}/download`, {}, {
        headers: { Authorization: `Bearer ${await user.getIdToken()}` }
      })
      const link = document.createElement('a')
      link.href = url
      link.download = title || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to download media",
        variant: "destructive",
      })
    }
  }

  const handleView = async (id: string) => {
    if (user) {
      try {
        await api.post(`/api/media/${id}/view`, {}, {
          headers: { Authorization: `Bearer ${await user.getIdToken()}` }
        })
      } catch (error) {
        console.error('Failed to record view', error)
      }
    }
  }

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

  if (loading || userLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="photo">Photos</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {mediaItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    handleView(item.id)
                    router.push(`/${item.type}s/${item.id}`)
                  }}
                >
                  <div className="relative">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ height: "auto" }}
                    />

                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
                        {item.type === "video" && item.duration && <span className="ml-1">• {item.duration}</span>}
                      </Badge>
                    </div>


                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-black/80 transition-colors">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    )}

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
                              {item.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {item.downloads.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {item.likes.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6 border border-white">
                              <AvatarImage src={item.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{item.creator?.charAt(0) || ''}</AvatarFallback>
                            </Avatar>
                            <span className="text-white text-sm font-medium">{item.creator}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-white text-black hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(item.id, item.url, item.title)
                            }}
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
                        {item.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${likedMediaIds.includes(item.id) ? 'text-red-500' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            likedMediaIds.includes(item.id) ? handleUnlike(item.id) : handleLike(item.id)
                          }}
                        >
                          <Heart className="h-3 w-3" fill={likedMediaIds.includes(item.id) ? "currentColor" : "none"} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(item.id, item.url, item.title)
                          }}
                        >
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

          <TabsContent value="photo">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {mediaItems
                .filter((item) => item.type === "photo")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                    onClick={() => {
                      handleView(item.id)
                      router.push(`/photos/${item.id}`)
                    }}
                  >
                    <div className="relative">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex justify-between items-center text-white text-sm mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {item.views.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Download className="h-3 w-3 mr-1" />
                                {item.downloads.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                {item.likes.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6 border border-white">
                                <AvatarImage src={item.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{item.creator?.charAt(0) || ''}</AvatarFallback>
                              </Avatar>
                              <span className="text-white text-sm">{item.creator}</span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-white text-black"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(item.id, item.url, item.title)
                              }}
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
                          {item.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${likedMediaIds.includes(item.id) ? 'text-red-500' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              likedMediaIds.includes(item.id) ? handleUnlike(item.id) : handleLike(item.id)
                            }}
                          >
                            <Heart className="h-3 w-3" fill={likedMediaIds.includes(item.id) ? "currentColor" : "none"} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(item.id, item.url, item.title)
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="video">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {mediaItems
                .filter((item) => item.type === "video")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                    onClick={() => {
                      handleView(item.id)
                      router.push(`/videos/${item.id}`)
                    }}
                  >
                    <div className="relative">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
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
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex justify-between items-center text-white text-sm mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {item.views.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Download className="h-3 w-3 mr-1" />
                                {item.downloads.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                {item.likes.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6 border border-white">
                                <AvatarImage src={item.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{item.creator?.charAt(0) || ''}</AvatarFallback>
                              </Avatar>
                              <span className="text-white text-sm">{item.creator}</span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-white text-black"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(item.id, item.url, item.title)
                              }}
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
                          {item.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${likedMediaIds.includes(item.id) ? 'text-red-500' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              likedMediaIds.includes(item.id) ? handleUnlike(item.id) : handleLike(item.id)
                            }}
                          >
                            <Heart className="h-3 w-3" fill={likedMediaIds.includes(item.id) ? "currentColor" : "none"} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(item.id, item.url, item.title)
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {mediaItems
                .filter((item) => item.type === "audio")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="break-inside-avoid overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl"
                    onClick={() => {
                      handleView(item.id)
                      router.push(`/music/${item.id}`)
                    }}
                  >
                    <div className="relative">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge className="absolute top-3 left-3 bg-black/70 text-white">
                        <Music className="h-3 w-3 mr-1" />
                        {item.duration}
                      </Badge>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex justify-between items-center text-white text-sm mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {item.views.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Download className="h-3 w-3 mr-1" />
                                {item.downloads.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                {item.likes.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6 border border-white">
                                <AvatarImage src={item.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{item.creator?.charAt(0) || ''}</AvatarFallback>
                              </Avatar>
                              <span className="text-white text-sm">{item.creator}</span>
                            </div>
                            <Button
                              size="sm"
                              className="bg-white text-black"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(item.id, item.url, item.title)
                              }}
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
                          {item.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${likedMediaIds.includes(item.id) ? 'text-red-500' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              likedMediaIds.includes(item.id) ? handleUnlike(item.id) : handleLike(item.id)
                            }}
                          >
                            <Heart className="h-3 w-3" fill={likedMediaIds.includes(item.id) ? "currentColor" : "none"} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(item.id, item.url, item.title)
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Load More Content
          </Button>
        </div>
      </div>
    </section>
  )
}