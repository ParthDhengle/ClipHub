/* Corrected File: components/music-library.tsx */
"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, Filter, Download, Heart, Eye, User, Music } from "lucide-react"
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

interface MusicTrack {
  id: string
  title: string
  url: string // URL to the audio file
  thumbnail: string // Optional: a cover image for the track
  genre: string[]
  duration: string // e.g., "3:45" for 3 minutes, 45 seconds
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

const sampleTracks: MusicTrack[] = [
  {
    id: "1",
    title: "Ambient Dreamscape",
    url: "https://example.com/audio/ambient-dreamscape.mp3",
    thumbnail: "https://images.unsplash.com/photo-1511671786161-5c8d2c4b8999?w=400&h=300&fit=crop",
    genre: ["ambient", "chill", "relaxing"],
    duration: "4:12",
    tags: ["calm", "background", "mood"],
    likes: 320,
    views: 1540,
    downloads: 102,
    creator: { name: "Emma Stone", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" },
    category: "Ambient",
    isPremium: false
  },
  {
    id: "2",
    title: "Upbeat Pop Track",
    url: "https://example.com/audio/upbeat-pop.mp3",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
    genre: ["pop", "energetic", "dance"],
    duration: "3:28",
    tags: ["fun", "upbeat", "party"],
    likes: 245,
    views: 987,
    downloads: 78,
    creator: { name: "Jake Miller", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face" },
    category: "Pop",
    isPremium: true
  },
  {
    id: "3",
    title: "Cinematic Orchestra",
    url: "https://example.com/audio/cinematic-orchestra.mp3",
    thumbnail: "https://images.unsplash.com/photo-1579547945413-497f067239a1?w=400&h=300&fit=crop",
    genre: ["cinematic", "epic", "orchestral"],
    duration: "5:10",
    tags: ["dramatic", "soundtrack", "epic"],
    likes: 189,
    views: 762,
    downloads: 54,
    creator: { name: "Sophia Lee", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" },
    category: "Cinematic",
    isPremium: false
  },
  {
    id: "4",
    title: "Lo-Fi Hip Hop",
    url: "https://example.com/audio/lofi-hiphop.mp3",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop",
    genre: ["lo-fi", "hip hop", "study"],
    duration: "2:55",
    tags: ["relax", "study", "chill"],
    likes: 276,
    views: 1320,
    downloads: 95,
    creator: { name: "Ryan Kim", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
    category: "Lo-Fi",
    isPremium: true
  },
  {
    id: "5",
    title: "Acoustic Folk Song",
    url: "https://example.com/audio/acoustic-folk.mp3",
    thumbnail: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=400&h=300&fit=crop",
    genre: ["folk", "acoustic", "calm"],
    duration: "3:15",
    tags: ["gentle", "folk", "acoustic"],
    likes: 154,
    views: 845,
    downloads: 62,
    creator: { name: "Lily Chen", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face" },
    category: "Folk",
    isPremium: false
  },
  {
    id: "6",
    title: "Electronic Dance Beat",
    url: "https://example.com/audio/electronic-dance.mp3",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36c7b9?w=400&h=300&fit=crop",
    genre: ["electronic", "dance", "party"],
    duration: "4:30",
    tags: ["dance", "edm", "energetic"],
    likes: 312,
    views: 1678,
    downloads: 134,
    creator: { name: "Mark Davis", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" },
    category: "Electronic",
    isPremium: true
  }
]

export function MusicLibrary() {
  const router = useRouter()
  const [tracks, setTracks] = useState<MusicTrack[]>(sampleTracks)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())

  const categories = ["All", "Ambient", "Pop", "Cinematic", "Lo-Fi", "Folk", "Electronic"]

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.genre.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         track.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || track.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleLike = (trackId: string) => {
    const newLikedTracks = new Set(likedTracks)
    if (newLikedTracks.has(trackId)) {
      newLikedTracks.delete(trackId)
    } else {
      newLikedTracks.add(trackId)
    }
    setLikedTracks(newLikedTracks)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search music..."
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
        Showing {filteredTracks.length} tracks
      </div>

      {/* Music Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTracks.map((track) => (
          <Card 
            key={track.id} 
            className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/music/${track.id}`)}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {track.isPremium && (
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
                      handleLike(track.id)
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${likedTracks.has(track.id) ? 'fill-red-500 text-red-500' : ''}`} 
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
              <h3 className="font-medium mb-2 line-clamp-1">{track.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={track.creator.avatar} />
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{track.creator.name}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {track.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {track.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {track.views}
                  </span>
                </div>
                <span>{track.downloads} downloads</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Tracks
        </Button>
      </div>
    </div>
  )
}
