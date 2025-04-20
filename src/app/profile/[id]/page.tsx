/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation"; // Import useRouter
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // Import auth functions
import { db, auth } from "@/firebase/config"; // Import auth instance
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ChevronLeft } from "lucide-react"; // Import ChevronLeft
import NewRequestForm from "@/components/NewRequestForm";
import { SERVICES } from "@/types/enums";

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
  const router = useRouter(); // Get router instance
  const [user, setUser] = useState<User | null>(null); // Store user object
  const [authLoading, setAuthLoading] = useState(true); // Loading state for auth check
  const [loading, setLoading] = useState(true); // Loading state for client data
  const [client, setClient] = useState<ClientDoc | null>(null);

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [meds, setMeds] = useState<MedicationRow[]>([]);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("Profile Page: User is authenticated:", currentUser.uid);
      } else {
        setUser(null);
        console.log("Profile Page: User not authenticated, redirecting to login.");
        router.push('/login'); // Redirect if not logged in
      }
      setAuthLoading(false); // Auth check complete
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  /* fetch client data only if authenticated */
  useEffect(() => {
    // Only fetch if auth check is done and user is authenticated
    if (!authLoading && user) {
      setLoading(true); // Start loading client data
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
          services: MOCK_SERVICES, // Replace with actual data if available
          meds: MOCK_MEDICATIONS,   // Replace with actual data if available
        });
        setServices(MOCK_SERVICES); // Replace with actual data if available
        setMeds(MOCK_MEDICATIONS);   // Replace with actual data if available
        setLoading(false); // Client data loaded
      })();
    } else if (!authLoading && !user) {
        // If auth check is done and user is not logged in,
        // ensure data loading state is false as fetch won't happen.
        setLoading(false);
    }
  }, [id, authLoading, user]); // Depend on auth state and user

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

  const handleNewRequestSubmit = (serviceType: SERVICES, note: string) => {
    console.log("New Request Submitted:", { serviceType, note, clientId: id });

    setServices((prevServices) => {
      // Find if a service of the same type already exists and is "In Queue"
      const existingServiceIndex = prevServices.findIndex(
        (s) => s.type === serviceType && s.status === "In Queue"
      );

      if (existingServiceIndex !== -1) {
        // If found, increment the quantity of the existing service
        return prevServices.map((s, index) =>
          index === existingServiceIndex
            ? { ...s, quantity: s.quantity + 1 } // Increment quantity
            : s
        );
      } else {
        // If not found, create a new request object
        const newRequest: ServiceRow = {
          type: serviceType,
          quantity: 1, // Start with quantity 1
          time: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
          date: new Date().toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          }),
          status: "In Queue",
        };
        // Add the new request to the beginning of the array
        return [newRequest, ...prevServices];
      }
    });

    setIsRequestFormOpen(false); // Close the form
  };

  // Show loading indicator while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  // If not authenticated, the redirect should have happened, but return null just in case.
  // Also show loading while fetching client data.
  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-muted-foreground">Loading profile…</p>
      </div>
    );
  }

  // If client data failed to load after auth check (e.g., notFound was called but didn't redirect fully yet)
  if (!client) return null;

  // Render profile page only if authenticated and client data is loaded
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f7e9] to-[#c8e6c9] p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Go Back Button */}
        <Button
          variant="link"
          className="mb-4 text-muted-foreground hover:text-foreground px-0 hover:cursor-pointer"
          onClick={() => router.push('/dashboard')} // Navigate to dashboard
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Go back to dashboard
        </Button>

        {/* Header */}
        <Card className="mb-6 overflow-hidden bg-[#06803D] rounded-xl border-lg shadow-sm">
          <CardHeader className="text-white">
            <h1 className="text-2xl font-medium">{client.name}</h1>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Column 1: Demographics and Medications */}
          <div className="flex flex-col gap-6"> {/* Changed gap to 6 to match grid */}
            {/* Demographics */}
            <Card className="rounded-xl border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">
                  Demographics
                </CardTitle>
                {/* Add Edit Button */}
                <Button className="bg-green-200 text-green-800 hover:bg-green-300">
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                {/* Adjust grid layout for a more rectangular feel */}
                <div className="grid grid-cols-3 gap-x-6 gap-y-4 pt-2">
                  <Demographic label="Age‑Group" value={client.ageGroup} />
                  <Demographic label="Gender" value={client.gender ?? "—"} />
                  <Demographic
                    label="Ethnicity"
                    value={client.ethnicity ?? "—"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <MedicationsCard meds={meds} onStatusChange={updateMedStatus} />
          </div>

          {/* Column 2: Services */}
          <ServicesCard
            services={services}
            onStatusChange={updateServiceStatus}
            onNewRequestClick={() => setIsRequestFormOpen(true)}
          />
        </div>
      </div>

      <NewRequestForm
        open={isRequestFormOpen}
        onOpenChange={setIsRequestFormOpen}
        onSubmit={handleNewRequestSubmit}
      />
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
      className={`rounded-full px-3 py-1 text-sm font-medium appearance-none cursor-pointer border-0 pr-6 bg-opacity-70 ${status === "Completed"
        ? "bg-green-100 text-green-800"
        : "bg-amber-100 text-amber-800"
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
  onNewRequestClick,
}: {
  services: ServiceRow[];
  onStatusChange: (type: string, status: "In Queue" | "Completed") => void;
  onNewRequestClick: () => void;
}) {
  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Services</CardTitle>
        <Button
          className="bg-green-200 text-green-800 hover:bg-green-300"
          onClick={onNewRequestClick}
        >
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
        <Button className="bg-green-200 text-green-800 hover:bg-green-300">
          <Plus className="mr-1 h-4 w-4" /> New Medication
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="mb-4 grid w-full max-w-[200px] grid-cols-2 bg-gray-200">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-green-200 data-[state=active]:text-green-800"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-green-200 data-[state=active]:text-green-800"
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
