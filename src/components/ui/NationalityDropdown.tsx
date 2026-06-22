"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  AF, AL, DZ, AR, AT, AU, BD, BE, BR, BG, CA, CL, CN, CO, HR,
  CZ, DK, EG, EE, FI, FR, DE, GR, HU, IN, ID, IR, IQ, IE, IL,
  IT, JP, JO, KZ, KE, KW, LV, LB, LT, LU, MY, MX, MA, NL, NZ,
  NG, NO, PK, PS, PH, PL, PT, QA, RO, RU, SA, RS, SG, SK, SI,
  ZA, KR, ES, LK, SE, CH, SY, TW, TH, TN, TR, UA, AE, GB, US, VN, YE,
} from "country-flag-icons/react/3x2";
import type { ComponentType } from "react";

interface FlagOption {
  value: string;
  label: string;
  Flag: ComponentType<{ className?: string; title?: string }>;
}

const NATIONALITIES: FlagOption[] = [
  { value: "", label: "Select nationality", Flag: ({ className }) => <span className={className} /> },
  { value: "Afghanistan", label: "Afghanistan", Flag: AF },
  { value: "Albania", label: "Albania", Flag: AL },
  { value: "Algeria", label: "Algeria", Flag: DZ },
  { value: "Argentina", label: "Argentina", Flag: AR },
  { value: "Australia", label: "Australia", Flag: AU },
  { value: "Austria", label: "Austria", Flag: AT },
  { value: "Bangladesh", label: "Bangladesh", Flag: BD },
  { value: "Belgium", label: "Belgium", Flag: BE },
  { value: "Brazil", label: "Brazil", Flag: BR },
  { value: "Bulgaria", label: "Bulgaria", Flag: BG },
  { value: "Canada", label: "Canada", Flag: CA },
  { value: "Chile", label: "Chile", Flag: CL },
  { value: "China", label: "China", Flag: CN },
  { value: "Colombia", label: "Colombia", Flag: CO },
  { value: "Croatia", label: "Croatia", Flag: HR },
  { value: "Czech Republic", label: "Czech Republic", Flag: CZ },
  { value: "Denmark", label: "Denmark", Flag: DK },
  { value: "Egypt", label: "Egypt", Flag: EG },
  { value: "Estonia", label: "Estonia", Flag: EE },
  { value: "Finland", label: "Finland", Flag: FI },
  { value: "France", label: "France", Flag: FR },
  { value: "Germany", label: "Germany", Flag: DE },
  { value: "Greece", label: "Greece", Flag: GR },
  { value: "Hungary", label: "Hungary", Flag: HU },
  { value: "India", label: "India", Flag: IN },
  { value: "Indonesia", label: "Indonesia", Flag: ID },
  { value: "Iran", label: "Iran", Flag: IR },
  { value: "Iraq", label: "Iraq", Flag: IQ },
  { value: "Ireland", label: "Ireland", Flag: IE },
  { value: "Israel", label: "Israel", Flag: IL },
  { value: "Italy", label: "Italy", Flag: IT },
  { value: "Japan", label: "Japan", Flag: JP },
  { value: "Jordan", label: "Jordan", Flag: JO },
  { value: "Kazakhstan", label: "Kazakhstan", Flag: KZ },
  { value: "Kenya", label: "Kenya", Flag: KE },
  { value: "Kuwait", label: "Kuwait", Flag: KW },
  { value: "Latvia", label: "Latvia", Flag: LV },
  { value: "Lebanon", label: "Lebanon", Flag: LB },
  { value: "Lithuania", label: "Lithuania", Flag: LT },
  { value: "Luxembourg", label: "Luxembourg", Flag: LU },
  { value: "Malaysia", label: "Malaysia", Flag: MY },
  { value: "Mexico", label: "Mexico", Flag: MX },
  { value: "Morocco", label: "Morocco", Flag: MA },
  { value: "Netherlands", label: "Netherlands", Flag: NL },
  { value: "New Zealand", label: "New Zealand", Flag: NZ },
  { value: "Nigeria", label: "Nigeria", Flag: NG },
  { value: "Norway", label: "Norway", Flag: NO },
  { value: "Pakistan", label: "Pakistan", Flag: PK },
  { value: "Palestine", label: "Palestine", Flag: PS },
  { value: "Philippines", label: "Philippines", Flag: PH },
  { value: "Poland", label: "Poland", Flag: PL },
  { value: "Portugal", label: "Portugal", Flag: PT },
  { value: "Qatar", label: "Qatar", Flag: QA },
  { value: "Romania", label: "Romania", Flag: RO },
  { value: "Russia", label: "Russia", Flag: RU },
  { value: "Saudi Arabia", label: "Saudi Arabia", Flag: SA },
  { value: "Serbia", label: "Serbia", Flag: RS },
  { value: "Singapore", label: "Singapore", Flag: SG },
  { value: "Slovakia", label: "Slovakia", Flag: SK },
  { value: "Slovenia", label: "Slovenia", Flag: SI },
  { value: "South Africa", label: "South Africa", Flag: ZA },
  { value: "South Korea", label: "South Korea", Flag: KR },
  { value: "Spain", label: "Spain", Flag: ES },
  { value: "Sri Lanka", label: "Sri Lanka", Flag: LK },
  { value: "Sweden", label: "Sweden", Flag: SE },
  { value: "Switzerland", label: "Switzerland", Flag: CH },
  { value: "Syria", label: "Syria", Flag: SY },
  { value: "Taiwan", label: "Taiwan", Flag: TW },
  { value: "Thailand", label: "Thailand", Flag: TH },
  { value: "Tunisia", label: "Tunisia", Flag: TN },
  { value: "Turkey", label: "Turkey", Flag: TR },
  { value: "Ukraine", label: "Ukraine", Flag: UA },
  { value: "United Arab Emirates", label: "United Arab Emirates", Flag: AE },
  { value: "United Kingdom", label: "United Kingdom", Flag: GB },
  { value: "United States", label: "United States", Flag: US },
  { value: "Vietnam", label: "Vietnam", Flag: VN },
  { value: "Yemen", label: "Yemen", Flag: YE },
];

