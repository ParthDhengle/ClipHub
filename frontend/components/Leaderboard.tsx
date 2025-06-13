"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import api from "@/lib/api"

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

export function Leaderboard() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [user, userLoading] = useAuthState(auth)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true)
      try {
        const idToken = user ? await user.getIdToken() : null
        const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {}
        const response = await api.get('/api/leaderboard', { headers })
        const leaderboardData = response.data.items.map((item: any) => ({
          ...item,
          isCurrentUser: user ? item.id === user.uid : false,
        }))
        setCreators(leaderboardData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to load leaderboard",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (!userLoading) fetchLeaderboard()
  }, [user, userLoading, toast])

  if (loading || userLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const currentUser = creators.find(creator => creator.isCurrentUser)

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