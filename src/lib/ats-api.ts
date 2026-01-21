/**
 * API service for ATS Resume Matcher backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export interface ATSMatchResult {
  score: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  missingKeywords: string[];
  matchingSkills: string[];
}

export interface ATSErrorResponse {
  error: string;
}

/**
 * Upload resume and job description to get Resume Analysis
 * @param resumeFile - The PDF resume file
 * @param jobDescription - The job description text
 * @returns Promise with ATS match result
 */
export const matchResume = async (
  resumeFile: File,
  jobDescription: string
): Promise<ATSMatchResult> => {
  // Validate inputs
  if (!resumeFile) {
    throw new Error("Resume file is required");
  }

  if (!jobDescription || jobDescription.trim() === "") {
    throw new Error("Job description is required");
  }

  if (resumeFile.type !== "application/pdf") {
    throw new Error("Only PDF files are supported");
  }

  // Create form data
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);

  try {
    // Validate API_BASE_URL is set
    if (!API_BASE_URL) {
      throw new Error("API base URL is not configured. Please set VITE_API_BASE_URL environment variable.");
    }

    const response = await fetch(`${API_BASE_URL}/match_resume`, {
      method: "POST",
      body: formData,
    });

    // Check content-type before parsing
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!response.ok) {
      // Try to parse error as JSON, but handle HTML responses
      if (isJson) {
        try {
          const errorData: ATSErrorResponse = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        } catch (parseError) {
          throw new Error(`HTTP error! status: ${response.status}. Server returned invalid JSON.`);
        }
      } else {
        // Response is HTML (likely an error page)
        const text = await response.text();
        const preview = text.substring(0, 200).replace(/\s+/g, " ");
        throw new Error(
          `Server returned an error page (status: ${response.status}). ` +
          `Please check that your backend API is running and accessible at ${API_BASE_URL}. ` +
          `Response preview: ${preview}...`
        );
      }
    }

    // Ensure response is JSON before parsing
    if (!isJson) {
      const text = await response.text();
      throw new Error(
        `Server returned non-JSON response. Expected JSON but received: ${contentType}. ` +
        `Response preview: ${text.substring(0, 100)}... ` +
        `Please check that your backend API endpoint is correct.`
      );
    }

    const data: ATSMatchResult = await response.json();
    
    // Validate response structure
    if (typeof data.score !== "number") {
      throw new Error("Invalid response format from server: missing or invalid 'score' field");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Check for network errors
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        throw new Error(
          `Cannot connect to backend API at ${API_BASE_URL}. ` +
          `Please check that the backend server is running and the URL is correct.`
        );
      }
      throw error;
    }
    throw new Error("An unexpected error occurred while matching resume");
  }
};
