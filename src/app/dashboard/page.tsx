'use client';
import { DataTable as DataTableType, AGEGROUP } from "@/types/types";
import DataTable from "@/components/sheet/DataTable";
import ProfileCard from "@/components/ProfileCard";
import React from "react";
import { useIsExpanded } from "@/lib/atom";
import { cn, generateDataTableData } from "@/lib/utils"; // Import cn utility

// Sample data - replace with your actual data fetching logic
const defaultData: DataTableType[] = generateDataTableData(5).data

export default function Dashboard() {
  const [isExpanded, setIsExpanded] = useIsExpanded();
  return (
    <div className={cn('flex-col', isExpanded ? 'ml-80' : 'ml-30')}>
      <DataTable data={defaultData} />
      <ProfileCard />
    </div>
  )
}