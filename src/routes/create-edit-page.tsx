import { db } from "@/config/firebase.config";
import { FormMockInterview } from "@/forms/form-mock-interview";
import type{ Interview } from "@/types";
import { handleError } from "@/lib/helpers";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const CreateEditPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));

          if (interviewDoc.exists()) {
            setInterview({ ...interviewDoc.data() } as Interview);
          }
        } catch (error) {
          const { message } = handleError(
            error,
            "Failed to load interview data."
          );
          toast.error("Error", {
            description: message,
          });
        }
      }
    };

    fetchInterview();
  }, [interviewId]);

  return (
    <div className="my-4 flex-col w-full">
      <FormMockInterview initialData={interview} />
    </div>
  );
};