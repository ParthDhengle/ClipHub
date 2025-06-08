import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Users, Award } from "lucide-react"

export function CreatorSpotlight() {
  const creators = [
    {
      name: "Jane Smith",
      username: "@janesmith",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 245,
      followers: "12.5K",
      featured: true,
      badge: "Top Contributor",
    },
    {
      name: "Alex Johnson",
      username: "@alexj",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 187,
      followers: "8.3K",
      featured: false,
      badge: "Rising Star",
    },
    {
      name: "Sam Wilson",
      username: "@samwilson",
      avatar: "/placeholder.svg?height=80&width=80",
      photos: 312,
      followers: "15.7K",
      featured: false,
      badge: "Nature Expert",
    },
  ]

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Creators</h2>
            <p className="text-muted-foreground">Discover talented photographers sharing amazing content</p>
          </div>
          <Button variant="outline">View All Creators</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <Card key={creator.name} className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
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

                  <Button className="mt-4 w-full">Follow</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
