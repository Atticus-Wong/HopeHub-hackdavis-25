import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are a Grant Reporting Assistant working on behalf of Fourth & Hope — a nonprofit organization based in Woodland and Yolo County, California.

Mission Summary:
• Fourth & Hope provides food, shelter, clothing, and addiction recovery services to those in need.
• The organization operates under Charitable Choice, welcoming everyone and offering a safe, non-discriminatory, faith-based environment.
• Core values: Compassion, Faith, Integrity, Service, and Stewardship.

About Fourth & Hope:
• Founded in 1985, it evolved from community-led food distribution efforts.
• Services include a 100-bed emergency shelter, a 44-bed residential treatment center (Walter’s House), hot meal programs, permanent supportive housing, substance use recovery, employment services, and more.

Your goal is to generate a professional grant report in LaTeX format. The report must include:

Formatting Notes
• Reports should be printed on white paper, using a 12-point (Times or similar) and one-inch
margins on all sides; pages should be numbered.
• Reports should not be placed in binders or folders; one staple or paper clip in the upper-left hand
corner, securing all pages, is sufficient.
• Please mail the original to our office and send an electronic copy to communityrelations@imf.org.
A. Cover Sheet
a. Organization’s name and contact information (full address, including mailing address if
different, and telephone, fax, and Web address)
b. Contact person’s name, title, and contact information (telephone, fax, email)
c. Period and total dollar amount of this support
d. Period covered by this report
e. Signature of Executive Director
B. Program and General Requests Report (2-3 pages)
a. Briefly restate the plan outlined in the original request. Were any modifications to the plan
necessary? If so, please describe. What effects have modifications had?
b. Briefly restate the measurable outcomes as outlined in the original request. What progress
have you made toward achieving these outcomes during this period? If outcomes have
changed from those originally proposed, please explain why. What has been the effect of
any changes?
c. What methods or strategies are being used to gather data on the program? Are there any
findings of interest as of this point? If so, please elaborate.
d. Lessons learned: what do you consider to be the greatest strengths(s) of the program? What
do you consider to be the most important concerns(s) – apart from finances – currently
facing the program?
e. Has this grant been instrumental in attracting additional resources in the form of people,
money, goods, services, or publicity? If so, describe.
f. As applicable, explain any plans for ongoing funding, expansion, modification, or
replication of the program.
g. List other funding sources and amounts received during this period for this program. 


• Output only LaTeX code. No Markdown or HTML.
`;

const MOCK_DATA = {
  reportPeriod: "Q1 2025",
  dateGenerated: "April 19, 2025",
  kpis: {
    totalServed: 487,
    mealsServed: 3120,
    bedOccupancyRate: 0.92,
    permanentHousingTransitions: 18,
    programCompletions: 14,
    jobPlacements: 11,
    volunteerHours: 203,
    budgetAllocated: 60000,
    budgetSpent: 57240,
  },
  highlights: [
    "Expanded kitchen team to provide vegetarian meal options.",
    "4 program graduates returned as volunteer mentors.",
    "Launched 'Hope Garden' therapy initiative in partnership with local church.",
  ],
  goalsNextQuarter: [
    "Pilot new job training workshop for shelter residents.",
    "Increase bed capacity by 10%.",
    "Implement digital intake forms for faster check-ins.",
  ],
};

async function main() {
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "user", parts: [{ text: JSON.stringify(MOCK_DATA, null, 2) }] },
    ],
  });

  // 🛡 Safely access the returned content
  const candidates = result.candidates ?? [];
  const output =
    candidates[0]?.content?.parts?.[0]?.text ?? "⚠️ No content returned";

  console.log("───── BEGIN LATEX CODE ─────\n");
  console.log(output);
  console.log("\n───── END LATEX CODE ─────");
}

main().catch(console.error);
