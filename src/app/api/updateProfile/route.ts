import { NextRequest } from 'next/server'
import { getAuth } from 'firebase/auth'
import { NextResponse } from 'next/server'

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
  

}
