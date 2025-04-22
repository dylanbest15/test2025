import { cn } from "@/lib/utils"
import Link from "next/link"

interface NavItemProps {
  href?: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick?: () => void
}

export default function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <Link href={href || "#"} onClick={handleClick} className="flex flex-col items-center justify-center relative h-full">
      <div className="flex flex-col items-center justify-center">
        <div className={cn("transition-colors scale-125", isActive ? "text-red-600" : "text-gray-500")}>{icon}</div>
        <span className={cn("text-xs mt-1 transition-colors", isActive ? "text-red-600 font-bold" : "text-gray-500")}>
          {label}
        </span>
      </div>
    </Link>
  )
}