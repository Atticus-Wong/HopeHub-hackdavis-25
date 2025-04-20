// app/analytics/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      // Initiate grant report generation API call
      const res = await fetch("/api/generate-grant-report", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Server responded ${res.status}`);
      }

      // Receive PDF blob and trigger download
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "FourthAndHope_Q1-2025.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("🛑 Report generation failed:", error);
      alert(
        "We encountered an issue generating your grant report. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h1 className="text-2xl font-semibold mb-6">Analytics Dashboard</h1>
      <p className="mb-4 text-gray-700">
        Click the button below to generate your quarterly grant report.
      </p>
      <Button
        onClick={handleGenerateReport}
        disabled={isLoading}
        className="px-6 py-3"
      >
        {isLoading ? "Generating Report…" : "Generate Grant Report"}
      </Button>
    </div>
  );
}
