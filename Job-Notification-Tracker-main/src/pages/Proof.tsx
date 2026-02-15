import { useState, useCallback, useMemo } from "react";
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Info,
  Copy,
  Circle,
  Loader2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

/* ─── Test Checklist ─── */

interface TestItem {
  id: string;
  label: string;
  howToTest: string;
}

const testItems: TestItem[] = [
  { id: "prefs_persist", label: "Preferences persist after refresh", howToTest: "Go to Settings, save preferences, refresh the page, and confirm they are still there." },
  { id: "match_score", label: "Match score calculates correctly", howToTest: "Set preferences with specific keywords/locations, then verify Dashboard job scores reflect those criteria." },
  { id: "threshold_toggle", label: '"Show only matches" toggle works', howToTest: "Enable the threshold toggle on Dashboard and confirm only jobs above your minimum score appear." },
  { id: "save_persist", label: "Save job persists after refresh", howToTest: "Bookmark a job on Dashboard, refresh, then check the Saved page to confirm it's still there." },
  { id: "apply_tab", label: "Apply opens in new tab", howToTest: "Click the Apply button on any job card and verify it opens the link in a new browser tab." },
  { id: "status_persist", label: "Status update persists after refresh", howToTest: "Change a job's status to 'Applied', refresh the page, and confirm the status badge still shows 'Applied'." },
  { id: "status_filter", label: "Status filter works correctly", howToTest: "Set a job to 'Applied', then use the status dropdown filter on Dashboard to show only 'Applied' jobs." },
  { id: "digest_top10", label: "Digest generates top 10 by score", howToTest: "Generate a digest on the Digest page and verify it lists the 10 highest-scoring jobs." },
  { id: "digest_persist", label: "Digest persists for the day", howToTest: "Generate a digest, refresh the page, and confirm the same digest loads without regenerating." },
  { id: "no_console_errors", label: "No console errors on main pages", howToTest: "Open browser DevTools Console, navigate through Dashboard, Saved, Digest, Settings, and Proof — check for errors." },
];

const CHECKLIST_KEY = "jobTrackerTestChecklist";

function loadChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveChecked(data: Record<string, boolean>) {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(data));
}

/* ─── Steps ─── */

const steps = [
  "Job Data & Card Layout",
  "Preferences & Match Scoring",
  "Dashboard Filters & Sorting",
  "Save & Bookmark System",
  "Daily Digest Engine",
  "Status Tracking & Notifications",
  "Test Checklist System",
  "Proof & Final Submission",
];

/* ─── Artifact Links ─── */

const LINKS_KEY = "jobTrackerProofLinks";

interface ProofLinks {
  lovable: string;
  github: string;
  deployed: string;
}

function loadLinks(): ProofLinks {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    return raw ? JSON.parse(raw) : { lovable: "", github: "", deployed: "" };
  } catch { return { lovable: "", github: "", deployed: "" }; }
}
function saveLinks(data: ProofLinks) {
  localStorage.setItem(LINKS_KEY, JSON.stringify(data));
}

