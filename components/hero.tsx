"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function Hero() {
  const [searchType, setSearchType] = useState("Photos")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/Background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-70"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-300 opacity-70"></div>
      <div className="absolute bottom-40 left-20 w-5 h-5 bg-blue-400 rounded-full animate-bounce delay-500 opacity-70"></div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in">
          Discover Amazing{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Free Content
          </span>
          <br className="hidden sm:block" />
          Created by{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Talented Artists
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
          </span>
        </h1>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="flex rounded-lg overflow-hidden bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-none border-r px-4 h-12 flex items-center">
                  {searchType}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSearchType("Photos")}>Photos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType("Videos")}>Videos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType("Music")}>Music</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              placeholder="Search for free photos and videos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
            />
            <Button className="rounded-none px-6 h-12">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Trending Tags */}
          <div className="mt-4 text-sm text-white/80">
            <span>Trending: </span>
            {["nature", "business", "food", "travel", "technology"].map((tag) => (
              <Button key={tag} variant="link" className="text-white p-0 h-auto text-sm">
                {tag},
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Credit */}
      <div className="absolute bottom-4 right-4 text-xs text-white/70">
        Photo by{" "}
        <Button variant="link" className="text-white/90 p-0 h-auto text-xs">
          John Doe
        </Button>
      </div>
    </section>
  )
}
