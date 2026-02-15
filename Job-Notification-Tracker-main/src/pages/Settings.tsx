import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";
import { usePreferences, defaultPreferences, type Preferences } from "@/hooks/usePreferences";
import { useToast } from "@/hooks/use-toast";

const ALL_LOCATIONS = [
  "Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune", "Noida", "Gurgaon", "Mysore",
];

const MODES = ["Remote", "Hybrid", "Onsite"] as const;

const Settings = () => {
  const { preferences, save } = usePreferences();
  const { toast } = useToast();
  const [form, setForm] = useState<Preferences>(preferences);

  useEffect(() => {
    setForm(preferences);
  }, [preferences]);

  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleLocation = (loc: string) => {
    set(
      "preferredLocations",
      form.preferredLocations.includes(loc)
        ? form.preferredLocations.filter((l) => l !== loc)
        : [...form.preferredLocations, loc]
    );
  };

  const toggleMode = (mode: string) => {
    set(
      "preferredMode",
      form.preferredMode.includes(mode)
        ? form.preferredMode.filter((m) => m !== mode)
        : [...form.preferredMode, mode]
    );
  };

  const handleSave = () => {
    save(form);
    toast({ title: "Preferences saved", description: "Your job matching preferences have been updated." });
  };

  return (
    <div className="mx-auto max-w-7xl px-system-3 py-system-5">
      <div className="max-w-prose">
        <h1 className="text-4xl text-foreground">Settings</h1>
        <p className="mt-system-1 text-base text-muted-foreground">
          Configure your job tracking preferences for intelligent matching.
        </p>
      </div>

      <div className="mt-system-4 max-w-lg space-y-system-3">
        {/* Role Keywords */}
        <div className="space-y-system-1">
          <Label htmlFor="keywords" className="text-sm font-medium text-foreground">
            Role Keywords
          </Label>
          <Input
            id="keywords"
            placeholder="e.g. Frontend, React, SDE Intern"
            className="bg-card"
            value={form.roleKeywords}
            onChange={(e) => set("roleKeywords", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated keywords to match job titles and descriptions.
          </p>
        </div>

        {/* Preferred Locations */}
        <div className="space-y-system-1">
          <Label className="text-sm font-medium text-foreground">
            Preferred Locations
          </Label>
          <div className="flex flex-wrap gap-2">
            {ALL_LOCATIONS.map((loc) => {
              const selected = form.preferredLocations.includes(loc);
              return (
                <Badge
                  key={loc}
                  variant={selected ? "default" : "outline"}
                  className={`cursor-pointer select-none transition-system ${
                    selected ? "" : "hover:bg-muted"
                  }`}
                  onClick={() => toggleLocation(loc)}
                >
                  {loc}
                  {selected && <X className="ml-1 h-3 w-3" />}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Work Mode */}
        <div className="space-y-system-1">
          <Label className="text-sm font-medium text-foreground">
            Work Mode
          </Label>
          <div className="flex gap-system-3">
            {MODES.map((mode) => (
              <label key={mode} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <Checkbox
                  checked={form.preferredMode.includes(mode)}
                  onCheckedChange={() => toggleMode(mode)}
                />
                {mode}
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-system-1">
          <Label className="text-sm font-medium text-foreground">
            Experience Level
          </Label>
          <Select
            value={form.experienceLevel}
            onValueChange={(v) => set("experienceLevel", v)}
          >
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="Fresher">Fresher</SelectItem>
              <SelectItem value="0-1">0–1 years</SelectItem>
              <SelectItem value="1-3">1–3 years</SelectItem>
              <SelectItem value="3-5">3–5 years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div className="space-y-system-1">
          <Label htmlFor="skills" className="text-sm font-medium text-foreground">
            Skills
          </Label>
          <Input
            id="skills"
            placeholder="e.g. React, TypeScript, Java, Python"
            className="bg-card"
            value={form.skills}
            onChange={(e) => set("skills", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated skills to match against job requirements.
          </p>
        </div>

        {/* Min Match Score */}
        <div className="space-y-system-1">
          <Label className="text-sm font-medium text-foreground">
            Minimum Match Score: {form.minMatchScore}%
          </Label>
          <Slider
            value={[form.minMatchScore]}
            onValueChange={([v]) => set("minMatchScore", v)}
            min={0}
            max={100}
            step={5}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Only jobs scoring above this threshold appear when the filter is active.
          </p>
        </div>

        <div className="flex items-center gap-system-2 pt-system-2">
          <Button onClick={handleSave} className="gap-1">
            <Check className="h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
