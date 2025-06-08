"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Upload,
  ChevronDown,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-white"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-black">ClipHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-foreground">
                Explore
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Link href="/photos">Photos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/videos">Videos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/music">Music</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/collections">Collections</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/license" className="text-sm font-medium text-foreground">
              License
            </Link>
            <Link href="/creators" className="text-sm font-medium text-foreground">
              Creators
            </Link>
            <Link href="/upload" className="text-sm font-medium text-foreground flex items-center">
              <Upload className="mr-1 h-4 w-4" />
              Upload
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Link href="/join">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 transition">
                Join
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {[
                  ["photos", "Photos"],
                  ["videos", "Videos"],
                  ["music", "Music"],
                  ["collections", "Collections"],
                  ["license", "License"],
                  ["creators", "Creators"],
                  ["upload", "Upload"]
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={`/${href}`}
                    className="text-lg font-medium hover:text-primary transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {href === "upload" && <Upload className="mr-2 h-4 w-4" />}
                    {label}
                  </Link>
                ))}

                <div className="pt-4 border-t">
                  <Link href="/join" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition">
                      Join
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
