export function dateKeyInTimeZone(value: Date | string, timeZone: string) {
  const d = typeof value === "string" ? new Date(value) : value;
  // en-CA yields YYYY-MM-DD reliably.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatMonthYear(value: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "long",
    year: "numeric",
  }).format(value);
}

export function formatWeekdayShort(value: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(value);
}

export function formatDayNumber(value: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, day: "numeric" }).format(value);
}

export function formatShortMonthDay(value: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
  }).format(value);
}

const WEEKDAY_TO_INDEX_MON = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
} as const;

export function weekIndexMon0(value: Date, timeZone: string) {
  const wd = formatWeekdayShort(value, timeZone) as keyof typeof WEEKDAY_TO_INDEX_MON;
  return WEEKDAY_TO_INDEX_MON[wd] ?? 0;
}

export function addDays(value: Date, days: number) {
  const d = new Date(value);
  d.setDate(d.getDate() + days);
  return d;
}
