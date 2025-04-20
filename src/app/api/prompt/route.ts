import { Cerebras } from '@cerebras/cerebras_cloud_sdk'
import { NextRequest, NextResponse } from 'next/server' // Import NextResponse

export async function GET(request: NextRequest) {
  // Access the API key without the NEXT_PUBLIC_ prefix on the server
  const apiKey = process.env.CEREBRAS_API_KEY;

  if (!apiKey) {
    console.error("Cerebras API key is not defined in environment variables.");
    return NextResponse.json({ error: 'API key configuration error' }, { status: 500 });
  }

  const client = new Cerebras({
    apiKey: apiKey, // Use the variable without NEXT_PUBLIC_
  });

  try {
    const completionCreateResponse = await client.chat.completions.create({
      messages: [{ role: 'user', content: 'Why is fast inference important?' }],
      model: 'llama-4-scout-17b-16e-instruct',
    });

    // You need to return a NextResponse object
    return NextResponse.json(completionCreateResponse);

  } catch (error) {
    console.error("Error calling Cerebras API:", error);
    // Return a proper error response
    return NextResponse.json({ error: 'Failed to get completion from Cerebras' }, { status: 500 });
  }
}
