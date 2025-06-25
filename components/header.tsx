"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Menu,
  Upload,
  ChevronDown,
  MoreHorizontal,
  User,
  LogOut,
  Settings,
  Heart
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isCreator: boolean
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      setUserData(null)
      return
    }

    // Map Firebase user to your User interface
    const mappedUser: User = {
      id: user.uid,
      name: user.displayName || "User",
      email: user.email || "",
      avatar: user.photoURL || "https://via.placeholder.com/150",
      isCreator: false, // You may need to fetch this from your backend or Firestore
    }
    setUserData(mappedUser)
  }, [user, loading])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      setUserData(null)
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Show a minimal loading state while auth is resolving
  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
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
            <div>Loading...</div>
          </div>
        </div>
      </header>
    )
  }

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
            {userData ? (
              <>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userData.avatar} alt={userData.name} />
                        <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{userData.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/preferences">
                        <Settings className="mr-2 h-4 w-4" />
                        Preferences
                      </Link>
                    </DropdownMenuItem>
                    {!userData.isCreator && (
                      <DropdownMenuItem asChild>
                        <Link href="/join">
                          <User className="mr-2 h-4 w-4" />
                          Become Creator
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                {userData && (
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userData.name}</p>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                    </div>
                  </div>
                )}

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
                  {userData ? (
                    <div className="space-y-2">
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/preferences" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Preferences
                        </Button>
                      </Link>
                      <Button onClick={handleLogout} variant="ghost" className="w-full">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/join" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition">
                          Join
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}