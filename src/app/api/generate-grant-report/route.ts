// app/api/generate-grant-report/route.ts
import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promises as fs } from "fs";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export async function POST() {
  try {
    // 1) Run your local script (make sure it's executable and on disk)
    //    You can also inline the logic here instead of shelling out.
    await execAsync(`node ${path.resolve("generate_grant_report.js")}`);

    // 2) Read the generated PDF
    const pdfPath = path.resolve("FourthAndHope_Q1-2025.pdf");
    const pdfData = await fs.readFile(pdfPath);

    // 3) Stream it back with the right headers
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
  } finally {
    // (Optional) Clean up .pdf if you like
    // await fs.unlink(path.resolve("FourthAndHope_Q1-2025.pdf")).catch(() => {});
  }
}
