"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  dark?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  className,
  disabled = false,
  dark = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);
  const displayText = selected?.label ?? placeholder;

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  useEffect(() => {
    if (open && highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlightedIndex]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          close();
        } else {
          setOpen(true);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) { setOpen(true); break; }
        setHighlightedIndex((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) { setOpen(true); break; }
        setHighlightedIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case "Escape":
        close();
        break;
    }
  }

  const inputId = label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-xs font-medium uppercase tracking-[0.06em] font-sans",
            dark ? "text-white/50" : "text-muted"
          )}
        >
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-11 w-full rounded-lg border px-4 pr-10 text-left font-sans text-sm transition-colors",
            dark
              ? "bg-white/5 border-white/15 text-white"
              : "bg-white border-line",
            !selected && (dark ? "text-white/40" : "text-muted/60"),
            open && "border-blue ring-2 ring-blue/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          {displayText}
        </button>
        <ChevronDown
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-transform",
            dark ? "text-white/40" : "text-muted",
            open && "rotate-180"
          )}
        />
        {open && (
          <ul
            ref={listRef}
            role="listbox"
            className="absolute z-[60] mt-1.5 w-full max-h-60 overflow-auto rounded-lg border border-line bg-white shadow-lg py-1 font-sans text-sm scrollbar-thin"
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value;
              const isHighlighted = i === highlightedIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    close();
                  }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors",
                    isHighlighted && "bg-blue/5",
                    isSelected ? "text-blue font-medium" : "text-ink"
                  )}
                >
                  {opt.label}
                  {isSelected && <Check className="h-4 w-4 text-blue" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && <p className="text-xs text-danger font-sans">{error}</p>}
    </div>
  );
}

/** Compact variant for inline filters (no label, smaller size). */
export function DropdownCompact({
  options,
  value,
  onChange,
  className,
}: {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "h-8 pl-3 pr-8 rounded-lg border border-line text-xs font-sans text-ink bg-white text-left",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-[length:16px] bg-[right_6px_center] bg-no-repeat",
          "focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/20 transition-colors",
          className
        )}
      >
        {selected?.label ?? "Select"}
      </button>
      {open && (
        <ul className="absolute z-[60] mt-1.5 right-0 w-max min-w-[140px] max-h-60 overflow-auto rounded-lg border border-line bg-white shadow-lg py-1 font-sans text-sm scrollbar-thin">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-2 cursor-pointer transition-colors whitespace-nowrap",
                  "hover:bg-blue/5",
                  isSelected ? "text-blue font-medium" : "text-ink"
                )}
              >
                {opt.label}
                {isSelected && <Check className="h-3.5 w-3.5 text-blue" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
