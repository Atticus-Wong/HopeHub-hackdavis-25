"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Menu, Search } from "lucide-react";

/* ──────────────────  Types  ────────────────── */

interface Case {
  id: string;
  clientName: string;
  caseTitle: string;
  daysIntake: number;
  category: string;
  status: string;
  startDate: string;
  lastActivityDate: string;
  actionItems: string[];
  notes: string;
}

/* ──────────────────  Mock Data  ────────────────── */

const cases: Case[] = [
  {
    id: "1",
    clientName: "Maria Lopez",
    caseTitle: "Emergency Shelter Placement",
    daysIntake: 3,
    category: "Housing",
    status: "Active",
    startDate: "2025-04-01",
    lastActivityDate: "2025-04-18",
    actionItems: ["Confirm shelter availability", "Schedule intake meeting"],
    notes: "Client has requested a shelter close to downtown.",
  },
  {
    id: "2",
    clientName: "John Thompson",
    caseTitle: "Mental Health Evaluation Referral",
    daysIntake: 12,
    category: "Health",
    status: "Pending",
    startDate: "2025-03-29",
    lastActivityDate: "2025-04-17",
    actionItems: ["Follow up with clinic", "Send paperwork"],
    notes: "Awaiting confirmation from referred clinic.",
  },
];

/* ──────────────────  Color Maps  ────────────────── */

const categoryColors: Record<string, string> = {
  Housing: "bg-blue-100 text-blue-800",
  Health: "bg-green-100 text-green-800",
  Employment: "bg-purple-100 text-purple-800",
  Food: "bg-amber-100 text-amber-800",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Pending: "bg-orange-100 text-orange-800",
  Closed: "bg-gray-100 text-gray-800",
};

/* ──────────────────  Component  ────────────────── */

export default function CaseManagement() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 lg:px-8">
        <div className="text-xl font-semibold text-blue-600">
          Fourth &amp; Hope
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Staff" />
            <AvatarFallback>FH</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Staff placeholder */}
        <div className="mb-6">
          <div className="h-8 w-48 rounded bg-white-900" />
          <text>Hi, Admin</text>
        </div>

        <div className="space-y-6">
          {/* Header row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold">My Cases</h1>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search cases..."
                className="pl-8"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => router.push(`/case/${item.id}`)}
              >
                <Card className="cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="bg-gray-200 p-4">
                      {/* title row */}
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.clientName}</h3>
                          <p className="text-sm text-gray-700">
                            {item.caseTitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-700">
                            Days since intake
                          </p>
                          <p className="font-medium">{item.daysIntake}</p>
                        </div>
                      </div>

                      {/* badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={categoryColors[item.category] || ""}>
                          {item.category}
                        </Badge>
                        <Badge className={statusColors[item.status] || ""}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
