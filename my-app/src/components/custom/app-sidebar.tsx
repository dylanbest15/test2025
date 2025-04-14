import { MapPin, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Startup } from "@/types/startup"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  startup: Startup;
}

export function AppSidebar({ className, startup, ...props }: AppSidebarProps) {
  return (
    <Sidebar className={className} {...props}>
      <SidebarHeader>
        <SidebarGroup>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
          </div>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
      <SidebarGroup>
        <div className="w-full space-y-3 px-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{startup.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{startup.location}</span>
          </div>
        </div>
      </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarGroup>
        <div className="flex flex-col space-y-1 text-xs text-sidebar-foreground/70">
          <div className="font-semibold">The Fund Pool</div>
          <div>© 2025 The Fund Pool, Inc.</div>
          <div>All rights reserved.</div>
        </div>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
