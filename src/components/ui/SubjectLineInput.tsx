"use client";

import { useCallback, useId, useRef, useState, useSyncExternalStore } from "react";
import { useAuth } from "@clerk/nextjs";
import { ChevronDown } from "lucide-react";
import {
  parseSubjectHistory, readSubjectHistory, rememberSubject, SUBJECT_HISTORY_EVENT,
} from "@/lib/subject-history";

function subscribeToHistory(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SUBJECT_HISTORY_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SUBJECT_HISTORY_EVENT, onChange);
  };
}

interface SubjectLineInputProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  onFocus?: () => void;
  className?: string;
  placeholder?: string;
}

export default function SubjectLineInput({ id, value, onValueChange, onFocus, className, placeholder }: SubjectLineInputProps) {
  const { userId } = useAuth();
  const getSnapshot = useCallback(() => readSubjectHistory(userId), [userId]);
  const rawHistory = useSyncExternalStore(subscribeToHistory, getSnapshot, () => null);
  const history = parseSubjectHistory(rawHistory);
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const subjects = showAll ? history : history.filter((subject) => subject.toLowerCase().includes(value.toLowerCase()));

  const selectSubject = (subject: string) => {
    onValueChange(subject);
    rememberSubject(userId, subject);
    setOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div className="relative" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        rememberSubject(userId, value);
        setOpen(false);
        setActiveIndex(-1);
      }
    }}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && subjects[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        className={`${className ?? ""} pr-12`}
        onFocus={() => { onFocus?.(); setShowAll(true); setOpen(true); }}
        onChange={(event) => {
          onValueChange(event.target.value);
          setShowAll(false);
          setOpen(true);
          setActiveIndex(-1);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            if (subjects.length) setActiveIndex((index) => event.key === "ArrowDown"
              ? (index + 1) % subjects.length
              : (index <= 0 ? subjects.length - 1 : index - 1));
          } else if (event.key === "Enter" && open && subjects[activeIndex]) {
            event.preventDefault();
            selectSubject(subjects[activeIndex]);
          } else if (event.key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            setOpen(false);
            setActiveIndex(-1);
          }
        }}
      />
      <button
        type="button"
        aria-label="Show previous subject lines"
        aria-expanded={open}
        aria-controls={listId}
        className="absolute right-1 top-1 h-[calc(100%-8px)] px-3 text-slate-500 hover:text-blue-600 rounded-lg cursor-pointer"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => { inputRef.current?.focus(); setShowAll(true); setActiveIndex(-1); setOpen(!open); }}
      >
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 z-30 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <p className="px-4 py-2 text-xs font-semibold text-slate-500">Previous subject lines</p>
          <div id={listId} role="listbox" aria-label="Previous subject lines" className="max-h-52 overflow-y-auto">
            {subjects.map((subject, index) => (
              <button
                key={subject}
                type="button"
                role="option"
                id={`${listId}-${index}`}
                aria-selected={index === activeIndex}
                tabIndex={-1}
                className={`block w-full px-4 py-2.5 text-left text-sm break-words hover:bg-blue-50 ${index === activeIndex ? "bg-blue-50 text-blue-700" : "text-slate-700"}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </div>
          {!subjects.length && <p className="px-4 py-3 text-sm text-slate-500">{history.length ? "No matching subjects" : "Subjects you enter will appear here."}</p>}
        </div>
      )}
    </div>
  );
}
