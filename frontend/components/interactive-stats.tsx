"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Users, Camera, Heart, TrendingUp } from "lucide-react"

export function InteractiveStats() {
  const [activeCard, setActiveCard] = useState(0)
  const [counters, setCounters] = useState({
    downloads: 0,
    creators: 0,
    photos: 0,
    likes: 0,
  })

  const stats = [
    {
      icon: Download,
      label: "Downloads",
      value: "2.5M+",
      target: 2500000,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      icon: Users,
      label: "Active Creators",
      value: "50K+",
      target: 50000,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      icon: Camera,
      label: "Photos & Videos",
      value: "1M+",
      target: 1000000,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      icon: Heart,
      label: "Community Likes",
      value: "10M+",
      target: 10000000,
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-50",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Join Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Growing Community
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thousands of creators and millions of users trust ClipHub for their creative needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                activeCard === index ? "ring-2 ring-blue-500 shadow-xl" : "hover:shadow-lg"
              }`}
              onMouseEnter={() => setActiveCard(index)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`}></div>
              <CardContent className="relative p-6 text-center">
                <div
                  className={`inline-flex p-4 rounded-full bg-gradient-to-r ${stat.color} mb-4 transform transition-transform duration-300 ${
                    activeCard === index ? "scale-110 rotate-12" : ""
                  }`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
                {activeCard === index && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${stat.color} h-2 rounded-full transition-all duration-1000 animate-pulse`}
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            View Live Statistics
          </Button>
        </div>
      </div>
    </section>
  )
}
