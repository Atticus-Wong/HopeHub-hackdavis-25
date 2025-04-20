import { GrantReportTool } from '@/lib/tools/grantReportTool';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Optional: Get input from the request body if needed
    // const body = await req.json();
    // const toolInput = body.input || "Default report generation instructions";

    // Hardcoded input for simplicity, same as before
    const toolInput = "Generate a comprehensive summary of client services for the last quarter, highlighting key trends and service utilization numbers.";

    // Instantiate the tool (runs server-side, safely accesses env vars)
    const grantTool = new GrantReportTool();

    // Invoke the tool
    const result = await grantTool.invoke(toolInput);

    // Return the successful result
    return NextResponse.json({ reportContent: result });

  } catch (err) {
    console.error("[API Generate Report Error]:", err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    // Return an error response
    return NextResponse.json({ error: `Failed to generate report: ${errorMessage}` }, { status: 500 });
  }
}

// Optional: Add a GET handler if you prefer, adjusting how input is passed
// export async function GET(req: NextRequest) { ... }