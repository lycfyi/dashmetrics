"use client";

import { TrendingUp, HelpCircle } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { calculateMRR } from "@/lib/utils";
import type { ParsedData } from "@/components/fileupload";

export const description = "ARR";

const chartConfig = {
  arr: {
    label: "ARR",
    color: "hsl(var(--chart-1))",
  },
};

interface ARRChartProps {
  data: ParsedData[];
}

export function ARRChart({ data }: ARRChartProps) {
  const chartData = calculateMRR(data);

  // convert MRR data to ARR by multiplying by 12
  const arrData = chartData.map((item) => ({
    ...item,
    arr: item.mrr * 12,
  }));

  const formatYAxis = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const formatXAxis = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>ARR</CardTitle>
          <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root>
              <TooltipPrimitive.Trigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipPrimitive.Trigger>
              <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                  className="TooltipContent bg-zinc-800 text-white p-3 rounded-md shadow-lg max-w-xs text-sm"
                  sideOffset={5}
                >
                  Annual Recurring Revenue (ARR) represents the total value of
                  recurring revenue normalized for a 12-month period.
                  <TooltipPrimitive.Arrow className="TooltipArrow fill-gray-800" />
                </TooltipPrimitive.Content>
              </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
          </TooltipPrimitive.Provider>
        </div>
        <CardDescription>Annual Recurring Revenue (ARR)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={arrData}
            margin={{
              top: 20,
              left: 40,
              right: 40,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatXAxis}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatYAxis}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              type="linear"
              dataKey="arr"
              stroke="var(--color-arr)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-arr)",
                r: 2,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
