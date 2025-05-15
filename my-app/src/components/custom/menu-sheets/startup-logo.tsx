import { Button } from "@/components/ui/button";
import { Startup } from "@/types/startup";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Building2, Upload } from "lucide-react";
import { useCallback, useState } from "react";

interface StartupLogoProps {
  startup: Startup;
  updateStartup: (data: Partial<Startup>) => Promise<boolean>
  onClose: () => void
}

export default function StartupLogo({ startup, updateStartup, onClose }: StartupLogoProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(startup.logo_url)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]

    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Clean up the object URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl)
  }

  // Upload image to Supabase storage
  const uploadImage = useCallback(async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      setError(null)

      // If there's an existing logo URL, extract the file name to delete it
      if (startup.logo_url) {
        const fileName = startup.logo_url.split("/").pop()
        if (fileName) {
          await supabase.storage.from("logos").remove([fileName])
        }
      }

      // Create a unique file name
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${startup.id}-${Date.now()}.${fileExt}`

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: selectedFile.type
        })

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("logos").getPublicUrl(data.path)

      // Update the profile with the new avatar URL
      await updateStartup({ logo_url: publicUrl })

      // Close the sheet
      onClose()
    } catch (err) {
      console.error("Error uploading image:", err)
      setError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, startup.id, supabase, onClose])

  // Reset the selected file
  const resetSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(startup.logo_url)
    setError(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-lg font-semibold">Upload Logo</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6">
        {/* Preview */}
        <div className="relative">
          {previewUrl ? (
            <div className="h-32 w-32 border-2 border-border overflow-hidden rounded-md flex items-center justify-center">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={`${startup.name || "Company"} logo`}
                className="object-contain max-h-full max-w-full"
                style={{ objectPosition: "center" }}
              />
            </div>
          ) : (
            <div className="h-32 w-32 bg-gray-100 flex items-center justify-center rounded-md border-2 border-border">
              <Building2 className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <p className="text-destructive text-sm">{error}</p>}

        {/* Upload controls */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
          {selectedFile ? (
            <div className="space-y-3 w-full">
              <p className="text-sm text-center text-muted-foreground">Selected: {selectedFile.name}</p>
              <Button className="w-full" onClick={uploadImage} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save Logo"}
              </Button>
              <Button variant="outline" className="w-full" onClick={resetSelection} disabled={isUploading}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-3 w-full">
              <label className="relative block border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:border-muted-foreground/40 transition-colors cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF (max 5MB)</p>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isUploading}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}