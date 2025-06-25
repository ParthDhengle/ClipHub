"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, Filter, Eye, Heart, User, Download } from "lucide-react"
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
import { auth, db } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import api from "@/lib/api"
import { collection, onSnapshot } from "firebase/firestore"

interface Collection {
  id: string
  title: string
  thumbnail: string
  themes: string[]
  itemCount: number
  views: number
  likes: number
  downloads: number
  creator: {
    name: string
    avatar?: string
  }
  category: string
  isPremium: boolean
}

export function CollectionsGrid() {
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedCollections, setLikedCollections] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [user, userLoading] = useAuthState(auth)

  const categories = ["All", "Nature", "Urban", "Music", "Abstract", "Food", "Travel"]

  useEffect(() => {
    if (userLoading) return

    // Optional: Real-time Firestore listener
    const unsubscribe = onSnapshot(collection(db, "collections"), (snapshot) => {
      const fetchedCollections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Collection))
      setCollections(fetchedCollections)
      setLoading(false)
    }, (error) => {
      toast({
        title: "Error",
        description: "Failed to load collections",
        variant: "destructive",
      })
      setLoading(false)
    })

    // Fallback: Fetch from backend
    const fetchCollections = async () => {
      try {
        const response = await api.get('/api/collections')
        setCollections(response.data.items)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to load collections",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()

    return () => unsubscribe()
  }, [userLoading, toast])

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || collection.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleLike = async (collectionId: string) => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "Please log in to like collections",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    try {
      const idToken = await user.getIdToken()
      const newLikedCollections = new Set(likedCollections)
      if (newLikedCollections.has(collectionId)) {
        newLikedCollections.delete(collectionId)
        // Call backend to unlike
        await api.post(`/api/collections/${collectionId}/unlike`, {}, {
          headers: { Authorization: `Bearer ${idToken}` }
        })
      } else {
        newLikedCollections.add(collectionId)
        // Call backend to like
        await api.post(`/api/collections/${collectionId}/like`, {}, {
          headers: { Authorization: `Bearer ${idToken}` }
        })
      }
      setLikedCollections(newLikedCollections)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update like",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
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
                      className={`h-4 w-4 ${likedCollections.has(collection.id) ? 'fill-red-500 text-red-500' : ''}`} 
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
                {collection.themes.slice(0, 3).map(theme => (
                  <Badge key={theme} variant="secondary" className="text-xs">
                    {theme}
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