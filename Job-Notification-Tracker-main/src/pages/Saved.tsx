import { useState, useMemo } from "react";
import { Bookmark } from "lucide-react";
import { jobs } from "@/data/jobs";
import type { Job } from "@/data/jobs";
import JobCard from "@/components/JobCard";
import JobDetailModal from "@/components/JobDetailModal";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useJobStatus } from "@/hooks/useJobStatus";
import { useToast } from "@/hooks/use-toast";

const Saved = () => {
  const { savedIds, isSaved, toggleSave } = useSavedJobs();
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const { getStatus, setStatus } = useJobStatus();
  const { toast } = useToast();

  const savedJobs = useMemo(
    () => jobs.filter((j) => savedIds.includes(j.id)),
    [savedIds]
  );

  return (
    <div className="mx-auto max-w-7xl px-system-3 py-system-5">
      <div className="max-w-prose">
        <h1 className="text-4xl text-foreground">Saved Jobs</h1>
        <p className="mt-system-1 text-base text-muted-foreground">
          {savedJobs.length > 0
            ? `${savedJobs.length} job${savedJobs.length !== 1 ? "s" : ""} saved for later.`
            : "Jobs you've bookmarked for later review."}
        </p>
      </div>

      {savedJobs.length > 0 ? (
        <div className="mt-system-3 grid gap-system-2 md:grid-cols-2">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={isSaved(job.id)}
              onToggleSave={toggleSave}
              onView={setViewJob}
              status={getStatus(job.id)}
              onStatusChange={(id, status) => {
                setStatus(id, status);
                if (status !== "Not Applied") {
                  toast({ title: `Status updated: ${status}` });
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-system-5 flex flex-col items-center rounded-lg border border-border bg-card px-system-4 py-system-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Bookmark className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="mt-system-3 text-xl text-foreground">No saved jobs</h2>
          <p className="mt-system-1 max-w-sm text-sm text-muted-foreground">
            When you save jobs from the dashboard, they will appear here for easy access.
          </p>
        </div>
      )}

      <JobDetailModal job={viewJob} open={!!viewJob} onOpenChange={(o) => !o && setViewJob(null)} />
    </div>
  );
};

export default Saved;
