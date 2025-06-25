"use client"

import React, { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, ImageIcon, Video, Music, Info, X, Camera, Play, Pause, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// --- schema & types ---
const formSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().nonempty(),
  description: z.string().max(500).optional(),
  tags: z.string().optional(),
  license: z.boolean().refine((v) => v, { message: "You must agree to the license terms" }),
})

type FormValues = z.infer<typeof formSchema>

interface FileWithThumbnail {
  file: File
  thumbnail?: string
  customThumbnail?: File
  isGeneratingThumbnail?: boolean
}

export function UploadForm() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/dashboard"
  const { toast } = useToast()

  const [files, setFiles] = useState<FileWithThumbnail[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(-1)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      tags: "",
      license: false,
    },
  })

  if (loading) return <div>Loading…</div>
  if (!user) {
    router.push("/login")
    return null
  }

  // Generate video thumbnail
  const generateVideoThumbnail = (file: File, timeInSeconds: number = 1): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.onloadedmetadata = () => {
        // Set canvas dimensions
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Seek to specific time
        video.currentTime = Math.min(timeInSeconds, video.duration / 2)
      }
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
          resolve(thumbnail)
        } else {
          reject(new Error('Could not get canvas context'))
        }
      }
      
      video.onerror = () => reject(new Error('Error loading video'))
      video.src = URL.createObjectURL(file)
    })
  }

  // Generate music thumbnail (waveform visualization)
  const generateMusicThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = 400
      canvas.height = 200
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Create a simple waveform-like visualization
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        
        audioContext.decodeAudioData(arrayBuffer)
          .then((audioBuffer) => {
            const data = audioBuffer.getChannelData(0)
            const step = Math.ceil(data.length / canvas.width)
            const amp = canvas.height / 2
            
            // Clear canvas with dark background
            ctx.fillStyle = '#1a1a1a'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            // Draw waveform
            ctx.strokeStyle = '#3b82f6'
            ctx.lineWidth = 2
            ctx.beginPath()
            
            for (let i = 0; i < canvas.width; i++) {
              const min = Math.min(...data.slice(i * step, (i + 1) * step))
              const max = Math.max(...data.slice(i * step, (i + 1) * step))
              
              ctx.moveTo(i, (1 + min) * amp)
              ctx.lineTo(i, (1 + max) * amp)
            }
            
            ctx.stroke()
            
            // Add music icon
            ctx.fillStyle = '#ffffff'
            ctx.font = '48px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('♪', canvas.width / 2, canvas.height / 2 + 16)
            
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
            resolve(thumbnail)
          })
          .catch(() => {
            // Fallback: create a simple music icon thumbnail
            ctx.fillStyle = '#1a1a1a'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            ctx.fillStyle = '#3b82f6'
            ctx.font = '72px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('♪', canvas.width / 2, canvas.height / 2 + 24)
            
            const thumbnail = canvas.toDataURL('image/jpeg', 0.8)
            resolve(thumbnail)
          })
      }
      
      reader.onerror = () => reject(new Error('Error reading audio file'))
      reader.readAsArrayBuffer(file)
    })
  }

  // Auto-generate thumbnails for new files
  const processNewFiles = async (newFiles: File[]) => {
    const processedFiles: FileWithThumbnail[] = []
    
    for (const file of newFiles) {
      const fileWithThumbnail: FileWithThumbnail = { file, isGeneratingThumbnail: false }
      
      if (file.type.startsWith('video/')) {
        fileWithThumbnail.isGeneratingThumbnail = true
        try {
          const thumbnail = await generateVideoThumbnail(file)
          fileWithThumbnail.thumbnail = thumbnail
        } catch (error) {
          console.error('Error generating video thumbnail:', error)
        }
        fileWithThumbnail.isGeneratingThumbnail = false
      } else if (file.type.startsWith('audio/')) {
        fileWithThumbnail.isGeneratingThumbnail = true
        try {
          const thumbnail = await generateMusicThumbnail(file)
          fileWithThumbnail.thumbnail = thumbnail
        } catch (error) {
          console.error('Error generating music thumbnail:', error)
        }
        fileWithThumbnail.isGeneratingThumbnail = false
      }
      
      processedFiles.push(fileWithThumbnail)
    }
    
    setFiles(prev => [...prev, ...processedFiles])
  }

  // Regenerate video thumbnail at different timestamp
  const regenerateVideoThumbnail = async (index: number, timeInSeconds: number) => {
    const fileItem = files[index]
    if (!fileItem.file.type.startsWith('video/')) return
    
    setFiles(prev => prev.map((item, i) => 
      i === index ? { ...item, isGeneratingThumbnail: true } : item
    ))
    
    try {
      const thumbnail = await generateVideoThumbnail(fileItem.file, timeInSeconds)
      setFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, thumbnail, isGeneratingThumbnail: false } : item
      ))
    } catch (error) {
      console.error('Error regenerating thumbnail:', error)
      setFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, isGeneratingThumbnail: false } : item
      ))
    }
  }

  // Handle custom thumbnail upload
  const handleCustomThumbnail = (index: number, thumbnailFile: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const thumbnail = e.target?.result as string
      setFiles(prev => prev.map((item, i) => 
        i === index ? { ...item, thumbnail, customThumbnail: thumbnailFile } : item
      ))
    }
    reader.readAsDataURL(thumbnailFile)
  }

  // drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files.length) {
      processNewFiles(Array.from(e.dataTransfer.files))
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : []
    if (newFiles.length) {
      processNewFiles(newFiles)
    }
  }
  
  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx))

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!files.length) {
      toast({ title: "Error", description: "Please select at least one file.", variant: "destructive" })
      return
    }

    setUploading(true)
    try {
      const total = files.length
      for (let i = 0; i < total; i++) {
        setCurrentIndex(i)
        const fileItem = files[i]
        const file = fileItem.file
        
        // Create FormData for main file
        const fd = new FormData()
        fd.append("file", file)
        
        console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

        // Upload main file
        const uploadRes = await api.post("/api/upload/media", fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (e) => {
            if (!e.lengthComputable || !e.total) return
            const percent = Math.round((e.loaded * 100) / e.total)
            setProgress((i * 100 + percent * 0.8) / total) // 80% for main file
          },
        })

        console.log('Upload response:', uploadRes.data)
        const { url } = uploadRes.data
        let thumbnail_url = uploadRes.data.thumbnail_url

        // Upload custom thumbnail if provided or generated
        if (fileItem.thumbnail && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
          try {
            let thumbnailFormData = new FormData()
            
            if (fileItem.customThumbnail) {
              // Use custom uploaded thumbnail
              thumbnailFormData.append("file", fileItem.customThumbnail)
            } else {
              // Convert generated thumbnail to blob
              const response = await fetch(fileItem.thumbnail)
              const blob = await response.blob()
              const thumbnailFile = new File([blob], `thumbnail_${file.name}.jpg`, { type: 'image/jpeg' })
              thumbnailFormData.append("file", thumbnailFile)
            }
            
            const thumbnailRes = await api.post("/api/upload/media", thumbnailFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            
            thumbnail_url = thumbnailRes.data.url
            console.log('Thumbnail uploaded:', thumbnail_url)
          } catch (thumbError) {
            console.error('Error uploading thumbnail:', thumbError)
            // Continue without thumbnail if upload fails
          }
        }

        const mediaType = file.type.startsWith("image/")
          ? "photo"
          : file.type.startsWith("video/")
          ? "video"
          : "music"

        // Process tags correctly
        const tagsArray = data.tags 
          ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          : []

        // Create media record
        await api.post("/api/media/", {
          title: data.title,
          url,
          thumbnail_url,
          type: mediaType,
          category_id: data.category,
          tags: tagsArray,
          description: data.description || "",
          is_premium: false,
          status: "pending",
          likes: 0,
          views: 0,
          downloads: 0
        })

        setProgress(((i + 1) * 100) / total)
      }

      toast({ title: "Success", description: "Upload complete!", variant: "default" })
      form.reset()
      setFiles([])
      router.push(from)
    } catch (err) {
      console.error('Upload error:', err)
      let message = "Upload failed. Please try again."
      if (axios.isAxiosError(err)) {
        console.error('Response data:', err.response?.data)
        console.error('Response status:', err.response?.status)
        message = err.response?.data?.message || err.message
      } else if (err instanceof Error) {
        message = err.message
      }
      toast({ title: "Error", description: message, variant: "destructive" })
    } finally {
      setUploading(false)
      setCurrentIndex(-1)
      setProgress(0)
    }
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Your Content</h1>
            <p className="text-muted-foreground">
              Share your photos, videos, or music with the ClipHub community
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Drag and drop your files or click to browse. Supported formats: JPG, PNG, MP4, MOV,
                MP3, WAV. Thumbnails will be automatically generated for videos and music.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploading && (
                <div className="mb-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center mt-2">
                    Uploading {files[currentIndex]?.file.name} ({Math.round(progress)}%)
                  </p>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
                      dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                    }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*,audio/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium mb-1">Drag and drop files here</p>
                        <p className="text-muted-foreground mb-4">or click to browse your device</p>
                        <Button type="button">Select Files</Button>
                      </div>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Selected Files ({files.length})</h3>
                      <div className="space-y-4">
                        {files.map((fileItem, index) => (
                          <div
                            key={index}
                            className="p-4 bg-muted/50 rounded-lg border"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                {fileItem.file.type.startsWith("image/") && (
                                  <ImageIcon className="h-5 w-5 mr-2" />
                                )}
                                {fileItem.file.type.startsWith("video/") && (
                                  <Video className="h-5 w-5 mr-2" />
                                )}
                                {fileItem.file.type.startsWith("audio/") && (
                                  <Music className="h-5 w-5 mr-2" />
                                )}
                                <div>
                                  <span className="font-medium">{fileItem.file.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB)
                                  </span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Thumbnail section for videos and music */}
                            {(fileItem.file.type.startsWith('video/') || fileItem.file.type.startsWith('audio/')) && (
                              <div className="mt-3 p-3 bg-background rounded border">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium">Thumbnail</h4>
                                  <div className="flex gap-2">
                                    {fileItem.file.type.startsWith('video/') && (
                                      <>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => regenerateVideoThumbnail(index, 1)}
                                          disabled={fileItem.isGeneratingThumbnail}
                                        >
                                          <RotateCcw className="h-3 w-3 mr-1" />
                                          1s
                                        </Button>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => regenerateVideoThumbnail(index, 5)}
                                          disabled={fileItem.isGeneratingThumbnail}
                                        >
                                          <RotateCcw className="h-3 w-3 mr-1" />
                                          5s
                                        </Button>
                                      </>
                                    )}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      ref={thumbnailInputRef}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          handleCustomThumbnail(index, file)
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => thumbnailInputRef.current?.click()}
                                    >
                                      <Camera className="h-3 w-3 mr-1" />
                                      Custom
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-center bg-muted/30 rounded h-24 w-full">
                                  {fileItem.isGeneratingThumbnail ? (
                                    <div className="text-center">
                                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                      <p className="text-xs text-muted-foreground">Generating...</p>
                                    </div>
                                  ) : fileItem.thumbnail ? (
                                    <img
                                      src={fileItem.thumbnail}
                                      alt="Thumbnail"
                                      className="max-h-full max-w-full object-contain rounded"
                                    />
                                  ) : (
                                    <div className="text-center text-muted-foreground">
                                      <Camera className="h-6 w-6 mx-auto mb-1" />
                                      <p className="text-xs">No thumbnail</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter a title for your content" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="nature">Nature</SelectItem>
                                <SelectItem value="people">People</SelectItem>
                                <SelectItem value="architecture">Architecture</SelectItem>
                                <SelectItem value="animals">Animals</SelectItem>
                                <SelectItem value="travel">Travel</SelectItem>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="technology">Technology</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Describe your content" rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags (comma separated)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="nature, landscape, mountains, sky" 
                              value={Array.isArray(field.value) ? field.value.join(", ") : field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="license"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="grid gap-1.5 leading-none">
                            <FormLabel className="text-sm font-medium leading-none">
                              I confirm that I have all necessary rights to the content I&apos;m
                              uploading
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              By uploading, you agree to our{" "}
                              <a href="/terms" className="underline">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="/license" className="underline">
                                License Agreement
                              </a>
                            </p>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(from)}
                        disabled={uploading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={uploading}>
                        {uploading ? "Uploading..." : "Upload Content"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-muted rounded-lg flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Content Guidelines</h3>
              <p className="text-sm text-muted-foreground">
                Please ensure your content meets our quality standards and doesn&apos;t violate any
                copyright laws. High-resolution images, properly tagged content, and original work
                perform best on our platform. Thumbnails are automatically generated for videos and music files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}