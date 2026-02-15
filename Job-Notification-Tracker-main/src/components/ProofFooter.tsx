import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";

interface ProofItem {
  id: string;
  label: string;
}

const defaultItems: ProofItem[] = [
  { id: "ui", label: "UI Built" },
  { id: "logic", label: "Logic Working" },
  { id: "test", label: "Test Passed" },
  { id: "deploy", label: "Deployed" },
];

const ProofFooter = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <footer className="border-t border-border px-system-4 py-system-3">
      <p className="mb-system-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Proof of Completion
      </p>
      <div className="flex flex-wrap gap-system-3">
        {defaultItems.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="flex items-center gap-2 text-sm transition-system hover:text-primary"
          >
            {checked[item.id] ? (
              <CheckSquare className="h-4 w-4 text-success" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={checked[item.id] ? "text-foreground" : "text-muted-foreground"}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default ProofFooter;
