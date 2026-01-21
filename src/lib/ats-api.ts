/**
 * API service for ATS Resume Matcher backend
 */

const ATS_API_URL = import.meta.env.VITE_ATS_API_URL || "http://localhost:8000";

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
    const response = await fetch(`${ATS_API_URL}/match_resume`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData: ATSErrorResponse = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ATSMatchResult = await response.json();
    
    // Validate response structure
    if (typeof data.score !== "number") {
      throw new Error("Invalid response format from server");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while matching resume");
  }
};
