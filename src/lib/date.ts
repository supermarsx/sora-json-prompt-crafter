/**
 * Returns the provided date formatted as `YYYYMMDD-HHMMSS`.
 *
 * @param date - The date to format. Defaults to the current date and time.
 * @returns The formatted date string.
 */
export function formatDateTime(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

/**
 * Returns a human-readable localized date and time string.
 *
 * @param date - The date to format. Defaults to the current date and time.
 * @returns The formatted date string.
 */
export function formatDisplayDate(date: Date = new Date()): string {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
