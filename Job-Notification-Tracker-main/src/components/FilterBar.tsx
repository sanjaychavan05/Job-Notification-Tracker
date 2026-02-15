import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export interface Filters {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  sort: string;
  status: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const FilterBar = ({ filters, onChange }: FilterBarProps) => {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap items-end gap-system-2">
      {/* Keyword */}
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search title or company…"
          value={filters.keyword}
          onChange={(e) => set("keyword", e.target.value)}
          className="bg-card pl-9"
        />
      </div>

      {/* Location */}
      <Select value={filters.location} onValueChange={(v) => set("location", v)}>
        <SelectTrigger className="w-[150px] bg-card">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="Bangalore">Bangalore</SelectItem>
          <SelectItem value="Hyderabad">Hyderabad</SelectItem>
          <SelectItem value="Chennai">Chennai</SelectItem>
          <SelectItem value="Mumbai">Mumbai</SelectItem>
          <SelectItem value="Pune">Pune</SelectItem>
          <SelectItem value="Noida">Noida</SelectItem>
          <SelectItem value="Gurgaon">Gurgaon</SelectItem>
          <SelectItem value="Mysore">Mysore</SelectItem>
        </SelectContent>
      </Select>

      {/* Mode */}
      <Select value={filters.mode} onValueChange={(v) => set("mode", v)}>
        <SelectTrigger className="w-[130px] bg-card">
          <SelectValue placeholder="Mode" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          <SelectItem value="all">All Modes</SelectItem>
          <SelectItem value="Remote">Remote</SelectItem>
          <SelectItem value="Hybrid">Hybrid</SelectItem>
          <SelectItem value="Onsite">Onsite</SelectItem>
        </SelectContent>
      </Select>

      {/* Experience */}
      <Select value={filters.experience} onValueChange={(v) => set("experience", v)}>
        <SelectTrigger className="w-[140px] bg-card">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="Fresher">Fresher</SelectItem>
          <SelectItem value="0-1">0–1 yrs</SelectItem>
          <SelectItem value="1-3">1–3 yrs</SelectItem>
          <SelectItem value="3-5">3–5 yrs</SelectItem>
        </SelectContent>
      </Select>

      {/* Source */}
      <Select value={filters.source} onValueChange={(v) => set("source", v)}>
        <SelectTrigger className="w-[130px] bg-card">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="LinkedIn">LinkedIn</SelectItem>
          <SelectItem value="Naukri">Naukri</SelectItem>
          <SelectItem value="Indeed">Indeed</SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}
      <Select value={filters.status} onValueChange={(v) => set("status", v)}>
        <SelectTrigger className="w-[150px] bg-card">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="Not Applied">Not Applied</SelectItem>
          <SelectItem value="Applied">Applied</SelectItem>
          <SelectItem value="Rejected">Rejected</SelectItem>
          <SelectItem value="Selected">Selected</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={filters.sort} onValueChange={(v) => set("sort", v)}>
        <SelectTrigger className="w-[150px] bg-card">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          <SelectItem value="latest">Latest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="matchScore">Match Score</SelectItem>
          <SelectItem value="salary">Salary (High)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;
