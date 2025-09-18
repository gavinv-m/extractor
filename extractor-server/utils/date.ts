// utils/date.ts
export default function normaliseDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
