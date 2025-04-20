import { doc, setDoc } from 'firebase/firestore'
import { NextRequest } from 'next/server'
import { db } from '@/firebase/config'

export default async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, name, uuid, createdAt } = body

    const docRef = doc(db, 'BaseQueue', type)
    await setDoc(docRef, type)
    return new Response('Queue updated successfully', { status: 200 })
  } catch (error) {
    console.error('Error updating queue:', error)
    return new Response('Failed to update queue', { status: 500 })
  }
}
