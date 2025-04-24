import { Startup } from "@/types/startup";

interface StartupLogoProps {
  startup?: Startup;
  onClose: () => void
}

export default function StartupLogo({ startup, onClose }: StartupLogoProps) {
  return (
    <div className="flex h-full flex-col">
      
    </div>
  )
}