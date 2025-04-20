/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import AddClientForm from "@/components/AddClientForm"; // Import the form component

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

type ClientLite = { id: string; name: string };

export default function Dashboard() {
  const [term, setTerm] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [directory, setDirectory] = useState<ClientLite[]>([]);
  const router = useRouter();
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false); // State for the dialog

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [clientListData, logsData] = await Promise.all([
          handleFetchData().catch(err => { console.error("Error fetching directory:", err); return undefined; }),
          fetch('/api/fetchServiceLogs').then(res => res.ok ? res.json() : Promise.reject(res)).catch(err => { console.error("Error fetching logs:", err); return { logs: [] }; }),
        ]);

        if (clientListData) {
          setDirectory(clientListData);
        } else {
          setDirectory([]);
        }

        setLogs(logsData?.logs || []);

      } catch (err) {
        console.error("Error during initial data fetch:", err);
        setError("Failed to load dashboard data.");
        setDirectory([]);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Update handleAddNewClient to open the dialog
  const handleAddNewClient = () => {
    setIsAddClientDialogOpen(true); // Set state to true to open the dialog
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
              Hello, Placeholder name
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

            {/* Add New Client Button - onClick now triggers the state change */}
            <Button onClick={handleAddNewClient} className="h-11 whitespace-nowrap">
              + Add new Client
            </Button>
          </div>

          {/* Panels */}
          {isLoading ? (
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

      {/* Render the AddClientForm, passing the state and handler */}
      <AddClientForm open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen} />

    </motion.div>
  );
}
