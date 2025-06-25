"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Users, Award, Search, Filter } from "lucide-react"

export function CreatorsDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [creators, setCreators] = useState([])

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
    avatar: "",
    bio: "",
    photos: 0,
    followers: 0,
    birthdate: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "photos" || name === "followers" ? Number(value) : value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "cliphub_preset") // your Cloudinary upload preset

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dae84aoht/image/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, avatar: data.secure_url }))
      }
    } catch (err) {
      console.error("Image upload failed", err)
      alert("Upload failed")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:8000/api/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.detail || "Failed to create account")
        return
      }

      alert("Account created!")
      setShowForm(false)
      setForm({
        firstName: "", lastName: "", email: "", password: "", username: "",
        avatar: "", bio: "", photos: 0, followers: 0, birthdate: ""
      })
      fetchCreators()
    } catch (err) {
      console.error("Error submitting form", err)
      alert("Something went wrong")
    }
  }

  const fetchCreators = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/creators")
      const data = await res.json()
      setCreators(Array.isArray(data) ? data : data.creators || [])
    } catch (err) {
      console.error("Failed to fetch creators", err)
    }
  }

  useEffect(() => {
    fetchCreators()
  }, [])

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">ClipHub Creators</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover talented photographers, videographers, and musicians sharing their creative work with the world
          </p>
        </div>

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
            <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Creators</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {creators.length === 0 ? (
              <p className="text-center text-muted-foreground">No creators found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map((creator) => (
                  <Card key={creator.id}>
                    <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                    <CardContent className="pt-0 relative">
                      <div className="flex justify-center">
                        <Avatar className="h-20 w-20 border-4 border-background -mt-10">
                          <AvatarImage src={creator.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{creator.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-center mt-3">
                        <h3 className="font-semibold text-lg">{creator.firstName} {creator.lastName}</h3>
                        <p className="text-muted-foreground text-sm">@{creator.username}</p>
                        {creator.featured && (
                          <Badge className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500">
                            <Award className="h-3 w-3 mr-1" />
                            {creator.badge || "Featured"}
                          </Badge>
                        )}
                        <p className="text-sm mt-3 line-clamp-2">{creator.bio}</p>
                        <div className="flex justify-center space-x-6 mt-4">
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs">Photos</p>
                            <div className="flex items-center justify-center">
                              <Camera className="h-3 w-3 mr-1" />
                              <p className="font-medium">{creator.photos || 0}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-muted-foreground text-xs">Followers</p>
                            <div className="flex items-center justify-center">
                              <Users className="h-3 w-3 mr-1" />
                              <p className="font-medium">{creator.followers || 0}</p>
                            </div>
                          </div>
                        </div>
                        <Button className="mt-4 w-full" asChild>
                          <a href={`/creators/${creator.id}`}>View Profile</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Become a ClipHub Creator</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Share your creative work with millions of users. Join now.
          </p>
          {!showForm ? (
            <Button size="lg" onClick={() => setShowForm(true)}>Join as Creator</Button>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 text-left max-w-md mx-auto">
              <div className="flex gap-4">
                <Input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
                <Input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} required />
              </div>
              <Input name="username" placeholder="@username" value={form.username} onChange={handleChange} required />
              <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="p-2 rounded border" />
              {form.avatar && <img src={form.avatar} alt="Preview" className="w-24 h-24 rounded-full mx-auto mt-2" />}
              <textarea name="bio" placeholder="Short bio" value={form.bio} onChange={handleChange} className="rounded-md p-2 border" rows={3} />
              <div className="flex gap-4">
                <Input name="photos" type="number" placeholder="Photos count" value={form.photos} onChange={handleChange} />
                <Input name="followers" type="number" placeholder="Followers count" value={form.followers} onChange={handleChange} />
              </div>
              <Input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}