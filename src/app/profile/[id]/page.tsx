import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* Mock profiles keyed by id */
const PROFILES: Record<
  string,
  { name: string; details: string; joined: string }
> = {
  "1": {
    name: "Jane Doe",
    details:
      "Regular guest. Prefers morning showers and vegetarian meals. Working towards housing assistance.",
    joined: "Jan 2024",
  },
  "2": {
    name: "Bob Dylan",
    details:
      "Visits primarily for meals. Interested in resume‑building workshops.",
    joined: "Mar 2024",
  },
  "3": {
    name: "Atticus",
    details:
      "Uses printing services weekly for job applications. Awaiting case‑management appointment.",
    joined: "Feb 2025",
  },
  /* …add more as needed… */
};

interface Props {
  params: { id: string };
}

export default function Profile({ params }: Props) {
  const profile = PROFILES[params.id];
  if (!profile) notFound();

  return (
    <main className="container mx-auto max-w-xl p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="text-sm text-gray-500">
                Client since {profile.joined}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{profile.details}</p>
        </CardContent>
      </Card>
    </main>
  );
}