interface NationalityDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  dark?: boolean;
}

export function NationalityDropdown({
  value,
  onChange,
  label,
  error,
  placeholder = "Select nationality",
  dark = false,
}: NationalityDropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = NATIONALITIES.find((o) => o.value === value);

  const filtered = NATIONALITIES.filter((o) =>
    o.value === "" || o.label.toLowerCase().includes(search.toLowerCase())
  );

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(-1);
    setSearch("");
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

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (open && highlightedIndex >= 0) {
          onChange(filtered[highlightedIndex].value);
          close();
        } else {
          setOpen(true);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!open) { setOpen(true); break; }
        setHighlightedIndex((i) => (i + 1) % filtered.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) { setOpen(true); break; }
        setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
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
          onClick={() => setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-11 w-full rounded-lg border px-4 pr-10 text-left font-sans text-sm transition-colors",
            dark
              ? "border-white/15 bg-white/5 text-white placeholder:text-white/40"
              : "bg-white border-line",
            !selected && (dark ? "text-white/40" : "text-muted/60"),
            open && "border-blue ring-2 ring-blue/20",
            error && "border-danger"
          )}
        >
          <span className="flex items-center gap-2">
            {selected && selected.value && (
              <selected.Flag className="h-4 w-6 rounded-[2px] flex-shrink-0" title={selected.label} />
            )}
            <span className="truncate">{selected?.label ?? placeholder}</span>
          </span>
        </button>
        <ChevronDown
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none transition-transform",
            dark ? "text-white/40" : "text-muted",
            open && "rotate-180"
          )}
        />
        {open && (
          <div className={cn(
            "absolute z-50 mt-1.5 w-full rounded-lg border shadow-xl",
            dark
              ? "border-white/15 bg-navy"
              : "border-line bg-white"
          )}>
            {/* Search input */}
            <div className={cn("p-2 border-b", dark ? "border-white/15" : "border-line")}>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightedIndex(-1);
                }}
                placeholder="Search..."
                className={cn(
                  "h-9 w-full rounded-md border px-3 text-sm font-sans focus:outline-none focus:border-blue",
                  dark
                    ? "border-white/15 bg-white/5 text-white placeholder:text-white/40"
                    : "border-line"
                )}
              />
            </div>
            <ul
              ref={listRef}
              role="listbox"
              className="max-h-60 overflow-auto py-1 font-sans text-sm scrollbar-thin"
            >
              {filtered.map((opt, i) => {
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
                      "flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors",
                      isHighlighted && (dark ? "bg-white/10" : "bg-blue/5"),
                      isSelected
                        ? "text-blue font-medium"
                        : dark ? "text-white" : "text-ink"
                    )}
                  >
                    {opt.value && (
                      <opt.Flag className="h-4 w-6 rounded-[2px] flex-shrink-0" title={opt.label} />
                    )}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-blue flex-shrink-0" />}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger font-sans">{error}</p>}
    </div>
  );
}
