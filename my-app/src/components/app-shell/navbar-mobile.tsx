"use client"

import { Bell, Building, Menu, Monitor, Search } from "lucide-react"
import { usePathname } from "next/navigation"
import NavItem from "@/components/app-shell/nav-item"

interface NavbarMobileProps {
  type: string
  notificationCount?: number
}

export function NavbarMobile({
  type,
  notificationCount = 0
}: NavbarMobileProps) {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-white">
      <div className="grid h-full grid-cols-5">
        {type === "founder" && (
          <>
            <NavItem
              href="/search-investors"
              icon={<Search className="h-5 w-5" />}
              label="Explore"
              isActive={pathname === "/search-investors"}
            />
            <NavItem
              href="/my-startup"
              icon={<Building className="h-5 w-5" />}
              label="My Startup"
              isActive={pathname === "/my-startup"}
            />
          </>
        )}
        {type === "investor" && (
          <>
            <NavItem
              href="/search-startups"
              icon={<Search className="h-5 w-5" />}
              label="Startups"
              isActive={pathname === "/search-startups"}
            />
            <NavItem
              href="/favorites"
              icon={<Building className="h-5 w-5" />}
              label="Favorites"
              isActive={pathname === "/favorites"}
            />
          </>
        )}
        <NavItem
          href="/dashboard"
          icon={<Monitor className="h-5 w-5" />}
          label="Dashboard"
          isActive={pathname === "/dashboard"}
        />
        <NavItem
          href="/notifications"
          icon={
            <div className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className={`absolute ${notificationCount > 9 ? '-right-3' : '-right-1'} -top-1 flex pl-1 pr-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-primary-foreground`}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </div>
          }
          label="Notifications"
          isActive={pathname === "/notifications"}
        />
        <NavItem
          href="/menu"
          icon={<Menu className="h-5 w-5" />}
          label="Menu"
          isActive={pathname === "/menu"}
        />
      </div>
    </div>
  )
}
