/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // Import auth functions
import { auth } from "@/firebase/config"; // Import your Firebase auth instance
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  handleFetchData,
  handleFetchQueueMeals,
  handleFetchQueueShower
} from "@/lib/endpoint";
import { ServiceLog, BaseQueue } from "@/types/types";
import Queue from "@/components/Queue";
import ServiceLogs from "@/components/Cards/ServiceLogs";
import Announcements from "@/components/Announcments";
import AddClientForm from "@/components/AddClientForm";

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

type ClientLite = { id: string; name: string };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Store user object
  const [authLoading, setAuthLoading] = useState(true); // Loading state for auth check
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [directory, setDirectory] = useState<ClientLite[]>([]);
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state for data
  const [error, setError] = useState<string | null>(null);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [clientMap, setClientMap] = useState<Map<string, string>>(new Map()); // State for ID-Name map

  // Check authentication status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User is authenticated:", currentUser.uid);
      } else {
        setUser(null);
        console.log("User is not authenticated, redirecting to login.");
        router.push('/login'); // Redirect to login if not authenticated
      }
      setAuthLoading(false); // Auth check finished
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]); // Add router to dependency array

  // Wrap data fetching logic in a useCallback to keep its reference stable
  const fetchDashboardData = useCallback(async () => {
    // Only fetch data if authenticated
    if (!user) {
        console.log("Skipping data fetch: User not authenticated.");
        setIsLoading(false); // Ensure loading state is false if we skip fetch
        return;
    }

    setIsLoading(true);
    setError(null);
    console.log("Fetching dashboard data...");

    try {
      const [clientListData, logsData] = await Promise.all([
        handleFetchData().catch(err => { console.error("Error fetching directory:", err); return undefined; }),
        fetch('/api/fetchServiceLogs').then(res => res.ok ? res.json() : Promise.reject(res)).catch(err => { console.error("Error fetching logs:", err); return { logs: [] }; }),
      ]);

      if (clientListData) {
        console.log("Directory data fetched:", clientListData);
        setDirectory(clientListData);

        // Update the clientMap state
        const newClientMap = new Map<string, string>();
        clientListData.forEach(client => {
          newClientMap.set(client.name, client.id);
        });
        setClientMap(newClientMap);
        console.log("Client map updated:", newClientMap); // Optional: log the updated map

      } else {
        console.log("Directory data fetch returned undefined.");
        setDirectory([]);
        setClientMap(new Map()); // Reset map if data fetch fails or returns undefined
      }

      console.log("Logs data fetched:", logsData);
      setLogs(logsData?.logs || []);

    } catch (err) {
      console.error("Error during data fetch:", err);
      setError("Failed to load dashboard data.");
      setDirectory([]);
      setLogs([]);
      setClientMap(new Map()); // Reset map on error
    } finally {
      setIsLoading(false);
      console.log("Finished fetching dashboard data.");
    }
  }, [user]); // Add user to dependency array

  // Fetch data only after authentication is confirmed and user is set
  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user, fetchDashboardData]); // Depend on authLoading, user, and the stable fetch function

  const suggestions = term
    ? directory
      .filter((c) => c.name.toLowerCase().includes(term.toLowerCase()))
      .slice(0, 8)
    : [];

  const handleSelect = (uuid: string) => {
    setTerm("");
    setDropdown(false);
    router.push(`/profile/${uuid}`);
  };

  const handleAddNewClient = () => {
    setIsAddClientDialogOpen(true);
  };

  const LoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-[150px] w-full rounded-lg" />
        <Skeleton className="h-[150px] w-full rounded-lg" />
      </div>
    </div>
  );

  // Show loading indicator while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  // If not authenticated (and not loading), this component effectively renders nothing
  // as the redirect should have already happened. You could return null here explicitly.
  if (!user) {
    return null;
  }

  // Render dashboard content only if authenticated
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-[#eaf5ed] to-[#eef3f0] p-4 md:p-6 lg:p-8"
    >
      <Card className="w-full bg-gradient-to-b from-[#FEFEFE] to-[#D3E7C8]">
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          {/* Header Row: Greeting, Search, Add Button */}
          <div className="mb-10 flex items-center justify-between gap-4">
            {/* Greeting */}
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {/* Use user's display name or email */}
              Hello, {user.displayName || user.email || 'User'}
            </p>

            {/* Search */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="relative w-full max-w-xl flex-grow"
              layoutId="search-bar"
            >
              <Input
                placeholder="Search clients..."
                value={term}
                onFocus={() => setDropdown(true)}
                onChange={(e) => {
                  setTerm(e.target.value);
                  setDropdown(true);
                }}
                onBlur={() => setTimeout(() => setDropdown(false), 150)}
                className="h-11 rounded-full px-5 shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <AnimatePresence>
                {dropdown && suggestions.length > 0 && (
                  <motion.ul
                    key="dropdown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
                    className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-white shadow-xl dark:bg-gray-800 dark:border-gray-700"
                  >
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        // Pass s.id directly to handleSelect
                        onMouseDown={() => handleSelect(s.id)}
                        className="cursor-pointer px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {s.name}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Add New Client Button */}
            <Button
              onClick={handleAddNewClient}
              className="h-11 whitespace-nowrap bg-[#07A950] hover:bg-[#057a3a] hover:cursor-pointer" // Added hover:bg-[#057a3a]
            >
              + Add new Client
            </Button>
          </div>

          {/* Panels */}
          {isLoading ? ( // Use the data loading state here
            <LoadingSkeleton />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <motion.div
              className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
              }}
            >
              {/* Stack Announcements and Queue */}
              <div className="flex flex-col gap-6">
                <Announcements />
                <Queue />
              </div>

              {/* ServiceLogs remain in its own column */}
              <ServiceLogs />
            </motion.div>
          )}
        </main>
      </Card>

      {/* Render AddClientForm, passing the onSuccess callback */}
      <AddClientForm
        open={isAddClientDialogOpen}
        onOpenChange={setIsAddClientDialogOpen}
        onSuccess={fetchDashboardData} // Pass the stable fetch function
      />
    </motion.div>
  );
}
