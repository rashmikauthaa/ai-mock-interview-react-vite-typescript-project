import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/interview-pin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { db } from "@/config/firebase.config";
import type { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus, Search, X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { handleError } from "@/lib/helpers";
import { BarChart3 } from "lucide-react";

export const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTechStack, setFilterTechStack] = useState<string>("");

  const { userId } = useAuth();

  useEffect(() => {
    // set upa realtime listener even for the interviews collection where the userId matches

    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        const interviewList: Interview[] = snapshot.docs.map((doc) =>
          doc.data()
        ) as Interview[];
        
        // Sort interviews by createdAt in descending order (newest first)
        const sortedInterviews = interviewList.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime; // Descending order (newest first)
        });
        
        setInterviews(sortedInterviews);
        setLoading(false);
      },
      (error) => {
        const { message } = handleError(
          error,
          "Something went wrong. Try again later."
        );
        toast.error("Error", {
          description: message,
        });
        setLoading(false);
      }
    );

    //  clean up the listener when the component unmount

    return () => unsubscribe();
  }, [userId]);

  // Filter and search interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const matchesSearch =
        searchQuery === "" ||
        interview.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.techStack.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterTechStack === "" ||
        interview.techStack.toLowerCase().includes(filterTechStack.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [interviews, searchQuery, filterTechStack]);

  // Get unique tech stacks for filter
  const techStacks = useMemo(() => {
    const stacks = new Set<string>();
    interviews.forEach((interview) => {
      interview.techStack.split(",").forEach((stack) => {
        stacks.add(stack.trim());
      });
    });
    return Array.from(stacks).sort();
  }, [interviews]);

  return (
    <>
      <div className="flex w-full items-center justify-between flex-wrap gap-4">
        {/* heading */}
        <Headings
          title="Dashboard"
          description="Create and start you AI Mock interview"
        />
        {/* action buttons */}
        <div className="flex gap-2">
          <Link to={"/generate/analytics"}>
            <Button size={"sm"} variant="outline">
              <BarChart3 className="min-w-4 min-h-4 mr-1" />
              Analytics
            </Button>
          </Link>
          <Link to={"/generate/create"}>
            <Button size={"sm"}>
              <Plus className="min-w-5 min-h-5 mr-1" />
              Add new
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search interviews by position, description, or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {techStacks.length > 0 && (
          <div className="md:w-64">
            <select
              value={filterTechStack}
              onChange={(e) => setFilterTechStack(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Tech Stacks</option>
              {techStacks.map((stack) => (
                <option key={stack} value={stack}>
                  {stack}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="md:grid md:grid-cols-3 gap-3 py-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 md:h-32 rounded-md" />
          ))
        ) : filteredInterviews.length > 0 ? (
          filteredInterviews.map((interview) => (
            <InterviewPin key={interview.id} data={interview} />
          ))
        ) : interviews.length > 0 ? (
          <div className="md:col-span-3 w-full flex flex-col items-center justify-center h-96">
            <p className="text-muted-foreground">
              No interviews match your search criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setFilterTechStack("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="md:col-span-3 w-full flex flex-grow items-center justify-center h-96 flex-col">
            <img
              src="/svg/not-found.svg"
              className="w-44 h-44 object-contain"
              alt=""
            />

            <h2 className="text-lg font-semibold text-muted-foreground">
              No Data Found
            </h2>

            <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-4">
              There is no available data to show. Please add some new mock
              interviews
            </p>

            <Link to={"/generate/create"} className="mt-4">
              <Button size={"sm"}>
                <Plus className="min-w-5 min-h-5 mr-1" />
                Add New
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};