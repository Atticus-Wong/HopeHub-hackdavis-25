import { Tool } from "@langchain/core/tools";
import Cerebras from '@cerebras/cerebras_cloud_sdk'; // Assuming this is the correct import path
import { DataTable } from '@/types/types'; // Make sure this path and type are correct

// Initialize Cerebras client
// TODO: Replace placeholders with your actual API key and URL, ideally from environment variables
const cerebrasApiKey = process.env.CEREBRAS_API_KEY || 'YOUR_CEREBRAS_API_KEY';
const cerebrasApiUrl = process.env.CEREBRAS_API_URL || 'YOUR_CEREBRAS_API_URL'; // Check if SDK needs this explicitly

if (!cerebrasApiKey || cerebrasApiKey === 'YOUR_CEREBRAS_API_KEY') {
    console.warn("Cerebras API key is not set. Please set the CEREBRAS_API_KEY environment variable or update the placeholder.");
    // Depending on your setup, you might want to throw an error here if the key is essential
}

const cerebras = new Cerebras({
    apiKey: cerebrasApiKey,
    // apiUrl: cerebrasApiUrl, // Include if the SDK requires the API URL explicitly during initialization
    // Add any other necessary configuration based on Cerebras SDK docs
});

export class GrantReportTool extends Tool {
    name = "grant_report_generator";
    description = "Generates a grant report section based on aggregated homeless shelter service data. Input should be a summary of data or instructions for data aggregation and focus.";
    // Optional: Define a schema for structured input if needed later
    // inputSchema = z.object({ ... });

    constructor() {
        super();
        // You can add initialization logic here if needed
    }

    /**
     * Fetches service data from the internal API.
     * @returns {Promise<DataTable[]>} A promise that resolves to an array of service data records.
     */
    private async fetchServiceData(): Promise<DataTable[]> {
        try {
            // TODO: Replace with your actual API endpoint
            const response = await fetch('/api/fetchData');
            if (!response.ok) {
                throw new Error(`Failed to fetch service data: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            // Optional: Add validation here to ensure data matches DataTable[] structure
            return data as DataTable[];
        } catch (error) {
            console.error("Error fetching service data:", error);
            throw new Error(`Could not fetch service data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Processes raw service data into a summary string suitable for the report prompt.
     * @param {DataTable[]} data - The raw service data.
     * @returns {string} A summary string of the aggregated data.
     */
    private processDataForReport(data: DataTable[]): string {
        if (!data || data.length === 0) {
            return "No service data available to process.";
        }

        const totalClients = data.length;
        const serviceCounts: { [key: string]: number } = {};
        let uniqueClientsServed = 0; // Example: Count unique clients if data structure allows

        data.forEach(client => {
            // Assuming each entry in 'data' represents a client interaction or record
            uniqueClientsServed++; // Adjust if structure is different (e.g., unique client IDs)

            // Aggregate benefits/services
            if (client.benefits && Array.isArray(client.benefits)) {
                client.benefits.forEach(benefit => {
                    // Assuming benefit has 'name' and 'value' or similar structure
                    // Adjust logic based on actual DataTable structure
                    const serviceName = benefit.name || 'Unknown Service';
                    const count = typeof benefit.value === 'number' ? benefit.value : 1; // Handle different value types
                    serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + count;
                });
            }
            // TODO: Add aggregation for demographics, outcomes, etc. based on DataTable structure
        });

        let summary = `Summary of Services Provided:\n`;
        summary += `- Total clients records processed: ${totalClients}\n`;
        // summary += `- Unique clients served: ${uniqueClientsServed}\n`; // Uncomment if applicable

        summary += `Service Utilization Breakdown:\n`;
        if (Object.keys(serviceCounts).length > 0) {
            for (const [service, count] of Object.entries(serviceCounts)) {
                summary += `  - ${service}: ${count} instances\n`;
            }
        } else {
            summary += `  - No specific services recorded or aggregated.\n`;
        }

        // Add more aggregated data as needed (demographics, outcomes, trends, etc.)

        return summary;
    }

    /**
     * The main method called by LangChain to execute the tool.
     * @param {string} input - User instructions or context for the report section.
     * @returns {Promise<string>} A promise that resolves to the generated grant report section string.
     */
    async _call(input: string): Promise<string> {
        try {
            console.log(`GrantReportTool received input: "${input}"`);

            // 1. Fetch and process data
            const allData = await this.fetchServiceData();
            const dataSummary = this.processDataForReport(allData);

            // 2. Construct prompt for Cerebras
            // This prompt structure assumes a chat-based model API. Adjust if using a completion API.
            const systemPrompt = `You are an AI assistant specialized in writing grant report sections for a homeless shelter. Your response should be professional, concise, and focused on impact based on the provided data summary.`;
            const userPrompt = `
Generate a concise grant report section summarizing our shelter's service utilization based *only* on the following aggregated data.

**Aggregated Service Data:**
${dataSummary}

**User Instructions/Focus:**
${input}

**Instructions for Generation:**
- Focus on the impact and reach of the services provided, using the data summary.
- Do not invent data not present in the summary.
- Keep the tone professional and suitable for a grant report.
- Structure the output as a paragraph or a few bullet points, as appropriate.

**Grant Report Section:**
`;

            // 3. Call Cerebras API
            console.log("Calling Cerebras API...");

            // *** IMPORTANT: Verify the correct method and parameters from Cerebras SDK documentation ***
            // Example using a hypothetical 'chat.completions.create' method:
            const response = await cerebras.chat.completions.create({
                model: "MODEL_NAME", // TODO: Specify the Cerebras model you want to use (e.g., 'CGPT-Large', 'Andromeda-13B', etc.)
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                max_tokens: 500, // TODO: Adjust token limit as needed
                temperature: 0.5, // Optional: Adjust creativity (0.0 to 1.0+)
                // Add other parameters like stop sequences, top_p, etc., if supported/needed
            });

            console.log("Cerebras API response received.");

            // 4. Parse the response
            // Adjust this based on the actual structure of the response object from the Cerebras SDK
            const choices = response?.choices as Array<{message: {content: string}}> || [];
            if (choices.length > 0 && choices[0]?.message?.content) {
                const reportSection = choices[0].message.content.trim();
                console.log("Generated report section:", reportSection);
                return reportSection;
            } else {
                // Log the unexpected response structure for debugging
                console.error("Unexpected Cerebras response format:", JSON.stringify(response, null, 2));
                return "Error: Could not generate report due to unexpected API response format. Please check the Cerebras SDK documentation and the API response structure.";
            }

        } catch (error: any) {
            console.error("Error executing GrantReportTool _call method:", error);
            return `Error generating grant report: ${error.message || String(error)}`;
        }
    }
}

// Example Usage (within an async context, e.g., in your LangChain agent setup)
/*
async function runTool() {
    const grantTool = new GrantReportTool();
    const result = await grantTool.invoke("Focus on the number of clients served and the most utilized services.");
    console.log("\n--- Tool Result ---");
    console.log(result);
}

runTool();
*/