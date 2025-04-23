"use client"
import Link from "next/link"
import { Bell, Building, LogOut, Menu, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchBar } from "@/components/custom/search-bar"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation"
import NavItem from "@/components/custom/nav-item"

interface NavbarProps {
  onLogout?: () => void
  notificationCount?: number
}

export function AppNavbar({
  onLogout,
  notificationCount = 0,
}: NavbarProps) {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-white">
        <div className="grid h-full grid-cols-4">
        <NavItem
            href="/my-startup"
            icon={<Building className="h-5 w-5" />}
            label="My Startup"
            isActive={pathname === "/my-startup"}
          />
          <NavItem
            href="/search"
            icon={<Search className="h-5 w-5" />}
            label="Search"
            isActive={pathname === "/search"}
          />
          <NavItem
            href="/notifications"
            icon={
              <div className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </div>
            }
            label="Alerts"
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

  return (
    <div className="sticky top-0 z-50 w-full flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4 md:gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">The Fund Pool</span>
        </Link>
        <SearchBar />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
