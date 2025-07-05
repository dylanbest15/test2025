"use client"

import { useState, useEffect } from "react"
import QRCode from "qrcode"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { toast } from "sonner"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  startupName: string
}

export default function QRCodeDialog({ open, onOpenChange, url, startupName }: QRCodeDialogProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const generateQRCode = async (targetUrl: string) => {
    try {
      setIsLoading(true)
      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrCodeUrl(qrDataUrl)
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.error("Error", { description: "Failed to generate QR code" })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open && url) {
      generateQRCode(url)
    }
  }, [open, url])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Copied!", { description: "URL copied to clipboard" })
    } catch (error) {
      toast.error("Error", { description: "Failed to copy URL" })
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = `${startupName.toLowerCase().replace(/\s+/g, "-")}-qr-code.png`
    link.href = qrCodeUrl
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{startupName}</DialogTitle>
          {/* <DialogDescription>Scan this QR code to visit the startup page</DialogDescription> */}
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            {isLoading ? (
              <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Generating...</span>
              </div>
            ) : (
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-64 h-64 border rounded-lg" />
            )}
          </div>

          <div className="space-y-2">
            {/* <p className="text-sm font-medium text-gray-700">URL:</p> */}
            <div className="p-2 bg-gray-100 rounded text-xs break-all">{url}</div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1 bg-transparent">
              <Copy className="h-4 w-4 mr-2" />
              Copy URL
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadQRCode}
              disabled={!qrCodeUrl}
              className="flex-1 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}