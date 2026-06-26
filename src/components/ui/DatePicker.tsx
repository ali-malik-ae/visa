"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(str: string): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isBefore(a: Date, b: Date): boolean {
  return a.getFullYear() < b.getFullYear() ||
    a.getFullYear() === b.getFullYear() &&
      (a.getMonth() < b.getMonth() ||
        (a.getMonth() === b.getMonth() && a.getDate() < b.getDate()));
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

type ViewMode = "days" | "months" | "years";

export function DatePicker({
  value,
  onChange,
  min,
  max,
  label,
  error,
  placeholder = "mm/dd/yyyy",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("days");
  const selected = parseDate(value);
  const minDate = parseDate(min ?? "");
  const maxDate = parseDate(max ?? "");

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setViewMode("days");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setViewMonth(selected?.getMonth() ?? today.getMonth());
      setViewYear(selected?.getFullYear() ?? today.getFullYear());
      setViewMode("days");
    }
  }, [open]);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewYear, viewMonth]);

  const yearGrid = useMemo(() => {
    const start = viewYear - 5;
    const years: number[] = [];
    for (let y = start; y < start + 12; y++) years.push(y);
    return years;
  }, [viewYear]);

  function selectDate(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && isBefore(d, minDate)) return;
    if (maxDate && isBefore(maxDate, d)) return;
    onChange(formatDateStr(d));
    setOpen(false);
    setViewMode("days");
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const inputId = label?.toLowerCase().replace(/\s+/g, "-");
  const displayValue = selected
    ? `${selected.getMonth() + 1}/${selected.getDate()}/${selected.getFullYear()}`
    : "";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-[0.06em] text-muted font-sans"
        >
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          id={inputId}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "h-11 w-full rounded-lg border px-4 text-left font-sans text-sm transition-colors",
            "bg-white border-line",
            !selected && "text-muted/60",
            open && "border-blue ring-2 ring-blue/20",
            error && "border-danger",
            className
          )}
        >
          {displayValue || placeholder}
        </button>
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />

        {open && (
          <div className="absolute z-[100] mt-1.5 w-72 rounded-xl border border-line bg-white shadow-xl p-4">
            {/* Header — always shown */}
            <div className="flex items-center justify-between mb-3">
              {viewMode === "days" && (
                <>
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-ink" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("months")}
                      className="font-sans font-semibold text-sm text-ink hover:text-blue transition-colors px-2 py-1 rounded hover:bg-blue/5"
                    >
                      {MONTHS_FULL[viewMonth]}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("years")}
                      className="font-sans font-semibold text-sm text-ink hover:text-blue transition-colors px-2 py-1 rounded hover:bg-blue/5"
                    >
                      {viewYear}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-ink" />
                  </button>
                </>
              )}

              {viewMode === "months" && (
                <>
                  <button
                    type="button"
                    onClick={() => setViewYear((y) => y - 1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-ink" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("years")}
                    className="font-sans font-semibold text-sm text-ink hover:text-blue transition-colors px-2 py-1 rounded hover:bg-blue/5"
                  >
                    {viewYear}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewYear((y) => y + 1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-ink" />
                  </button>
                </>
              )}

              {viewMode === "years" && (
                <>
                  <button
                    type="button"
                    onClick={() => setViewYear((y) => y - 12)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-ink" />
                  </button>
                  <span className="font-sans font-semibold text-sm text-ink">
                    {viewYear - 5}–{viewYear + 6}
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewYear((y) => y + 12)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-ink" />
                  </button>
                </>
              )}
            </div>

            {/* Days view */}
            {viewMode === "days" && (
              <>
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center text-[11px] font-sans font-medium text-muted py-1">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />;
                    const d = new Date(viewYear, viewMonth, day);
                    const isToday = isSameDay(d, today);
                    const isSelected = selected ? isSameDay(d, selected) : false;
                    const isDisabled =
                      (minDate && isBefore(d, minDate)) ||
                      (maxDate && isBefore(maxDate, d));

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => selectDate(day)}
                        disabled={isDisabled ?? undefined}
                        className={cn(
                          "h-9 w-full flex items-center justify-center rounded-lg text-sm font-sans transition-colors",
                          isDisabled && "text-muted/30 cursor-not-allowed",
                          !isDisabled && !isSelected && "hover:bg-blue/5 text-ink",
                          isSelected && "bg-blue text-white font-medium",
                          isToday && !isSelected && "border border-blue text-blue font-medium"
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Months view */}
            {viewMode === "months" && (
              <div className="grid grid-cols-3 gap-2">
                {MONTHS_FULL.map((m, i) => {
                  const isCurrentMonth = i === today.getMonth() && viewYear === today.getFullYear();
                  const isSelected = i === viewMonth;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setViewMonth(i); setViewMode("days"); }}
                      className={cn(
                        "h-10 rounded-lg text-sm font-sans font-medium transition-colors",
                        isSelected ? "bg-blue text-white" : "text-ink hover:bg-blue/5",
                        isCurrentMonth && !isSelected && "border border-blue text-blue"
                      )}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Years view */}
            {viewMode === "years" && (
              <div className="grid grid-cols-3 gap-2">
                {yearGrid.map((y) => {
                  const isCurrentYear = y === today.getFullYear();
                  const isSelected = y === viewYear;
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => { setViewYear(y); setViewMode("months"); }}
                      className={cn(
                        "h-10 rounded-lg text-sm font-sans font-medium transition-colors",
                        isSelected ? "bg-blue text-white" : "text-ink hover:bg-blue/5",
                        isCurrentYear && !isSelected && "border border-blue text-blue"
                      )}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => { onChange(""); setOpen(false); setViewMode("days"); }}
                className="text-xs font-sans text-muted hover:text-ink transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMonth(today.getMonth());
                  setViewYear(today.getFullYear());
                  setViewMode("days");
                }}
                className="text-xs font-sans text-blue font-medium hover:underline"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger font-sans">{error}</p>}
    </div>
  );
}

/** Dark-themed date picker for navy backgrounds (Quick Apply widget). */
export function DatePickerDark({
  value,
  onChange,
  min,
  label,
  error,
  className,
}: Omit<DatePickerProps, "placeholder">) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("days");
  const selected = parseDate(value);
  const minDate = parseDate(min ?? "");

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setViewMode("days");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setViewMonth(selected?.getMonth() ?? today.getMonth());
      setViewYear(selected?.getFullYear() ?? today.getFullYear());
      setViewMode("days");
    }
  }, [open]);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewYear, viewMonth]);

  const yearGrid = useMemo(() => {
    const start = viewYear - 5;
    const years: number[] = [];
    for (let y = start; y < start + 12; y++) years.push(y);
    return years;
  }, [viewYear]);

  function selectDate(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && isBefore(d, minDate)) return;
    onChange(formatDateStr(d));
    setOpen(false);
    setViewMode("days");
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  const inputId = label?.toLowerCase().replace(/\s+/g, "-");
  const displayValue = selected
    ? `${selected.getMonth() + 1}/${selected.getDate()}/${selected.getFullYear()}`
    : "";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-semibold uppercase tracking-widest text-white/50 font-sans"
        >
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          id={inputId}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "h-11 w-full rounded-lg border px-4 text-left font-sans text-sm transition-colors",
            "border-white/15 bg-white/5",
            !selected && "text-white/40",
            selected && "text-white",
            open && "border-blue ring-2 ring-blue/30",
            error && "border-danger",
            className
          )}
        >
          {displayValue || "mm/dd/yyyy"}
        </button>
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />

        {open && (
          <div className="absolute z-[100] mt-1.5 w-72 rounded-xl border border-line bg-white shadow-xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              {viewMode === "days" && (
                <>
                  <button type="button" onClick={prevMonth} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors">
                    <ChevronLeft className="h-4 w-4 text-ink" />
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("months")}
                      className="font-sans font-semibold text-sm text-ink hover:text-blue transition-colors px-2 py-1 rounded hover:bg-blue/5"
                    >
                      {MONTHS_FULL[viewMonth]}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("years")}
                      className="font-sans font-semibold text-sm text-ink hover:text-blue transition-colors px-2 py-1 rounded hover:bg-blue/5"
                    >
                      {viewYear}
                    </button>
                  </div>
                  <button type="button" onClick={nextMonth} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors">
                    <ChevronRight className="h-4 w-4 text-ink" />
                  </button>
                </>
              )}

              {viewMode === "months" && (
                <>
                  <button type="button" onClick={() => setViewYear((y) => y - 1)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors">
                    <ChevronLeft className="h-4 w-4 text-ink" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("years")}
                    className="font-sans font-semibold text-sm text-ink hover:text-blue transition-colors px-2 py-1 rounded hover:bg-blue/5"
                  >
                    {viewYear}
                  </button>
                  <button type="button" onClick={() => setViewYear((y) => y + 1)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors">
                    <ChevronRight className="h-4 w-4 text-ink" />
                  </button>
                </>
              )}

              {viewMode === "years" && (
                <>
                  <button type="button" onClick={() => setViewYear((y) => y - 12)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors">
                    <ChevronLeft className="h-4 w-4 text-ink" />
                  </button>
                  <span className="font-sans font-semibold text-sm text-ink">
                    {viewYear - 5}–{viewYear + 6}
                  </span>
                  <button type="button" onClick={() => setViewYear((y) => y + 12)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-mist transition-colors">
                    <ChevronRight className="h-4 w-4 text-ink" />
                  </button>
                </>
              )}
            </div>

            {/* Days */}
            {viewMode === "days" && (
              <>
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="text-center text-[11px] font-sans font-medium text-muted py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />;
                    const d = new Date(viewYear, viewMonth, day);
                    const isToday = isSameDay(d, today);
                    const isSelected = selected ? isSameDay(d, selected) : false;
                    const isDisabled = minDate && isBefore(d, minDate);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => selectDate(day)}
                        disabled={isDisabled ?? undefined}
                        className={cn(
                          "h-9 w-full flex items-center justify-center rounded-lg text-sm font-sans transition-colors",
                          isDisabled && "text-muted/30 cursor-not-allowed",
                          !isDisabled && !isSelected && "hover:bg-blue/5 text-ink",
                          isSelected && "bg-blue text-white font-medium",
                          isToday && !isSelected && "border border-blue text-blue font-medium"
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Months */}
            {viewMode === "months" && (
              <div className="grid grid-cols-3 gap-2">
                {MONTHS_FULL.map((m, i) => {
                  const isCurrentMonth = i === today.getMonth() && viewYear === today.getFullYear();
                  const isSelected = i === viewMonth;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setViewMonth(i); setViewMode("days"); }}
                      className={cn(
                        "h-10 rounded-lg text-sm font-sans font-medium transition-colors",
                        isSelected ? "bg-blue text-white" : "text-ink hover:bg-blue/5",
                        isCurrentMonth && !isSelected && "border border-blue text-blue"
                      )}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Years */}
            {viewMode === "years" && (
              <div className="grid grid-cols-3 gap-2">
                {yearGrid.map((y) => {
                  const isCurrentYear = y === today.getFullYear();
                  const isSelected = y === viewYear;
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => { setViewYear(y); setViewMode("months"); }}
                      className={cn(
                        "h-10 rounded-lg text-sm font-sans font-medium transition-colors",
                        isSelected ? "bg-blue text-white" : "text-ink hover:bg-blue/5",
                        isCurrentYear && !isSelected && "border border-blue text-blue"
                      )}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
              <button type="button" onClick={() => { onChange(""); setOpen(false); setViewMode("days"); }} className="text-xs font-sans text-muted hover:text-ink transition-colors">
                Clear
              </button>
              <button
                type="button"
                onClick={() => { setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); setViewMode("days"); }}
                className="text-xs font-sans text-blue font-medium hover:underline"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-danger font-sans">{error}</p>}
    </div>
  );
}
