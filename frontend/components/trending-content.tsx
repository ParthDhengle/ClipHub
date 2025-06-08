"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlameIcon as Fire, TrendingUp, Clock, Star, Download, Heart, Eye } from "lucide-react"

export function TrendingContent() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const trendingItems = [
    {
      id: 1,
      title: "Sunset Mountain Landscape",
      category: "Nature",
      downloads: "12.5K",
      likes: "3.2K",
      views: "45K",
      creator: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/placeholder.svg?height=300&width=400",
      trending: true,
      hot: true,
    },
    {
      id: 2,
      title: "Modern Office Workspace",
      category: "Business",
      downloads: "8.7K",
      likes: "2.1K",
      views: "32K",
      creator: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/placeholder.svg?height=300&width=400",
      trending: true,
      hot: false,
    },
    {
      id: 3,
      title: "Fresh Food Photography",
      category: "Food",
      downloads: "15.2K",
      likes: "4.8K",
      views: "67K",
      creator: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/placeholder.svg?height=300&width=400",
      trending: true,
      hot: true,
    },
    {
      id: 4,
      title: "Urban Street Art",
      category: "Art",
      downloads: "6.3K",
      likes: "1.9K",
      views: "28K",
      creator: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      image: "/placeholder.svg?height=300&width=400",
      trending: false,
      hot: false,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Fire className="h-8 w-8 text-orange-500 mr-2 animate-pulse" />
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Trending Now
              </span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular content that's capturing everyone's attention
          </p>
        </div>

        <Tabs defaultValue="all" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger value="hot" className="flex items-center">
              <Fire className="h-4 w-4 mr-2" />
              Hot
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              New
            </TabsTrigger>
            <TabsTrigger value="top" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Top Rated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.hot && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
                          <Fire className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      {item.trending && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                        hoveredCard === index ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex justify-between items-center text-white text-sm">
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
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>

                    <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={item.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{item.creator.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{item.creator}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 px-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hot">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingItems
                .filter((item) => item.hot)
                .map((item, index) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
                  >
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 animate-pulse">
                        <Fire className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="mb-2">
                        {item.category}
                      </Badge>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={item.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{item.creator.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{item.creator}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fresh Content</h3>
              <p className="text-muted-foreground">Discover the latest uploads from our creators</p>
            </div>
          </TabsContent>

          <TabsContent value="top">
            <div className="text-center py-12">
              <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Top Rated</h3>
              <p className="text-muted-foreground">The highest rated content by our community</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
