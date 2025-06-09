"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, User } from "lucide-react"

interface Creator {
  id: string
  name: string
  avatar?: string
  points: number
  rank: number
  challengesWon: number
  photosLiked: number
  followers: number
  isCurrentUser: boolean
}

const sampleCreators: Creator[] = [
  { id: "1", name: "Alex Chen", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face", points: 1250, rank: 1, challengesWon: 15, photosLiked: 320, followers: 915, isCurrentUser: false },
  { id: "2", name: "Sarah Kim", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face", points: 1120, rank: 2, challengesWon: 12, photosLiked: 280, followers: 840, isCurrentUser: false },
  { id: "3", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face", points: 980, rank: 3, challengesWon: 10, photosLiked: 245, followers: 735, isCurrentUser: false },
  { id: "4", name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face", points: 850, rank: 4, challengesWon: 8, photosLiked: 210, followers: 640, isCurrentUser: false },
  { id: "5", name: "You", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face", points: 720, rank: 5, challengesWon: 7, photosLiked: 190, followers: 550, isCurrentUser: true },
  { id: "6", name: "Ryan Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face", points: 680, rank: 6, challengesWon: 6, photosLiked: 175, followers: 520, isCurrentUser: false },
  { id: "7", name: "Lily Chen", avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=32&h=32&fit=crop&crop=face", points: 620, rank: 7, challengesWon: 5, photosLiked: 160, followers: 480, isCurrentUser: false },
  { id: "8", name: "Mark Davis", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face", points: 580, rank: 8, challengesWon: 4, photosLiked: 145, followers: 450, isCurrentUser: false },
]

export function Leaderboard() {
  const [creators, setCreators] = useState<Creator[]>(sampleCreators)
  const currentUser = creators.find(creator => creator.isCurrentUser)

  // Simulate fetching data and sorting by points
  useEffect(() => {
    const sortedCreators = [...sampleCreators].sort((a, b) => b.points - a.points)
    setCreators(sortedCreators)
  }, [])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Creator Leaderboard
          </CardTitle>
          <p className="text-muted-foreground">
            Top creators ranked by points (based on challenge wins, photo likes, and followers)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current User Rank */}
          {currentUser && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge className="text-lg font-bold px-3 py-1">
                    #{currentUser.rank}
                  </Badge>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{currentUser.name} (You)</h3>
                    <p className="text-sm text-muted-foreground">{currentUser.points} points</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  <p>Challenges Won: {currentUser.challengesWon}</p>
                  <p>Photos Liked: {currentUser.photosLiked}</p>
                  <p>Followers: {currentUser.followers}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard List */}
          <div className="space-y-4">
            {creators.map(creator => (
              <Card 
                key={creator.id} 
                className={creator.isCurrentUser ? "hidden" : "flex items-center justify-between p-4"}
              >
                <div className="flex items-center gap-4">
                  <Badge variant={creator.rank <= 3 ? "default" : "secondary"} className="px-3 py-1">
                    #{creator.rank}
                  </Badge>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{creator.name}</h3>
                    <p className="text-sm text-muted-foreground">{creator.points} points</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  <p>Challenges Won: {creator.challengesWon}</p>
                  <p>Photos Liked: {creator.photosLiked}</p>
                  <p>Followers: {creator.followers}</p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
