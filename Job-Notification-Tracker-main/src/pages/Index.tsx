import TopBar from "@/components/TopBar";
import ContextHeader from "@/components/ContextHeader";
import PrimaryWorkspace from "@/components/PrimaryWorkspace";
import SecondaryPanel from "@/components/SecondaryPanel";
import ProofFooter from "@/components/ProofFooter";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar
        projectName="KodNest Premium Build"
        currentStep={1}
        totalSteps={5}
        status="In Progress"
      />

      <ContextHeader
        headline="Design System Foundation"
        subtext="Establish the visual language before building features. Every component inherits from this system."
      />

      <div className="flex flex-1">
        {/* Primary Workspace — 70% */}
        <div className="w-[70%]">
          <PrimaryWorkspace />
        </div>

        {/* Secondary Panel — 30% */}
        <div className="w-[30%]">
          <SecondaryPanel
            stepTitle="What to do"
            stepDescription="Review every component below. Confirm the typography, colors, spacing, and interaction states match the spec."
            promptText="Create a premium SaaS design system with off-white background, deep red accent, serif headings, and clean sans-serif body text."
          />
        </div>
      </div>

      <ProofFooter />
    </div>
  );
};

export default Index;
