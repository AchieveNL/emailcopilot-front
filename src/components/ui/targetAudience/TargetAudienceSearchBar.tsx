import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

export interface TargetAudienceSearchBarProps {
  /** Called with the (debounced) search term whenever it changes. */
  onSearch: (query: string) => void;
  /** Controlled value. Omit to let the component manage its own input state. */
  value?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Debounce delay in ms before onSearch fires. Set to 0 to disable debouncing. */
  debounceMs?: number;
  /** Autofocus the input on mount. */
  autoFocus?: boolean;
  /** Extra classes for the outer wrapper, for layout/spacing overrides. */
  className?: string;
  /** Show the clear (x) button when there's text. Defaults to true. */
  clearable?: boolean;
}

function TargetAudienceSearchBar({
  onSearch,
  value,
  placeholder = "Search by name...",
  debounceMs = 250,
  autoFocus = false,
  className = "",
  clearable = true,
}: TargetAudienceSearchBarProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const query = isControlled ? value! : internalValue;

  // Keep internal state in sync if a controlled value changes externally.
  useEffect(() => {
    if (isControlled) setInternalValue(value!);
  }, [isControlled, value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    if (!isControlled) setInternalValue(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (debounceMs <= 0) {
      onSearch(next);
    } else {
      debounceRef.current = setTimeout(() => onSearch(next), debounceMs);
    }
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!isControlled) setInternalValue("");
    onSearch("");
  }

  return (
    <div className={`relative w-full max-w-xs ${className}`}>
      <Search
        size={16}
        strokeWidth={1.75}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search target audiences by name"
        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
      />
      {clearable && query.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={15} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}

export default TargetAudienceSearchBar;
