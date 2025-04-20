import { NextRequest } from 'next/server'
import { getAuth } from 'firebase/auth'
import { NextResponse } from 'next/server'
import { db } from '@/firebase/config'
import { doc, getDoc, setDoc } from 'firebase/firestore'
export default async function PUT(req: NextRequest) {
  const auth = getAuth()
  if (!auth.currentUser) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const uuid = searchParams.get('uuid')
  const profileInfo = req.json()

  try {
    const docRef = doc(db, 'DataTable', profileInfo.uuid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const documentData = docSnap.data()
      const profilesArray = documentData.data

      if (profilesArray) {
        const foundProfile = profilesArray.find(
          (item: { uuid: string }) => item.uuid === uuid
        )

        if (foundProfile) {
          const updatedProfile = await req.json()
          Object.assign(foundProfile, updatedProfile)

          await setDoc(docRef, { data: profilesArray })

          return NextResponse.json(foundProfile, { status: 200 })
        } else {
          return NextResponse.json(
            { error: `Profile with UUID ${uuid} not found` },
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
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
