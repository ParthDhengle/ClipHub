"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Video, Music, Info, X } from "lucide-react"

export function UploadForm() {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload Your Content</h1>
            <p className="text-muted-foreground">Share your photos, videos, or music with the ClipHub community</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Drag and drop your files or click to browse. Supported formats: JPG, PNG, MP4, MOV, MP3, WAV.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* File Upload Area */}
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

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Selected Files ({files.length})</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center">
                          {file.type.startsWith("image/") && <ImageIcon className="h-5 w-5 mr-2" />}
                          {file.type.startsWith("video/") && <Video className="h-5 w-5 mr-2" />}
                          {file.type.startsWith("audio/") && <Music className="h-5 w-5 mr-2" />}
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

              {/* File Details Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter a title for your content" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your content" rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="nature, landscape, mountains, sky" />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox id="license" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="license"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm that I have all necessary rights to the content I'm uploading
                    </Label>
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
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Upload Content</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-muted rounded-lg flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Content Guidelines</h3>
              <p className="text-sm text-muted-foreground">
                Please ensure your content meets our quality standards and doesn't violate any copyright laws.
                High-resolution images, properly tagged content, and original work perform best on our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
