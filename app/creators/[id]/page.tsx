"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Users } from "lucide-react"

interface Creator {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  photos: number
  followers: number
  featured?: boolean
  badge?: string
}

export default function CreatorProfilePage() {
  const { id } = useParams()
  const [creator, setCreator] = useState<Creator | null>(null)

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/creators/${id}`)
        const data = await res.json()
        setCreator(data)
      } catch (err) {
        console.error("Failed to load creator", err)
      }
    }

    fetchCreator()
  }, [id])

  if (!creator) return <p className="text-center mt-10">Loading profile...</p>

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={creator.avatar || "/placeholder.svg"} />
          <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-3xl font-bold">{creator.name}</h2>
          <p className="text-muted-foreground text-sm">{creator.username}</p>
          {creator.featured && (
            <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500">
              {creator.badge || "Featured Creator"}
            </Badge>
          )}
        </div>

        <p className="text-center max-w-md text-muted-foreground">
          {creator.bio || "This creator hasn’t added a bio yet."}
        </p>

        <div className="flex space-x-10 mt-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Photos</p>
            <div className="flex justify-center items-center">
              <Camera className="h-4 w-4 mr-1" />
              <span>{creator.photos}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Followers</p>
            <div className="flex justify-center items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{creator.followers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
