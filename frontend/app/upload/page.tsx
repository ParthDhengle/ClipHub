"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);

    setUploading(true);

    try {
      const response = await fetch("http://localhost:8000/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <main className="pt-16 px-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload Media</h1>

        {/* File Input */}
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-white"
        />

        {/* Title Field */}
        <input
          type="text"
          placeholder="Enter a title for your content"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />

        {/* Description Field */}
        <textarea
          placeholder="Describe your content"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />

        {/* Tags Field */}
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="mb-4 w-full p-2 rounded bg-gray-800 text-white border border-gray-700"
        />

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white w-full"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Upload Result */}
        {result && (
          <div className="mt-6 bg-gray-800 p-4 rounded text-sm">
            <p><strong>Filename:</strong> {result.saved_as}</p>
            <p><strong>URL:</strong>{" "}
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
                {result.url}
              </a>
            </p>
            {result.title && (
              <p><strong>Title:</strong> {result.title}</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
