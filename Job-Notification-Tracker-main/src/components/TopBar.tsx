import logo from "@/assets/kodnest-logo.png";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  projectName?: string;
  currentStep?: number;
  totalSteps?: number;
  status?: "Not Started" | "In Progress" | "Shipped";
}

const statusColors: Record<string, string> = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-warning/15 text-warning-foreground",
  "Shipped": "bg-success/15 text-success",
};

const TopBar = ({
  projectName = "KodNest Premium Build",
  currentStep = 1,
  totalSteps = 5,
  status = "Not Started",
}: TopBarProps) => {
  return (
    <header className="flex items-center justify-between border-b border-border px-system-4 py-system-2">
      <div className="flex items-center gap-system-2">
        <img src={logo} alt="KodNest" className="h-8 w-8" />
        <span className="text-sm font-medium text-foreground">{projectName}</span>
      </div>

      <div className="text-sm text-muted-foreground">
        Step {currentStep} / {totalSteps}
      </div>

      <Badge variant="outline" className={`${statusColors[status]} border-0 text-xs font-medium`}>
        {status}
      </Badge>
    </header>
  );
};

export default TopBar;
