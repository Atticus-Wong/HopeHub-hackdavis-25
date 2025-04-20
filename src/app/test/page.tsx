'use client';
import { Button } from "@/components/ui/button"
import { generateDataTableData } from "@/lib/utils"
import { SERVICES } from "@/types/enums"; // Import SERVICES enum if needed for transformation
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function Test() {

  const testFetchProfile = async () => {
    const response = await fetch('/api/fetchProfile?uuid=uuid-2-1745109832048')
    if (!response.ok) {
      console.error("Error fetching profile:", response.statusText)
      return
    }
    const data = await response.json()
    console.log("Fetched profile data:", data)
  }

  const handleWriteMockData = async () => {
    // Generate data using the utility function (returns DataTableType[] from @/types/types)
    const docRef = doc(db, "DataTable", 'worker')
    const generatedData = generateDataTableData(100)
    try {
      await setDoc(docRef, generatedData)
    } catch (error) {
      console.error("Error writing mock data to Firestore:", error)

    }
  }

  const handleFetchAllData = async () => {
    const response = await fetch('/api/fetchData')
    if (!response.ok) {
      console.error("Error fetching all data:", response.statusText)
      return
    }
    const data = await response.json()
    console.log("Fetched all data:", data)
  }
  return (
    <>
      <Button variant="default" onClick={handleWriteMockData}>mock firebase data</Button>
      <Button variant="default" onClick={testFetchProfile}>test fetchProfile</Button>
      <Button variant="default" onClick={handleFetchAllData}>test all data</Button>
    </>
  )
}