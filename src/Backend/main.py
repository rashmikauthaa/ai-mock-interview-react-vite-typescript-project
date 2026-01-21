import os
import json
import re
from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import fitz  # PyMuPDF
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for all origins (helpful for frontend testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to extract text from uploaded PDF resume
def extract_text_from_pdf(file: UploadFile) -> str:
    with fitz.open(stream=file.file.read(), filetype="pdf") as doc:
        text = ""
        for page in doc:
            text += page.get_text()
        return text.strip()

# Function to get AI-based resume match score using Gemini
def get_match_score(resume_text: str, job_description: str) -> dict:
    model = genai.GenerativeModel('gemini-2.5-flash')  # Use lighter model to avoid quota limits
    prompt = f"""
You are an AI resume evaluator. Compare the following resume to the job description and provide a concise evaluation.

Resume:
{resume_text}

Job Description:
{job_description}

Analyze the resume against the job description and provide a brief, focused evaluation.

IMPORTANT: Keep responses SHORT and CONCISE. Limit to maximum 3-4 items per category.

Respond ONLY with valid JSON in the following format (no markdown, no code blocks, just pure JSON):
{{
    "score": <number between 0-100>,
    "feedback": "<brief 2-3 sentence feedback explaining the score>",
    "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
    "missingKeywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>"],
    "matchingSkills": ["<skill 1>", "<skill 2>", "<skill 3>"]
}}

Keep all strings brief - one short sentence or phrase per item. Maximum 3-4 items per array.
"""
    response = model.generate_content(prompt)
    response_text = response.text.strip()
    
    # Remove markdown code blocks if present
    response_text = re.sub(r'```json\n?', '', response_text)
    response_text = re.sub(r'```\n?', '', response_text)
    response_text = response_text.strip()
    
    try:
        result = json.loads(response_text)
        # Validate required fields
        if "score" not in result:
            raise ValueError("Missing 'score' field in response")
        # Ensure score is a number
        result["score"] = int(result.get("score", 0))
        
        # Limit array lengths to keep responses concise (max 4 items per array)
        max_items = 4
        if "improvements" in result and isinstance(result["improvements"], list):
            result["improvements"] = result["improvements"][:max_items]
        if "missingKeywords" in result and isinstance(result["missingKeywords"], list):
            result["missingKeywords"] = result["missingKeywords"][:max_items]
        if "matchingSkills" in result and isinstance(result["matchingSkills"], list):
            result["matchingSkills"] = result["matchingSkills"][:max_items]
        
        # Limit feedback length to 300 characters
        if "feedback" in result and isinstance(result["feedback"], str):
            feedback = result["feedback"].strip()
            if len(feedback) > 300:
                # Truncate at last sentence or word boundary near 300 chars
                truncated = feedback[:297]
                last_period = truncated.rfind('.')
                last_space = truncated.rfind(' ')
                cut_point = last_period if last_period > 250 else (last_space if last_space > 250 else 297)
                result["feedback"] = truncated[:cut_point]
            else:
                result["feedback"] = feedback
        
        return result
    except json.JSONDecodeError as e:
        # Fallback: try to extract score from text
        score_match = re.search(r'"score"\s*:\s*(\d+)', response_text)
        score = int(score_match.group(1)) if score_match else 0
        return {
            "score": score,
            "feedback": response_text[:500] if len(response_text) > 500 else response_text,
            "improvements": ["Unable to parse detailed feedback. Please try again."],
            "missingKeywords": [],
            "matchingSkills": []
        }

# API endpoint to upload resume and job description
@app.post("/match_resume")
async def match_resume(resume: UploadFile, job_description: str = Form(...)):
    try:
        if not job_description or job_description.strip() == "":
            return JSONResponse(
                content={"error": "Job description is required"}, 
                status_code=400
            )
        
        if resume.content_type not in ["application/pdf", "application/x-pdf"]:
            return JSONResponse(
                content={"error": "Only PDF files are supported"}, 
                status_code=400
            )
        
        resume_text = extract_text_from_pdf(resume)
        
        if not resume_text or resume_text.strip() == "":
            return JSONResponse(
                content={"error": "Could not extract text from PDF. Please ensure the PDF contains readable text."}, 
                status_code=400
            )
        
        result = get_match_score(resume_text, job_description)
        return JSONResponse(content=result)
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return JSONResponse(
            content={"error": f"An error occurred: {str(e)}"}, 
            status_code=500
        )

# Basic root endpoint
@app.get("/")
def read_root():
    return {"message": "Resume Matcher API is running."}
