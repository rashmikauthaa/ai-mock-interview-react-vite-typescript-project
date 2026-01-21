import { useState, useRef } from "react";
import { Container } from "@/components/container";
import { Headings } from "@/components/headings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload,
  FileText,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { matchResume, type ATSMatchResult } from "@/lib/ats-api";
import { handleError } from "@/lib/helpers";

export const ATSScorePage = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ATSMatchResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Invalid file type", {
          description: "Please upload a PDF file.",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File too large", {
          description: "Please upload a PDF file smaller than 5MB.",
        });
        return;
      }
      setResumeFile(file);
      toast.success("Resume uploaded", {
        description: file.name,
      });
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile) {
      toast.error("Resume required", {
        description: "Please upload your resume (PDF).",
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Job description required", {
        description: "Please enter the job description.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const matchResult = await matchResume(resumeFile, jobDescription);
      setResult(matchResult);
      toast.success("Analysis complete!", {
        description: `Your Resume Analysis is ${matchResult.score}/100`,
      });
    } catch (error) {
      const { message, isNetworkError } = handleError(
        error,
        "Failed to analyze resume. Please try again."
      );

      if (isNetworkError) {
        toast.error("Connection Error", {
          description:
            "Could not connect to the server. Make sure the backend is running on http://localhost:8000",
        });
      } else {
        toast.error("Error", {
          description: message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setJobDescription("");
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="w-full min-h-screen py-8">
      <Container>
        <Headings
          title="Resume Analysis Checker"
          description="Upload your resume and job description to get an Resume Analysis and improvement suggestions"
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Resume</CardTitle>
                <CardDescription>
                  Upload your resume in PDF format to analyze against the job description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resume-upload">Resume (PDF)</Label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {resumeFile ? resumeFile.name : "Choose PDF File"}
                    </Button>
                  </div>
                  {resumeFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      <span>{resumeFile.name}</span>
                      <span className="text-xs">
                        ({(resumeFile.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={12}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !resumeFile || !jobDescription.trim()}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analyse your resume
                      </>
                    )}
                  </Button>
                  {(resumeFile || jobDescription || result) && (
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={isLoading}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {isLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ) : result ? (
              <>
                {/* Score Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resume Analytics</CardTitle>
                    <CardDescription>
                      Your resume compatibility with the job description
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center gap-6">
                      <div
                        className={`w-32 h-32 rounded-full flex items-center justify-center ${getScoreColor(
                          result.score
                        )} font-bold text-4xl`}
                      >
                        {result.score}
                      </div>
                      <div>
                        <p className="text-2xl font-semibold">
                          {getScoreLabel(result.score)}
                        </p>
                        <p className="text-muted-foreground">out of 100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{result.feedback}</p>
                  </CardContent>
                </Card>

                {/* Improvements */}
                {result.improvements.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        Improvement Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Missing Keywords */}
                {result.missingKeywords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Missing Keywords</CardTitle>
                      <CardDescription>
                        Add these keywords to improve your Resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.missingKeywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Matching Skills */}
                {result.matchingSkills.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Matching Skills</CardTitle>
                      <CardDescription>
                        Skills from your resume that match the job description
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {result.matchingSkills.map((skill, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Results Will Appear Here</CardTitle>
                  <CardDescription>
                    Upload your resume and job description, then click "Check your resume analytics" to
                    see your analysis results.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Your Resume Analysis and detailed feedback will appear here after analysis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
