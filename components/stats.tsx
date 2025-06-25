import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Users, IndianRupeeIcon as Rupee, Globe, TrendingUp, Heart } from "lucide-react"

export function Stats() {
  const stats = [
    {
      icon: Download,
      value: "50M+",
      label: "Total Downloads",
      description: "Content downloaded by users worldwide",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      value: "100K+",
      label: "Active Creators",
      description: "Artists sharing their cultural stories",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Rupee,
      value: "₹2.5Cr+",
      label: "Creator Earnings",
      description: "Total amount paid to creators",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: Globe,
      value: "22+",
      label: "Languages",
      description: "Regional content in Indian languages",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Growth Rate",
      description: "Year-over-year platform growth",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Heart,
      value: "4.9/5",
      label: "User Rating",
      description: "Average rating from our community",
      color: "from-indigo-500 to-purple-500",
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-orange-50/50 via-pink-50/50 to-purple-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            📊 Platform Statistics
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            ClipHub by the{" "}
            <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Numbers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how our platform is empowering creators and serving the global community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-8">
                <div
                  className={`inline-flex p-4 rounded-full bg-gradient-to-r ${stat.color} mb-6 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-3xl sm:text-4xl font-bold mb-2">{stat.value}</h3>
                <p className="text-lg font-semibold mb-2">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
