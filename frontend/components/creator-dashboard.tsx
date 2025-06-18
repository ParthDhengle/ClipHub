"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Eye,
  Download,
  Users,
  IndianRupeeIcon as Rupee,
  Upload,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Bell,
  Folder,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import api from "@/lib/api"
import { useRouter, usePathname } from "next/navigation"

interface Stat {
  title: string
  value: string
  change: string
  icon: React.ComponentType<any>
  color: string
  bgColor: string
}

interface Upload {
  id: string
  title: string
  type: string
  status: string
  views: string
  downloads: string
  earnings: string
  uploadDate: string
}

interface Achievement {
  title: string
  description: string
  icon: string
}

export function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<Stat[]>([])
  const [recentUploads, setRecentUploads] = useState<Upload[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [user, userLoading] = useAuthState(auth)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      if (!user) return
      setLoading(true)
      try {
        const idToken = await user.getIdToken()
        const headers = { Authorization: `Bearer ${idToken}` }

        // Fetch user stats
        const userResponse = await api.get('/api/users/me', { headers })
        const analyticsResponse = await api.get('/api/analytics', { headers })
        const mediaResponse = await api.get('/api/media?userId=' + user.uid, { headers })

        setStats([
          {
            title: "Total Views",
            value: analyticsResponse.data.totalViews.toLocaleString(),
            change: `+${analyticsResponse.data.viewsChange}%`,
            icon: Eye,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Downloads",
            value: analyticsResponse.data.totalDownloads.toLocaleString(),
            change: `+${analyticsResponse.data.downloadsChange}%`,
            icon: Download,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Followers",
            value: userResponse.data.followers.toLocaleString(),
            change: `+${analyticsResponse.data.followersChange}%`,
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Earnings",
            value: `₹${analyticsResponse.data.earnings.toLocaleString()}`,
            change: `+${analyticsResponse.data.earningsChange}%`,
            icon: Rupee,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
        ])

        setRecentUploads(mediaResponse.data.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          status: item.status,
          views: item.views.toLocaleString(),
          downloads: item.downloads.toLocaleString(),
          earnings: `₹${item.earnings.toLocaleString()}`,
          uploadDate: new Date(item.created_at).toLocaleDateString(),
        })))

        setAchievements([
          { title: "Top Creator", description: "Reached 25K followers", icon: "🏆" },
          { title: "Viral Content", description: "1M+ views on single upload", icon: "🔥" },
          { title: "Cultural Ambassador", description: "Featured in 5+ festivals", icon: "🎭" },
          { title: "Community Favorite", description: "4.9+ average rating", icon: "⭐" },
        ])
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.detail || "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchData()
  }, [user, userLoading, router, toast])

  if (loading || userLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-pink-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 ring-2 ring-orange-200">
                <AvatarImage src={user?.photoURL || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white font-semibold">
                  {user?.displayName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {user?.displayName || 'Creator'}!</h1>
                <p className="text-muted-foreground">Let's create something amazing today</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-pink-500"
                onClick={() => router.push(`/upload?from=${encodeURIComponent(pathname)}`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload Content
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="uploads">Uploads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Recent Uploads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUploads.map((upload) => (
                      <div
                        key={upload.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{upload.title}</h4>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <Badge variant="secondary">{upload.type}</Badge>
                            <Badge
                              variant={upload.status === "Approved" ? "default" : "secondary"}
                              className={upload.status === "Approved" ? "bg-green-100 text-green-700" : ""}
                            >
                              {upload.status === "Approved" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {upload.status}
                            </Badge>
                            <span>{upload.uploadDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{upload.earnings}</p>
                          <p className="text-sm text-muted-foreground">{upload.downloads} downloads</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Content Approval Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement Rate</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quality Score</span>
                      <span className="font-medium">4.9/5</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Manager Tab */}
          <TabsContent value="uploads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Your Content</h3>
                  <p className="text-muted-foreground mb-6">Share your creative work with the ClipHub community</p>
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500" onClick={() => router.push('/upload')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Start Upload
                  </Button>
                </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Detailed Analytics</h3>
                    <p className="text-muted-foreground">Track your content performance and audience insights</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rupee className="h-5 w-5 mr-2" />
                    Earnings Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-600">₹{stats.find(s => s.title === "Earnings")?.value || "0"}</h3>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600">₹8,450</h3>
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-orange-600">₹12,680</h3>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Collections Tab */}
            <TabsContent value="collections" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Folder className="h-5 w-5 mr-2" />
                    My Collections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Organize Your Content</h3>
                    <p className="text-muted-foreground">Create collections to organize your uploads</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Manage Your Account</h3>
                    <p className="text-muted-foreground">Update your profile and preferences</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }