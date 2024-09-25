import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ParsedData } from "@/components/fileupload";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MRRData {
  month: string;
  mrr: number;
}

export function processMRRData(data: ParsedData[]): MRRData[] {
  const mrrByMonth: { [key: string]: number } = {};

  for (const item of data) {
    const monthYear = item.createdDate.toISOString().slice(0, 7); // Format: YYYY-MM
    if (!mrrByMonth[monthYear]) {
      mrrByMonth[monthYear] = 0;
    }
    mrrByMonth[monthYear] += item.convertedAmount;
  }

  return Object.entries(mrrByMonth)
    .map(([month, mrr]) => ({ month, mrr }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function calculateMRR(
  data: ParsedData[]
): { month: string; mrr: number }[] {
  const monthlyMRR: { [key: string]: number } = {};

  for (const item of data) {
    const date = new Date(item.createdDate);
    const monthYear = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyMRR[monthYear]) {
      monthlyMRR[monthYear] = 0;
    }

    if (item.status === "Paid") {
      const description = item.description.toLowerCase();
      const amount = item.convertedAmount;

      if (
        description.includes("subscription creation") ||
        description.includes("subscription update")
      ) {
        monthlyMRR[monthYear] += amount;
      } else if (
        description.includes("subscription cancellation") ||
        item.convertedAmountRefunded > 0
      ) {
        monthlyMRR[monthYear] -= amount;
      }
    }
  }

  return Object.entries(monthlyMRR)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, mrr]) => ({ month, mrr }));
}
