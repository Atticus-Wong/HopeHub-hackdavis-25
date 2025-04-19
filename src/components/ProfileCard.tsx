'use client';

import { DataTable as DataTableType } from "@/types/types"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" // Import Card components

type ProfileCardProps = {
  data: DataTableType | null
}


export default function ProfileCard({ data }: ProfileCardProps) {
  return (
    // Use the Card component as the main container
    <Card className="w-[350px]"> {/* You might want to adjust width as needed */}
      <CardHeader>
        <CardTitle>{data?.name}</CardTitle>
        <CardDescription>{data?.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Age Group: {data?.ageGroup}</p>
        {/* Add more fields from 'data' as needed */}
        {/* Example: <p className="text-sm text-muted-foreground">Ethnicity: {data.ethnicity}</p> */}
        {/* Example: Display benefits if available */}
        {/* {data.benefits && data.benefits.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mt-2">Benefits:</h3>
            <ul>
              {data.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  Service {Object.values(benefit)[0]}
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </CardContent>
      {/* Optionally, add a CardFooter for actions or less important info */}
      {/* <CardFooter>
        <p>Last Updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
      </CardFooter> */}
    </Card>
  )
}