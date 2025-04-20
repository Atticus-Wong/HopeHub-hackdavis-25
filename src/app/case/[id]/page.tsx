import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/* ──────────────────  Types  ────────────────── */

const categoryColors = {
  Housing: "bg-blue-100 text-blue-800",
  Health: "bg-green-100 text-green-800",
  Employment: "bg-purple-100 text-purple-800",
  Food: "bg-amber-100 text-amber-800",
} as const;

const statusColors = {
  Active: "bg-emerald-100 text-emerald-800",
  Pending: "bg-orange-100 text-orange-800",
  Closed: "bg-gray-100 text-gray-800",
} as const;

type Category = keyof typeof categoryColors;
type Status = keyof typeof statusColors;

interface CaseData {
  clientName: string;
  caseTitle: string;
  category: Category;
  status: Status;
  startDate: string;
  lastActivityDate: string;
  actionItems: string[];
  notes: string;
}

/* ──────────────────  Mock Data  ────────────────── */

const mockCases: Record<string, CaseData> = {
  "1": {
    clientName: "Maria Lopez",
    caseTitle: "Emergency Shelter Placement",
    category: "Housing",
    status: "Active",
    startDate: "2025-04-01",
    lastActivityDate: "2025-04-18",
    actionItems: ["Confirm shelter availability", "Schedule intake meeting"],
    notes: "Client has requested a shelter close to downtown.",
  },
  "2": {
    clientName: "John Thompson",
    caseTitle: "Mental Health Evaluation Referral",
    category: "Health",
    status: "Pending",
    startDate: "2025-03-29",
    lastActivityDate: "2025-04-17",
    actionItems: ["Follow up with clinic", "Send paperwork"],
    notes: "Awaiting confirmation from referred clinic.",
  },
};

/* ──────────────────  Page Component  ────────────────── */

export default function CaseDetails({ params }: { params: { id: string } }) {
  const caseData = mockCases[params.id];

  if (!caseData) {
    return <p className="p-6">Case not found</p>;
  }

  return (
    <main className="container mx-auto max-w-xl space-y-6 p-6">
      {/* Back link */}
      <Link href="/case" className="text-sm text-blue-600 hover:underline">
        ← Back to My Cases
      </Link>

      {/* Header */}
      <section>
        <h1 className="text-2xl font-semibold">{caseData.clientName}</h1>
        <p className="mb-2 text-gray-700">{caseData.caseTitle}</p>
        <div className="mb-4 flex gap-2">
          <Badge className={categoryColors[caseData.category]}>
            {caseData.category}
          </Badge>
          <Badge className={statusColors[caseData.status]}>
            {caseData.status}
          </Badge>
        </div>
      </section>

      {/* Dates */}
      <section className="space-y-2">
        <p>
          <span className="font-semibold">Date Started:</span>{" "}
          {caseData.startDate}
        </p>
        <p>
          <span className="font-semibold">Most Recent Activity Date:</span>{" "}
          {caseData.lastActivityDate}
        </p>
      </section>

      {/* Action Items */}
      <section>
        <p className="mb-2 font-semibold">Action Items:</p>
        <ul className="space-y-2">
          {caseData.actionItems.map((item, idx) => (
            <li
              key={idx}
              className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-800"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Notes */}
      <section>
        <p className="mb-1 font-semibold">Notes:</p>
        <div className="rounded bg-gray-200 p-4 text-sm text-gray-700">
          {caseData.notes}
        </div>
      </section>

      {/* Documents placeholder */}
      <section>
        <p className="font-semibold">Documents:</p>
        <p className="text-sm text-gray-500">No documents attached yet.</p>
      </section>
    </main>
  );
}
