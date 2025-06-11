"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, ImageIcon, Users, Award, Search, Filter } from "lucide-react"

export function CreatorsDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", form)
    // TODO: Replace with actual API call
  }

  const creators = [
    {
      name: "Jane Smith",
      username: "@janesmith",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 245,
      followers: "12.5K",
      featured: true,
      badge: "Top Contributor",
      bio: "Nature and wildlife photographer based in California. Capturing the beauty of our planet.",
    },
    {
      name: "Alex Johnson",
      username: "@alexj",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 187,
      followers: "8.3K",
      featured: true,
      badge: "Rising Star",
      bio: "Urban landscape photographer. Finding beauty in city architecture and street scenes.",
    },
    {
      name: "Sam Wilson",
      username: "@samwilson",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 312,
      followers: "15.7K",
      featured: true,
      badge: "Nature Expert",
      bio: "Travel photographer exploring the world one click at a time. Sharing my adventures.",
    },
    {
      name: "Maria Garcia",
      username: "@mariagarcia",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 156,
      followers: "5.2K",
      featured: false,
      bio: "Portrait and fashion photographer. Creating stories through images.",
    },
    {
      name: "David Kim",
      username: "@davidkim",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 98,
      followers: "3.7K",
      featured: false,
      bio: "Food photographer and stylist. Making delicious moments last forever.",
    },
    {
      name: "Priya Patel",
      username: "@priyapatel",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 210,
      followers: "9.1K",
      featured: false,
      bio: "Documentary photographer focusing on cultural stories and traditions.",
    },
  ]

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">ClipHub Creators</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover talented photographers, videographers, and musicians sharing their creative work with the world
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators by name or username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Creators</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <Card key={creator.name} className="overflow-hidden hover:shadow-lg transition-all">
                  <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                  <CardContent className="pt-0 relative">
                    <div className="flex justify-center">
                      <Avatar className="h-20 w-20 border-4 border-background -mt-10">
                        <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="text-center mt-3">
                      <h3 className="font-semibold text-lg">{creator.name}</h3>
                      <p className="text-muted-foreground text-sm">{creator.username}</p>

                      {creator.featured && (
                        <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500">
                          <Award className="h-3 w-3 mr-1" />
                          {creator.badge}
                        </Badge>
                      )}

                      <p className="text-sm mt-3 line-clamp-2">{creator.bio}</p>

                      <div className="flex justify-center space-x-6 mt-4">
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs">Photos</p>
                          <div className="flex items-center justify-center">
                            <Camera className="h-3 w-3 mr-1" />
                            <p className="font-medium">{creator.photos}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs">Followers</p>
                          <div className="flex items-center justify-center">
                            <Users className="h-3 w-3 mr-1" />
                            <p className="font-medium">{creator.followers}</p>
                          </div>
                        </div>
                      </div>

                      <Button className="mt-4 w-full">View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Join as Creator Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Become a ClipHub Creator</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Share your creative work with millions of users. Join now.
          </p>

          {!showForm ? (
            <Button size="lg" onClick={() => setShowForm(true)}>
              Join as Creator
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 text-left max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
