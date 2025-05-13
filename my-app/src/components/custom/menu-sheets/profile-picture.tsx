"use client"

import type React from "react"

import type { Profile } from "@/types/profile"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { displayName, getInitials } from "@/types/profile"
import { ArrowLeft, Upload, X } from "lucide-react"
import { useCallback, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { updateProfile } from "@/app/(dashboard)/menu/(profile-section)/actions"

interface ProfilePictureProps {
  profile: Profile
  onClose: () => void
}

export default function ProfilePicture({ profile, onClose }: ProfilePictureProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar_url)
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

      // Create a unique file name
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-pictures").getPublicUrl(data.path)

      // Update the profile with the new avatar URL
      await updateProfile(profile.id, { avatar_url: publicUrl })

      // Close the sheet
      onClose()
    } catch (err) {
      console.error("Error uploading image:", err)
      setError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }, [selectedFile, profile.id, supabase, onClose])

  // Remove the current profile picture
  const removeProfilePicture = useCallback(async () => {
    try {
      setIsUploading(true)
      setError(null)

      // If there's an existing avatar URL, extract the file name to delete it
      if (profile.avatar_url) {
        const fileName = profile.avatar_url.split("/").pop()
        if (fileName) {
          // Delete from storage (this is optional, you might want to keep old images)
          await supabase.storage.from("profile-pictures").remove([fileName])
        }
      }

      // Update profile with null avatar_url
      // await updateProfile(profile.id, { avatar_url: null })
      console.log(profile.id);

      // Reset state
      setPreviewUrl(null)
      setSelectedFile(null)

      // Close the sheet
      onClose()
    } catch (err) {
      console.error("Error removing profile picture:", err)
      setError("Failed to remove profile picture. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }, [profile.id, profile.avatar_url, supabase, onClose])

  // Reset the selected file
  const resetSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(profile.avatar_url)
    setError(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-lg font-semibold">Upload Profile Picture</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6">
        {/* Preview */}
        <div className="relative">
          <Avatar className="h-32 w-32 border-2 border-border">
            <AvatarImage src={previewUrl || "/placeholder.svg"} alt={displayName(profile)} className="object-cover" />
            <AvatarFallback className="text-2xl">{getInitials(profile)}</AvatarFallback>
          </Avatar>
        </div>

        {/* Error message */}
        {error && <p className="text-destructive text-sm">{error}</p>}

        {/* Upload controls */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
          {selectedFile ? (
            <div className="space-y-3 w-full">
              <p className="text-sm text-center text-muted-foreground">Selected: {selectedFile.name}</p>
              <Button className="w-full" onClick={uploadImage} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save Profile Picture"}
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

              {profile.avatar_url && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={removeProfilePicture}
                  disabled={isUploading}
                >
                  Remove Profile Picture
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}