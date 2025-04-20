/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu } from "lucide-react";

// /* ─── Mock client directory (id + name) ─── */
// const CLIENTS = [
//   { id: "1", name: "Jane Doe" },
//   { id: "2", name: "Bob Dylan" },
//   { id: "3", name: "Atticus" },
//   { id: "4", name: "Marla" },
//   { id: "5", name: "Zed" },
//   { id: "6", name: "Angela" },
//   { id: "7", name: "David" },
//   { id: "8", name: "Arjun" },
//   { id: "9", name: "Maya" },
// ];

/* ─── Dashboard mock panels ─── */
const MOCK_ANNOUNCEMENTS = [
  {
    title: "Winter Shelter Hours Update",
    content:
      "Starting next week, the Winter Shelter will be open from 6 PM to 8 AM daily. Please make sure all clients are informed during intake.",
  },
  {
    title: "Staff Meeting on Friday",
    content:
      "A brief team sync will be held in the break room at 4 PM. Topics include updated check‑in procedures and volunteer scheduling.",
  },
];
const MOCK_LOGS = [
  { name: "Jane Doe", service: "Shower", time: "12:41 PM" },
  { name: "Bob Dylan", service: "Meal", time: "12:41 PM" },
  { name: "Atticus", service: "Printing", time: "12:41 PM" },
];
const MOCK_QUEUES = {
  Showers: [
    { name: "Marla", wait: "24 min" },
    { name: "Zed", wait: "24 min" },
    { name: "Angela", wait: "24 min" },
  ],
  Meals: [
    { name: "David", wait: "24 min" },
    { name: "Arjun", wait: "15 min" },
    { name: "Maya", wait: "47 min" },
  ],
};

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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/fetchData");
        if (!response.ok) {
          console.error("Error fetching all data:", response.statusText);
          return;
        }
        const data = await response.json();
        console.log("Fetched all data:", data);

        const list = data.map((user: any) => ({
          id: user.id,
          name: user.name,
        }));

        setDirectory(list);
      } catch (err) {
        console.error("Failed to fetch directory:", err);
      }
    };
    fetchClients();
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Nav */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 lg:px-8 shadow-sm"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-xl font-semibold text-blue-600"
        >
          Fourth & Hope
        </motion.div>
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4 } }}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Staff" />
            <AvatarFallback>FH</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="relative overflow-hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </motion.div>
      </motion.header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Search */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative mx-auto mb-10 w-full max-w-3xl"
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
            className="h-12 rounded-full px-5 shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <AnimatePresence>
            {dropdown && suggestions.length > 0 && (
              <motion.ul
                key="dropdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
                className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-md border bg-white shadow-xl"
              >
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onMouseDown={() => handleSelect(s.id)}
                    className="cursor-pointer px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {s.name}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Panels */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* Announcements */}
          <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }}>
            <Card className="overflow-hidden shadow-md">
              <CardHeader className="bg-white pb-2">
                <CardTitle className="text-lg">Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-gray-100 p-4">
                {MOCK_ANNOUNCEMENTS.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="rounded border-l-4 border-gray-900 bg-white p-4 shadow-sm"
                  >
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    <p className="mt-1 text-sm text-gray-700">{a.content}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* My Service Logs */}
          <motion.div variants={fadeUp} whileHover={{ scale: 1.02 }}>
            <Card className="overflow-hidden shadow-md">
              <CardHeader className="bg-gray-100 pb-2">
                <CardTitle className="text-lg">My Service Logs</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-100 p-0">
                <div className="divide-y divide-gray-200">
                  {MOCK_LOGS.map((l, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-4"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <div>{`${l.name}, ${l.service}`}</div>
                      <div className="text-gray-500">{l.time}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Queues */}
          <motion.div className="flex flex-col gap-6" variants={fadeUp}>
            <h2 className="mb-2 text-xl font-semibold">Queues</h2>
            {Object.entries(MOCK_QUEUES).map(([queueName, list]) => (
              <motion.div key={queueName} whileHover={{ scale: 1.02 }}>
                <Card className="overflow-hidden shadow-md">
                  <CardHeader className="bg-gray-100 pb-2">
                    <CardTitle className="text-lg">{queueName}</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-gray-100 p-0">
                    <div className="divide-y divide-gray-200">
                      {list.map((e, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center justify-between p-4"
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: i * 0.08 }}
                        >
                          <div>{e.name}</div>
                          <div className="text-gray-500">{`waiting for ${e.wait}`}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
