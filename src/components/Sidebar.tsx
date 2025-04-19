'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Home, User, Settings, LogOut, PanelLeft, MessageSquare, LayoutDashboard, BookOpenText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AccountSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleSignOut = async () => {
    console.log("Signing out...");
  }

  const getUserInitials = () => {
    if (!user) return "?";

    const name = user.user_metadata?.full_name || user.email || "";
    if (!name) return "?";

    if (name.includes('@')) {
      return name.charAt(0).toUpperCase();
    }

    const nameParts = name.split(' ').filter(Boolean);
    if (nameParts.length === 0) return "?";
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Sidebar
      className={`transition-all duration-100 overflow-hidden scrollbar-none ${isExpanded ? 'w-64' : 'w-16'} border-r`}
    >
      <SidebarHeader>
        <div className={`p-2 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          {isExpanded && <p className='font-bold'>Fourth and Hope</p>}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-grow">
        <SidebarGroup>
          <nav className="space-y-1 p-2">
            <Link href="/account" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <LayoutDashboard className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Dashboard</span>
            </Link>
            <Link href="/account/session" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <BookOpenText className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Sessions</span>
            </Link>
            <Link href="/account/chat" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <MessageSquare className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Talk to Minerva</span>
            </Link>
            <Link href="/settings" className={`flex items-center rounded-md text-sm hover:bg-secondary ${isExpanded ? 'space-x-3 p-2' : 'w-8 h-8 justify-center p-0'}`}>
              <Settings className="h-5 w-5 min-w-[20px]" />
              <span className={`transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>Settings</span>
            </Link>
          </nav>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t">
        <div className={`flex items-center p-3 ${isExpanded ? 'gap-3' : 'justify-center'}`}>
          <span className={`text-sm transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>
            Theme
          </span>
        </div>

        {!loading && user && (
          <div className={`p-2 flex items-center ${!isExpanded ? 'flex justify-center pl-4' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center p-2 ${isExpanded
                    ? 'w-full justify-start gap-4'
                    : 'justify-center h-10 w-7 rounded-full'
                    }`}
                >
                  <Avatar className={`h-7 w-7`}>
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                      alt={user.user_metadata?.full_name || user.email}
                    />
                    <AvatarFallback className="text-xs">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <span className={`text-sm font-medium truncate transition-opacity duration-100 ${isExpanded ? 'opacity-100 delay-75' : 'opacity-0 w-0'}`}>
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="mb-2 w-56">
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/chat" className="w-full cursor-pointer">
                    Talk to Minerva
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900/50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}