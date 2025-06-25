import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight } from "lucide-react"

export function Services() {
  const services = [
    {
      title: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small projects and personal use",
      features: ["Up to 5 projects", "Mobile-first templates", "Basic analytics", "Email support", "SSL certificate"],
      popular: false,
    },
    {
      title: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses and teams",
      features: [
        "Unlimited projects",
        "Advanced templates",
        "Real-time analytics",
        "Priority support",
        "Custom domains",
        "Team collaboration",
        "API access",
      ],
      popular: true,
    },
    {
      title: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations with advanced needs",
      features: [
        "Everything in Professional",
        "White-label solution",
        "Advanced security",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "Training sessions",
      ],
      popular: false,
    },
  ]

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Choose Your Perfect Plan</h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible pricing options designed to scale with your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                service.popular ? "border-primary shadow-lg scale-105" : "border-border hover:border-primary/50"
              }`}
            >
              {service.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">Most Popular</Badge>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl sm:text-2xl">{service.title}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl sm:text-4xl font-bold">{service.price}</span>
                  <span className="text-muted-foreground">{service.period}</span>
                </div>
                <CardDescription className="mt-2 text-sm sm:text-base">{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full" variant={service.popular ? "default" : "outline"} size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
