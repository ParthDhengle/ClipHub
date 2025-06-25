"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Award, Users } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
  deadline: string // ISO date string, e.g., "2025-06-10T23:59:59Z"
  participants: number
  status: "Active" | "Completed" | "Upcoming"
}

const sampleChallenges: Challenge[] = [
  {
    id: "1",
    title: "Sunset Photography",
    description: "Capture a stunning sunset scene in any landscape. Submit your best photo!",
    category: "Photography",
    difficulty: "Medium",
    points: 100,
    deadline: "2025-06-10T23:59:59Z",
    participants: 245,
    status: "Active"
  },
  {
    id: "2",
    title: "Short Dance Video",
    description: "Create a 30-second dance video to a trending song. Be creative!",
    category: "Video",
    difficulty: "Hard",
    points: 150,
    deadline: "2025-06-11T23:59:59Z",
    participants: 180,
    status: "Active"
  },
  {
    id: "3",
    title: "Lo-Fi Music Track",
    description: "Compose a 2-minute lo-fi track for studying or relaxing.",
    category: "Music",
    difficulty: "Medium",
    points: 120,
    deadline: "2025-06-12T23:59:59Z",
    participants: 95,
    status: "Active"
  },
  {
    id: "4",
    title: "Urban Sketch",
    description: "Sketch a detailed scene of an urban environment. Submit your artwork!",
    category: "Art",
    difficulty: "Easy",
    points: 80,
    deadline: "2025-06-09T23:59:59Z",
    participants: 320,
    status: "Completed"
  },
  {
    id: "5",
    title: "Nature Time-Lapse",
    description: "Record a time-lapse video of a natural phenomenon (e.g., clouds, plants).",
    category: "Video",
    difficulty: "Hard",
    points: 200,
    deadline: "2025-06-15T23:59:59Z",
    participants: 45,
    status: "Upcoming"
  }
]

export function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(sampleChallenges)

  // Update challenge status based on deadline
  useEffect(() => {
    const updateStatuses = () => {
      const now = new Date()
      const updatedChallenges = challenges.map(challenge => {
        const deadline = new Date(challenge.deadline)
        if (challenge.status === "Upcoming" && now >= deadline) {
          return { ...challenge, status: "Active" as const }
        } else if (challenge.status === "Active" && now > deadline) {
          return { ...challenge, status: "Completed" as const }
        }
        return challenge
      })

      // Only update state if there are actual changes
      if (JSON.stringify(updatedChallenges) !== JSON.stringify(challenges)) {
        setChallenges(updatedChallenges)
      }
    }

    // Run immediately on mount
    updateStatuses()

    // Set up a timer to check every minute
    const intervalId = setInterval(updateStatuses, 60 * 1000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, []) // Empty dependency array to run only on mount/unmount

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            Daily Creator Challenges
          </CardTitle>
          <p className="text-muted-foreground">
            Participate in daily challenges to boost your rank, earn points, and showcase your skills!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {challenges.map(challenge => (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{challenge.title}</CardTitle>
                  <Badge 
                    variant={
                      challenge.status === "Active" ? "default" : 
                      challenge.status === "Completed" ? "secondary" : "outline"
                    }
                  >
                    {challenge.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Deadline: {new Date(challenge.deadline).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Difficulty: {challenge.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {challenge.points} Points
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {challenge.participants} Participants
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{challenge.category}</Badge>
                </div>
                <Button 
                  disabled={challenge.status === "Completed"}
                  className="w-full sm:w-auto"
                >
                  {challenge.status === "Active" ? "Participate Now" : 
                   challenge.status === "Completed" ? "View Results" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}