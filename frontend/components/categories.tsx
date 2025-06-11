'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Camera, Video, Music, Users, ImageIcon, Bookmark, Trophy } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface Category {
  name: string
  icon: LucideIcon
  path: string
}

export function Categories() {
  const categories: Category[] = [
    { name: 'Home', icon: Camera, path: '/' },
    { name: 'Images', icon: ImageIcon, path: '/photos' },
    { name: 'Videos', icon: Video, path: '/videos' },
    { name: 'Music', icon: Music, path: '/music' },
    { name: 'Creators', icon: Users, path: '/creators' },
    { name: 'Collections', icon: Bookmark, path: '/collections' },
    { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { name: 'Challenges', icon: ImageIcon, path: '/challenges' },
  ]

  const pathname = usePathname()

  return (
    <div className="border-b sticky top-16 bg-background/80 backdrop-blur-md z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 py-4">
            {categories.map((category) => {
              const isActive = category.path === pathname
              return (
                <Button
                  key={category.name}
                  variant={isActive ? 'default' : 'ghost'}
                  className="flex items-center"
                  asChild
                >
                  <Link href={category.path}>
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Link>
                </Button>
              )
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}