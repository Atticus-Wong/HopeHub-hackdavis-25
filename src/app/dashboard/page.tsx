'use client';
import { DataTable as DataTableType, AGEGROUP } from "@/types/types";
import DataTable from "@/components/sheet/DataTable";
import ProfileCard from "@/components/ProfileCard";
import React from "react";

// Sample data - replace with your actual data fetching logic
const defaultData: DataTableType[] = [
  { uuid: "1", name: "Alice", gender: 'Male', ethnicity: "Caucasian", ageGroup: AGEGROUP.ADULT, benefits: [{ SERVICES: 1 }], location: "City A", createAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { uuid: "2", name: "Bob", gender: 'Male', ethnicity: "Hispanic", ageGroup: AGEGROUP.SENIOR, benefits: [{ SERVICES: 2 }], location: "City B", createAt: new Date().toISOString(), updatedAt: new Date().toISOString(), },
  { uuid: "3", name: "Charlie", gender: 'Male', ethnicity: "Asian", ageGroup: AGEGROUP.MINOR, benefits: [], location: "City C", createAt: new Date().toISOString(), updatedAt: new Date().toISOString(), },
  { uuid: "4", name: "Diana", gender: 'Male', ethnicity: "African American", ageGroup: AGEGROUP.ADULT, benefits: [{ SERVICES: 1 }, { SERVICES: 3 }], location: "City D", createAt: new Date().toISOString(), updatedAt: new Date().toISOString(), },
];

export default function Dashboard() {
  const [profileCardData, setProfileCardData] = React.useState<DataTableType | null>(defaultData[0]);
  return (
    <>
      <DataTable data={defaultData} />
      <ProfileCard data={profileCardData} />
    </>
  )
}