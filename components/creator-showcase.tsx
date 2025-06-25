import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Download, Users, MapPin, Star, Verified } from "lucide-react"

export function CreatorShowcase() {
  const creators = [
    {
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      specialty: "Festival Photography",
      avatar: "/placeholder.svg?height=60&width=60",
      verified: true,
      stats: {
        followers: "25.4K",
        downloads: "150K",
        rating: 4.9,
      },
      earnings: "₹45,000",
      recentWork: {
        title: "Diwali Celebrations 2024",
        downloads: "2.3K",
        likes: "890",
      },
    },
    {
      name: "Arjun Patel",
      location: "Ahmedabad, Gujarat",
      specialty: "Traditional Dance Videos",
      avatar: "/placeholder.svg?height=60&width=60",
      verified: true,
      stats: {
        followers: "18.7K",
        downloads: "89K",
        rating: 4.8,
      },
      earnings: "₹32,500",
      recentWork: {
        title: "Garba Dance Tutorial",
        downloads: "1.8K",
        likes: "654",
      },
    },
    {
      name: "Meera Krishnan",
      location: "Chennai, Tamil Nadu",
      specialty: "Classical Music",
      avatar: "/placeholder.svg?height=60&width=60",
      verified: true,
      stats: {
        followers: "31.2K",
        downloads: "200K",
        rating: 4.9,
      },
      earnings: "₹58,750",
      recentWork: {
        title: "Carnatic Ragas Collection",
        downloads: "3.1K",
        likes: "1.2K",
      },
    },
  ]

  return (
    <section id="creators" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            🌟 Featured Creators
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Top Creators
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Talented artists from across India sharing their cultural stories and earning from their creativity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {creators.map((creator, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                {/* Creator Header */}
                <div className="flex items-start space-x-4 mb-6">
                  <Avatar className="h-16 w-16 ring-2 ring-orange-200">
                    <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
                    <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white font-semibold">
                      {creator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-lg">{creator.name}</h3>
                      {creator.verified && <Verified className="h-4 w-4 text-blue-500 fill-current" />}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {creator.location}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {creator.specialty}
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-blue-500 mr-1" />
                    </div>
                    <p className="text-sm font-semibold">{creator.stats.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Download className="h-4 w-4 text-green-500 mr-1" />
                    </div>
                    <p className="text-sm font-semibold">{creator.stats.downloads}</p>
                    <p className="text-xs text-muted-foreground">Downloads</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    </div>
                    <p className="text-sm font-semibold">{creator.stats.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                {/* Earnings */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">Monthly Earnings</span>
                    <span className="text-lg font-bold text-green-600">{creator.earnings}</span>
                  </div>
                </div>

                {/* Recent Work */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Latest Upload</h4>
                  <p className="text-sm text-muted-foreground mb-3">{creator.recentWork.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {creator.recentWork.downloads}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {creator.recentWork.likes}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs h-6">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="mr-4">
            View All Creators
          </Button>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            Become a Creator
          </Button>
        </div>
      </div>
    </section>
  )
}
