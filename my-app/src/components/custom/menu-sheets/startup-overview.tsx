import { Startup } from "@/types/startup";

interface StartupOverviewProps {
  startup?: Startup;
  onClose: () => void
}

export default function StartupOverview({ startup, onClose }: StartupOverviewProps) {
  return (
    <div className="flex h-full flex-col">
      
    </div>
  )
}