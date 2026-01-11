export const MainRoutes = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Contact Us",
        href: "/contact",
    },
    {
        label: "About Us",
        href: "/about",
    },
    {
        label: "Services",
        href: "/services",
    },
];

/**
 * Cleans and parses JSON response from AI, removing code blocks and formatting
 * @param responseText - Raw text response from AI
 * @returns Parsed JSON array
 * @throws Error if JSON is invalid or no array found
 */
export const cleanJsonResponse = (responseText: string): unknown[] => {
    // Step 1: Trim any surrounding whitespace
    let cleanText = responseText.trim();

    // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    // Step 3: Extract a JSON array by capturing text between square brackets
    const jsonArrayMatch = cleanText.match(/\[.*\]/s);
    if (jsonArrayMatch) {
        cleanText = jsonArrayMatch[0];
    } else {
        throw new Error("No JSON array found in response");
    }

    // Step 4: Parse the clean JSON text into an array of objects
    try {
        return JSON.parse(cleanText);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Invalid JSON format: ${errorMessage}`);
    }
};

/**
 * Handles errors and provides user-friendly error messages
 * @param error - The error object
 * @param defaultMessage - Default message if error type cannot be determined
 * @returns Object with error type and user-friendly message
 */
export const handleError = (
    error: unknown,
    defaultMessage = "Something went wrong. Please try again later."
): { message: string; isQuotaError: boolean; isNetworkError: boolean } => {
    let message = defaultMessage;
    let isQuotaError = false;
    let isNetworkError = false;

    if (error instanceof Error) {
        message = error.message;
        
        // Check for quota/rate limit errors
        isQuotaError = 
            error.message.includes("429") ||
            error.message.includes("quota") ||
            error.message.includes("Quota exceeded") ||
            error.message.toLowerCase().includes("rate limit");
        
        // Check for network errors
        isNetworkError = 
            error.message.includes("network") ||
            error.message.includes("fetch") ||
            error.message.includes("connection") ||
            error.message.includes("timeout");
    } else if (typeof error === "object" && error !== null) {
        const errorObj = error as Record<string, unknown>;
        
        // Check status codes
        if (errorObj.status === 429 || errorObj.statusCode === 429) {
            isQuotaError = true;
            message = "API quota exceeded. Please check your plan and billing details, or try again later.";
        } else if (errorObj.message && typeof errorObj.message === "string") {
            message = errorObj.message;
        }
    }

    return { message, isQuotaError, isNetworkError };
};