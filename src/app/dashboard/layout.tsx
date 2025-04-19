import { AccountSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="absolute top-0 left-0 h-full">
        <AccountSidebar />
      </div>
      <main className=" w-full h-full">
        {children}
      </main>
    </SidebarProvider>
  )
}