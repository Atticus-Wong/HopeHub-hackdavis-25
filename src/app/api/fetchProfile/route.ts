import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { NextRequest, NextResponse } from 'next/server'
import { DataTable as DataTableType } from '@/types/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const uuid = searchParams.get('uuid')

  if (!uuid) {
    return NextResponse.json({ error: 'UUID is required' }, { status: 400 })
  }
  try {
    const docRef = doc(db, 'DataTable', 'worker')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const documentData = docSnap.data()
      const profilesArray = documentData.data as DataTableType[] | undefined

      if (profilesArray) {
        const foundProfile = profilesArray.find(
          (item: DataTableType) => item.uuid === uuid
        )

        if (foundProfile) {
          return NextResponse.json(foundProfile, { status: 200 })
        } else {
          return NextResponse.json(
            {
              error: `Profile with UUID ${uuid} not found in the profiles array`,
            },
            { status: 404 }
          )
        }
      } else {
        return NextResponse.json(
          { error: "Profiles array field not found in document 'worker'" },
          { status: 404 }
        )
      }
    } else {
      return NextResponse.json(
        { error: "Document 'worker' not found!" },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
