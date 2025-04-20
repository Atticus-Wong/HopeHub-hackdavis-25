/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

/* ───────────── Types ───────────── */

type ServiceRow = {
  type: string;
  quantity: number;
  time: string;
  date: string;
  status: "In Queue" | "Completed";
};

type MedicationRow = {
  type: string;
  time: string;
  date: string;
  status: "Awaiting" | "Completed";
};

type ClientDoc = {
  name: string;
  ageGroup: string;
  gender?: string;
  ethnicity?: string;
  services: ServiceRow[];
  meds: MedicationRow[];
};

/* ───────────── Mock Data ───────────── */

const MOCK_SERVICES: ServiceRow[] = [
  {
    type: "SHOWER",
    quantity: 6,
    time: "3:22 PM",
    date: "04/17/25",
    status: "In Queue",
  },
  {
    type: "LAUNDRY",
    quantity: 10,
    time: "9:05 AM",
    date: "03/29/25",
    status: "In Queue",
  },
  {
    type: "MNGMT",
    quantity: 4,
    time: "6:47 PM",
    date: "04/06/25",
    status: "In Queue",
  },
];

const MOCK_MEDICATIONS: MedicationRow[] = [
  { type: "Ibuprofen", time: "8:00 AM", date: "04/20/25", status: "Awaiting" },
  {
    type: "Paracetamol",
    time: "12:00 PM",
    date: "04/20/25",
    status: "Completed",
  },
  {
    type: "Amoxicillin",
    time: "6:00 PM",
    date: "04/20/25",
    status: "Awaiting",
  },
];

/* ───────────── Page Component ───────────── */

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientDoc | null>(null);

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [meds, setMeds] = useState<MedicationRow[]>([]);

  /* fetch client once */
  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "DataTable", id));
      if (!snap.exists()) {
        notFound();
        return;
      }
      const raw = snap.data() as any;

      setClient({
        name: raw.name,
        ageGroup: raw.ageGroup,
        gender: raw.gender,
        ethnicity: raw.ethnicity,
        services: MOCK_SERVICES,
        meds: MOCK_MEDICATIONS,
      });
      setServices(MOCK_SERVICES);
      setMeds(MOCK_MEDICATIONS);
      setLoading(false);
    })();
  }, [id]);

  /* status handlers */
  const updateServiceStatus = (
    type: string,
    status: "In Queue" | "Completed"
  ) =>
    setServices((prev) =>
      prev.map((s) => (s.type === type ? { ...s, status } : s))
    );

  const updateMedStatus = (type: string, status: "Awaiting" | "Completed") =>
    setMeds((prev) =>
      prev.map((m) => (m.type === type ? { ...m, status } : m))
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-muted-foreground">Loading profile…</p>
      </div>
    );

  if (!client) return null;

  return (
    <div className="min-h-screen bg-[#f2fae8] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Card className="mb-6 overflow-hidden rounded-xl border-0 shadow-sm">
          <CardHeader className="bg-[#3c7d4d] p-6 text-white">
            <h1 className="text-2xl font-medium">{client.name}</h1>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Demographics */}
          <Card className="rounded-xl border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">
                Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <Demographic label="Age‑Group" value={client.ageGroup} />
                <Demographic label="Gender" value={client.gender ?? "—"} />
                <Demographic
                  label="Ethnicity"
                  value={client.ethnicity ?? "—"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <ServicesCard
            services={services}
            onStatusChange={updateServiceStatus}
          />

          {/* Medications */}
          <MedicationsCard meds={meds} onStatusChange={updateMedStatus} />
        </div>
      </div>
    </div>
  );
}

/* ───────────── Helper Components ───────────── */

function Demographic({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-medium text-sm text-muted-foreground">{label}</span>
      <span className="text-lg">{value}</span>
    </div>
  );
}

function StatusSelect<T extends string>({
  status,
  options,
  onChange,
}: {
  status: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as T)}
      className={`rounded-full px-3 py-1 text-sm font-medium appearance-none cursor-pointer border-0 pr-6 bg-opacity-30 ${
        status === "Completed"
          ? "bg-[#e3f9d5] text-[#4b8e16]"
          : "bg-[#fff3c2] text-[#f5c842]"
      }`}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

/* ───────────── Services Card ───────────── */

function ServicesCard({
  services,
  onStatusChange,
}: {
  services: ServiceRow[];
  onStatusChange: (type: string, status: "In Queue" | "Completed") => void;
}) {
  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Services</CardTitle>
        <Button className="bg-[#8bbd45] text-white hover:bg-[#7aa93e]">
          <Plus className="mr-1 h-4 w-4" /> New Request
        </Button>
      </CardHeader>
      <CardContent>
        {services.length ? (
          <table className="w-full rounded-md border overflow-hidden">
            <thead className="bg-[#d6dce5]">
              <tr>
                {["Type", "Qty", "Time", "Date", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.type} className="border-t">
                  <td className="px-4 py-3">{s.type}</td>
                  <td className="px-4 py-3">{s.quantity}</td>
                  <td className="px-4 py-3">{s.time}</td>
                  <td className="px-4 py-3">{s.date}</td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      status={s.status}
                      options={["In Queue", "Completed"]}
                      onChange={(val) => onStatusChange(s.type, val)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty label="No active service requests." />
        )}
      </CardContent>
    </Card>
  );
}

/* ───────────── Medications Card ───────────── */

function MedicationsCard({
  meds,
  onStatusChange,
}: {
  meds: MedicationRow[];
  onStatusChange: (type: string, status: "Awaiting" | "Completed") => void;
}) {
  return (
    <Card className="rounded-xl border-0 shadow-sm md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Medications</CardTitle>
        <Button className="bg-[#8bbd45] text-white hover:bg-[#7aa93e]">
          <Plus className="mr-1 h-4 w-4" /> New Medication
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="mb-4 grid w-full max-w-[200px] grid-cols-2 bg-[#e9e9e9]">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-[#8bbd45] data-[state=active]:text-white"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#8bbd45] data-[state=active]:text-white"
            >
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            {meds.length ? (
              <table className="w-full rounded-md border overflow-hidden">
                <thead className="bg-[#d6dce5]">
                  <tr>
                    {["Type", "Time", "Date", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {meds.map((m) => (
                    <tr key={m.type} className="border-t">
                      <td className="px-4 py-3">{m.type}</td>
                      <td className="px-4 py-3">{m.time}</td>
                      <td className="px-4 py-3">{m.date}</td>
                      <td className="px-4 py-3">
                        <StatusSelect
                          status={m.status}
                          options={["Awaiting", "Completed"]}
                          onChange={(val) => onStatusChange(m.type, val)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Empty label="No medications scheduled for today." />
            )}
          </TabsContent>

          <TabsContent value="history">
            <Empty label="Medication history will be displayed here." />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

/* ───────────── Small Utility ───────────── */

function Empty({ label }: { label: string }) {
  return (
    <div className="p-8 text-center text-sm text-muted-foreground">{label}</div>
  );
}
