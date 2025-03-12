
import { toast } from "sonner";

// Informatica API configuration
const IDMC_AUTH_URL = "https://dm-us.informaticacloud.com/authz-service/oauth/token";
const CLIENT_ID = "7owS9SxB5AtfGkFRUzEtsJ";
const CLIENT_SECRET = "9fPOElhSg";
const HEADER = "N293UzlTeEI1QXRmR2tGUlV6RXRzSjo5ZlBPRWxoU2c="; // Base64 encoded

// API response types
export interface InformaticaResponse {
  result?: any;
  error?: string;
  Final_Answer?: string;
  [key: string]: any; // Allow for other properties that might be in the response
}

export interface ProcessedResult {
  rawJson: any;
  naturalLanguage: string;
  error?: string;
}

// Simulate Python backend processing
const simulatePythonBackend = async (query: string): Promise<ProcessedResult> => {
  console.log("Simulating Python backend processing for query:", query);
  
  // This simulates the Python flow you provided
  try {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a realistic-looking response based on the query
    let responseData: any = {};
    
    // Check the query content to determine the appropriate response
    const normalizedQuery = query.toLowerCase();
    
    if (normalizedQuery.includes("sforce") || (normalizedQuery.includes("force") && !normalizedQuery.includes("genepoint"))) {
      responseData = {
        Account_Details: {
          Account_Number: "CD451796",
          Account_Name: "sForce",
          Industry_Type: "Technology",
          Revenue: "$987,000",
          Billing_Address: "1 Market St, San Francisco, CA",
          Upsell_Status: "High Potential"
        },
        Performance_Metrics: {
          Customer_Satisfaction: 4.7,
          Product_Usage: "85%",
          Support_Tickets_Open: 3,
          Last_Purchase_Date: "2023-04-15"
        },
        Growth_Opportunities: [
          "Cloud expansion package - $45,000 potential",
          "Training services - $12,000 potential",
          "Premium support upgrade - $8,500 potential"
        ],
        Final_Answer: "The sForce account (Account #CD451796) is in the Technology industry with annual revenue of $987,000. Their billing address is 1 Market St, San Francisco, CA. This account has high upsell potential with several growth opportunities including cloud expansion, training services, and premium support upgrades totaling over $65,000 in potential additional revenue. They maintain a high customer satisfaction score of 4.7 and currently have 3 open support tickets."
      };
    } else if (normalizedQuery.includes("genepoint")) {
      responseData = {
        Account_Details: {
          Account_Number: "CC947211",
          Account_Name: "GenePoint",
          Industry_Type: "Biotechnology",
          Revenue: "$782,000",
          Billing_Address: "345 Shoreline Park, Mountain View, CA",
          Upsell_Status: "Medium Potential"
        },
        Performance_Metrics: {
          Customer_Satisfaction: 4.2,
          Product_Usage: "73%",
          Support_Tickets_Open: 5,
          Last_Purchase_Date: "2023-02-28"
        },
        Growth_Opportunities: [
          "Laboratory equipment package - $28,000 potential",
          "Research database access - $15,000 potential",
          "Consulting services - $9,800 potential"
        ],
        Final_Answer: "The GenePoint account (Account #CC947211) operates in the Biotechnology industry with annual revenue of $782,000. Their billing address is 345 Shoreline Park, Mountain View, CA. This account has medium upsell potential with growth opportunities in laboratory equipment, research database access, and consulting services totaling approximately $52,800 in potential revenue. Their customer satisfaction score is 4.2 and they currently have 5 open support tickets."
      };
    } else if (normalizedQuery.includes("account") || normalizedQuery.includes("data")) {
      // Generic account-related query
      responseData = {
        Query_Results: {
          Status: "Completed",
          Records_Found: 3,
          Query_Execution_Time: "1.2 seconds",
          Query_Terms: query
        },
        Data_Summary: {
          Average_Revenue: "$650,000",
          Total_Opportunities: 12,
          Primary_Industries: ["Technology", "Manufacturing", "Healthcare"],
          Growth_Potential: "Medium to High"
        },
        Final_Answer: `Analysis of your query "${query}" found 3 matching records across Technology, Manufacturing, and Healthcare industries. The average revenue is $650,000 with 12 total opportunities identified. The data indicates medium to high growth potential across these accounts.`
      };
    } else {
      // Catch-all response for other queries
      responseData = {
        Query_Results: {
          Status: "Completed",
          Records_Found: 1,
          Query_Execution_Time: "0.9 seconds",
          Query_Terms: query
        },
        Data_Summary: {
          Query_Type: "Custom",
          Analysis_Level: "Basic",
          Confidence_Score: "75%"
        },
        Final_Answer: `I've analyzed your query: "${query}". This appears to be a custom query that doesn't match our predefined patterns. Based on available data, I can provide a basic analysis with 75% confidence. For more specific information, consider refining your query to target specific accounts like "sForce" or "GenePoint", or ask for specific metrics.`
      };
    }
    
    // Process the result to match our expected format
    const naturalLanguage = responseData.Final_Answer || "No detailed analysis available for this query.";
    
    return {
      rawJson: responseData,
      naturalLanguage
    };
  } catch (error) {
    console.error("Error in simulated Python backend:", error);
    return {
      rawJson: { error: String(error) },
      naturalLanguage: "An error occurred during processing. Please try again with a different query.",
      error: String(error)
    };
  }
};

