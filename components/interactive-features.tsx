"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Download, Search, Users, ArrowRight, CheckCircle } from "lucide-react"

export function InteractiveFeatures() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: Download,
      title: "Instant Downloads",
      description: "Download high-quality content instantly without any registration required",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      benefits: ["No watermarks", "Multiple formats", "Commercial use", "Instant access"],
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "AI-powered search helps you find exactly what you're looking for",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      benefits: ["Visual search", "Tag suggestions", "Category filters", "Related content"],
    },
    {
      icon: Users,
      title: "Creator Network",
      description: "Connect with talented creators and discover their amazing work",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      benefits: ["Follow creators", "Creator profiles", "Portfolio browsing", "Direct messaging"],
    },
    {
      icon: Shield,
      title: "License Protection",
      description: "All content comes with clear licensing for worry-free usage",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      benefits: ["Legal protection", "Clear terms", "Commercial rights", "Attribution guide"],
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500">✨ Platform Features</Badge>
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Creative Success
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and features designed to make your creative workflow seamless and enjoyable
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  activeFeature === index
                    ? "ring-2 ring-blue-500 shadow-xl bg-gradient-to-r " + feature.bgColor
                    : "hover:shadow-lg"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} transform transition-transform duration-300 ${
                        activeFeature === index ? "scale-110 rotate-6" : ""
                      }`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>

                      {activeFeature === index && (
                        <div className="space-y-2 animate-fade-in">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowRight
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                        activeFeature === index ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Demo */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500">
              <div className="text-center mb-6">
                <div
                  className={`inline-flex p-4 rounded-full bg-gradient-to-r ${features[activeFeature].color} mb-4 animate-pulse`}
                >
                  {(() => {
                    const IconComponent = features[activeFeature].icon
                    return <IconComponent className="h-8 w-8 text-white" />
                  })()}
                </div>
                <h3 className="text-2xl font-bold mb-2">{features[activeFeature].title}</h3>
                <p className="text-muted-foreground">{features[activeFeature].description}</p>
              </div>

              <div className="space-y-3">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg transform transition-all duration-300 hover:bg-gray-100"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                Try {features[activeFeature].title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-70"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-300 opacity-70"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
