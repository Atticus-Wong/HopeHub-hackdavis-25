import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AccountSidebar } from "@/components/Sidebar"; // Import the sidebar
import { SidebarProvider } from "@/components/ui/sidebar"; // Import the provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fourth & Hope Staff Dashboard",
  description: "Internal dashboard for Fourth & Hope staff members",
};

export default function DashboardLayout({ // Renamed for clarity
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning for ThemeProvider */}
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SidebarProvider> {/* Wrap with SidebarProvider */}
            <div className="ml-4 flex min-h-screen">
              <AccountSidebar />
              <main className="flex-1 bg-gray-50 dark:bg-gray-900"> {/* Ensure main content takes remaining space */}
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
