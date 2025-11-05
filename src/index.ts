export type AgeResult = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
};

export function getAge(input: string): AgeResult {
  const parts = input.trim().split(/\s+/);
  const dateStr = parts[0];
  const timeStr = parts[1]?.replace(':', '-') ?? undefined;

  const dateNormalized = dateStr.replace(/\//g, '-').trim();
  const dateParts = dateNormalized.split('-');
  if (dateParts.length !== 3) throw new Error('Invalid date format. Expected dd-mm-yyyy');

  const [ddS, mmS, yyyyS] = dateParts;
  const dd = parseInt(ddS, 10);
  const mm = parseInt(mmS, 10);
  const yyyy = parseInt(yyyyS, 10);

  if (
    Number.isNaN(dd) ||
    Number.isNaN(mm) ||
    Number.isNaN(yyyy) ||
    dd < 1 ||
    mm < 1 ||
    mm > 12
  ) {
    throw new Error('Invalid date values');
  }

  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const timeParts = timeStr.split('-');
    if (timeParts.length !== 2) throw new Error('Invalid time format. Expected hh-mm');
    hours = parseInt(timeParts[0], 10);
    minutes = parseInt(timeParts[1], 10);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new Error('Invalid time values');
    }
  }

  const dob = new Date(yyyy, mm - 1, dd, hours, minutes, 0, 0);
  const now = new Date();

  if (dob.getTime() > now.getTime()) {
    throw new Error('Date/time cannot be in the future');
  }

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();
  let hrs = now.getHours() - dob.getHours();
  let mins = now.getMinutes() - dob.getMinutes();

  if (mins < 0) {
    mins += 60;
    hrs -= 1;
  }

  if (hrs < 0) {
    hrs += 24;
    days -= 1;
  }

  if (days < 0) {
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hrs),
    minutes: Math.max(0, mins),
  };
}
