import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import type { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Headings } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/scripts/ai-studio";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";
import { cleanJsonResponse, handleError } from "@/lib/helpers";

interface FormMockInterview {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.number().min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});


type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterview) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: "",
      description: "",
      experience: 0,
      techStack: "",
    },
  });
  

  const { isValid, isSubmitting } = form.formState;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuthContext();

  const title = initialData
    ? initialData.position
    : "Create a new mock interview";

  const breadCrumpPage = initialData ? initialData?.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

    const generateAiResult = async (data: FormData) => {
      const prompt = `
    You are a senior technical interviewer at a top product-based company.
    
    Conduct a realistic mock interview based on the following job details and generate exactly 5 interview questions with concise, high-quality answers.
    
    STRICT REQUIREMENTS:
    - Questions must be REAL interview questions commonly asked for this role
    - Questions must strictly match the candidate's experience level
    - Avoid theoretical definitions unless experience is junior
    - Focus on practical, scenario-based, and decision-making questions
    - Keep answers short, clear, and interview-ready (5–8 lines max)
    - No overly verbose or textbook-style answers
    - No introductions, explanations, or extra text
    
    QUESTION DISTRIBUTION:
    1. Core concept from the tech stack
    2. Practical problem or real-world scenario
    3. Best practices / performance / optimization
    4. Common interview “trap” or mistake question
    5. Experience-based or project-related question
    
    JOB DETAILS:
    - Role: ${data?.position}
    - Years of Experience: ${data?.experience}
    - Tech Stack: ${data?.techStack}
    - Job Description: ${data?.description}
    
    OUTPUT FORMAT (STRICT):
    Return ONLY a valid JSON array like this:
    
    [
      { "question": "Question text", "answer": "Answer text" },
      ...
    ]
    
    Do NOT include markdown, code blocks, headings, or any extra text.
    `;
    
      const aiResult = await chatSession.sendMessage(prompt);
      const cleanedResponse = cleanJsonResponse(aiResult.response.text());
    
      return cleanedResponse;
    };
    

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      if (initialData) {
        // update api
        if (isValid) {
          // create a new mock interview
          const aiResult = await generateAiResult(data);

          await updateDoc(doc(db, "interviews", initialData?.id), {
            questions: aiResult,
            ...data,
            updatedAt: serverTimestamp(),
          });

          toast(toastMessage.title, { description: toastMessage.description });
          navigate("/generate", { replace: true });
        }
      } else {
        // create api

        if (isValid) {
          // create a new mock interview
          const aiResult = await generateAiResult(data);

          const interviewRef = await addDoc(collection(db, "interviews"), {
            ...data,
            userId,
            questions: aiResult,
            createdAt: serverTimestamp(),
          });

          const id = interviewRef.id;

          await updateDoc(doc(db, "interviews", id), {
            id,
            updatedAt: serverTimestamp(),
          });

          toast(toastMessage.title, { description: toastMessage.description });
          navigate("/generate", { replace: true });
        }
      }
    } catch (error) {
      const { message, isQuotaError, isNetworkError } = handleError(
        error,
        "Something went wrong. Please try again later."
      );

      if (isQuotaError) {
        toast.error("API Quota Exceeded", {
          description: "You've exceeded your API quota. Please check your plan and billing details, or try again later.",
          duration: 6000,
        });
      } else if (isNetworkError) {
        toast.error("Network Error", {
          description: "Please check your internet connection and try again.",
          duration: 5000,
        });
      } else {
        toast.error("Error", {
          description: message,
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: Number(initialData.experience),
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);  

  return (
    <div className="w-full flex-col space-y-4">
      {/* Bread Crumb */}
      <CustomBreadCrumb
        breadCrumbPage={breadCrumpPage}
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="text-red-500 min-w-4 min-h-4" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md "
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={isLoading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={isLoading}
                    placeholder="eg:- describle your job role"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={isLoading}
                    placeholder="eg:- 5 Years"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? 0 : Number(value));
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={isLoading}
                    placeholder="eg:- React, Typescript..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || !isValid || isLoading}
            >
              {isLoading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};