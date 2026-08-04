// Fixed locale so SSR and the browser render identical strings.
const LOCALE = "en-GB";

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: "UTC", ...options }).format(new Date(value));
}

export function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: "UTC",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatMoney(amount: number, currency = "GHS") {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}