"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import {
  Upload,
  User,
  LogOut,
  Settings,
  Menu,
  X
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isCreator: boolean
}

export function Header() {
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      setUserData(null)
      return
    }

    const mappedUser: User = {
      id: user.uid,
      name: user.displayName || "User",
      email: user.email || "",
      avatar: user.photoURL || "/cliphublogo11.png",
      isCreator: false,
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

  return (
    <header className="absolute top-0 left-0 right-0 z-50 text-white bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
                <img src="/cliphublogo11.png" alt="ClipHub Logo" className="h-5 w-5 object-contain" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-white">ClipHub</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explore" className="text-sm font-medium text-white hover:underline">
              Explore
            </Link>
            <Link href="/license" className="text-sm font-medium text-white hover:underline">
              License
            </Link>
            <Link href="/creators" className="text-sm font-medium text-white hover:underline">
              Creators
            </Link>
            <Link href="/upload" className="text-sm font-medium text-white hover:underline flex items-center">
              <Upload className="mr-1 h-4 w-4" /> Upload
            </Link>
          </nav>

          {/* Desktop Avatar/Login */}
          <div className="hidden md:flex items-center space-x-4">
            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
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
                      <User className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/preferences">
                      <Settings className="mr-2 h-4 w-4" /> Preferences
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
  <div className="absolute top-16 right-4 w-48 bg-black bg-opacity-90 rounded-lg shadow-lg p-4 space-y-3 md:hidden z-50">
    <Link href="/explore" onClick={() => setMenuOpen(false)} className="block text-white hover:underline">Explore</Link>
    <Link href="/license" onClick={() => setMenuOpen(false)} className="block text-white hover:underline">License</Link>
    <Link href="/creators" onClick={() => setMenuOpen(false)} className="block text-white hover:underline">Creators</Link>
    <Link href="/upload" onClick={() => setMenuOpen(false)} className="block text-white hover:underline flex items-center">
      <Upload className="mr-2 h-4 w-4" /> Upload
    </Link>
    {userData ? (
      <>
        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block text-white hover:underline">Dashboard</Link>
        <Link href="/preferences" onClick={() => setMenuOpen(false)} className="block text-white hover:underline">Preferences</Link>
        <button onClick={handleLogout} className="block text-left text-white hover:underline">Logout</button>
      </>
    ) : (
      <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-white hover:underline">Login</Link>
    )}
  </div>
)}

      </div>
    </header>
  )
}
