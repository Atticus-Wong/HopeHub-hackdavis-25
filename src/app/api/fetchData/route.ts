import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { NextRequest, NextResponse } from 'next/server'
import { DataTable as DataTableType } from '@/types/types'

export async function GET(req: NextRequest) {
  try {
    const docRef = doc(db, 'DataTable', 'worker')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const documentData = docSnap.data()
      return NextResponse.json(documentData, { status: 200 })
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
