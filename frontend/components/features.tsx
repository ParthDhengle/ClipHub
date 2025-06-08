import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, IndianRupeeIcon as Rupee, Shield, Globe, Users, Zap, Star } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Download,
      title: "Free HD Downloads",
      description: "Download high-quality content without watermarks or hidden fees",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      stats: "50M+ downloads",
    },
    {
      icon: Rupee,
      title: "Creator Earnings",
      description: "Earn money from your creative content with our revenue sharing program",
      color: "from-orange-500 to-yellow-500",
      bgColor: "from-orange-50 to-yellow-50",
      stats: "₹2.5Cr+ paid",
    },
    {
      icon: Shield,
      title: "Copyright Safe",
      description: "All content is original or properly licensed for commercial use",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      stats: "100% verified",
    },
    {
      icon: Globe,
      title: "Regional Content",
      description: "Celebrate India's diversity with content in 22+ languages",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      stats: "22+ languages",
    },
    {
      icon: Users,
      title: "Creator Community",
      description: "Join 100K+ Indian creators sharing their cultural stories",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      stats: "100K+ creators",
    },
    {
      icon: Zap,
      title: "API Access",
      description: "Integrate ClipHub content into your apps with our developer API",
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
      stats: "1000+ apps",
    },
  ]

  return (
    <section id="features" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            ✨ Platform Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              ClipHub
            </span>
            ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            India's first creative platform built for creators, by creators. Experience the difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-0 bg-gradient-to-br ${feature.bgColor} hover:shadow-lg transition-all duration-300 group`}
            >
              <CardContent className="p-6">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {feature.stats}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
