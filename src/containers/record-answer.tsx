import WebCam from "react-webcam";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";

import useSpeechToText from "react-hook-speech-to-text";
import type { ResultType } from "react-hook-speech-to-text";

import { TooltipButton } from "@/components/tooltip-button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { chatSession } from "@/scripts/ai-studio";
import { SaveModal } from "../components/save-modal";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { cleanJsonResponse, handleError } from "@/lib/helpers";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer?.length < 30) {
        toast.error("Error", {
          description: "Your answer should be more than 30 characters",
        });

        return;
      }

      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );

      setAiResult(aiResult);
    } else {
      startSpeechToText();
    }
  };


  const generateResult = async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);

    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;

    try {
      const aiResult = await chatSession.sendMessage(prompt);

      const parsedResult = cleanJsonResponse(
        aiResult.response.text()
      ) as unknown;
      
      // Validate the parsed result is an AIResponse
      if (
        typeof parsedResult === "object" &&
        parsedResult !== null &&
        "ratings" in parsedResult &&
        "feedback" in parsedResult
      ) {
        return parsedResult as AIResponse;
      }
      
      throw new Error("Invalid AI response format");
    } catch (error) {
      const { message, isQuotaError, isNetworkError } = handleError(
        error,
        "An error occurred while generating feedback."
      );

      if (isQuotaError) {
        toast.error("API Quota Exceeded", {
          description: "Please try again later or check your plan.",
        });
      } else if (isNetworkError) {
        toast.error("Network Error", {
          description: "Please check your internet connection and try again.",
        });
      } else {
        toast.error("Error", {
          description: message,
        });
      }
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
  };

  const saveUserAnswer = async () => {
    setLoading(true);

    if (!aiResult) {
      return;
    }

    const currentQuestion = question.question;

    try {
      // query the firbase to check if the user answer already exists for this question

      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion)
      );

      const querySnap = await getDocs(userAnswerQuery);

      // if the user already answerd the question dont save it again
      if (!querySnap.empty) {
        toast.info("Already Answered", {
          description: "You have already answered this question",
        });
        return;
      } else {
        // save the answer

        const questionAnswerRef = await addDoc(collection(db, "userAnswers"), {
          mockIdRef: interviewId,
          question: question.question,
          correct_ans: question.answer,
          user_ans: userAnswer,
          feedback: aiResult.feedback,
          rating: aiResult.ratings,
          userId,
          createdAt: serverTimestamp(),
        });

        const id = questionAnswerRef.id;

        await updateDoc(doc(db, "userAnswers", id), {
          id,
          updatedAt: serverTimestamp(),
        });

        toast("Saved", { description: "Your answer has been saved.." });
      }

      setUserAnswer("");
      stopSpeechToText();
    } catch (error) {
      const { message } = handleError(
        error,
        "An error occurred while saving your answer."
      );
      toast.error("Error", {
        description: message,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    // combine all transcripts into a single answers
    const combinedTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    setUserAnswer(combinedTranscripts);
  }, [results]);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      {/* save modal */}

      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-muted rounded-md">
        {isWebCam ? (
          <WebCam
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-muted-foreground" />
        )}
      </div>

      {/* action buttons group */}
      <div className="flex items-center justify-center gap-3">
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={
            isWebCam ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={recordUserAnswer}
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
        />

        <TooltipButton
          content="Save Result"
          icon={
            isAiGenerating ? (
              <Loader className="min-w-5 min-h-5 animate-spin" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setOpen(!open)}
          disbaled={!aiResult}
        />
      </div>

      <div className="w-full mt-4 p-4 border rounded-md bg-muted">
        <h2 className="text-lg font-semibold">Your Answer:</h2>
        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Start recording to see your ansewer here"}
        </p>

        {interimResult && (
          <p className="text-sm text-gray-500 mt-2">
            <strong>Current Speech:</strong>
            {interimResult}
          </p>
        )}
      </div>
    </div>
  );
};