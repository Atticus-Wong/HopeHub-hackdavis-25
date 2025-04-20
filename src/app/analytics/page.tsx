'use client';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';

export default function Analytics() {
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      setLoading(true);
      setError(null);
      setReportContent(null);

      try {
        // Fetch the report content from the new API route
        const response = await fetch('/api/generateReport', {
          method: 'POST', // Use POST as defined in the API route
          headers: {
            'Content-Type': 'application/json',
          },
          // Optional: Send input if the API route expects it
          // body: JSON.stringify({ input: "Your specific instructions here" })
        });

        if (!response.ok) {
          // Try to parse error message from response body
          let errorData;
          try {
            errorData = await response.json();
          } catch (parseError) {
            // Fallback if response is not JSON
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
          }
          throw new Error(errorData.error || `API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
           throw new Error(data.error);
        }

        setReportContent(data.reportContent);
        console.log("Generated report content:", data.reportContent);

      } catch (err) {
        console.error("Error fetching report from API:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching the report.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, []); // Run once on component mount

  const handleGeneratePdf = () => {
    if (!reportContent) {
      alert("No report content available to generate PDF.");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text("Grant Report Section", 10, 10);
      const splitText = doc.splitTextToSize(reportContent, 180);
      doc.text(splitText, 10, 20);
      doc.save("grant-report-section.pdf");
    } catch (pdfError) {
      console.error("Error generating PDF:", pdfError);
      alert("Failed to generate PDF. See console for details.");
    }
  };

  // Determine what content to display based on state
  let contentDisplay;
  if (loading) {
    contentDisplay = <p>Generating report...</p>;
  } else if (error) {
    contentDisplay = <p style={{ color: 'red' }}>Error: {error}</p>;
  } else if (reportContent) {
    contentDisplay = (
      <>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'monospace', border: '1px solid #ccc', padding: '10px', background: '#f9f9f9' }}>
          {reportContent}
        </pre>
        <Button onClick={handleGeneratePdf} className="mt-4">
          Download Report as PDF
        </Button>
      </>
    );
  } else {
    contentDisplay = <p>No report generated or an issue occurred.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generated Grant Report Section</h1>
      {contentDisplay}
    </div>
  );
}