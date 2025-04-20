import { NextRequest } from 'next/server'
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

export default async function GET(req: NextRequest) {
  try {
    const docRef = doc(db, 'BaseQueue', 'Shower')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const documentData = docSnap.data()
      return new Response(JSON.stringify(documentData), { status: 200 })
    }
    return new Response('Document not found', { status: 404 })
  } catch (error) {
    console.error('Error fetching data:', error)
    return new Response('Failed to fetch data', { status: 500 })
  }
}
