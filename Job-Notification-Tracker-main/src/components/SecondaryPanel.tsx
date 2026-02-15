import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check, AlertCircle, ImagePlus } from "lucide-react";

interface SecondaryPanelProps {
  stepTitle: string;
  stepDescription: string;
  promptText: string;
}

const SecondaryPanel = ({
  stepTitle = "Step Guidance",
  stepDescription = "Follow the instructions in the primary workspace. Use the prompt below if needed.",
  promptText = "Create a responsive dashboard layout with a sidebar navigation and main content area.",
}: SecondaryPanelProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="flex flex-col gap-system-3 border-l border-border p-system-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground font-serif">{stepTitle}</h3>
        <p className="mt-system-1 text-sm text-muted-foreground leading-relaxed">
          {stepDescription}
        </p>
      </div>

      {/* Prompt Box */}
      <div className="rounded-md border border-border bg-muted/50 p-system-2">
        <p className="text-sm text-foreground font-mono leading-relaxed">{promptText}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-system-1">
        <Button variant="default" size="sm" onClick={handleCopy} className="justify-start">
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Copied" : "Copy Prompt"}
        </Button>

        <Button variant="secondary" size="sm" className="justify-start">
          <ExternalLink className="mr-2 h-4 w-4" />
          Build in Lovable
        </Button>

        <Button variant="success" size="sm" className="justify-start">
          <Check className="mr-2 h-4 w-4" />
          It Worked
        </Button>

        <Button variant="outline" size="sm" className="justify-start">
          <AlertCircle className="mr-2 h-4 w-4" />
          Report Error
        </Button>

        <Button variant="ghost" size="sm" className="justify-start">
          <ImagePlus className="mr-2 h-4 w-4" />
          Add Screenshot
        </Button>
      </div>
    </aside>
  );
};

export default SecondaryPanel;
