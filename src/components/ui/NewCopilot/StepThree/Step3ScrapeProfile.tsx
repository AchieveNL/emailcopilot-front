"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Globe, X, Map as MapIcon, Building2 } from "lucide-react";
import { Country, City, ICountry, ICity } from "country-state-city";
import StepsActions from "../StepsActions";
import { useCopilotStore } from "@/store/copilotStore";

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
      .slice(0, 50); // cap results for performance
  }, [options, selected, query]);

  // Close on outside click
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Backspace" && query === "" && selected.length > 0) {
      onRemove(selected[selected.length - 1]);
    }
    if (e.key === "Enter" && query.trim() !== "") {
      e.preventDefault();
      if (allowCustom && !selected.includes(query.trim())) {
        onAdd(query.trim());
        setQuery("");
        setOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="md:col-span-2 relative">
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
          className="no-focus-ring flex-1 min-w-[80px] outline-none focus:outline-none focus:ring-0 focus:border-none text-sm bg-transparent placeholder:text-gray-400"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {selected.length > 0 && (
          <button
            type="button"
            className="ml-auto text-gray-300 hover:text-gray-400 transition-colors shrink-0"
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

/** Build a Map of country name → ICountry for O(1) lookups */
function buildCountryMap(): Map<string, ICountry> {
  const map = new Map<string, ICountry>();
  for (const c of Country.getAllCountries()) {
    map.set(c.name, c);
  }
  return map;
}

const COUNTRY_MAP = buildCountryMap();
const ALL_COUNTRY_NAMES = Array.from(COUNTRY_MAP.keys());

/** Get city names for the given country names */
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

  // Return sorted, deduplicated city names
  return Array.from(citySet).sort((a, b) => a.localeCompare(b));
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function Step3ScrapeProfile() {
  const { copilotData, updateTargetProfile, setStep } = useCopilotStore();
  const { industries, countries, cities } = copilotData.targetProfile;

  // Derive available cities from selected countries
  const availableCities = useMemo(
    () => getCitiesForCountries(countries),
    [countries],
  );

  // When a country is removed, also remove cities that no longer belong
  const handleRemoveCountry = useCallback(
    (countryName: string) => {
      const remaining = countries.filter((c) => c !== countryName);

      // Recompute valid cities and prune orphaned selections
      const validCities = new Set(getCitiesForCountries(remaining));
      const remainingCities = cities.filter((city) => validCities.has(city));

      updateTargetProfile({ countries: remaining, cities: remainingCities });
    },
    [countries, cities, updateTargetProfile],
  );

  const handleClearCountries = useCallback(() => {
    updateTargetProfile({ countries: [], cities: [] });
  }, [updateTargetProfile]);

  const canContinue = industries.length > 0;

  return (
    <>
      <h2 className="text-lg font-bold mb-1">Define your target profile</h2>
      <p className="text-sm text-gray-500 mb-12">
        Tell your copilot who you want to reach and we'll find the best matches.
      </p>

      <div className="space-y-8">
        {/* Industry */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
          <div>
            <h3 className="text-sm relative font-bold text-gray-900">
              Industry
              <span className="text-sm font-semibold  text-red-500 absolute">
                *
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Choose the industry of your target companies.
            </p>
          </div>
          <TagInput
            icon={<Building2 size={15} />}
            allowCustom
            selected={industries}
            onAdd={(v) =>
              updateTargetProfile({ industries: [...industries, v] })
            }
            onRemove={(v) =>
              updateTargetProfile({
                industries: industries.filter((i) => i !== v),
              })
            }
            onClearAll={() => updateTargetProfile({ industries: [] })}
            placeholder="Type and press Enter to add industries…"
          />
        </div>

        {/* Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Country</h3>
            <p className="text-xs text-gray-500 mt-1">
              In which countries are your target companies located?
            </p>
          </div>
          <TagInput
            icon={<Globe size={15} />}
            options={ALL_COUNTRY_NAMES}
            selected={countries}
            onAdd={(v) => updateTargetProfile({ countries: [...countries, v] })}
            onRemove={handleRemoveCountry}
            onClearAll={handleClearCountries}
            placeholder="Search countries…"
          />
        </div>

        {/* Cities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-start">
          <div>
            <h3 className="text-sm font-bold text-gray-900">City</h3>
            <p className="text-xs text-gray-500 mt-1">
              In which cities are your target companies located?
            </p>
          </div>
          <TagInput
            icon={<MapIcon size={15} />}
            options={availableCities}
            selected={cities}
            onAdd={(v) => updateTargetProfile({ cities: [...cities, v] })}
            onRemove={(v) =>
              updateTargetProfile({ cities: cities.filter((c) => c !== v) })
            }
            onClearAll={() => updateTargetProfile({ cities: [] })}
            placeholder={
              countries.length === 0
                ? "Select a country first…"
                : "Search cities…"
            }
            emptyMessage={
              countries.length === 0
                ? "Please select a country first"
                : "No cities found"
            }
          />
        </div>
      </div>
      <StepsActions
        onPress={() => {
          console.log("copilot data", copilotData);
          setStep(4);
        }}
        canContinue={!canContinue}
      />
    </>
  );
}
