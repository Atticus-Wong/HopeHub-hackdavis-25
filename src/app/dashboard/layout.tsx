import { AccountSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
        {children}
    </SidebarProvider>
  )
}