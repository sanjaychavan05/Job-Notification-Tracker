import { MapPin, Clock, ExternalLink, Bookmark, BookmarkCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/data/jobs";
import type { JobStatus } from "@/hooks/useJobStatus";

interface JobCardProps {
  job: Job;
  matchScore?: number;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onView: (job: Job) => void;
  status?: JobStatus;
  onStatusChange?: (id: string, status: JobStatus) => void;
}

const sourceColors: Record<string, string> = {
  LinkedIn: "bg-primary/10 text-primary border-primary/20",
  Naukri: "bg-success/10 text-success border-success/20",
  Indeed: "bg-warning/10 text-warning-foreground border-warning/20",
};

function scoreColor(score: number): string {
  if (score >= 80) return "bg-success/15 text-success border-success/30";
  if (score >= 60) return "bg-warning/15 text-warning-foreground border-warning/30";
  if (score >= 40) return "bg-muted text-muted-foreground border-border";
  return "bg-muted/50 text-muted-foreground/60 border-border/50";
}

const statusStyles: Record<JobStatus, string> = {
  "Not Applied": "bg-muted text-muted-foreground border-border",
  Applied: "bg-[hsl(210_60%_50%/0.15)] text-[hsl(210_60%_50%)] border-[hsl(210_60%_50%/0.3)]",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  Selected: "bg-success/15 text-success border-success/30",
};

const allStatuses: JobStatus[] = ["Not Applied", "Applied", "Rejected", "Selected"];

function formatPosted(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

const JobCard = ({ job, matchScore, isSaved, onToggleSave, onView, status = "Not Applied", onStatusChange }: JobCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-system-3 transition-system hover:border-primary/20">
      <div className="flex items-start justify-between gap-system-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
          <p className="mt-0.5 text-sm font-medium text-muted-foreground">{job.company}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {matchScore !== undefined && (
            <Badge variant="outline" className={`text-xs font-semibold ${scoreColor(matchScore)}`}>
              {matchScore}%
            </Badge>
          )}
          <Badge variant="outline" className={`text-xs ${sourceColors[job.source] || ""}`}>
            {job.source}
          </Badge>
        </div>
      </div>

      <div className="mt-system-2 flex flex-wrap items-center gap-x-system-2 gap-y-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location} · {job.mode}
        </span>
        <span>{job.experience === "Fresher" ? "Fresher" : `${job.experience} yrs`}</span>
        <span className="font-medium text-foreground">{job.salaryRange}</span>
      </div>

      {/* Status button group */}
      {onStatusChange && (
        <div className="mt-system-2 flex flex-wrap items-center gap-1">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(job.id, s)}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-system ${
                status === s ? statusStyles[s] : "border-transparent text-muted-foreground/60 hover:text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-system-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatPosted(job.postedDaysAgo)}
        </span>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onView(job)} className="gap-1 text-xs">
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleSave(job.id)}
            className={`gap-1 text-xs ${isSaved ? "text-primary" : ""}`}
          >
            {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button variant="ghost" size="sm" asChild className="gap-1 text-xs">
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Apply
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
