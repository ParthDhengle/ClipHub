import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The mobile-first approach transformed our user engagement. Our mobile conversion rates increased by 150% after implementing this solution.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "CTO",
      company: "StartupXYZ",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Incredible responsive design capabilities. The seamless experience across all devices has significantly improved our customer satisfaction.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "DesignStudio",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The attention to detail in mobile optimization is outstanding. Every interaction feels natural and intuitive on any device.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Marketing Director",
      company: "GrowthCo",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Our mobile traffic engagement improved dramatically. The responsive design adapts perfectly to every screen size.",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "CEO",
      company: "InnovateLab",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Game-changing platform for mobile-first development. The results speak for themselves - higher engagement and better user retention.",
      rating: 5,
    },
    {
      name: "Alex Martinez",
      role: "Developer",
      company: "CodeCraft",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The development experience is smooth and the mobile optimization tools are incredibly powerful. Highly recommended!",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-12 sm:py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">What Our Customers Say</h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their mobile experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <blockquote className="text-sm sm:text-base text-muted-foreground mb-6">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
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
