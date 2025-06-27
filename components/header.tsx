"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg">
                <img src="/cliphublogo11.png" alt="ClipHub Logo" className="h-5 w-5 object-contain" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-white">ClipHub</span>
          </Link>

          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-white hover:underline">
                  Explore
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-64 max-h-[400px] overflow-y-auto"
              >
                <DropdownMenuItem><Link href="/photos">Photos</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/videos">Videos</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/music">Music</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/collections">Collections</Link></DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Indian Culture</DropdownMenuLabel>
                <DropdownMenuItem><Link href="/festivals/holi">Holi</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/diwali">Diwali</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/navratri">Navratri</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/durga-puja">Durga Puja</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/raksha-bandhan">Raksha Bandhan</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/lohri">Lohri</Link></DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Religious & Caste-Based</DropdownMenuLabel>
                <DropdownMenuItem><Link href="/religion/hindu">Hindu Content</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/religion/muslim">Muslim Content</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/religion/sikh">Sikh Content</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/religion/christian">Christian Content</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/religion/buddhist">Buddhist Content</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/religion/jain">Jain Content</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/religion/parsi">Parsi Content</Link></DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Islamic Festivals</DropdownMenuLabel>
                <DropdownMenuItem><Link href="/festivals/ramzan">Ramzan (Ramadan)</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/eid-ul-fitr">Eid-ul-Fitr</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/eid-ul-adha">Eid-ul-Adha</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/muharram">Muharram</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/festivals/milad-un-nabi">Milad-un-Nabi</Link></DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Caste Cultural Themes</DropdownMenuLabel>
                <DropdownMenuItem><Link href="/castes/brahmin">Brahmin Traditions</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/castes/rajput">Rajput Heritage</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/castes/dalit">Dalit Stories</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/castes/jat">Jat Life</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/castes/maratha">Maratha Legacy</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/castes/tribal">Tribal & Indigenous</Link></DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Global Cultures</DropdownMenuLabel>
                <DropdownMenuItem><Link href="/global/chinese-new-year">Chinese New Year</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/global/hanukkah">Hanukkah</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/global/christmas">Christmas</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/global/thanksgiving">Thanksgiving</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/global/halloween">Halloween</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/global/easter">Easter</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/global/ramadan-global">Global Ramadan</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
                <Button variant="outline" size="sm" className="text-white border-white ">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 right-4 w-64 bg-black bg-opacity-90 rounded-lg shadow-lg p-4 space-y-3 md:hidden z-50">
            <Link href="/photos" className="block text-white hover:underline">Photos</Link>
            <Link href="/videos" className="block text-white hover:underline">Videos</Link>
            <Link href="/music" className="block text-white hover:underline">Music</Link>
            <Link href="/collections" className="block text-white hover:underline">Collections</Link>
            <Link href="/license" className="block text-white hover:underline">License</Link>
            <Link href="/creators" className="block text-white hover:underline">Creators</Link>
            <Link href="/upload" className="block text-white hover:underline">Upload</Link>
            {userData ? (
              <>
                <Link href="/dashboard" className="block text-white hover:underline">Dashboard</Link>
                <Link href="/preferences" className="block text-white hover:underline">Preferences</Link>
                <button onClick={handleLogout} className="block text-left text-white hover:underline">Logout</button>
              </>
            ) : (
              <Link href="/login" className="block text-white hover:underline">Login</Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
