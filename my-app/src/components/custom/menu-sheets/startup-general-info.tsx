import { Startup } from "@/types/startup";

interface StartupGeneralInfoProps {
  startup?: Startup;
  onClose: () => void
}

export default function StartupGeneralInfo({ startup, onClose }: StartupGeneralInfoProps) {
  return (
    <div className="flex h-full flex-col">
      
    </div>
  )
}