import { fetchInsights } from "./actions";
import InsightCard from "@/components/analytics/InsightCard";
// import Charts from "@/components/analytics/Charts";
import { Suspense } from "react";

export const metadata = {
  title: "Analytics | Fourth & Hope",
};

export default async function AnalyticsPage() {
  const data = await fetchInsights();

  return (
    <main className="container mx-auto space-y-10 p-6">
      <h1 className="text-3xl font-bold">Analytics Overview</h1>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {data.kpis.map((k) => (
          <div
            key={k.label}
            className="rounded bg-gray-100 p-6 text-center shadow"
          >
            <p className="text-3xl font-semibold">{k.value}</p>
            <p className="text-sm text-gray-600">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <Suspense fallback={<p>Loading chart…</p>}>
        {/* <Charts data={data.byCategory} /> */}
      </Suspense>

      {/* Cerebrase Insight */}
      <InsightCard summary={data.summary} />
    </main>
  );
}