function isValidUrl(str: string): boolean {
  if (!str.trim()) return false;
  try {
    const url = new URL(str.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch { return false; }
}

/* ─── Component ─── */

const Proof = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);
  const [links, setLinks] = useState<ProofLinks>(loadLinks);
  const { toast } = useToast();

  // Checklist logic
  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveChecked(next);
      return next;
    });
  }, []);

  const resetChecklist = useCallback(() => {
    saveChecked({});
    setChecked({});
  }, []);

  const passed = testItems.filter((t) => checked[t.id]).length;
  const total = testItems.length;
  const allTestsPassed = passed === total;

  // Links logic
  const updateLink = useCallback((field: keyof ProofLinks, value: string) => {
    setLinks((prev) => {
      const next = { ...prev, [field]: value };
      saveLinks(next);
      return next;
    });
  }, []);

  const allLinksValid = useMemo(
    () => isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deployed),
    [links]
  );

  // Ship status
  const shipStatus = useMemo(() => {
    if (allTestsPassed && allLinksValid) return "Shipped" as const;
    if (passed > 0 || links.lovable || links.github || links.deployed) return "In Progress" as const;
    return "Not Started" as const;
  }, [allTestsPassed, allLinksValid, passed, links]);

  const canShip = shipStatus === "Shipped";

  // Copy submission
  const copySubmission = useCallback(() => {
    const text = `Job Notification Tracker — Final Submission

Lovable Project:
${links.lovable.trim()}

GitHub Repository:
${links.github.trim()}

Live Deployment:
${links.deployed.trim()}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced`;

    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Submission copied to clipboard" });
    });
  }, [links, toast]);

  const statusColor = {
    "Not Started": "bg-muted text-muted-foreground",
    "In Progress": "bg-warning/15 text-warning border-warning/30",
    Shipped: "bg-success/15 text-success border-success/30",
  }[shipStatus];

  return (
    <div className="mx-auto max-w-7xl px-system-3 py-system-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="max-w-prose">
          <h1 className="text-4xl text-foreground">Proof & Submission</h1>
          <p className="mt-system-1 text-base text-muted-foreground">
            Project 1 — Job Notification Tracker
          </p>
        </div>
        <Badge variant="outline" className={`text-xs font-medium ${statusColor}`}>
          {shipStatus === "In Progress" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          {shipStatus === "Shipped" && <CheckCircle2 className="mr-1 h-3 w-3" />}
          {shipStatus === "Not Started" && <Circle className="mr-1 h-3 w-3" />}
          {shipStatus}
        </Badge>
      </div>

      {/* Shipped confirmation */}
      {canShip && (
        <div className="mt-system-3 flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 px-system-3 py-system-2">
          <ShieldCheck className="h-5 w-5 text-success" />
          <p className="text-sm text-foreground">Project 1 Shipped Successfully.</p>
        </div>
      )}

      {/* ─── Section A: Step Completion Summary ─── */}
      <div className="mt-system-3">
        <h2 className="text-xl text-foreground">Step Completion Summary</h2>
        <div className="mt-system-2 rounded-lg border border-border bg-card divide-y divide-border">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 px-system-3 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="flex-1 text-sm text-foreground">
                Step {i + 1}: {step}
              </span>
              <span className="text-xs text-success font-medium">Completed</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section B: Artifact Links ─── */}
      <div className="mt-system-3">
        <h2 className="text-xl text-foreground">Artifact Collection</h2>
        <div className="mt-system-2 rounded-lg border border-border bg-card p-system-3 space-y-system-2">
          {([
            { key: "lovable" as const, label: "Lovable Project Link", placeholder: "https://lovable.dev/projects/..." },
            { key: "github" as const, label: "GitHub Repository Link", placeholder: "https://github.com/..." },
            { key: "deployed" as const, label: "Deployed URL", placeholder: "https://your-app.vercel.app" },
          ]).map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <Label className="text-sm text-foreground">{label}</Label>
              <div className="flex gap-2">
                <Input
                  value={links[key]}
                  onChange={(e) => updateLink(key, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1"
                />
                {links[key] && (
                  isValidUrl(links[key]) ? (
                    <a
                      href={links[key].trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-system hover:text-foreground hover:bg-muted"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="inline-flex h-10 items-center text-xs text-destructive px-2">Invalid URL</span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Section C: Test Checklist ─── */}
      <div className="mt-system-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-foreground">Test Checklist</h2>
          <Button variant="outline" size="sm" onClick={resetChecklist} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>

        {/* Progress */}
        <div className="mt-system-2 rounded-lg border border-border bg-card p-system-3">
          <div className="flex items-center gap-3">
            {allTestsPassed ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-warning" />
            )}
            <p className="text-sm font-medium text-foreground">
              Tests Passed: {passed} / {total}
            </p>
            {!allTestsPassed && (
              <p className="text-xs text-muted-foreground">— Resolve all issues before shipping.</p>
            )}
          </div>
          <Progress value={(passed / total) * 100} className="mt-system-2 h-2" />
        </div>

        {/* Items */}
        <div className="mt-system-1 rounded-lg border border-border bg-card divide-y divide-border">
          {testItems.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 px-system-3 py-3 transition-system hover:bg-muted/50"
            >
              <Checkbox
                checked={!!checked[item.id]}
                onCheckedChange={() => toggle(item.id)}
              />
              <span className={`flex-1 text-sm ${checked[item.id] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {item.label}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="rounded p-1 text-muted-foreground transition-system hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs text-xs">
                  {item.howToTest}
                </TooltipContent>
              </Tooltip>
            </label>
          ))}
        </div>
      </div>

      {/* ─── Final Submission ─── */}
      <div className="mt-system-3 rounded-lg border border-border bg-card p-system-3">
        <h2 className="text-xl text-foreground">Final Submission</h2>
        {!canShip && (
          <p className="mt-system-1 text-sm text-muted-foreground">
            Complete all {total} test items and provide all 3 artifact links to unlock submission.
          </p>
        )}
        <Button
          className="mt-system-2 gap-2"
          disabled={!canShip}
          onClick={copySubmission}
        >
          <Copy className="h-4 w-4" />
          Copy Final Submission
        </Button>
      </div>

      <p className="mt-system-2 text-center text-xs text-muted-foreground">
        Manual verification — all checks and links are persisted locally.
      </p>
    </div>
  );
};

export default Proof;
