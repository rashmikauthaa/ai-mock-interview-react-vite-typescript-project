import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/auth-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { StatCard } from "@/components/stat-card";
import { Headings } from "@/components/headings";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  Target,
  MessageSquare,
} from "lucide-react";
import type { Interview, UserAnswer } from "@/types";
import { handleError } from "@/lib/helpers";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Analytics = () => {
  const { userId } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalAnswers: 0,
    averageRating: 0,
    totalPracticeTime: 0,
    improvementRate: 0,
    completedInterviews: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        // Fetch interviews
        const interviewsQuery = query(
          collection(db, "interviews"),
          where("userId", "==", userId)
        );
        const interviewsSnapshot = await getDocs(interviewsQuery);
        const interviews = interviewsSnapshot.docs.map(
          (doc) => doc.data() as Interview
        );

        // Fetch user answers
        const answersQuery = query(
          collection(db, "userAnswers"),
          where("userId", "==", userId)
        );
        const answersSnapshot = await getDocs(answersQuery);
        const answers = answersSnapshot.docs.map(
          (doc) => doc.data() as UserAnswer
        );

        // Calculate statistics
        const totalInterviews = interviews.length;
        const totalAnswers = answers.length;
        const averageRating =
          answers.length > 0
            ? answers.reduce((sum, ans) => sum + (ans.rating || 0), 0) /
              answers.length
            : 0;

        // Calculate completed interviews (interviews with at least one answer)
        const interviewIdsWithAnswers = new Set(
          answers.map((ans) => ans.mockIdRef)
        );
        const completedInterviews = interviewIdsWithAnswers.size;

        // Calculate improvement (simplified - compare recent vs older answers)
        const sortedAnswers = answers.sort(
          (a, b) =>
            b.createdAt.toMillis() - a.createdAt.toMillis()
        );
        const recentAnswers = sortedAnswers.slice(0, Math.ceil(answers.length / 2));
        const olderAnswers = sortedAnswers.slice(Math.ceil(answers.length / 2));

        const recentAvg =
          recentAnswers.length > 0
            ? recentAnswers.reduce((sum, ans) => sum + (ans.rating || 0), 0) /
              recentAnswers.length
            : 0;
        const olderAvg =
          olderAnswers.length > 0
            ? olderAnswers.reduce((sum, ans) => sum + (ans.rating || 0), 0) /
              olderAnswers.length
            : 0;

        const improvementRate =
          olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

        setStats({
          totalInterviews,
          totalAnswers,
          averageRating: Math.round(averageRating * 10) / 10,
          totalPracticeTime: totalAnswers * 5, // Estimate 5 minutes per answer
          improvementRate: Math.round(improvementRate * 10) / 10,
          completedInterviews,
        });
      } catch (error) {
        const { message } = handleError(
          error,
          "Failed to load analytics data."
        );
        toast.error("Error", {
          description: message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Headings
          title="Analytics"
          description="Track your interview preparation progress"
        />
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Headings
        title="Analytics"
        description="Track your interview preparation progress and performance metrics"
      />
      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Interviews"
          value={stats.totalInterviews}
          icon={BarChart3}
          description="Mock interviews created"
        />
        <StatCard
          title="Questions Answered"
          value={stats.totalAnswers}
          icon={MessageSquare}
          description="Total practice questions"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating.toFixed(1)}
          icon={Award}
          description="Out of 10.0"
          trend={
            stats.improvementRate !== 0
              ? {
                  value: Math.abs(stats.improvementRate),
                  isPositive: stats.improvementRate > 0,
                }
              : undefined
          }
        />
        <StatCard
          title="Practice Time"
          value={`${Math.round(stats.totalPracticeTime / 60)}h`}
          icon={Clock}
          description="Estimated total practice time"
        />
        <StatCard
          title="Completed Interviews"
          value={stats.completedInterviews}
          icon={Target}
          description="Interviews with answers"
        />
        <StatCard
          title="Improvement Rate"
          value={`${stats.improvementRate > 0 ? "+" : ""}${stats.improvementRate.toFixed(1)}%`}
          icon={TrendingUp}
          description="Performance improvement"
          className={
            stats.improvementRate > 0
              ? "border-emerald-200 bg-emerald-50/50"
              : stats.improvementRate < 0
              ? "border-red-200 bg-red-50/50"
              : ""
          }
        />
      </div>

      {stats.totalAnswers === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Data Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start practicing interviews to see your analytics and track your
              progress over time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
