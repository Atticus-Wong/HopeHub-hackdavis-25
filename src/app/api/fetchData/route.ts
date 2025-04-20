import { collection, getDocs } from 'firebase/firestore' // Import collection and getDocs
import { db } from '@/firebase/config'
import { NextRequest, NextResponse } from 'next/server'
import { DataTable as DataTableType } from '@/types/types'

export async function GET(req: NextRequest) {
  try {
    // Get a reference to the 'DataTable' collection
    const collectionRef = collection(db, 'DataTable')
    // Fetch all documents in the collection
    const querySnapshot = await getDocs(collectionRef)

    const allData: DataTableType[] = [] // Assuming DataTableType is the structure of your documents
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      allData.push({ uuid: doc.id, ...doc.data() } as DataTableType) // Add document ID and data
    })

    return NextResponse.json(allData, { status: 200 })
  } catch (error) {
    console.error('Error fetching data:', error) // Corrected error message
    return NextResponse.json(
      { error: 'Failed to fetch data' }, // Corrected error message
      { status: 500 }
    )
  }
}
