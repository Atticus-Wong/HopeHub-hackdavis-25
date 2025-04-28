// app/api/generate-grant-report/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { generateGrantReport } from "@/lib/generate_grant_report";

export async function POST() {
  try {
    // Call the generateGrantReport function
    await generateGrantReport();

    // Read the generated PDF
    const pdfPath = path.resolve("FourthAndHope_Q1-2025.pdf");
    const pdfData = await fs.readFile(pdfPath);

    // Stream it back with the right headers
    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="FourthAndHope_Q1-2025.pdf"',
      },
    });
  } catch (error) {
    console.error("API error generating report:", error);
    return new NextResponse(
      JSON.stringify({ error: "Report generation failed." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
