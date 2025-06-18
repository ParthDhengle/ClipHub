"use client"

import React, { useState } from "react"
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
import { Upload, ImageIcon, Video, Music, Info, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// --- schema & types ---
const formSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().nonempty(),
  description: z.string().max(500).optional(),
  tags: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : []
    ),
  license: z.boolean().refine((v) => v, { message: "You must agree to the license terms" }),
})

type FormValues = z.infer<typeof formSchema>

export function UploadForm() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/dashboard"
  const { toast } = useToast()

  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(-1)

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

  // drag & drop…
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
      setFiles((f) => [...f, ...Array.from(e.dataTransfer.files)])
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFiles((f) => [...f, ...Array.from(e.target.files)])
    }
  }
  const removeFile = (idx: number) => setFiles((f) => f.filter((_, i) => i !== idx))

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
        const file = files[i]
        const fd = new FormData()
        fd.append("file", file)

        // let axios set Content-Type (with boundary)
        const uploadRes = await api.post("/api/upload/media", fd, {
          onUploadProgress: (e) => {
            if (!e.lengthComputable) return
            const percent = Math.round((e.loaded * 100) / e.total)
            setProgress((i * 100 + percent) / total)
          },
        })

        const { url, thumbnail_url } = uploadRes.data
        const mediaType = file.type.startsWith("image/")
          ? "photo"
          : file.type.startsWith("video/")
          ? "video"
          : "music"

        await api.post("/api/media/", {
          title: data.title,
          url,
          thumbnail_url,
          type: mediaType,
          category_id: data.category,
          tags: data.tags,
          description: data.description || "",
          is_premium: false,
        })
      }

      setProgress(100)
      toast({ title: "Success", description: "Upload complete!", variant: "default" })
      form.reset()
      setFiles([])
      router.push(from)
    } catch (err) {
      let message = "Upload failed. Please try again."
      if (axios.isAxiosError(err)) {
        // server‑sent
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
                MP3, WAV.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploading && (
                <div className="mb-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-center mt-2">
                    Uploading {files[uploadingFileIndex]?.name} ({Math.round(uploadProgress)}%)
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
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center">
                              {file.type.startsWith("image/") && (
                                <ImageIcon className="h-5 w-5 mr-2" />
                              )}
                              {file.type.startsWith("video/") && (
                                <Video className="h-5 w-5 mr-2" />
                              )}
                              {file.type.startsWith("audio/") && (
                                <Music className="h-5 w-5 mr-2" />
                              )}
                              <span className="truncate max-w-xs">{file.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                              <X className="h-4 w-4" />
                            </Button>
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
                perform best on our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}