export const InformaticaService = {
  // Get access token for authentication
  getAccessToken: async (): Promise<string | null> => {
    try {
      console.log("Attempting to get Informatica access token...");
      const response = await fetch(IDMC_AUTH_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${HEADER}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Successfully obtained Access Token");
        return data.access_token;
      } else {
        const errorText = await response.text();
        console.error("Authentication failed:", errorText);
        return null;
      }
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  },

  // Call Informatica AI Query Execution
  executeQuery: async (query: string): Promise<InformaticaResponse> => {
    try {
      toast.info("Processing your query...", {
        duration: 5000,
        id: "informatica-query",
      });

      // Get access token
      const accessToken = await InformaticaService.getAccessToken();
      if (!accessToken) {
        toast.error("Failed to authenticate with Informatica", {
          id: "informatica-query",
        });
        return { error: "Authentication failed" };
      }

      // Prepare headers and endpoint
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      const endpoint = "https://usw5-gw.dm-us.informaticacloud.com/3FM5COFqnE8gB0bW7hEkIo.com/genai2/v1/genai";

      // Prepare query parameters
      const params = new URLSearchParams({
        'User_Prompt': query,
        'System_Instruction_Planning': '',
        'System_Instruction_Query_Processing': '',
        'Max_Query_Limit': '5'
      });

      // Make the API call
      console.log("🤖 Executing AI Query (CAI) using GET method...");
      console.log("Query:", query);
      const response = await fetch(`${endpoint}?${params.toString()}`, {
        method: 'GET',
        headers
      });

      console.log(`Status Code: ${response.status}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Raw Response:", result);
        toast.success("Query processed successfully!", {
          id: "informatica-query",
        });
        return result;
      } else {
        const errorText = await response.text();
        console.error("API call failed:", errorText);
        toast.error("Failed to process query", {
          id: "informatica-query",
        });
        return { error: errorText };
      }
    } catch (error) {
      console.error("Error executing query:", error);
      toast.error("Error processing query", {
        id: "informatica-query",
      });
      return { error: String(error) };
    }
  },
  
  // Process results with simulated Groq's LLM (based on Python code)
  processWithGroq: async (data: any): Promise<ProcessedResult> => {
    try {
      // If there's an error with the input data, return it
      if (data.error) {
        return { 
          rawJson: data, 
          naturalLanguage: "Error processing the query", 
          error: data.error 
        };
      }

      // Simulate Groq processing with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Extract meaningful content from the response
      let naturalLanguage = "Processing with AI...";

      if (data.Final_Answer) {
        naturalLanguage = data.Final_Answer;
      } else {
        // Generate a natural language response based on available data
        const keys = Object.keys(data).filter(key => typeof data[key] !== 'object');
        if (keys.length > 0) {
          naturalLanguage = "Based on the data, ";
          keys.forEach((key, index) => {
            const formattedKey = key.replace(/_/g, ' ').toLowerCase();
            if (index > 0) naturalLanguage += ", ";
            naturalLanguage += `${formattedKey} is ${data[key]}`;
          });
          naturalLanguage += ".";
        } else {
          naturalLanguage = "The analysis found relevant data but could not generate a natural language summary.";
        }
      }
      
      return {
        rawJson: data,
        naturalLanguage
      };
    } catch (error) {
      console.error("Error processing with Groq:", error);
      return {
        rawJson: data,
        naturalLanguage: "Error occurred while processing with AI",
        error: String(error)
      };
    }
  },
  
  // Function to handle the complete query flow
  processQueryFlow: async (query: string): Promise<ProcessedResult> => {
    try {
      toast.info("Processing your query...", {
        duration: 5000,
        id: "query-processing",
      });
      
      // Use the simulated Python backend directly
      const simulatedResult = await simulatePythonBackend(query);
      
      toast.success("Query processing complete!", {
        id: "query-processing",
      });
      
      return simulatedResult;
    } catch (error) {
      console.error("Error in query flow:", error);
      toast.error("Error processing query", {
        id: "query-processing",
      });
      
      return {
        rawJson: { error: String(error) },
        naturalLanguage: "An error occurred during processing",
        error: String(error)
      };
    }
  }
};
