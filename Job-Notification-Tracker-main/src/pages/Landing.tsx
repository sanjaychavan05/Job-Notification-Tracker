import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-system-3 py-system-5">
        <div className="max-w-prose text-center">
          <h1 className="text-5xl leading-tight text-foreground md:text-6xl">
            Stop Missing The Right Jobs.
          </h1>
          <p className="mx-auto mt-system-3 max-w-lg text-lg text-muted-foreground">
            Precision-matched job discovery delivered daily at 9AM.
          </p>
          <div className="mt-system-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/settings">
                Start Tracking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Minimal footer */}
      <footer className="border-t border-border py-system-2 text-center text-sm text-muted-foreground">
        KodNest Premium Build System
      </footer>
    </div>
  );
};

export default Landing;
