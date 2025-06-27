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
    <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/Backgroundimagenture.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-6 leading-snug">
          Discover Amazing{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Free Content
          </span>
          <br className="hidden sm:block" />
          Created by{" "}
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Talented Artists
          </span>
        </h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex rounded-xl overflow-hidden bg-white shadow-md">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-none border-r border-gray-200 px-4 h-12 text-gray-700 text-sm"
                >
                  {searchType}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
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
              className="flex-1 h-12 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            />
            <Button className="h-12 px-4 rounded-none">
              <Search className="h-5 w-5 text-white" />
            </Button>
          </div>

          {/* Trending Tags */}
          <div className="mt-3 text-sm text-white/80">
            <span>Trending: </span>
            {["nature", "business", "food", "travel", "technology"].map((tag) => (
              <Button
                key={tag}
                variant="link"
                className="text-white p-0 h-auto text-sm font-normal"
              >
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
          Creators
        </Button>
      </div>
    </section>
  )
}
