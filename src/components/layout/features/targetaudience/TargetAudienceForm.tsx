"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Globe, X, Map as MapIcon, Building2 } from "lucide-react";
import { Country, City, ICountry, ICity } from "country-state-city";
import { targetAudiencesApi } from "@/lib/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

// ── TagInput ─────────────────────────────────────────────────────────────────

interface TagInputProps {
  icon: React.ReactNode;
  options?: string[];
  selected: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  onClearAll: () => void;
  placeholder?: string;
  emptyMessage?: string;
  allowCustom?: boolean;
}

function TagInput({
  icon,
  options = [],
  selected,
  onAdd,
  onRemove,
  onClearAll,
  placeholder = "Type to search…",
  emptyMessage = "No results found",
  allowCustom = false,
}: TagInputProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options
      .filter((o) => !selected.includes(o) && o.toLowerCase().includes(q))
      .slice(0, 50);
  }, [options, selected, query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      onAdd(value);
      setQuery("");
      setOpen(false);
      inputRef.current?.focus();
    },
    [onAdd],
  );

  // NEW: commits whatever is currently typed as a tag, used on blur
  // (mobile-friendly — no Enter press required) and reused by keyboard handlers.
  const commitCustomValue = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed !== "" && !selected.includes(trimmed)) {
      onAdd(trimmed);
    }
    setQuery("");
  }, [query, selected, onAdd]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Backspace" && query === "" && selected.length > 0) {
      onRemove(selected[selected.length - 1]);
    }
    if ((e.key === "Enter" || e.key === "Tab") && query.trim() !== "") {
      if (e.key === "Enter") {
        e.preventDefault();
      }
      if (allowCustom) {
        commitCustomValue();
        setOpen(false);
      } else if (filtered.length > 0) {
        const match =
          filtered.find(
            (o) => o.toLowerCase() === query.trim().toLowerCase(),
          ) || filtered[0];
        if (!selected.includes(match)) {
          onAdd(match);
        }
        setQuery("");
        setOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <div
        className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 min-h-10.5 flex-wrap cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <span className="text-gray-400 shrink-0">{icon}</span>

        {selected.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 bg-primary-light text-primary text-xs font-medium px-2.5 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              className="hover:opacity-70 transition-opacity"
              onMouseDown={(e) => e.preventDefault()} // prevent blur-commit stealing focus mid-remove
              onClick={(e) => {
                e.stopPropagation();
                onRemove(tag);
              }}
            >
              <X size={11} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="no-focus-ring flex-1 min-w-20 outline-none focus:outline-none focus:ring-0 focus:border-none text-sm bg-transparent placeholder:text-gray-400"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (allowCustom) {
              commitCustomValue();
            }
            setOpen(false);
          }}
        />

        {selected.length > 0 && (
          <button
            type="button"
            className="ml-auto text-gray-300 hover:text-gray-400 transition-colors shrink-0"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              onClearAll();
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && !allowCustom && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg py-1">
          {filtered.map((option) => (
            <li
              key={option}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-primary-light hover:text-primary cursor-pointer transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(option);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {open && query.length > 0 && filtered.length === 0 && !allowCustom && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg py-3 px-3 text-sm text-gray-400 text-center">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildCountryMap(): Map<string, ICountry> {
  const map = new Map<string, ICountry>();
  for (const c of Country.getAllCountries()) {
    map.set(c.name, c);
  }
  return map;
}

const COUNTRY_MAP = buildCountryMap();
const ALL_COUNTRY_NAMES = Array.from(COUNTRY_MAP.keys());

function getCitiesForCountries(countryNames: string[]): string[] {
  const citySet = new Set<string>();

  for (const name of countryNames) {
    const country = COUNTRY_MAP.get(name);
    if (!country) continue;

    const cities: ICity[] = City.getCitiesOfCountry(country.isoCode) ?? [];
    for (const city of cities) {
      citySet.add(city.name);
    }
  }

  return Array.from(citySet).sort((a, b) => a.localeCompare(b));
}

import type { TargetAudience } from "@/../store/copilotStore";

// ── Main Component ───────────────────────────────────────────────────────────

interface TargetAudienceFormProps {
  initialData?: TargetAudience | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function TargetAudienceForm({
  initialData,
  onCancel,
  onSuccess,
}: TargetAudienceFormProps) {
  const parseArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string")
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  };

  const [name, setName] = useState(initialData?.name || "");
  const [industries, setIndustries] = useState<string[]>(
    parseArray(initialData?.searchQuery),
  );
  const [countries, setCountries] = useState<string[]>(
    parseArray(initialData?.country),
  );
  const [cities, setCities] = useState<string[]>(parseArray(initialData?.city));
  const [saving, setSaving] = useState(false);

  const { user } = useUser();

  const availableCities = useMemo(
    () => getCitiesForCountries(countries),
    [countries],
  );

  const handleRemoveCountry = useCallback(
    (countryName: string) => {
      const remaining = countries.filter((c) => c !== countryName);

      // Recompute valid cities and prune orphaned selections
      const validCities = new Set(getCitiesForCountries(remaining));
      const remainingCities = cities.filter((city) => validCities.has(city));

      setCountries(remaining);
      setCities(remainingCities);
    },
    [countries, cities],
  );

  const handleClearCountries = useCallback(() => {
    setCountries([]);
    setCities([]);
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Profile Name is required.");
      return;
    }
    if (industries.length === 0) {
      toast.error("At least one Industry (Search Query) is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name,
        searchQuery: industries[0],
        country: countries[0],
        city: cities[0],
      };

      if (initialData) {
        await targetAudiencesApi.update(initialData.id, payload);
        toast.success("Target Audience updated successfully");
      } else {
        await targetAudiencesApi.create(payload);
        console.log("Created new Target Audience:", payload);
        toast.success("Target Audience created successfully");
      }
      onSuccess();
    } catch (error) {
      toast.error(
        initialData
          ? "Failed to update Target Audience."
          : "Failed to create Target Audience.",
      );
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
      <h2 className="text-lg font-bold mb-1">Define your Target Audience</h2>
      <p className="text-sm text-gray-500 mb-8">
        Tell your copilot who you want to reach and we`&apos;`ll find the best
        matches.
      </p>
      <div className="space-y-4">
        <div>
          <label className="text-lg font-bold mb-1">
            Target Audience Name <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2 ">
            Give your target a name so you can easily identify it later
          </p>
          <input
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="E.g. Tech Leads in Amsterdam"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-lg font-bold  mb-1">
            Industry <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Choose the industry of your target companies.
          </p>
          <TagInput
            icon={<Building2 size={15} />}
            allowCustom
            selected={industries}
            onAdd={(v) => setIndustries([...industries, v])}
            onRemove={(v) => setIndustries(industries.filter((i) => i !== v))}
            onClearAll={() => setIndustries([])}
            placeholder="Type and press Enter to add industries..."
          />
        </div>

        <div>
          <label className="text-lg font-bold  mb-1">Country</label>
          <p className="text-sm text-gray-500 mb-2">
            In which countries are you target companies located?
          </p>
          <TagInput
            icon={<Globe size={15} />}
            options={ALL_COUNTRY_NAMES}
            selected={countries}
            onAdd={(v) => setCountries([...countries, v])}
            onRemove={handleRemoveCountry}
            onClearAll={handleClearCountries}
            placeholder="Search countries..."
          />
        </div>

        <div>
          <label className="text-lg font-bold mb-1">City</label>
          <p className="text-sm text-gray-500 mb-2">
            In which cities are you target companies located?
          </p>
          <TagInput
            icon={<MapIcon size={15} />}
            options={availableCities}
            selected={cities}
            onAdd={(v) => setCities([...cities, v])}
            onRemove={(v) => setCities(cities.filter((c) => c !== v))}
            onClearAll={() => setCities([])}
            placeholder={
              countries.length === 0
                ? "Select a country first..."
                : "Search cities..."
            }
            emptyMessage={
              countries.length === 0
                ? "Please select a country first"
                : "No cities found"
            }
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={saving}
          className="flex-1 bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Create Profile"}
        </button>
      </div>
    </div>
  );
}
